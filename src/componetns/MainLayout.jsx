import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {

    return (
        <div>
            <Header />
            <div className="main">
                <Outlet />                
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;