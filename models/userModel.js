const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name!"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email!"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password!"]
    },
    role: {
        type: Number,
        default: 0 // 0 = user, 1 = admin
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/aman-jain/image/upload/v1621071871/avatar/black-and-white-stockportable-network-account-icon-11553436383dwuayhjyvo_rgy0di.png"
    },
    assessment_questions: [
        {
            questionTitle: {
                type: String,
                required: [true, "Please enter your question!"],
                trim: true
            },
            option1: {
                type: String,
                required: [true, "Please enter option 1!"],
                trim: true
            },
            option2: {
                type: String,
                required: [true, "Please enter option 2!"],
                trim: true
            },
            option3: {
                type: String,
                required: [true, "Please enter option 3!"],
                trim: true
            },
            option4: {
                type: String,
                required: [true, "Please enter option 4!"],
                trim: true
            }
        }
    ]
        
}, {
    timestamps: true
})

module.exports = mongoose.model("Users", userSchema)