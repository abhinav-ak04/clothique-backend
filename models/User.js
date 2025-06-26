import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String },
    mobileNo: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    gender: { type: String, enum: ['M', 'F'] },
    dob: { type: Date },
    location: { type: String },
    alternateMobileNo: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);
export default User;
