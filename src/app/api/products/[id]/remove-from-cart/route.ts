import { NextResponse } from "next/server";
import { connectToDatabase } from "src/lib/mongodb";

export async function PUT(request, { params }) {
    try {
        const { db } = await connectToDatabase();
        const productId = parseInt((await params).id);
        const user_id = 1;

        const product = await db.collection('products').findOne({ id: productId });
        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        const currentCart = await db.collection('cart').findOne({user_id: user_id});

        if(currentCart) {
            const existingItemIndex = currentCart.items.findIndex((item: {product_id: number}) => item.product_id === productId);
        
            if (existingItemIndex > -1) {
                currentCart.items[existingItemIndex].quantity -= 1;
                currentCart.items[existingItemIndex].updated_at = new Date();

                if (currentCart.items[existingItemIndex].quantity <= 0) {
                    currentCart.items.splice(existingItemIndex, 1);
                }
            } else {
                return NextResponse.json({ 
                    success: true,
                    message: 'Product removed from cart'
                });
            }

            currentCart.total_items = currentCart.items.reduce((sum: number, item: {quantity: number}) => sum + (item.quantity > 0 ? item.quantity : 0), 0);
            currentCart.total_price = currentCart.items.reduce((sum: number, item: {quantity: number, price: number}) => sum + ((item.price || 0) * (item.quantity > 0 ? item.quantity : 0)), 0);
            currentCart.updated_at = new Date();

            if (currentCart.items.length === 0) {
                // remove empty cart document
                await db.collection('cart').deleteOne({ user_id: user_id });
            } else {
                await db.collection('cart').updateOne(
                    { user_id: user_id },
                    { $set: currentCart }
                );
            }

            return NextResponse.json({ 
                success: true,
                message: 'Product removed from cart'
            });
        } else {
            return NextResponse.json(
            { error: 'Failed to remove product from cart' },
            { status: 500 }
        );
        }
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to remove product from cart' },
            { status: 500 }
        );
    }
}
