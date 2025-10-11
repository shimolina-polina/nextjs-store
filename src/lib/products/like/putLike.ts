import { Document } from "mongodb";
import { connectToDatabase } from "src/lib/mongodb";
import { IFavourite } from "src/types/apiTypes";

export const putLike = async ({productId, user_id}: {productId: number, user_id: number}) => {
    let db, client;
        try {
            const conn = await connectToDatabase();
            db = conn.db;
            client = conn.client;
        
            const userFavourites: number[] = (await db.collection<IFavourite & Document>("favourites")
                .findOne({ user_id: user_id }))?.product_ids || [];
            
            const newFavourites = [];
    
            let action: string;
    
            if (userFavourites.includes(productId)) {
                newFavourites.push(...userFavourites.filter(id => id !== productId));
                action = 'unliked';
            } else {
                newFavourites.push(...userFavourites, productId);
                action = 'liked';
            }
            
            await db.collection("favourites").updateOne(
                { user_id: user_id },
                { 
                    $set: { 
                        product_ids: newFavourites,
                        updated_at: new Date() 
                    }
                }
            );
            
                
            return ({ 
                success: true,
                action: action,
                product_id: productId,
                user_id: user_id
            });
    
      } catch (error) {
        console.error('Toggle like error:', error);
        return (
          { error: 'Failed to toggle like', status: 500 }
        );
      } finally {
        await client?.close();
      }
}