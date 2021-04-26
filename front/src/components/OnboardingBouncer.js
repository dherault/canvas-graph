import { useContext } from 'react'
import { Redirect } from 'react-router-dom'

import ViewerContext from '../ViewerContext'

function OnboardingBouncer({ children }) {
  const [viewer] = useContext(ViewerContext)

  if (viewer && !viewer.hasCompletedOnboarding) {
    return (
      <Redirect to="/onboarding" />
    )
  }

  return children
}

export default OnboardingBouncer
