import { useSelector } from 'react-redux'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import FileCopyIcon from '@material-ui/icons/FileCopy'

function FileEditor({ projectSlug, files, onClose }) {
  const currentFileId = useSelector(s => (s.projectMetadata[projectSlug] || {}).currentFileId) || null
  const file = files.find(f => f.id === currentFileId)
  const parentFiles = lookupParents(file)

  function lookupParents(file, parents = []) {
    if (!(file && file.parentId)) return parents

    const parentFile = files.find(f => f.id === file.parentId)

    parents.unshift(parentFile)

    return lookupParents(parentFile, parents)
  }

  function renderEmpty() {
    return (
      <div className="flex-grow y5">
        <Typography variant="body2">
          Select a file from the explorer to start editing.
        </Typography>
      </div>
    )
  }

  function renderFile() {
    return (
      <Typography variant="body2" className="pt-1 px-2">
        /{parentFiles.map(f => f.name).join('/')}{parentFiles.length > 0 ? '/' : ''}{file.name}
      </Typography>
    )
  }

  return (
    <div className="position-relative y2s">
      <div className="position-absolute top-0 right-0 p-1 x4">
        <Tooltip
          title="Copy source"
          enterDelay={0}
        >
          <IconButton
            size="small"
            className="ml-1"
          >
            <FileCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip
          title="Close editor"
          enterDelay={0}
        >
          <IconButton
            size="small"
            className="ml-1"
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
      {file ? renderFile() : renderEmpty()}
    </div>
  )
}

export default FileEditor
