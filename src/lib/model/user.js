import mongoose from "mongoose"

const userModel = new mongoose.Schema({
    UserName:String,
    Email:String,
    Password:String,
    PhoneNo: Number,
    MechFeedback: [
        {
            MechId: String,
            Feedback: String,
            Rating: Number,
            DateTime: String
        }
    ]
})

export const User = mongoose.models.userdetails 
|| mongoose.model("userdetails",userModel);