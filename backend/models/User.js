// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // This 'role' field is correct and what's needed for the admin functionality.
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    university: { type: String },
    address: { type: String },
}, {
    timestamps: true // It's good practice to add timestamps
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);