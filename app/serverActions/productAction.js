"use server"
import connectToDatabase from "@/app/utils/configue/db";
export async function productAction(){
    await connectToDatabase();
    

}
