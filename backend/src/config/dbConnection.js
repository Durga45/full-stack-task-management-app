import mongoose from "mongoose";

export default async function connectToDB(){
  try{
    await mongoose.connect(process.env.MONGOURI)
    console.log("connected to database")
  }catch(err){
    console.log(`error is ${err}`)
  }
}
