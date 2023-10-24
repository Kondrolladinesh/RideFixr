import { connectionDb } from "@/lib/db";
import { UserProfileURL } from "@/lib/model/userProfileURL";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(){
    let data = []
    try{
        await mongoose.connect(connectionDb)
        data = await UserProfileURL.find();
    } catch{
        data = {success:false}
    }
    return NextResponse.json({result:data, success:true})
}

export async function POST(request){
    const payload = await request.json();
    await mongoose.connect(connectionDb);
    let mech = new UserProfileURL(payload);
    const result = await mech.save();
    return NextResponse.json({result,success:true})
    
}