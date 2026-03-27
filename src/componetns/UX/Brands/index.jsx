import React from 'react'
import styles from "./Brands.module.scss";
import axios from 'axios';
import { AuthContext } from '../../../context';
import BrandsSkeleton from '../../UI/Skeletons/BrandsSkeleton';

function Brands({ type, brandId, onChangeBrand }) {

  const [brands, setBrands] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [allItems, setAllItems] = React.useState([]);
  const [selectedBrands, setSelectedBrands] = React.useState([]);
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
  }, [type, serverDomain]);

  React.useEffect(() => {
    axios.get(`${serverDomain}api/product?limit=2000`)
      .then((res) => {
        setAllItems(res.data.rows);
      });
  }, [serverDomain, type]);

  React.useEffect(() => {
    if (type && allItems.length > 0 && brands.length > 0) {
      const sortedItemsArr = allItems.filter((i) => i.typeId === type.id);
      const brandIdsArr = sortedItemsArr.length > 0 ? sortedItemsArr.map((i) => i.brandId) : [];
      let uniqueIds = [];
      if (brandIdsArr.length > 0) {
        for (let i = 0; i < brandIdsArr.length; i++) {
          let currentId = brandIdsArr[i];
          if (uniqueIds.length === 0) {
            uniqueIds.push(currentId);
          } else {
            const existingId = uniqueIds.find((brandId) => brandId === currentId);
            if (!existingId) {
              uniqueIds.push(currentId);
            }
          }
        }
      }
      if (uniqueIds.length > 0) {
        setSelectedBrands(uniqueIds);
      } 
    }
  }, [serverDomain, type, allItems, brands]);
  
  return (
    <ul className="product-main__categories">
      {
        selectedBrands.length > 1 
        &&
        <li onClick={() => onChangeBrand(0)} className={brandId === 0 ? "active" : ""}>
          <button className={styles.brandProducts}>
            Todos
          </button>
        </li>
      }
      {
        !selectedBrands.length
        &&
        <li onClick={() => onChangeBrand(0)} className={brandId === 0 ? "active" : ""}>
          <button className={styles.brandProducts}>
            Todos
          </button>
        </li>
      }
      {!isLoading
        ?
        selectedBrands.length > 0 && type.id > 0
          ?
          brands.map((brandName) => (
            selectedBrands.includes(brandName.id) ?
            <li key = { brandName.id } onClick = {() => onChangeBrand(brandName.id)} className={brandId === brandName.id || selectedBrands.length === 1 ? "active" : ""} >
              <button className={styles.brandProducts}>
                { brandName.name}
              </button>
            </li> : ''
          )) : 
          brands.map((brandName) => (
           <li key = { brandName.id } onClick = {() => onChangeBrand(brandName.id)} className={brandId === brandName.id ? "active" : ""} >
            <button className={styles.brandProducts}>
              { brandName.name}
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