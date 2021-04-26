function checkForViewer(viewer) {
  if (!viewer) {
    throw new Error('Unauthorized')
  }
}

module.exports = checkForViewer
