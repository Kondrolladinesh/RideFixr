import { connectionDb } from "@/lib/db";
import { Mechanic } from "@/lib/model/mechanic";
import { User } from "@/lib/model/user";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function GET(){
    let data = []
    try{
        await mongoose.connect(connectionDb)
        data = await Mechanic.find();
    } catch{
        data = {success:false}
    }
    return NextResponse.json({result:data, success:true})
}

export async function POST(request){
    const payload = await request.json();
    await mongoose.connect(connectionDb);
    const existingMech = await Mechanic.findOne({ Email: payload.Email });
    const existingUser = await User.findOne({ Email: payload.Email });
    if (existingMech) {
      return NextResponse.json({
        existingUser: false,
        existing: true,
        success: false,
        message: "Email already in use",
      });
    }else if(existingUser){
        return NextResponse.json({
            existingUser: true,
            existing: false,
            success: false,
            message: "Email already exist as User",
          });
    }
    let mech = new Mechanic(payload);
    const result = await mech.save();
    return NextResponse.json({result,success:true,existing: false,existingUser: false})
    
}