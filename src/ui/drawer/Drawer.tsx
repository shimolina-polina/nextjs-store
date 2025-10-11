'use client'

import { createPortal } from 'react-dom';
import styles from './Drawer.module.css';
import { ReactNode, useEffect, useRef, useState } from 'react';

export const Drawer = ({open, children, onClose}: {open: boolean, children: ReactNode, onClose: () => void}) => {
    const [mounted, setMounted] = useState(false)

    const ref = useRef<HTMLDivElement | null>(null)
    
    useEffect(() => {
        setMounted(true)

        return () => setMounted(false)
   }, [])

    useEffect(() => {

        const handleOutsideClick = (event: MouseEvent) => {
            if(ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        }

        addEventListener('mousedown', handleOutsideClick);    

        return () => {
            removeEventListener('mousedown', handleOutsideClick);
        }
    }, [])

    useEffect(() => {
        if(open) {
            document.documentElement.classList.add('scroll-lock');
        } else {
            document.documentElement.classList.remove('scroll-lock');
        }
    }, [open])

    return (
        <div className={`${styles.overlay} ${open ? styles.open : ''}`}>
            {mounted
      ? createPortal(
                <div className={`${styles.drawer} ${open ? styles.open : ''}`} ref={ref}>
                    <button aria-label='close button' onClick={onClose} className={styles.closeButton}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_6_13431)">
                        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#323232"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_6_13431">
                        <rect width="24" height="24" fill="white"/>
                        </clipPath>
                        </defs>
                        </svg>
                    </button>
                    {children}
                </div>, document.querySelector("#myportal") ?? document.body
            ) : null}
        </div>
    )
}
