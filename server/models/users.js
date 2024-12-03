const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        displayName: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        isAdmin: {type: Boolean, default: false},
        reputation: {type: Number, default: 100},
        communityIDs: [{type: Schema.Types.ObjectId, ref: 'Community'}],
        postIDs: [{type: Schema.Types.ObjectId, ref: 'Post'}],
        commentIDs: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    }
);

UserSchema.pre('save', async function(next) {
    if (this.isAdmin) {
        this.reputation = 1000;
    }

    this.password = await bcrypt.hash(this.password, 10);

    next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;