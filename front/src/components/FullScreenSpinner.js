import CircularProgress from '@material-ui/core/CircularProgress'

function FullScreenSpinner() {
  return (
    <div className="w100vw h100vh x5">
      <CircularProgress color="primary" />
    </div>
  )
}

export default FullScreenSpinner
