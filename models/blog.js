const mongoose = require('mongoose')
const validator = require('validator')



const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})




const Blog = mongoose.model('Blog', blogSchema)


module.exports = Blog