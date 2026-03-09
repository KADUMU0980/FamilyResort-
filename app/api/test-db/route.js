import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDatabase();
        const products = await productModel.find({ title: /Test/i }).lean();
        return NextResponse.json(products);
    } catch (e) {
        return NextResponse.json({ error: e.message });
    }
}
