'use client'
import { useState } from 'react';
import styles from './AddToCartButton.module.css'
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';

export const AddToCartButton = ({productId, amountInCart}: {productId: number, amountInCart?: number}) => {
    const router = useRouter()
    const [optimisticAmount, setOptimisticAmount] = useState(amountInCart || 0);

    const debouncedReset = debounce(() => {
        router.refresh()
    }, 3000);

    const handleAddToCart = async () => {
        await fetch(`/api/products/${productId}/add-to-cart`, { method: 'PUT' })
        setOptimisticAmount(prev => prev + 1);
        debouncedReset()
    }

    const removeFromCart = async () => {
        await fetch(`/api/products/${productId}/remove-from-cart`, { method: 'PUT' })
        setOptimisticAmount(prev => prev - 1);
        debouncedReset()
    }

    return (
        <div className={styles.container}>
            {optimisticAmount > 0 && 
                <button className={styles.remove} onClick={removeFromCart}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_17_17304)">
                            <path d="M18 13H6C5.45 13 5 12.55 5 12C5 11.45 5.45 11 6 11H18C18.55 11 19 11.45 19 12C19 12.55 18.55 13 18 13Z" fill="white"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_17_17304">
                                <rect width="24" height="24" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>

                </button>
            }
            <button className={`${styles.button} ${optimisticAmount > 0 && styles.plusButton}`} onClick={handleAddToCart}>{optimisticAmount > 0 ? optimisticAmount : "Add to Cart"}</button>
            {optimisticAmount > 0 && 
                <button className={styles.add} onClick={handleAddToCart}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_17_17337)">
                            <path d="M18 13H13V18C13 18.55 12.55 19 12 19C11.45 19 11 18.55 11 18V13H6C5.45 13 5 12.55 5 12C5 11.45 5.45 11 6 11H11V6C11 5.45 11.45 5 12 5C12.55 5 13 5.45 13 6V11H18C18.55 11 19 11.45 19 12C19 12.55 18.55 13 18 13Z" fill="white"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_17_17337">
                                <rect width="20" height="20" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                </button>
            }
        </div>
    )
}