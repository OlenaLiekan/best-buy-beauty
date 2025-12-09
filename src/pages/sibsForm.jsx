import React, { useEffect } from "react";
import { AuthContext } from '../context';
import { useLocation } from "react-router-dom";

const SIBSPaymentForm = () => {
const { serverDomain } = React.useContext(AuthContext);
  const location = useLocation();
  const { transactionID, formContext, amount } = location.state;
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [widgetLoaded, setWidgetLoaded] = React.useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    const script = document.createElement("script");
    script.src = `https://api.sibspayments.com/assets/js/widget.js?id=${transactionID}`;
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      console.log('Widget carregado com sucesso.');
      setWidgetLoaded(true);
      setIsLoading(false);
    };
    script.onerror = (error) => {
      console.error('Erro ao carregar o widget:', error);
      setIsError(true);
      setIsLoading(false);
    };
  }, [transactionID]);

  return (
    <div style={{minHeight: '100vh'}}>
      {isLoading && !widgetLoaded && !isError ?
        <div style={{
          paddingTop: '100px',
          textAlign: 'center',
          color: '#AD902B',
          fontWeight: '500',
          letterSpacing: '0.5px',
          lineHeight: '1.2'
        }}>
          Carregamento do formulário em andamento...
        </div> : ''}
        {isError && !isLoading && !widgetLoaded ?
          <div style={{
            paddingTop: '100px',
            textAlign: 'center',
          }}>
          <p style={{
            color: '#b45a40',
            fontWeight: '500',
            marginBottom: '40px',
            letterSpacing: '0.5px'
          }}>
            Erro ao carregar o widget
          </p>
          <button style={{
            borderRadius: '20px',
            padding: '15px 20px',
            backgroundColor: '#252525',
            color: '#fff',
            minWidth: '220px',
            boxShadow: '3px 3px 3px #3232324c',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontWeight: '500'
          }} onClick={() => window.location.reload()}>
            Repita
          </button>
      </div> : ''}
      <form
        className="paymentSPG"
        spg-config={JSON.stringify({
          paymentMethodList: ["CARD", "MBWAY", "REFERENCE"],
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