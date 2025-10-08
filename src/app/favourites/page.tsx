import { ProductsList } from "src/components/products-list/ProductsList";

export default async function FavouritesPage() {
    const favourites = (await (await fetch('http://localhost:3000/api/products/favourites')).json()).products;

    return (
        <>
            <ProductsList title={"your favourites"} productsList={favourites} description="buy while in stock ;)"/>
        </>
    )
}