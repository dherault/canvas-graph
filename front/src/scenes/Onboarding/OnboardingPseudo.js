import { useCallback, useState } from 'react'
import { useMutation } from 'urql'
import { useHistory } from 'react-router-dom'
import debounce from 'lodash.debounce'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import ProfileImageSwitcher from '../../components/ProfileImageSwitcher'

const CheckPseudoMutation = `
  mutation CheckPseudoMutation ($pseudo: String!) {
    checkPseudo (pseudo: $pseudo) {
      result
    }
  }
`

const UpdateViewerPseudoMutation = `
  mutation UpdateViewerPseudoMutation ($pseudo: String!) {
    updateViewerPseudo (pseudo: $pseudo) {
      viewer {
        id
        pseudo
      }
    }
  }
`

function OnboardingPseudo() {
  const [validated, setValidated] = useState(false)
  const [pseudo, setPseudo] = useState('')
  const [, checkPseudoMutation] = useMutation(CheckPseudoMutation)
  const [, updateViewerPseudoMutation] = useMutation(UpdateViewerPseudoMutation)
  const history = useHistory()

  // eslint-disable-next-line
  const debouncedCheck = useCallback(debounce(pseudo => {
    checkPseudoMutation({ pseudo })
    .then(results => {
      if (results.error) {
        return console.log(results.error.message)
      }

      const { result } = results.data.checkPseudo

      if (result) setValidated(true)
    })
  }, 1000), [])

  function handlePseudoChange(event) {
    const nextPseudo = event.target.value

    setPseudo(nextPseudo)
    debouncedCheck(nextPseudo)
  }

  function handleNextClick() {
    if (!validated) return

    updateViewerPseudoMutation({ pseudo })
    .then(results => {
      if (results.error) {
        return console.log(results.error.message)
      }

      history.push('/onboarding/end')
    })
  }

  return (
    <>
      <ProfileImageSwitcher />
      <TextField
        value={pseudo}
        onChange={handlePseudoChange}
        placeholder="Enter your user handle"
        color="secondary"
      />
      <Typography>
        {validated ? 'OK!' : 'Noop'}
      </Typography>
      <Button
        onClick={handleNextClick}
        disabled={!validated}
      >
        Use handle
      </Button>
    </>
  )
}

export default OnboardingPseudo
