import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";

export async function GET(request) {
    try {
        const { db } = await connectToDatabase();
        const user_id = 1;
        const userFavourites = await db.collection("favourites").findOne({user_id: user_id})
        const productsIds = userFavourites?.product_ids || []

        if(productsIds.length === 0) {
            return NextResponse.json({ 
                products: []
            });
        }

        const favouriteProducts = await db.collection('products')
            .find({ id: { $in: productsIds } })
            .sort({ id: 1 })
            .toArray();

        // load current user's cart to compute inCartAmount per product
        const currentCart = await db.collection('cart').findOne({ user_id: user_id });
        const qtyMap = {};
        if (currentCart && Array.isArray(currentCart.items)) {
            currentCart.items.forEach(item => {
                if (!item || typeof item.product_id === 'undefined') return;
                const pid = item.product_id;
                const q = Number(item.quantity) || 0;
                qtyMap[pid] = (qtyMap[pid] || 0) + q;
            });
        }

        const productsWithFavourite = favouriteProducts.map(product => ({
            ...product,
            isFavourite: true,
            inCartAmount: qtyMap[product.id] || 0
        }));

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