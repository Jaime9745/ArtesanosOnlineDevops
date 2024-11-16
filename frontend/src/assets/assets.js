import basket_icon from './basket_icon.png'
import logo from './logo.png'
import header_img from './header_img.png'
import search_icon from './search_icon.png'
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
import food_8 from './food_8.png'
import food_9 from './food_9.png'
import food_10 from './food_10.png'
import food_11 from './food_11.png'
import food_12 from './food_12.png'
import food_13 from './food_13.png'
import food_14 from './food_14.png'
import food_15 from './food_15.png'
import food_16 from './food_16.png'
import food_17 from './food_17.png'
import food_18 from './food_18.png'
import food_19 from './food_19.png'
import food_20 from './food_20.png'
import food_21 from './food_21.png'
import food_22 from './food_22.png'
import food_23 from './food_23.png'
import food_24 from './food_24.png'
import food_25 from './food_25.png'
import food_26 from './food_26.png'
import food_27 from './food_27.png'
import food_28 from './food_28.png'
import food_29 from './food_29.png'
import food_30 from './food_30.png'
import food_31 from './food_31.png'
import food_32 from './food_32.png'

import add_icon_white from './add_icon_white.png'
import add_icon_green from './add_icon_green.png'
import remove_icon_red from './remove_icon_red.png'
import app_store from './app_store.png'
import play_store from './play_store.png'
import linkedin_icon from './linkedin_icon.png'
import facebook_icon from './facebook_icon.png'
import twitter_icon from './twitter_icon.png'
import cross_icon from './cross_icon.png'
import selector_icon from './selector_icon.png'
import rating_starts from './rating_starts.png'
import profile_icon from './profile_icon.png'
import bag_icon from './bag_icon.png'
import logout_icon from './logout_icon.png'
import parcel_icon from './parcel_icon.png'
import checked from './checked.png'
import un_checked from './un_checked.png'

export const assets = {
    logo,
    basket_icon,
    header_img,
    search_icon,
    rating_starts,
    add_icon_green,
    add_icon_white,
    remove_icon_red,
    app_store,
    play_store,
    linkedin_icon,
    facebook_icon,
    twitter_icon,
    cross_icon,
    selector_icon,
    profile_icon,
    logout_icon,
    bag_icon,
    parcel_icon,
    checked,
    un_checked
}

export const menu_list = [
    {
        menu_name: "Cerámica",
        menu_image: menu_1
    },
    {
        menu_name: "Textiles",
        menu_image: menu_2
    },
    {
        menu_name: "Cestería",
        menu_image: menu_3
    },
    {
        menu_name: "Tallado",
        menu_image: menu_4
    },
    {
        menu_name: "Joyería",
        menu_image: menu_5
    },
    {
        menu_name: "Vidrio",
        menu_image: menu_6
    },
    {
        menu_name: "Cartonería",
        menu_image: menu_7
    },
    {
        menu_name: "Pintura",
        menu_image: menu_8
    }]

export const food_list = [
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
    
    {
        _id: "13",
        name: "Chicken Sandwich",
        image: food_13,
        price: 12,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Sandwich"
    },
    {
        _id: "14",
        name: "Vegan Sandwich",
        image: food_14,
        price: 18,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Sandwich"
    },
    {
        _id: "17",
        name: "Cup Cake",
        image: food_17,
        price: 14,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Cake"
    }, {
        _id: "18",
        name: "Vegan Cake",
        image: food_18,
        price: 12,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Cake"
    }, {
        _id: "19",
        name: "Butterscotch Cake",
        image: food_19,
        price: 20,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Cake"
    },
    {
        _id: "22",
        name: "Fried Cauliflower",
        image: food_22,
        price: 22,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Pure Veg"
    }, {
        _id: "23",
        name: "Mix Veg Pulao",
        image: food_23,
        price: 10,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Pure Veg"
    }, {
        _id: "24",
        name: "Rice Zucchini",
        image: food_24,
        price: 12,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Pure Veg"
    },
    {
        _id: "25",
        name: "Cheese Pasta",
        image: food_25,
        price: 12,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Pasta"
    },
    {
        _id: "26",
        name: "Tomato Pasta",
        image: food_26,
        price: 18,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Pasta"
    }, {
        _id: "27",
        name: "Creamy Pasta",
        image: food_27,
        price: 16,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Pasta"
    }, {
        _id: "28",
        name: "Chicken Pasta",
        image: food_28,
        price: 24,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Pasta"
    }, {
        _id: "29",
        name: "Buttter Noodles",
        image: food_29,
        price: 14,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Noodles"
    }, {
        _id: "30",
        name: "Veg Noodles",
        image: food_30,
        price: 12,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Noodles"
    }, {
        _id: "31",
        name: "Somen Noodles",
        image: food_31,
        price: 20,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Noodles"
    }, {
        _id: "32",
        name: "Cooked Noodles",
        image: food_32,
        price: 15,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Noodles"
    }
]
