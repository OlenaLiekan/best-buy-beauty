import React from 'react'
import styles from "./Brands.module.scss";
import axios from 'axios';
import { AuthContext } from '../../context';
import BrandsSkeleton from '../BrandsSkeleton';

function Brands({ type, brandId, onChangeBrand }) {

  const [brands, setBrands] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { serverDomain } = React.useContext(AuthContext);

  const skeletons = [...new Array(6)].map((_, index) => <BrandsSkeleton key={index} />);

  React.useEffect(() => {
    setIsLoading(true); 
    axios
      .get(
        `${serverDomain}api/brand`,
      )
      .then((res) => {
        setBrands(res.data);
        setIsLoading(false);
      });
    window.scrollTo(0, 0);
  }, [type]);
  
  return (
      <ul className="product-main__categories">
        <li onClick={() => onChangeBrand(0)} className={brandId === 0 ? "active" : ""}>
          <button className={styles.brandProducts}>
            Todos
          </button>
        </li>
        {!isLoading
          ?
          brands.map((brandName) => (
            <li key={brandName.id} onClick={() => onChangeBrand(brandName.id)} className={brandId === brandName.id ? "active" : ""} >
                  <button className={styles.brandProducts}>
                    {brandName.name}
                  </button>
              </li>
          ))
          :
          skeletons.map((skeleton, i) => 
            <li key={i}>
                <BrandsSkeleton />
            </li>
          )  
        }
      </ul>  
  );
}

export default Brands;