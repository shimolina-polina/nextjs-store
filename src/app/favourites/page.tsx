import { ProductsList } from "src/components/products-list/ProductsList";

const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export default async function FavouritesPage() {
    const favourites = (await (await fetch(`${base}/api/products/favourites`)).json()).products;

    return (
        <>
            <ProductsList title={"your favourites"} productsList={favourites} description="buy while in stock ;)"/>
        </>
    )
}