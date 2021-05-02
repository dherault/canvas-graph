import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTheme } from '@material-ui/core'

import run from './graph/runCanvas'
import assignNodesPositions from './graph/assignNodesPositions'

function Graph({ projectSlug, files }) {
  const graphRef = useRef()
  const canvasRef = useRef()
  const currentFileId = useSelector(s => (s.projectMetadata[projectSlug] || {}).currentFileId) || null
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [updateState, setUpdateState] = useState(() => () => null)
  const theme = useTheme()

  useEffect(() => {
    const data = (files.find(f => f.id === currentFileId) || {}).data || null
    const { nodes, edges } = JSON.parse(data) || {}

    if (Object.values(nodes).every(({ x, y }) => typeof x === 'number' && typeof y === 'number')) return

    assignNodesPositions(nodes, edges)

    console.log('nodesWithPosition', nodes, edges)
  }, [files, currentFileId])

  useEffect(() => {
    if (!canvasRef.current) return

    const { start, stop, updateState } = run(canvasRef.current)

    setUpdateState(() => updateState)
    start()

    return stop
  }, [canvasRef])

  useEffect(() => {
    updateState({
      theme,
      ...dimensions,
      data: (files.find(f => f.id === currentFileId) || {}).data,
    })
  }, [updateState, theme, dimensions, files, currentFileId])

  useEffect(() => {
    if (!graphRef.current) return

    new ResizeObserver(handleGraphResize).observe(graphRef.current)

    // window.addEventListener('resize', handleGraphResize)
    // return () => window.removeEventListener('resize', handleGraphResize)
  }, [graphRef])

  function handleGraphResize() {
    if (!graphRef.current) return

    const { width, height } = graphRef.current.getBoundingClientRect()

    setDimensions({
      width,
      height,
    })
  }

  return (
    <div
      ref={graphRef}
      className="flex-grow"
    >
      <canvas ref={canvasRef} width="100%" height="100%" />
    </div>
  )
}

export default Graph
