import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'

function useIsMobile() {
  const theme = useTheme()

  return useMediaQuery(theme.breakpoints.down('sm'))
}

export default useIsMobile
