import { BrowserRouter, Route } from 'react-router-dom'

import AuthenticationBouncer from './components/AuthenticationBouncer'
import OnboardingBouncer from './components/OnboardingBouncer'
import ApplicationLayout from './components/ApplicationLayout'
import BlankLayout from './components/BlankLayout'
import Authentication from './scenes/Authentication'
import User from './scenes/User'
import Source from './scenes/Source'
import Onboarding from './scenes/Onboarding'
import Home from './scenes/Home'
import Legal from './scenes/Legal'

function Router() {
  return (
    <BrowserRouter>
      <>
        <Route exact path="/">
          <OnboardingBouncer>
            <ApplicationLayout>
              <Home />
            </ApplicationLayout>
          </OnboardingBouncer>
        </Route>
        <Route exact path="/sign-up">
          <BlankLayout>
            <Authentication />
          </BlankLayout>
        </Route>
        <Route exact path="/sign-in">
          <BlankLayout>
            <Authentication isSignIn />
          </BlankLayout>
        </Route>
        <Route exact path="/~/:pseudo">
          <AuthenticationBouncer>
            <OnboardingBouncer>
              <ApplicationLayout>
                <User />
              </ApplicationLayout>
            </OnboardingBouncer>
          </AuthenticationBouncer>
        </Route>
        <Route exact path="/-/:slug">
          <AuthenticationBouncer>
            <OnboardingBouncer>
              <ApplicationLayout>
                <Source />
              </ApplicationLayout>
            </OnboardingBouncer>
          </AuthenticationBouncer>
        </Route>
        <Route path="/onboarding">
          <AuthenticationBouncer>
            <ApplicationLayout>
              <Onboarding />
            </ApplicationLayout>
          </AuthenticationBouncer>
        </Route>
        <Route exact path={['/privacy-policy', '/terms-of-service', '/legal']}>
          <ApplicationLayout>
            <Legal />
          </ApplicationLayout>
        </Route>
      </>
    </BrowserRouter>
  )
}

export default Router
