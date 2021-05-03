import { useCallback, useContext, useEffect, useState } from 'react'
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
import useQuery from '../../utils/useQuery'

const FileEditorUpdateFileMutation = `
  mutation FileEditorUpdateFileMutation ($fileId: ID!, $text: String!) {
    updateFile (fileId: $fileId, text: $text) {
      file {
        id
        text
        data
      }
    }
  }
`

function FileEditor({ opened, project, onClose }) {
  const queryParams = useQuery()
  const currentFileId = queryParams.get('fileId')
  const [themeType] = useContext(ThemeTypeContext)
  const file = project.files.find(f => f.id === currentFileId)
  const parentFiles = lookupParents(file)
  const [text, setText] = useState(file ? file.text : '')
  const previousFile = usePrevious(file)
  const [, updateFileMutation] = useMutation(FileEditorUpdateFileMutation)

  useEffect(() => {
    if (file && !previousFile || (file && previousFile && file.id !== previousFile.id)) {
      setText(file.text)
    }
  }, [previousFile, file])

  // eslint-disable-next-line
  const debouncedUpdateFile = useCallback(debounce(text => {
    updateFileMutation({
      fileId: file.id,
      text,
    })
      .then(results => {
        if (results.error) {
          console.error(results.error.message)
        }
      })
  }, 666), [file])

  function lookupParents(file, parents = []) {
    if (!(file && file.parentId)) return parents

    const parentFile = project.files.find(f => f.id === file.parentId)

    parents.unshift(parentFile)

    return lookupParents(parentFile, parents)
  }

  function handleDataChange(value) {
    setText(value)
    debouncedUpdateFile(value)
  }

  function renderToolbar() {
    // Prevent "close editor" tooltip when closed
    if (!opened) return null

    return (
      <div className="position-absolute top-0 right-0 p-0h x4">
        {!!file && (
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
        )}
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
    )
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
          value={text}
        />
      </>
    )
  }

  return (
    <div className="position-relative y2s flex-grow">
      {renderToolbar()}
      {file ? renderFile() : renderEmpty()}
    </div>
  )
}

export default FileEditor
