import { connectionDb } from "@/lib/db";
import { Mechanic } from "@/lib/model/mechanic";
import { User } from "@/lib/model/user";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function GET(){
    let data = []
    try{
        await mongoose.connect(connectionDb)
        data = await User.find();
    } catch{
        data = {success:false}
    }
    
    // console.log(data);
    return NextResponse.json({result:data, success:true})
}

export async function POST(request){
    const payload = await request.json();
    await mongoose.connect(connectionDb);
    const existingUser = await User.findOne({ Email: payload.Email });
    const existingMech = await Mechanic.findOne({ Email: payload.Email });
    if (existingUser) {
      return NextResponse.json({
        existingMech: false,
        existing: true,
        success: false,
        message: "Email already in use",
      });
    }else if(existingMech){
        return NextResponse.json({
            existingMech: true,
            existing: false,
            success: false,
            message: "Email already exist as Mechanic",
          });
    }
    let user = new User(payload);
    const result = await user.save();
    return NextResponse.json({result,success:true,existing:false,existingMech: false})
    
}