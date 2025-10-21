import { Cart as CartComponent } from "src/components/cart/Cart";
import { CartWrapper } from "src/components/cart-wrapper/CartWrapper";

export default function Cart() {
    
    return (
        <CartWrapper open={true}>
            <CartComponent />
        </CartWrapper>
    );
}