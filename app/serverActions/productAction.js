"use server"
import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";
export async function productAction(productDetails){
    await connectToDatabase();
    

}