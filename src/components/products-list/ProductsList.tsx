import { IProduct } from 'src/app/api/products/products';
import { ProductCard } from '../product-card/ProductCard';
import styles from './ProductsList.module.css';

export const ProductsList = ({productsList, title, description = ""}: {productsList: IProduct[], title: string, description?: string}) => {
    if (!productsList || !Array.isArray(productsList)) {
        return;
    }
    return (
        <section className={styles.container} id="products">
            <h1 className={styles.arrivalsHeader}>{title}</h1>
            {!!description && <p className={styles.description}>{description}</p>}
            <div className={styles.contentWrapper}>
                {productsList.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    )
}