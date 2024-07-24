import React from 'react';
import CategoryList from './CategoryList';

const ProductList = () => {
  return (
    <div>
      <CategoryList category="manav" title="Manav Ürünleri" />
      <CategoryList category="taze" title="Taze Ürünler" />
      <CategoryList category="soğuk" title="Soğuk Ürünler" />
      {/* Ekstra kategori ekleme yeri  */}
    </div>
  );
};

export default ProductList;
