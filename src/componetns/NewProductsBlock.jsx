import React from "react";

import axios from "axios";
import { Link } from "react-router-dom";
import { scrollTop } from "../js/script";
import ProductBlock from "./ProductBlock";
import Skeleton from "./UI/Skeletons/Skeleton";
import { AuthContext } from "../context";
import { setBrandId, setCategoryId } from "../redux/slices/filterSlice";
import { useDispatch } from "react-redux";

const NewProductsBlock = () => {

  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { serverDomain, isPromoPage, setIsPromoPage } = React.useContext(AuthContext);
  const path = 'produtos';

  const dispatch = useDispatch();

  React.useEffect(() => {
    setIsLoading(true);
    const sortBy = 'id';        
    const order = 'DESC';
    axios.get(`${serverDomain}api/product?limit=100&sort=${sortBy}&order=${order}`)
      .then((res) => {
        setItems((res.data.rows).filter((item) => item.newProduct).slice(0,8));
        setIsLoading(false);
      });
    scrollTop();
  }, [serverDomain]);
      
  const products = items.map((item) =>
    <div key={item.id}
      className="block-new__item product-main__item"
    >
      <ProductBlock path={`/${path}/${item.id}`} {...item} />
    </div>     
  );

  const showNew = () => {
    if (isPromoPage) {
      setIsPromoPage(false);
    }
    dispatch(setBrandId(0));
    localStorage.removeItem('categoryId');
    dispatch(setCategoryId('')); 
    scrollTop();
  };

  const skeletons = [...new Array(12)].map((_, index) => <Skeleton key={index} />);

    return (
        <section className="new__block block-new">
          <div className="block-new__container">
            <div className="block-new__content">
              <h2 className="block-new__title">NOVIDADES</h2>
              <div className="block-new__items product-main__items">
                {isLoading ? skeletons : products}
              </div>
              <div className="block-new__more more-new-block">
                <Link onClick={showNew} to="/produtos?sortProperty=id&categoryId=0&brandId=0&currentPage=1" className="more-new-block__link scroll-top">
                  Mostrar mais novidades
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
    );
};

export default NewProductsBlock;