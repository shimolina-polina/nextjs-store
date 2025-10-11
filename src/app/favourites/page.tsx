import { ProductsList } from "src/components/products-list/ProductsList";
import { getFavourites } from "src/lib/products/favourites/getFavourites";

export const dynamic = 'force-dynamic';

export default async function FavouritesPage() {
    const favourites = await getFavourites({user_id: 1});

    return (
        <>
            <ProductsList title={"your favourites"} productsList={favourites} description="buy while in stock ;)"/>
        </>
    )
}