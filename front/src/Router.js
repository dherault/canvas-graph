import { BrowserRouter, Route } from 'react-router-dom'

import AuthenticationBouncer from './components/AuthenticationBouncer'
import OnboardingBouncer from './components/OnboardingBouncer'
import Authentication from './scenes/Authentication'
import User from './scenes/User'
import Onboarding from './scenes/Onboarding'
import Home from './scenes/Home'
import Legal from './scenes/Legal'

function Router() {
  return (
    <BrowserRouter>
      <>
        <Route exact path="/">
          <OnboardingBouncer>
            <Home />
          </OnboardingBouncer>
        </Route>
        <Route exact path="/sign-up">
          <Authentication />
        </Route>
        <Route exact path="/sign-in">
          <Authentication isSignIn />
        </Route>
        <Route exact path="/~/:pseudo">
          <AuthenticationBouncer>
            <OnboardingBouncer>
              <User />
            </OnboardingBouncer>
          </AuthenticationBouncer>
        </Route>
        <Route path="/onboarding">
          <AuthenticationBouncer>
            <Onboarding />
          </AuthenticationBouncer>
        </Route>
        <Route exact path={['/privacy-policy', '/terms-of-service', '/legal']}>
          <Legal />
        </Route>
      </>
    </BrowserRouter>
  )
}

export default Router
