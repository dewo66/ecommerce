import React from 'react';
import ProductList from '../components/Product/ProductList';
import CampaignSlider from '../components/CampaignSlider';
import ExaminationImages from '../components/ExaminationImages';

const Home = () => {
  return (
    <div>
      <CampaignSlider />
      <ExaminationImages />
      <ProductList />
    </div>
  );
};

export default Home;
