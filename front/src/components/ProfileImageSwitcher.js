import { useContext, useState } from 'react'
import { useMutation } from 'urql'

import ViewerContext from '../ViewerContext'
import ViewerFragment from '../ViewerFragment'

const UpdateViewerProfileImageMutation = `
  mutation UpdateViewerProfileImageMutation {
    updateViewerProfileImage {
      viewer {
        id
        ...ViewerFragment
      }
    }
  }
  ${ViewerFragment}
`

function ProfileImageSwitcher() {
  const [loading, setLoading] = useState(false)
  const [viewer, setViewer] = useContext(ViewerContext)
  const [, updateViewerProfileImageMutation] = useMutation(UpdateViewerProfileImageMutation)

  function handleClick() {
    setLoading(true)

    updateViewerProfileImageMutation()
    .then(results => {
      setLoading(false)

      if (results.error) {
        return console.error(results.error.message)
      }

      setViewer(results.data.updateViewerProfileImage.viewer)
    })
  }

  return (
    <div>
      <img
        src={viewer.profileImageUrl}
        className="profile-image-64"
      />
      <div onClick={handleClick}>Change</div>
    </div>
  )
}

export default ProfileImageSwitcher
