import { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useMutation } from 'urql'
import { useTheme } from '@material-ui/core'

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

function Graph({ viewer, project }) {
  const graphRef = useRef()
  const canvasRef = useRef()
  const currentFileId = useSelector(s => (s.projectMetadata[project.slug] || {}).currentFileId) || null
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [updateState, setUpdateState] = useState(() => () => null)
  const [focus, setFocus] = useState(() => () => null)
  const theme = useTheme()
  const [, updateFileMutation] = useMutation(GraphUpdateFileMutation)

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

  useEffect(() => {
    const { nodes, edges } = getDataContent()

    if (!(nodes && edges)) return
    if (Object.values(nodes).every(({ x, y }) => typeof x === 'number' && typeof y === 'number')) return

    updatePositions(nodes, edges)
  }, [getDataContent, updatePositions])

  useEffect(() => {
    if (!canvasRef.current) return

    const { start, stop, updateState, focus } = run(canvasRef.current, innerWidth, innerHeight)

    setUpdateState(() => updateState)
    setFocus(() => focus)
    start()

    return stop
  }, [canvasRef])

  useEffect(() => {
    updateState({
      theme,
      ...dimensions,
      data: (project.files.find(f => f.id === currentFileId) || {}).data,
    })
  }, [updateState, theme, dimensions, project.files, currentFileId])

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
