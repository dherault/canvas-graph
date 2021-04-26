import './index.css'

import Typography from '@material-ui/core/Typography'

import ApplicationLayout from '../../components/ApplicationLayout'

function Home() {

  return (
    <ApplicationLayout>
      <header>
        <Typography
          variant="h1"
        >
          Achipel
        </Typography>
      </header>
    </ApplicationLayout>
  )
}

export default Home
