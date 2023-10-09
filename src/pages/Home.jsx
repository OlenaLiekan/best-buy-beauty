import React from 'react';

import BestSellersBlock from '../componetns/BestSellersBlock';
import BrandsBlock from '../componetns/BrandsBlock';
import MainSliderBlock from '../componetns/MainSliderBlock';

const Home = ({types}) => { 
    return (
      <div className="main__content">
        <MainSliderBlock />
        <BestSellersBlock types={types} />
        <BrandsBlock />
      </div>
    );
};

export default Home;