import { NextResponse } from "next/server";
import {connectToDatabase} from "../../../../lib/mongodb"

export const GET = async () => {
  const { db } = await connectToDatabase()
  const products = await db.collection('products').aggregate([
      { $match: { children: true } },
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
                    { $eq: ["$user_id", 1] },
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

        const productsWithInCart = products.map((p: { id: number } & Record<string, unknown>) => ({
          ...p,
          inCartAmount: cartMap[(p as { id: number }).id] || 0
        }));

        return NextResponse.json({ 
        products: productsWithInCart
      });

};
