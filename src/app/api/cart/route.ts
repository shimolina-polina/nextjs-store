import { NextResponse } from "next/server";
import { getCart } from "src/lib/cart/getCart";

export async function GET() {
    const cartData = await getCart({user_id: 1});
    return NextResponse.json({ 
        cartData: cartData
    });
}