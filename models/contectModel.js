const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactUsSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

const ContactUs = mongoose.model('ContactUs', ContactUsSchema);

module.exports = ContactUs;
