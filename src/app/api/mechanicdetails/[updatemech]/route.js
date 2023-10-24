import { connectionDb } from "@/lib/db";
import { Mechanic } from "@/lib/model/mechanic";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(request,content){
    const userId = content.params.updatemech;  // getting the dynamic route(user id)
    const filter = {_id:userId}
    const payload = await request.json();     // data need to be updated;

    //connect mongoDB
    await mongoose.connect(connectionDb);

    let result;
    if (payload.options) {
        result = await Mechanic.findOneAndUpdate(filter, payload.update, payload.options);
    } else {
        result = await Mechanic.findOneAndUpdate(filter, payload);
    }
    return NextResponse.json({result,success:true});
}

export async function GET(request,content){
    const userId = content.params.updatemech;  // getting the dynamic route(user id)
    const record = {_id:userId}

    //connect mongoDB
    await mongoose.connect(connectionDb);
    const result = await Mechanic.findById(record); //update data in DB
    return NextResponse.json({result,success:true});
}