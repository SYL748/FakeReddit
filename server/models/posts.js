// Post Document Schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema(
    {
        title: {type: String, required: true, maxLength: 100},
        content: {type: String, required: true},
        linkFlairID: {type: Schema.Types.ObjectId, ref: 'LinkFlair'},
        postedBy: {type: String, required: true},
        postedDate: {type: Date, default: Date.now},
        commentIDs: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
        views: {type: Number, required: true, default: 0},
    }
);

PostSchema
.virtual('url')
.get(function () {
    return '/posts/' + this._id;
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;