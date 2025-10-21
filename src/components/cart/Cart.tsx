'use client'

import styles from './Cart.module.css'
import { useEffect, useState } from "react";
import { ICart } from 'src/types/apiTypes';
import { AddToCartButton } from '../add-to-cart-button/AddToCartButton';
import Image from 'next/image';
import { Button } from "../../ui/button/Button"

export const Cart = () => {
    const [cartData, setCartData] = useState<ICart | null>(null);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const cart = await fetch("/api/cart").then(res => res.json()).then(data => data.cartData);
                setCartData(cart);
                console.log(cart)
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        }
        
        fetchCart();
            
    }, []);

    const optimisticUpdateCartData = (productId: number, newQuantity: number) => {
        if (!cartData) return;
        setCartData(prev => {
            if(!prev) return prev;
            const updatedItems = prev.items.map(item => 
                item.product_id === productId 
                    ? { ...item, quantity: newQuantity }
                    : item
            ).filter(item => item.quantity > 0);

            return {
                ...prev,
                total_items: updatedItems.reduce((sum, cur) => sum + cur.quantity, 0),
                total_price: updatedItems.reduce((sum, cur) => sum + cur.quantity * cur.price, 0),
                items: updatedItems
            };
        })
        
    }

    return (
        <>
        
            <section className={styles.container}>
                <h1 className={styles.title}>cart <span className={styles.quantity}>/ {cartData?.items.reduce((sum, item) => {return sum + item.quantity}, 0)}</span></h1>
                    {cartData?.items.map(item => (
                        <div key={item.product_id} className={styles.item}>
                            <Image 
                                src={item.imageUrl} 
                                width={100} 
                                height={100}
                                alt="Описание изображения"
                            />
                            <div className={styles.itemQuantity}>
                                x{item.quantity}
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.text}>
                                    <p className={styles.name}>{item.name}</p>
                                    <p>$ {item.price * item.quantity}</p>
                                </div>
                                <div className={styles.addButton}>
                                    <AddToCartButton 
                                        productId={item.product_id} 
                                        amountInCart={item.quantity} 
                                        onCartUpdate={optimisticUpdateCartData}/>
                                </div>
                            </div>
                            
                        </div>
                    ))}                    
                    <div className={styles.checkoutContainer}>
                        {cartData && "$ " + cartData?.total_price}
                        <Button>checkout</Button>
                    </div>
            </section>
]        </>
        
    )
}