import mongoose from "mongoose";
import menuModel from "./models/menuModel.js";
import 'dotenv/config';

// Conectar a la base de datos
const connectDB = async () => {
    await mongoose.connect('mongodb+srv://greatstack:2220211014@cluster0.fwhsu.mongodb.net/food-del', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("DB Connected");
};

// Datos de ejemplo para la colección de menús
const menuData = [
    {
        menu_name: "Cerámica",
        menu_image: "/images/menu_1.png"
    },
    {
        menu_name: "Textiles",
        menu_image: "/images/menu_2.png"
    },
    {
        menu_name: "Cestería",
        menu_image: "/images/menu_3.png"
    },
    {
        menu_name: "Tallado",
        menu_image: "/images/menu_4.png"
    },
    {
        menu_name: "Joyería",
        menu_image: "/images/menu_5.png"
    },
    {
        menu_name: "Vidrio",
        menu_image: "/images/menu_6.png"
    },
    {
        menu_name: "Cartonería",
        menu_image: "/images/menu_7.png"
    },
    {
        menu_name: "Pintura",
        menu_image: "/images/menu_8.png"
    }
];

// Insertar datos de ejemplo en la colección de menús
const seedMenu = async () => {
    await connectDB();
    await menuModel.deleteMany({});
    await menuModel.insertMany(menuData);
    console.log("Menu data seeded");
    mongoose.connection.close();
};

seedMenu();