import { connectionDb } from "@/lib/db";
import { User } from "@/lib/model/user";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(request,content){
    const userId = content.params.updateuser;  // getting the dynamic route(user id)
    const filter = {_id:userId}
    const payload = await request.json();     // data need to be updated;

    //connect mongoDB
    await mongoose.connect(connectionDb);
    const result = await User.findOneAndUpdate(filter,payload); //update data in DB
    return NextResponse.json({result,success:true});
}

export async function GET(request,content){
    const userId = content.params.updateuser;  // getting the dynamic route(user id)
    const record = {_id:userId}

    //connect mongoDB
    await mongoose.connect(connectionDb);
    const result = await User.findById(record); //update data in DB
    return NextResponse.json({result,success:true});
}