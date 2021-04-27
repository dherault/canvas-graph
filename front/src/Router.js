import { BrowserRouter, Route, Switch } from 'react-router-dom'

import AuthenticationBouncer from './components/AuthenticationBouncer'
import OnboardingBouncer from './components/OnboardingBouncer'
import ApplicationLayout from './components/ApplicationLayout'
import BlankLayout from './components/BlankLayout'

import Home from './scenes/Home'
import Authentication from './scenes/Authentication'
import Onboarding from './scenes/Onboarding'
import User from './scenes/User'
import Project from './scenes/Project'
import Legal from './scenes/Legal'
import NotFound from './scenes/NotFound'

function Router() {
  return (
    <BrowserRouter>
      <Switch>
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
                <Project />
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
        <Route path="*">
          <ApplicationLayout>
            <NotFound />
          </ApplicationLayout>
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default Router
