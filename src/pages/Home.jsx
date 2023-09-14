import React from 'react';

import BestSellersBlock from '../componetns/BestSellersBlock';
import BrandsBlock from '../componetns/BrandsBlock';
import MainSliderBlock from '../componetns/MainSliderBlock';

const Home = ({types}) => { 
    return (
      <div className="main__content">
        <MainSliderBlock />
        <BrandsBlock />
        <BestSellersBlock types={types} />
      </div>
    );
};

export default Home;