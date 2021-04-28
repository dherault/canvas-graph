import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import CloseIcon from '@material-ui/icons/Close'

function FileEditor({ file, onClose }) {
  console.log('file', file)

  return (
    <div className="position-relative">
      <div className="position-absolute top-0 right-0 p-1">
        <Tooltip
          title="Close editor"
          enterDelay={0}
        >
          <IconButton
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}

export default FileEditor
