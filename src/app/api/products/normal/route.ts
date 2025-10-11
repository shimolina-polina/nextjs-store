import { NextResponse } from "next/server";
import { getProducts } from "src/lib/products/getProducts";

export const GET = async () => {
  const productsWithInCart = await getProducts({user_id: 1, isChildren: false}).then(res => res.products);

  return NextResponse.json({ 
    products: productsWithInCart
  });
};

