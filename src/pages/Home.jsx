import React from 'react';

import BestSellersBlock from '../componetns/BestSellersBlock';
import BrandsBlock from '../componetns/UX/BrandsBlock';
import MainSliderBlock from '../componetns/UX/MainSliderBlock';

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