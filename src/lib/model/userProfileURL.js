import mongoose from "mongoose"

const userProfileURL = new mongoose.Schema({
    UserId:String,
    ProfileUrl: String,
})

export const UserProfileURL = mongoose.models.userProfileURL || mongoose.model("userProfileURL",userProfileURL)