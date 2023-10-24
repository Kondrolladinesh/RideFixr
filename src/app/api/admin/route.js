import { connectionDb } from "@/lib/db";
import { Admin } from "@/lib/model/admin";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(){
    let data = []
    try{
        await mongoose.connect(connectionDb)
        data = await Admin.find();
    } catch{
        data = {success:false}
    }
    // console.log(data);
    return NextResponse.json({result:data, success:true})
}