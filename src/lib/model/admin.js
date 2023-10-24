import mongoose from "mongoose"

const AdminModel = new mongoose.Schema({
    Email:String,
    Password:String,
})

export const Admin = mongoose.models.adminDetails || mongoose.model("adminDetails",AdminModel);