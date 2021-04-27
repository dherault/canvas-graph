import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'

function BlankLayout({ children }) {

  return (
    <>
      {/* Paper to set the Typography color to textPrimary */}
      <Paper
        square
        elevation={0}
        className="flex-grow y2s"
      >
        {/* Box to set background color */}
        <Box
          className="minh100vh flex-grow y2s"
          bgcolor="background.default"
        >
          {children}
        </Box>
      </Paper>
    </>
  )
}

export default BlankLayout
