import { ICart } from "src/types/apiTypes";
import { connectToDatabase } from "../mongodb";

export const getCart = async ({user_id}: {user_id: number}): Promise<ICart> => {
    const { db } = await connectToDatabase();
    const cart = await db.collection<ICart & Document>("cart").findOne({user_id: user_id})

    if(cart) {
        return cart;
    }
    throw new Error("Cart not found");
}