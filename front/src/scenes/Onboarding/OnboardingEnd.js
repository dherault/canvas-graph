import { useEffect } from 'react'
import { useMutation, useQuery } from 'urql'
import { useHistory } from 'react-router-dom'

import FullScreenSpinner from '../../components/FullScreenSpinner'

const OnboardingEndQuery = `
  query OnboardingEndQuery {
    viewer {
      id
      pseudo
    }
  }
`
const CompleteOnboardingMutation = `
  mutation CompleteOnboardingMutation {
    completeOnboarding {
      viewer {
        id
        hasCompletedOnboarding
      }
    }
  }
`

function OnboardingEnd() {
  const [queryResults] = useQuery({ query: OnboardingEndQuery })
  const [, completeOnboardingMutation] = useMutation(CompleteOnboardingMutation)
  const history = useHistory()

  useEffect(() => {
    if (queryResults.fetching) return

    if (queryResults.data && queryResults.data.viewer && queryResults.data.viewer.pseudo) {
      completeOnboardingMutation({})
      .then(results => {
        if (results.error) {
          return console.error(results.error.message)
        }

        history.push('/')
      })
    }
  }, [queryResults, completeOnboardingMutation, history])

  return (
    <FullScreenSpinner />
  )
}

export default OnboardingEnd
