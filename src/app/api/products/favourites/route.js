import { NextResponse } from "next/server";
import {getFavourites} from "src/lib/products/favourites/getFavourites";

export async function GET() {
    try {
        
        const productsWithFavourite = await getFavourites({user_id: 1})
        console.log('productsWithFavourite:', productsWithFavourite);

        return NextResponse.json({ 
            products: productsWithFavourite
        });
    } catch (error) {
    console.error('favourites GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch favourite products' },
            { status: 500 }
        );
    } 
}