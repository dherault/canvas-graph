import { useContext, useState } from 'react'
import { useMutation } from 'urql'
import { useHistory } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import { authorizationTokenLocalstorageKey } from '../../configuration'

import ViewerContext from '../../ViewerContext'
import ViewerFragment from '../../ViewerFragment'

const SignUpMutation = `
  mutation SignUpMutation ($email: String!, $password: String!) {
    signUp (email: $email, password: $password) {
      viewer {
        id
        ...ViewerFragment
      }
      token
    }
  }
  ${ViewerFragment}
`

const SignInMutation = `
  mutation SignInMutation ($email: String!, $password: String!) {
    signIn (email: $email, password: $password) {
      viewer {
        id
        ...ViewerFragment
      }
      token
    }
  }
  ${ViewerFragment}
`

function AuthenticationForm({ isSignIn }) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('admin@archipel.app')
  const [password, setPassword] = useState('12345678***')
  const [, setViewer] = useContext(ViewerContext)
  const [, signUpMutation] = useMutation(SignUpMutation)
  const [, signInMutation] = useMutation(SignInMutation)
  const history = useHistory()

  function handleSubmit(event) {
    event.preventDefault()

    setIsLoading(true)

    ;(isSignIn ? signInMutation : signUpMutation)({
      email,
      password,
    })
    .then(results => {
      setIsLoading(false)

      if (results.error) {
        return console.error(results.error.message)
      }

      const { token, viewer } = results.data[isSignIn ? 'signIn' : 'signUp']

      localStorage.setItem(authorizationTokenLocalstorageKey, token)

      setViewer(viewer)

      history.push(`/~/${viewer.pseudo}`)
    })
  }

  return (
    <div className="w33">
      <Typography variant="h3">
        {isSignIn ? 'Sign in' : 'Sign up'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          value={email}
          onChange={event => setEmail(event.target.value)}
          placeholder="Email"
          variant="outlined"
          className="mt-2"
        />
        <TextField
          fullWidth
          value={password}
          onChange={event => setPassword(event.target.value)}
          placeholder={isSignIn ? 'Password' : 'Password 8+ characters'}
          type="password"
          variant="outlined"
          className="mt-2"
        />
        <Button
          fullWidth
          color="primary"
          variant="contained"
          className="mt-2"
          type="submit"
          disabled={isLoading}
        >
          {isSignIn ? 'Sign in' : 'Get started now'}
        </Button>
      </form>
    </div>
  )
}

export default AuthenticationForm
