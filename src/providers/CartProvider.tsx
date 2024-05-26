import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import {CartItem, Tables} from '../types';
import { randomUUID } from 'expo-crypto';
import {useInsertOrder} from "@/src/api/orders";
import {useRouter} from "expo-router";
import {useInsertOrderItems} from "@/src/api/order-items";

type CartType = {
    items: CartItem[];
    addItem: (product: Tables<'products'>, size: CartItem['size']) => void;
    updateQuantity: (itemId: string, amount: 1 | -1) => void;
    total: number;
    checkout: () => void
};

const CartContext = createContext<CartType>({
    items: [],
    addItem: () => {},
    updateQuantity: () => {},
    total: 0,
    checkout: () => {}
});

export  function CartProvider({ children }: PropsWithChildren) {
    const [items, setItems] = useState<CartItem[]>([]);
    const { mutate: insertOrder } = useInsertOrder();
    const { mutate: insertOrderItems } = useInsertOrderItems();
    const router = useRouter()

    const total = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const addItem = (product: Tables<'products'>, size: CartItem['size']) => {
        const existingItem = items.find(
            (item) => item.product.id === product.id && item.size === size
        );
        if (existingItem) {
            updateQuantity(existingItem.id, 1);
            return;
        }

        const newCartItem: CartItem = {
            id: randomUUID(),
            product,
            product_id: product.id,
            size,
            quantity: 1,
        };

        setItems((existingItems) => [newCartItem, ...existingItems]);
    };

    const updateQuantity = (itemId: string, amount: 1 | -1) => {
        setItems((existingItems) =>
            existingItems
                .map((it) =>
                    it.id === itemId ? { ...it, quantity: it.quantity + amount } : it
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const clearCart = () => {
        setItems([])
    }

    const checkout = () => {
        insertOrder(
            { total: total },
            {
                onSuccess: saveOrderItems
            });
    };

    const saveOrderItems = (newOrder: Tables<'orders'>) => {
        if (!newOrder) return;

        const orderItems = items.map(cartItem => ({
            order_id: newOrder.id,
            product_id: cartItem.product.id,
            quantity: cartItem.quantity,
            size: cartItem.size,
        }))

        insertOrderItems(orderItems,
            {
                onSuccess() {
                    clearCart();
                    router.replace(`/(user)/orders/${newOrder.id}`);
                },
            }
        );
    };

    return (
        <CartContext.Provider value={{ items, addItem, updateQuantity, total, checkout }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
