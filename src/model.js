var mongoose = require('mongoose')
var Schema = mongoose.Schema

var AttachmentSchema = new Schema({
  name: String,
  type: String,
  size: Number,
  hash_md5: String,
  created_at: {
    type: Date
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  url: String,
  tags: [String]
})

var Attachment = mongoose.model('Attachment', AttachmentSchema)

module.exports = {
  Attachment,
  AttachmentSchema
}
