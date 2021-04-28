import { useCallback, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useMutation } from 'urql'
import debounce from 'lodash.debounce'

import AceEditor from 'react-ace'
import 'ace-builds/webpack-resolver'
import 'ace-builds/src-noconflict/mode-typescript'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/ext-language_tools'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import FileCopyIcon from '@material-ui/icons/FileCopy'

import ThemeTypeContext from '../../ThemeTypeContext'

import usePrevious from '../../utils/usePrevious'

const FileEditorUpdateFileMutation = `
  mutation FileEditorUpdateFileMutation ($fileId: ID!, $data: String!) {
    updateFile (fileId: $fileId, data: $data) {
      file {
        id
        data
      }
    }
  }
`

function FileEditor({ projectSlug, files, onClose }) {
  const currentFileId = useSelector(s => (s.projectMetadata[projectSlug] || {}).currentFileId) || null
  const [themeType] = useContext(ThemeTypeContext)
  const file = files.find(f => f.id === currentFileId)
  const parentFiles = lookupParents(file)
  const [data, setData] = useState(file ? file.data : '')
  const previousFile = usePrevious(file)
  const [, updateFileMutation] = useMutation(FileEditorUpdateFileMutation)

  useEffect(() => {
    console.log('previousFile, file', previousFile ? previousFile.id : null, file ? file.id : null)
    if (file && !previousFile || (file && previousFile && file.id !== previousFile.id)) {
      setData(file.data)
    }
  }, [previousFile, file])

  // eslint-disable-next-line
  const debouncedUpdateFile = useCallback(debounce(data => {
    updateFileMutation({
      fileId: file.id,
      data,
    })
      .then(results => {
        if (results.error) {
          console.error(results.error.message)
        }
      })
  }, 200), [file.id])

  function lookupParents(file, parents = []) {
    if (!(file && file.parentId)) return parents

    const parentFile = files.find(f => f.id === file.parentId)

    parents.unshift(parentFile)

    return lookupParents(parentFile, parents)
  }

  function handleDataChange(value) {
    setData(value)
    debouncedUpdateFile(value)
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
      <>
        <Typography variant="body2" className="py-1 px-2">
          /{parentFiles.map(f => f.name).join('/')}{parentFiles.length > 0 ? '/' : ''}{file.name}
        </Typography>
        <AceEditor
          enableLiveAutocompletion
          enableBasicAutocompletion
          enableSnippets
          tabSize={2}
          style={{
            width: '100%',
            height: 'auto',
            flexGrow: 1,
          }}
          placeholder="Placeholder Text"
          mode="typescript"
          theme={themeType === 'dark' ? 'monokai' : 'github'}
          onChange={handleDataChange}
          fontSize={14}
          showPrintMargin
          showGutter
          highlightActiveLine
          value={data}
        />
      </>
    )
  }

  return (
    <div className="position-relative y2s flex-grow">
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
