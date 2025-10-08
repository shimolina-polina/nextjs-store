import { ProductsList } from "src/components/products-list/ProductsList";

export const dynamic = 'force-dynamic';

export default async function FavouritesPage() {
    const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const favourites = (await (await fetch(`${base}/api/products/favourites`)).json()).products;

    return (
        <>
            <ProductsList title={"your favourites"} productsList={favourites} description="buy while in stock ;)"/>
        </>
    )
}