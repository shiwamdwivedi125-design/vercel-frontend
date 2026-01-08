import { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty) => {
        console.log("CartContext: Adding to cart", product, qty);
        const existItem = cartItems.find((x) => x._id === product._id);

        if (existItem) {
            console.log("CartContext: Item exists, updating qty");
            setCartItems(
                cartItems.map((x) =>
                    x._id === existItem._id ? { ...product, qty: existItem.qty + qty } : x
                )
            );
        } else {
            console.log("CartContext: New item, adding");
            setCartItems([...cartItems, { ...product, qty }]);
        }
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((x) => x._id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
