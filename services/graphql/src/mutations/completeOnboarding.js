const createMutationOutputType = require('../utils/createMutationOutputType')
const checkForViewer = require('../utils/checkForViewer')

const { User } = require('../types')

module.exports = {
  type: createMutationOutputType('CompleteOnboarding', {
    viewer: {
      type: User,
    },
  }),
  async resolve(_, args, { viewer }) {
    checkForViewer(viewer)

    await viewer.update({ hasCompletedOnboarding: true })

    return { viewer }
  },
}
