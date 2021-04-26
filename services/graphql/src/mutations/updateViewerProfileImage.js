// const tmp = require('tmp-promise')
// const aquarelle = require('aquarelle')

// const uploadFileToStorage = require('../../../database/file-storage/uploadFileToStorage')
const createMutationOutputType = require('../utils/createMutationOutputType')
const checkForViewer = require('../utils/checkForViewer')

const { User } = require('../types')

module.exports = {
  type: createMutationOutputType('UpdateViewerProfileImage', {
    viewer: {
      type: User,
    },
  }),
  async resolve(_, args, { viewer }) {
    checkForViewer(viewer)

    // const tmpDir = await tmp.dir()
    // const profilePictureMetadata = await aquarelle(128, 128, tmpDir.path)
    // const profileImageUrl = await uploadFileToStorage({
    //   bucketName: 'sensual-education-images',
    //   fileName: profilePictureMetadata.fileName,
    //   filePath: profilePictureMetadata.filePath,
    // })

    // await viewer.update({ profileImageUrl })

    return { viewer }
  },
}
