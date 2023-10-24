import mongoose from "mongoose"

const mechProfileURL = new mongoose.Schema({
    MechId:String,
    ProfileUrl: String,
})

export const MechProfileURL = mongoose.models.mechProfileURL || mongoose.model("mechProfileURL",mechProfileURL)