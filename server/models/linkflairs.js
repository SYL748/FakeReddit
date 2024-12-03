// LinkFlair Document Schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LinkFlairSchema = new Schema(
    {
        content: {type: String, required: true, maxLength: 30},
    }
);

LinkFlairSchema
.virtual('url')
.get(function () {
    return '/linkFlairs/' + this._id;
});

const linkFlair = mongoose.model('LinkFlair', LinkFlairSchema);
module.exports = linkFlair;