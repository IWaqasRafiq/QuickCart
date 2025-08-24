'use client'
import axios from 'axios';
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import react, { createContext, useContext, useEffect, useState } from "react";
import toast from 'react-hot-toast';

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

// --- Toast Manager ---
let activeToasts = [];

const limitedToast = (message, type = "success") => {
    // If more than 2 already showing, remove the oldest
    if (activeToasts.length >= 2) {
        const oldest = activeToasts.shift();
        toast.dismiss(oldest);
    }

    const id = toast[type](message, { duration: 3000 });
    activeToasts.push(id);
};


export const AppContextProvider = (props) => {

    const router = useRouter()

    const { user } = useUser();
    const { getToken } = useAuth();

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})





    const fetchProductData = async () => {
        try {
            const { data } = await axios.get('/api/product/list')
            if (data.success) {
                setProducts(data.products)
            } else {
                limitedToast(data.message, "error")
            }
        } catch (error) {
            limitedToast(error.message, 'error')
        }
    }

    const fetchUserData = async () => {
        try {
            if (user.publicMetadata.role === 'seller') {
                setIsSeller(true)
            }


            const token = await getToken();

            const { data } = await axios.get('/api/user/data', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (data.success) {
                setUserData(data.user)
                setCartItems(data.user.cartItems)
            } else {
                limitedToast(data.message, "error")
            }
        } catch (error) {
            console.log(error);
            limitedToast(error.message, "error")

        }

    }

    const addToCart = async (itemId) => {

        if (!user) {
            limitedToast("Login first to add items in cart", "error");
            return;
        }

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        if (user) {
            try {
                const token = await getToken();
                await axios.post('/api/cart/update', { cartData }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                limitedToast('Added to cart', 'success')

            } catch (error) {
                limitedToast(error.message, 'error')
            }
        }


    }

    const updateCartQuantity = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)
        if (user) {
            try {
                const token = await getToken();
                await axios.post('/api/cart/update', { cartData }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                limitedToast('Cart updated', 'success')
            } catch (error) {
                limitedToast(error.message, 'error')
            }
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;

        for (const itemId in cartItems) {
            // find the product by id
            const itemInfo = products.find((product) => product._id === itemId);

            // check product exists and cart quantity > 0
            if (itemInfo && cartItems[itemId] > 0) {
                totalAmount += (itemInfo.offerPrice || 0) * cartItems[itemId];
            } else if (!itemInfo) {
                console.warn("⚠️ Product not found for ID:", itemId);
            }
        }

        return Math.floor(totalAmount * 100) / 100;
    };

    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        if (user) {

            fetchUserData()
        }
    }, [user])

    const value = {
        user, getToken,
        router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}