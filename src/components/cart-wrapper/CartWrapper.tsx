'use client'

import { useRouter } from "next/navigation"
import { ReactNode } from "react"
import { Drawer } from "src/ui/drawer/Drawer"

export const CartWrapper = ({children, open}: {children: ReactNode, open: boolean}) => {
    const router = useRouter();

    return (
        <Drawer open={open} onClose={router.back} >
            {children}
        </Drawer>
    )
}