import Paper from '@material-ui/core/Paper'

function BlankLayout({ children }) {

  return (
    <Paper
      square
      className="minh100vh flex-grow"
    >
      {children}
    </Paper>
  )
}

export default BlankLayout
