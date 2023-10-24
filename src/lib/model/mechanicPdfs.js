import mongoose from "mongoose"

const mechanicPDFModel = new mongoose.Schema({
    MechId:String,
    UploadFile: String,
})

export const MechanicPDF = mongoose.models.mechanicPdf || mongoose.model("mechanicPdf",mechanicPDFModel)