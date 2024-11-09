const mongoose = require('mongoose')
const validator = require('validator')

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,

    },
    lastName: {
        type: String,
        required: false,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowecase: true,

    },
    password: {
        type: String,
        required: true,
        validate(value){

            if (!validator.isStrongPassword(value)) {
                throw new Error("Please Enter the Strong password ")
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,

        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Gender Data is not valid  ")
            }
        }

    },
    photourl: {
        type: String,
        validate(value) {

            if (!validator.isURL(value)) {
                throw new Error("Profile URL is not Correct")
            }
        },
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Fblank%2520profile%2520picture%2F&psig=AOvVaw0SwKS--iDEpX6kuPRaxGy_&ust=1731050384092000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLicyqvXyYkDFQAAAAAdAAAAABAE"

    },
    about: {
        type: String,
        default: "This is a Default About of the user !!"
    },
    skills: {
        type: [String]
    }

},
    {
        timestamps: true

    })


const User = mongoose.model('User', UserSchema)


module.exports = {
    User
}