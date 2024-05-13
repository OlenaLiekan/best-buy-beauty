import React from 'react';

import BestSellersBlock from '../componetns/BestSellersBlock';
import BrandsBlock from '../componetns/UX/BrandsBlock';
import MainSliderBlock from '../componetns/UX/MainSliderBlock';
import NewProductsBlock from '../componetns/NewProductsBlock';

const Home = ({types}) => { 
    return (
      <div className="main__content">
        <MainSliderBlock />
        <NewProductsBlock types={types} />
        <BestSellersBlock types={types} />
        <BrandsBlock />
      </div>
    );
};

export default Home;