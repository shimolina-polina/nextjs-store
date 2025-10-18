import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "src/lib/mongodb";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const {db} = await connectToDatabase();
        const paramsObj = await params;
        const productId = parseInt(paramsObj.id);
        
        const body = await request.json();
        const itemsCount = body.quantity;

        console.log("itemsCount", itemsCount)

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
                if (itemsCount !== 0) {
                    currentCart.items[existingItemIndex].quantity = itemsCount;
                    currentCart.items[existingItemIndex].updated_at = new Date();
                } else {
                    currentCart.items.splice(existingItemIndex, 1);
                }
            } else {
                currentCart.items.push({
                    product_id: productId,
                    quantity: itemsCount,
                    price: product.price,
                    name: product.name,
                    imageUrl: product.imageUrl,
                    added_at: new Date()
                });
            }

            currentCart.total_items = currentCart.items.reduce((sum: number, item: {quantity: number}) => sum + item.quantity, 0);
            currentCart.total_price = currentCart.items.reduce((sum: number, item: {quantity: number, price: number}) => sum + (item.price * item.quantity), 0);
            currentCart.updated_at = new Date();

            await db.collection('cart').updateOne(
                { user_id: user_id },
                { $set: currentCart }
            );

            return NextResponse.json({ 
                success: true,
                message: 'Product added to cart - new cart created'
            });
        } else {
            const newCart = {
                user_id: user_id,
                items: [{
                    product_id: productId,
                    quantity: itemsCount,
                    price: product.price,
                    name: product.name,
                    imageUrl: product.imageUrl,
                    added_at: new Date()
                }],
                total_items: itemsCount,
                total_price: product.price * itemsCount,
                created_at: new Date(),
                updated_at: new Date()
            };

            await db.collection('cart').insertOne(newCart);
            return NextResponse.json({ 
                success: true,
                message: 'Product added to cart',
            });
        }
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Failed to add product to cart' },
            { status: 500 }
        );
    } 
}
