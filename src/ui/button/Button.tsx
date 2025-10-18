import { CSSProperties, ReactNode } from "react"
import styles from './Button.module.css'

export const Button = ({children, style}: {children: ReactNode, style?: CSSProperties}) => {
    return (
        <>
            <button className={styles.button} style={{...style}}>
                {children}
            </button>
        </>
    )
}