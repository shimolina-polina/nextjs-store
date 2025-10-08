import { NextResponse } from "next/server";
import { connectToDatabase } from "src/lib/mongodb";

export async function PUT(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const productId = parseInt(params.id);
    const user_id = 1;

    const product = await db.collection('products').findOne({ id: productId });
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const currentFavourites = await db.collection('favourites').findOne({
      user_id: user_id,
      product_ids: productId
    });

    const isCurrentlyLiked = !!currentFavourites;
    let action;

    if (isCurrentlyLiked) {
      await db.collection('favourites').updateOne(
        { user_id: user_id },
        { 
          $pull: { product_ids: productId },
          $set: { updated_at: new Date() }
        }
      );
      action = 'unliked';
    } else {
      await db.collection('favourites').updateOne(
        { user_id: user_id },
        { 
          $addToSet: { product_ids: productId },
          $set: { updated_at: new Date() },
          $setOnInsert: { 
            created_at: new Date(),
            user_id: user_id 
          }
        },
        { upsert: true }
      );
      action = 'liked';
    }

    return NextResponse.json({ 
      success: true,
      action: action,
      isLiked: !isCurrentlyLiked,
      product_id: productId,
      user_id: user_id
    });

  } catch (error) {
    console.error('Toggle like error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
