const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AttachmentSchema = new Schema({
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

const Attachment = mongoose.model('Attachment', AttachmentSchema)

module.exports = {
  Attachment,
  AttachmentSchema
}
