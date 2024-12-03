const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
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

UserSchema.pre('save', function(next) {
    if (this.isAdmin) {
        this.reputation = 1000;
    }

    next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;