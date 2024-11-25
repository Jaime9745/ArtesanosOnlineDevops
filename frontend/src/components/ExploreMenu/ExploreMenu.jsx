import React, { useContext } from 'react'
import './ExploreMenu.css'
import { StoreContext } from '../../Context/StoreContext'

const ExploreMenu = ({category,setCategory}) => {

  const {menu_list} = useContext(StoreContext);
  const {url} = useContext(StoreContext);
  
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explora Nuestra Colección</h1>
      <p className='explore-menu-text'>Descubre una diversa gama de tesoros artesanales. Nuestra misión es celebrar el arte y la tradición, ofreciendo piezas únicas que aportan cultura y creatividad a tu vida, una obra artesanal a la vez.</p>
      <div className="explore-menu-list">
        {menu_list.map((item,index)=>{
            return (
                <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={index} className='explore-menu-list-item'>
                  <div className='explore-menu-list-item-img-container'>
                    <img src={url+"/images/"+item.menu_image} className={category===item.menu_name?"active":""} alt="" />
                  </div>
                  <p>{item.menu_name}</p> 
                </div>
            )
        })}
      </div>
      <hr />
    </div>
  )
}

export default ExploreMenu
