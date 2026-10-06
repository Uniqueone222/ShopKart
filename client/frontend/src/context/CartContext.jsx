import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axiosInstance from "../axiosCalls/axios.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // GET /cart
    const fetchCart = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.get("/cart");

            setCartItems(response.data.cart);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load your cart"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // POST /cart/:productId
    const addToCart = async (productId) => {
        setError(null);

        const response = await axiosInstance.post(`/cart/${productId}`);

        setCartItems(response.data.cart);
    };

    // PATCH /cart/:productId
    const updateQuantity = async (productId, quantity) => {
        setError(null);

        const response = await axiosInstance.patch(
            `/cart/${productId}`,
            {
                quantity: quantity,
            }
        );

        setCartItems(response.data.cart);
    };

    // DELETE /cart/:productId
    const removeFromCart = async (productId) => {
        setError(null);

        await axiosInstance.delete(`/cart/${productId}`);

        setCartItems((currentItems) =>
            currentItems.filter((item) => {
                const itemProductId = item.product?._id ?? item.product;
                return itemProductId.toString() !== productId;
            })
        );
    };

    useEffect(() => {
        if (authLoading) {
            return;
        }

        let active = true;
        Promise.resolve().then(() => {
            if (!active) {
                return;
            }

            if (user) {
                fetchCart();
            } else {
                setCartItems([]);
                setError(null);
                setLoading(false);
            }
        });

        return () => {
            active = false;
        };
    }, [authLoading, fetchCart, user]);

    // Derived values
    const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = cartItems.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                loading,
                error,

                fetchCart,
                addToCart,
                updateQuantity,
                removeFromCart,

                totalItems,
                subtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};