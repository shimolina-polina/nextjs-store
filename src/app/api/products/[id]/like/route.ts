import { NextRequest, NextResponse } from "next/server";
import { putLike } from "src/lib/products/like/putLike";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const result = await putLike({productId: parseInt((await params).id), user_id: 1});

    return NextResponse.json(result);
}
