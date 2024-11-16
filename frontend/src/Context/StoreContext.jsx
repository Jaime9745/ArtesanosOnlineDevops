import { createContext, useEffect, useState } from "react";
import { food_list, menu_list } from "../assets/assets";
import axios from "axios";
import menu_1 from './menu_1.png'
import menu_2 from './menu_2.png'
import menu_3 from './menu_3.png'
import menu_4 from './menu_4.png'
import menu_5 from './menu_5.png'
import menu_6 from './menu_6.png'
import menu_7 from './menu_7.png'
import menu_8 from './menu_8.png'

import food_1 from './food_1.png'
import food_2 from './food_2.png'
import food_3 from './food_3.png'
import food_4 from './food_4.png'
import food_5 from './food_5.png'
import food_6 from './food_6.png'
import food_7 from './food_7.png'
import food_16 from './food_16.png'
import food_17 from './food_17.png'
import food_18 from './food_18.png'
import food_20 from './food_20.png'
import food_22 from './food_22.png'
import food_25 from './food_25.png'
import food_26 from './food_26.png'
import food_30 from './food_30.png'
import food_33 from './food_33.png'
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = "https://artesanosonline-backend.onrender.com"
    const [menu_list] = useState([
        { menu_name: "Cerámica", menu_image: menu_1 },
        { menu_name: "Textiles", menu_image: menu_2 },
        { menu_name: "Cestería", menu_image: menu_3 },
        { menu_name: "Tallado", menu_image: menu_4 },
        { menu_name: "Joyería", menu_image: menu_5 },
        { menu_name: "Vidrio", menu_image: menu_6 },
        { menu_name: "Cartonería", menu_image: menu_7 },
        { menu_name: "Pintura", menu_image: menu_8 },
      ]);
    
      // Lista de productos con categorías asignadas
      const [foodList] = useState([
        // Cerámica
        { _id: "1", name: "Vaso de Cerámica", description: "Hecho a mano", price: 20, category: "Cerámica", image: food_17 },
        { _id: "2", name: "Vasijas", description: "Único y artesanal", price: 35, category: "Cerámica", image: food_1 },
    
        // Textiles
        { _id: "3", name: "Tela", description: "Color vibrante", price: 15, category: "Textiles", image: food_18 },
        { _id: "4", name: "Bolsa de Tela", description: "Ecológica y duradera", price: 12, category: "Textiles", image: food_16 },
    
        // Cestería
        { _id: "5", name: "Floreros Multiuso", description: "Hecha con mimbre", price: 50, category: "Cestería", image: food_22 },
        { _id: "6", name: "Jarrón", description: "Ideal para la mesa", price: 45, category: "Cestería", image: food_30 },
    
        // Tallado
        { _id: "7", name: "Figura Tallada", description: "Arte en madera", price: 70, category: "Tallado", image: food_5 },
        { _id: "8", name: "Juguetes Tallados", description: "Perfecto para niños", price: 30, category: "Tallado", image: food_25 },
    
        // Joyería
        { _id: "9", name: "Collar Elegante", description: "Diseño único", price: 100, category: "Joyería", image: food_4 },
        { _id: "10", name: "Pulsera Artesanal", description: "Hecho a mano", price: 25, category: "Joyería", image: food_7 },
    
        // Vidrio
        { _id: "11", name: "Florero de Vidrio", description: "Ideal para flores", price: 60, category: "Vidrio", image: food_2 },
        { _id: "12", name: "Plato de Vidrio", description: "Decoración elegante", price: 80, category: "Vidrio", image: food_3 },
    
        // Pintura
        { _id: "15", name: "Pintura Flores", description: "Colores vibrantes", price: 150, category: "Pintura", image: food_20 },
        { _id: "16", name: "Floreros", description: "Detalles precisos", price: 200, category: "Pintura", image: food_26 },
    
        // Extras para completar
        { _id: "20", name: "Cesta Decorativa", description: "Perfecto para interiores", price: 55, category: "Cestería", image: food_6 },
        { _id: "21", name: "Zapatos de Tela", description: "Con estilo artesanal", price: 120, category: "Textiles", image: food_33 },

        {_id: "24", name: "Figura en carton", description: "Hecho a mano", price: 20, category: "Cartonería", image: food_7}
      ]);

    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("")
    const currency = "$";
    const deliveryCharge = 50;

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
              if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }  
            } catch (error) {
                
            }
            
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data)
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: token });
        setCartItems(response.data.cartData);
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"))
                await loadCartData({ token: localStorage.getItem("token") })
            }
        }
        loadData()
    }, [])

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;
