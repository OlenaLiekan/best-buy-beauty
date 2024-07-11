import React from "react";

import { menuInit } from "../../../js/script";
import SubMenuHeader from "../SubMenuHeader";
import { Link } from "react-router-dom";
import axios from "axios";
import { camelize } from "../../../js/script";
import { setBrandId, setCategoryId } from "../../../redux/slices/filterSlice";
import { useDispatch } from "react-redux";
import { AuthContext } from "../../../context";
import MenuSkeleton from "../../UI/Skeletons/MenuSkeleton";

const MenuHeader = ({hideTicker}) => {

    const [menuList, setMenuList] = React.useState([]); 
    const [submenuList, setSubmenuList] = React.useState([]); 
    const [menuItems, setMenuItems] = React.useState([]);
    const [activeItem, setActiveItem] = React.useState(0);
    const { serverDomain, isPromoPage, setIsPromoPage } = React.useContext(AuthContext);

    const skeletons = [...new Array(6)].map((_, index) => <MenuSkeleton key={index} />);

    const dispatch = useDispatch();

    const onChangeBrand = (id) => {
        if (isPromoPage) {
            setIsPromoPage(false);            
        }
        dispatch(setBrandId(id));
        localStorage.removeItem('categoryId');
        localStorage.removeItem('subItems');
        dispatch(setCategoryId(id));        
    };

    const showPromo = () => {
        if (!isPromoPage) {
            setIsPromoPage(true);            
        }
        dispatch(setBrandId(0));
        localStorage.removeItem('categoryId');
        localStorage.removeItem('subItems');
        dispatch(setCategoryId(0));  
    };  

    React.useEffect(() => {
        axios.get(`${serverDomain}api/category`)
            .then((res) => {
                setMenuList(res.data.filter((item) => item.subMenu));
                setSubmenuList(res.data.filter((item) => !item.subMenu).reverse());
            });
    }, [serverDomain]);

    React.useEffect(() => {
        if (activeItem > 0) {
            axios.get(`${serverDomain}api/type?categoryId=${activeItem}`)
                .then((res) => {
                    setMenuItems(res.data);
                }); 
        }   
    }, [activeItem, serverDomain]);

    return ( 
        <>
            <div className="menu__link">
                <button onClick={menuInit} type="button" className="menu__icon icon-menu"><span></span></button>
                <Link to="/catalog" className="icon-menu__text icon-menu__text_hidden">Catálogo</Link>              
            </div>
            <div className="bottom-header__menu menu-bottom-header menu">
                <nav className={hideTicker ? "menu__body" : "menu__shift"}>
                <Link to="/catalog" className="icon-menu__text icon-menu__text_show">Catálogo</Link>                     
                    <ul className="menu__list">
                        <li className="menu__item item-menu">
                            <div className="item-menu__link item-menu__link-promo">
                                <Link to={`/produtos`} onClick={showPromo} className="item-menu__button menu-link">
                                    Promoção
                                </Link>
                            </div>
                        </li>
                        {menuList.length ? menuList.map((item) => 
                            <li key={item.id} value={item.name} onClick={() => setActiveItem(item.id)} className="menu__item item-menu">                               
                                <div className="item-menu__link">
                                    <button className="item-menu__button menu-button">
                                        {item.name}   
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                            <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
                                        </svg>
                                    </button>
                                </div> 
                            </li>
                        )
                        :                     
                        skeletons.map((skeleton, i) => 
                            <li key={i}>
                                <MenuSkeleton />
                            </li>
                        )        
                        }
                        {submenuList.length
                            ?
                            submenuList.map((item) => 
                            <li key={item.id} value={item.name} onClick={() => setActiveItem(item.id)} className="menu__item item-menu">                               
                                <div className={item.id == 8 ? "item-menu__link item-menu__link-promo" : "item-menu__link"}>
                                    <Link to={`/${camelize(item.name)}`} onClick={() => onChangeBrand(0)} className="item-menu__button menu-link">
                                        {item.name}
                                    </Link>
                                </div>
                            </li>
                        )
                        :                     
                        skeletons.map((skeleton, i) => 
                            <li key={i}>
                                <MenuSkeleton />
                            </li>
                        )        
                        }
                    </ul>
                </nav>
            </div>
            <SubMenuHeader menuItems={menuItems} categoryId={activeItem} hideTicker={hideTicker} />
        </>
    );
};

export default MenuHeader;