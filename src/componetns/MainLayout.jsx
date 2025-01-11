import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import MainLoader from './UX/MainLoader';

const MainLayout = () => {

    return (
        (document.readyState === "complete")
            ?
            <div>
                <Header />
                <div className="main">
                    <Outlet />                
                </div>
                <Footer />
            </div>                
            :
            <div className="main">
                <MainLoader/>
            </div>
    );
};

export default MainLayout;