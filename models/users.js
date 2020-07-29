const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Blog = require('./blog')



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid!")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if (value.toLowerCase().includes('password')){
                throw new Error('password cannot contain "password"')
            }
        },
        trim: true,
        minlength: 7

    }}, {
    timestamps: true
})


// create a user to task relationship
// local field - owner stored in task is related to the user _id
userSchema.virtual('blog', {
    ref: 'Blog',
    localField: '_id',
    foreignField: 'owner'
})


// JSON.stringify is run in the background, our objects are stringify
// to json method allows us to manipulate what we want back
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    // remove them so as they cant be seen
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}


// method are accessed by instances
userSchema.methods.generateAuthToken = async function () {

    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisisnodejs', { expiresIn: '1h' })

    user.tokens = user.tokens.concat({ token: token })
    await user.save()

    return token

}


//statics are accessed by our models/ model methods // allow for defining functions that exist directly on your Model
// userSchema.statics.findBycredentials = async (email, password) => {
//
//
//     const user = await User.findOne({ email: email})
//
//     if (!user) {
//         throw new Error("Unable to login")
//         //return res.status(400).json({ msg: "Invalid Credentials"})
//
//     }
//
//     const isMatch = await bcrypt.compare(password, user.password)
//
//     if (!isMatch) {
//         throw new Error("Unable to login")
//     }
//
//     return user
// }


// we are going to run save() middleware before a user is saved e.g check if there is a plain text password and hash it
// when the object is passed in the model it is automatically converted into a schema behind the scenes

// now we can take advantage of the middleware

// in middleware we can use pre/before saving or post/after saving

// this its the user being saved
// we call next when we are done running our code

// Hash the plain text before saving
userSchema.pre('save', async function (next) {

    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    //console.log("Just before saving!!")

    next()
})

// Delete user tasks when user is removed // let mongoose know when we are done running our code
userSchema.pre('remove', async function (next) {
    const user = this
    await Blog.deleteMany({ owner: user._id })

    next()
})





const User = mongoose.model('User', userSchema)




module.exports = User