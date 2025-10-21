import { IProduct } from 'src/app/api/products/products'
import styles from './ProductCard.module.css'
import { LikeButton } from '../like-button/LikeButton'
import { AddToCartButton } from '../add-to-cart-button/AddToCartButton'
import Image from 'next/image';

export const ProductCard = ({product}: {product: IProduct}) => {
    return (
        <article className={styles.card}>
            <LikeButton isFavourite={product.isFavourite} productId={product.id}/>
            <Image
                src={product.imageUrl}
                alt="Product Image"
                className={styles.image}
                width={320}
                height={290}
            />            
            <h3 className={styles.name}>{product.name}</h3>
            <p className={styles.description}>{product.description}</p>
            <div className={styles.priceContainer}>
                <span className={styles.price}>${product.price}</span>
                <AddToCartButton productId={product.id} amountInCart={product.inCartAmount}/>
            </div>
        </article>
    )
}