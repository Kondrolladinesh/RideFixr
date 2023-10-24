import mongoose from "mongoose"

const mechanicModel = new mongoose.Schema({
    UserName:String,
    Email:String,
    Password:String,
    PhoneNo: Number,
    MechType: String,
    VehicleType: String,
    // UploadFile: String,
    Address: String,
    City: String,
    State: String,
    Latitude: String,
    Longitude: String,
    Status: String,
    UserArray: [
        {
            Id: String,
            Name: String,
            PhoneNo: String,
            Latitude: String,
            Longitude: String,
            Distance: Number,
            Status: String,
            Time: String
        }
      ],
    UserFeedback: [
        {
            UserId: String,
            Feedback: String,
            Rating: Number,
            DateTime: String
        }
      ]
})

export const Mechanic = mongoose.models.mechanicdetails || mongoose.model("mechanicdetails",mechanicModel)