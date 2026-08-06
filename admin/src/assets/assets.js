import logo from './logo.png'
import add_icon from './add_icon.png'
import order_icon from './order_icon.png'
import profile_image from './profile_image.png'
import upload_area from './upload_area.png'
import parcel_icon from './parcel_icon.png'

// Se inyecta en el build (Vercel -> VITE_API_URL). El fallback es el Worker
// de desarrollo local.
export const url = import.meta.env.VITE_API_URL ?? 'http://localhost:8787'
export const currency = '$'

export const assets ={
    logo,
    add_icon,
    order_icon,
    profile_image,
    upload_area,
    parcel_icon
}

