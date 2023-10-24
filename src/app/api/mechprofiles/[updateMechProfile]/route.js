import { connectionDb } from "@/lib/db";
import { MechProfileURL } from "@/lib/model/mechProfileURL";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(request,content){
    const mechId = content.params.updateMechProfile;  // getting the dynamic route(user id)
    const filter = {MechId:mechId}
    const payload = await request.json();     // data need to be updated;

    //connect mongoDB
    await mongoose.connect(connectionDb);
    const result = await MechProfileURL.findOneAndUpdate(filter, payload);
    return NextResponse.json({result,success:true});
}

export async function GET(request,content){
    const mechId = content.params.updateMechProfile;  // getting the dynamic route(user id)
    const record = {MechId:mechId}

    //connect mongoDB
    await mongoose.connect(connectionDb);
    const result = await MechProfileURL.findOne(record); //update data in DB
    return NextResponse.json({result,success:true});
}