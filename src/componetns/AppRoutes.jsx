import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Catalog from "../pages/Catalog";
import Cart from "../pages/Cart";
import ProductPage from "../pages/ProductPage";
import ProductCard from "../pages/ProductCard";
import SuccessPage from "../pages/SuccessPage";
import About from "../pages/About";
import Payment from "../pages/Payment";
import Faq from "../pages/Faq";
import MainLayout from "./MainLayout";
import UserLogIn from "../pages/UserLogIn";
import Registration from "../pages/Registration";
import { AuthContext } from "../context";
import AuthPage from "../pages/AuthPage";
import axios from "axios";
import { camelize } from "../js/script";
import Terms from "../pages/Terms";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import ReturnsPolicy from "../pages/ReturnsPolicy";
import DisputeResolution from "../pages/DisputeResolution";
import SubmitPage from "../pages/SubmitPage";
import SIBSForm from "../pages/sibsForm";
import MBWay from "../pages/MBWay";

const AppRoutes = () => {
  const { isAuth, serverDomain } = React.useContext(AuthContext);
  const [types, setTypes] = React.useState([]);
  
  React.useEffect(() => {
    axios.get(`${serverDomain}api/type`).then((res) => {
      setTypes(res.data);
    });
  }, [serverDomain]);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="" element={<Home types={types} />} />
        {isAuth ? (
          <Route path="auth" element={<AuthPage />} />
        ) : (
          <Route path="login" element={<UserLogIn />} />
        )}
        <Route path="registration" element={<Registration />} />
        <Route path="catalog" element={<Catalog />} />
        {types.map((type) => (
          <Route
            key={type.id}
            value={type}
            path={`${camelize(type.name)}`}
            element={<ProductPage type={type} />}
          />
        ))}

        {types.map((type) => (
          <Route
            key={type.id}
            value={type}
            path={`${camelize(type.name)}/:id`}
            element={<ProductCard type={type} />}
          />
        ))}

        <Route path="cart" element={<Cart arr={types} />} />
        <Route path="order" element={<SubmitPage />} />
        <Route path="send-email" element={<SuccessPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="about" element={<About />} />
        <Route path="payment&delivery" element={<Payment />} />
        <Route path="faq" element={<Faq />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacyPolicy" element={<PrivacyPolicy />} />
        <Route path="returnsPolicy" element={<ReturnsPolicy />} />
        <Route path="disputeResolution" element={<DisputeResolution />} />

        <Route path="sibs-form" element={<SIBSForm />} />
        <Route path="sibs-mbway" element={<MBWay />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
