import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import Profile from './components/Auth/Profile';
import MyCart from './pages/MyCart';
import Menu from './components/Layout/Menu';
import CategoryFilter from './pages/CategoryFilter';
import CategoryPage from './pages/CategoryPage';
import Checkout from './pages/Checkout';
import ProductDetail from './components/Product/PorductDetail';
import AdminPanel from './adminPanel/adminPanel';
import AboutUs from './pages/aboutUs';
import ContactUs from './pages/ContactUs';
import BankAccounts from './pages/BankAccounts';

const App = () => {
  const location = useLocation();
  const isCheckoutPage = location.pathname === '/checkout';

  return (
    <>
      <Header showLogoOnly={isCheckoutPage} />
      {!isCheckoutPage && <Menu />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mycart" element={<MyCart />} />
        <Route path="/categoryfilter" element={<CategoryFilter />} />
        <Route path="/category/:mainCategory/:subCategory" element={<CategoryPage />} />
        <Route path="/category/:mainCategory" element={<CategoryPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/AdminPanel" element={<AdminPanel />} />
        <Route path='/aboutUs' element={<AboutUs/>}/>
        <Route path='/ContactUs' element={<ContactUs/>}/>
        <Route path='/BankAccounts' element={<BankAccounts/>}/>


      </Routes>
      {!isCheckoutPage && <Footer />}
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
