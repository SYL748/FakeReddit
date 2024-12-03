// Community Document Schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommunitySchema = new Schema(
    {
        name: {type: String, required: true, maxLength: 100},
        description: {type: String, required: true, maxLength: 500}, 
        postIDs: [{type: Schema.Types.ObjectId, ref: 'Post'}],
        startDate: {type: Date, default: Date.now},
        members: [{type: String, required: true}],
        memberCount: {type: Number, default: 1},
    }
);

CommunitySchema
.virtual('url')
.get(function () {
    return '/communities/' + this._id;
});

const Community = mongoose.model('Community', CommunitySchema); 
module.exports = Community;