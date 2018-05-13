var mongoose = require('mongoose')

function isObjectId (id) {
  try {
    return mongoose.Types.ObjectId(id)
  } catch (err) {
    return false
  }
}

module.exports = {
  isObjectId
}
