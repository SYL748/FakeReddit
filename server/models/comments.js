// Comment Document Schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
        content: {type: String, required: true, maxLength: 500},
        commentIDs: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
        commentedBy: {type: String, required: true},
        commentedDate: {type: Date, default: Date.now},
        upvotes: {type: Number, required: true, default: 0}
    }
);

CommentSchema
.virtual('url')
.get(function () {
    return '/comments/' + this._id;
});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;