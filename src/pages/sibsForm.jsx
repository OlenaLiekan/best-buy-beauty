import React, { useEffect } from "react";
import { AuthContext } from '../context';
import { useLocation } from "react-router-dom";

const SIBSPaymentForm = () => {
const { serverDomain } = React.useContext(AuthContext);
  const location = useLocation();
  const { transactionID, formContext, amount } = location.state;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://api.sibspayments.com/assets/js/widget.js?id=${transactionID}`;
    script.async = true;
    document.body.appendChild(script);
  }, [transactionID]);

  return (
    <div>
      <form
        className="paymentSPG"
        spg-config={JSON.stringify({
          paymentMethodList: ["CARD", "MBWAY", "REFERENCE"],
          //paymentMethodList: ["CARD"],
          redirectUrl: `${serverDomain}api/sibs/formHandler?orderId=${localStorage.getItem('orderId')}`,
          amount: amount.toString().replace(",", "."),
          language: "pt",
        })}
        spg-style=""
        spg-context={formContext}
      ></form>
    </div>
  );
};

export default SIBSPaymentForm;