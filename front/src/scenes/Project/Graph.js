import { useCallback, useEffect, useRef, useState } from 'react'
import { useMutation } from 'urql'
import { useHistory, useLocation } from 'react-router-dom'
import { useTheme } from '@material-ui/core'

import useQuery from '../../utils/useQuery'

import Toolbar from './Toolbar'

import run from './graph/runCanvas'
import assignNodesPositions from './graph/assignNodesPositions'

const innerWidth = 8192
const innerHeight = 8192

const GraphUpdateFileMutation = `
  mutation GraphUpdateFileMutation ($fileId: ID!, $data: String!) {
    updateFile (fileId: $fileId, data: $data) {
      file {
        id
        text
        data
      }
    }
  }
`

const reduceObject = (object, [key, value]) => Object.assign(object, { [key]: value })

function Graph({ viewer, project }) {
  const graphRef = useRef()
  const canvasRef = useRef()
  const queryParams = useQuery()
  const currentFileId = queryParams.get('fileId')
  const currentParentId = queryParams.get('parentId') || null
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [updateState, setUpdateState] = useState(() => () => null)
  const [focus, setFocus] = useState(() => () => null)
  const theme = useTheme()
  const [, updateFileMutation] = useMutation(GraphUpdateFileMutation)
  const location = useLocation()
  const history = useHistory()

  const getDataContent = useCallback(() => {
    const data = (project.files.find(f => f.id === currentFileId) || {}).data || null

    return JSON.parse(data) || {}
  }, [project.files, currentFileId])

  const updatePositions = useCallback((nodes, edges) => {
    assignNodesPositions(nodes, edges, innerWidth, innerHeight)

    updateFileMutation({
      fileId: currentFileId,
      data: JSON.stringify({ nodes, edges }),
    })
    .then(results => {
      if (results.error) {
        return console.error(results.error.message)
      }
    })

    console.log('nodesWithPosition', nodes, edges)
  }, [currentFileId, updateFileMutation])

  const setCurrentParentId = useCallback(nodeId => {
    queryParams.set('parentId', nodeId)

    history.push(`${location.pathname}?${queryParams.toString()}`)
  // eslint-disable-next-line
  }, [history, location.pathname, queryParams.toString()])

  useEffect(() => {
    const { nodes, edges } = getDataContent()

    if (!(nodes && edges)) return
    if (Object.values(nodes).every(({ x, y }) => typeof x === 'number' && typeof y === 'number')) return

    updatePositions(nodes, edges)
  }, [getDataContent, updatePositions])

  useEffect(() => {
    if (!canvasRef.current) return

    const { start, stop, updateState, focus } = run(canvasRef.current, innerWidth, innerHeight, setCurrentParentId)

    setUpdateState(() => updateState)
    setFocus(() => focus)
    start()

    return stop
  }, [canvasRef, setCurrentParentId])

  useEffect(() => {
    const { data } = (project.files.find(f => f.id === currentFileId) || {})
    const parsedData = JSON.parse(data) || { nodes: {}, edges: {} }

    const nodes = Object.entries(parsedData.nodes)
      .filter(([, value]) => value.parentId === currentParentId)
      .reduce(reduceObject, {})
    const nodeIds = Object.keys(nodes)

    updateState({
      theme,
      ...dimensions,
      data: {
        nodes,
        edges: Object.entries(parsedData.edges)
        .filter(([, value]) => nodeIds.includes(value.inputNodeId) || nodeIds.includes(value.outputNodeId))
        .reduce(reduceObject, {}),
      },
    })
  }, [updateState, theme, dimensions, project.files, currentFileId, currentParentId])

  useEffect(() => {
    if (!graphRef.current) return

    handleGraphResize()

    window.addEventListener('resize', handleGraphResize)

    return () => window.removeEventListener('resize', handleGraphResize)
  }, [graphRef])

  function handleGraphResize() {
    if (!graphRef.current) return

    const { width, height } = graphRef.current.getBoundingClientRect()

    setDimensions({
      width,
      height,
    })
  }

  function resetPositions() {
    const { nodes, edges } = getDataContent()

    Object.values(nodes).forEach(node => {
      delete node.x
      delete node.y
    })

    updatePositions(nodes, edges)
  }

  return (
    <div
      ref={graphRef}
      className="w100 position-relative"
    >
      <div className="position-absolute top-0 right-0 pt-1 pr-1">
        <Toolbar
          viewer={viewer}
          project={project}
          focus={focus}
          resetPositions={resetPositions}
        />
      </div>
      <canvas
        ref={canvasRef}
        width="100%"
        height="100%"
      />
    </div>
  )
}

export default Graph
