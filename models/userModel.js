const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: { type: String, required: true },
    madeAt: { type: String },
    year: { type: Number },
    image: { type: String },
    technology: { type: [String], required: true },
    projectUrl: { type: String },
});

const ExperienceSchema = new Schema({
    role: { type: String, required: true },
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date, required: true },
    description: { type: String, required: true },
    technology: { type: [String], required: true },
});

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password:{ type: String, required: true },
    image: { type: String },
    bio: { type: String },
    projects: [ProjectSchema],
    experience: [ExperienceSchema],
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;
