import { Document } from "mongodb";
import { IProduct } from "src/app/api/products/products";
import { connectToDatabase } from "src/lib/mongodb";
import { ICart, IFavourite } from "src/types/apiTypes";

export const getFavourites = async ({user_id}: {user_id: number}) => {
    const { db } = await connectToDatabase();
    const userFavourites = await db.collection<IFavourite & Document>("favourites").findOne({user_id: user_id})
    const productsIds = userFavourites?.product_ids || []

    if(productsIds.length === 0) {
        return [];
    }

    const favouriteProducts = await db.collection<IProduct & Document>('products')
        .find({ id: { $in: productsIds } })
        .sort({ id: 1 })
        .toArray();

    const currentCart = await db.collection<ICart & Document>('cart').findOne({ user_id: user_id });
    const qtyMap: Record<number, number> = {};
    if (currentCart && Array.isArray(currentCart.items)) {
        currentCart.items.forEach(item => {
            if (!item || typeof item.product_id === 'undefined') return;
            const pid: number = item.product_id;
            const q = Number(item.quantity) || 0;
            qtyMap[pid] = (qtyMap[pid] || 0) + q;
        });
    }

    const productsWithFavourite = favouriteProducts
        .map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            isFavourite: true,
            inCartAmount: qtyMap[product.id] || 0
        }));
    
    return productsWithFavourite;
}