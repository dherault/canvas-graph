import { Redirect, Route } from 'react-router-dom'

import Container from '@material-ui/core/Container'

import OnboardingPseudo from './OnboardingPseudo'
import OnboardingEnd from './OnboardingEnd'

function Onboarding() {
  return (
    <Container maxWidth="lg">
      <Route path="/onboarding/pseudo">
        <OnboardingPseudo />
      </Route>
      <Route path="/onboarding/end">
        <OnboardingEnd />
      </Route>
      <Redirect
        from="/onboarding"
        to="/onboarding/pseudo"
      />
    </Container>
  )

}

export default Onboarding
