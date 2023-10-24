import { connectionDb } from "@/lib/db";
import { UserProfileURL } from "@/lib/model/userProfileURL";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(request,content){
    const userId = content.params.updateUserProfile;  // getting the dynamic route(user id)
    const filter = {UserId:userId}
    const payload = await request.json();     // data need to be updated;

    //connect mongoDB
    await mongoose.connect(connectionDb);
    const result = await UserProfileURL.findOneAndUpdate(filter, payload);
    return NextResponse.json({result,success:true});
}

export async function GET(request,content){
    const userId = content.params.updateUserProfile;  // getting the dynamic route(user id)
    const record = {UserId:userId}

    //connect mongoDB
    await mongoose.connect(connectionDb);
    const result = await UserProfileURL.findOne(record); //update data in DB
    return NextResponse.json({result,success:true});
}