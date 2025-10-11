import { IProduct } from "src/app/api/products/products";
import { connectToDatabase } from "src/lib/mongodb";
import { Document } from 'mongodb';

export const getProducts = async ({user_id, isChildren}: {user_id: number, isChildren: boolean}) => {
    const { db } = await connectToDatabase()
    const products = await db.collection<IProduct & Document>('products').aggregate([
        { $match: { children: isChildren } },
        { $sort: { id: 1 } },
        {
            $lookup: {
                from: "favourites",
                let: { productId: "$id" },
                pipeline: [
                {
                    $match: {
                    $expr: {
                        $and: [
                        { $eq: ["$user_id", user_id] },
                        { $in: ["$$productId", "$product_ids"] }
                        ]
                    }
                    }
                }
                ],
                as: "userFavourite"
            }
        },
        {
            $addFields: {
                isFavourite: { $gt: [{ $size: "$userFavourite" }, 0] }
            }
        },
        { $project: { userFavourite: 0 } }
    ]).toArray();
    const cart = await db.collection('cart').findOne({ user_id: 1 });

    const cartMap: Record<number, number> = {};
    if (cart && Array.isArray(cart.items)) {
        for (const item of cart.items) {
            if (item && typeof item.product_id === 'number') {
                cartMap[item.product_id] = (cartMap[item.product_id] || 0) + (item.quantity || 0);
            }
        }
    }
    
    const productsWithInCart = products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        isFavourite: product.isFavourite,
        inCartAmount: cartMap[product.id] || 0
    }));
    
    return { 
        products: productsWithInCart
    };
}