'use client'

import { Drawer } from 'src/ui/drawer/Drawer';
import styles from './OpenCart.module.css'
import { useEffect, useState } from "react";
import { ICart } from 'src/types/apiTypes';
import { AddToCartButton } from '../add-to-cart-button/AddToCartButton';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "../../ui/button/Button"

export const OpenCart = () => {
    const [cartOpen, setCartOpen] = useState(false);
    const [cartData, setCartData] = useState<ICart | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

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
        if ('requestIdleCallback' in window || cartOpen) {
            requestIdleCallback(() => {
                fetchCart();
            });
        } 
        
    }, [cartOpen]);

    useEffect(() => {
        const cartParam = searchParams.get('cart');
        setCartOpen(cartParam === 'true' || cartParam === '');
    }, [searchParams]);

    const openCart = () => {
        setCartOpen(true);
        const params = new URLSearchParams(searchParams.toString());
        params.set('cart', 'true');
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const closeCart = () => {
        setCartOpen(false);
        const params = new URLSearchParams(searchParams.toString());
        params.delete('cart');
        router.push(`?${params.toString()}`, { scroll: false });
    };

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
                items: updatedItems
            };
        })
        
    }

    return (
        <>
            <button className={styles.cart} onClick={openCart}>
                <svg width="15" height="15" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 2H10L15.36 28.78C15.5429 29.7008 16.0438 30.5279 16.7751 31.1166C17.5064 31.7053 18.4214 32.018 19.36 32H38.8C39.7386 32.018 40.6536 31.7053 41.3849 31.1166C42.1162 30.5279 42.6171 29.7008 42.8 28.78L46 12H12M20 42C20 43.1046 19.1046 44 18 44C16.8954 44 16 43.1046 16 42C16 40.8954 16.8954 40 18 40C19.1046 40 20 40.8954 20 42ZM42 42C42 43.1046 41.1046 44 40 44C38.8954 44 38 43.1046 38 42C38 40.8954 38.8954 40 40 40C41.1046 40 42 40.8954 42 42Z" stroke="white" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            <Drawer open={cartOpen} onClose={closeCart} >
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
            </Drawer>
        </>
        
    )
}