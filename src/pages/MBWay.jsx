import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context";
import { useNavigate } from "react-router-dom";

const PaymentPendingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState("");
  const [transactionID, setTransactionID] = useState("");
  const { serverDomain } = React.useContext(AuthContext);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const phoneParam = searchParams.get("phone");
    const transactionIDParam = searchParams.get("transactionID");

    setPhone(phoneParam || "");
    setTransactionID(transactionIDParam || "");
  }, [location]);

  const tokenParts = phone.split("#");
  const formattedPhone =
    tokenParts.length === 2
      ? `+${tokenParts[0]} ${tokenParts[1]}`
      : "Número inválido";
  const totalTime = 4 * 60;
  const [timeLeft, setTimeLeft] = useState(totalTime);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(`${serverDomain}api/sibs/check-Status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactionID }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro desconhecido");
      }

      if (data.success && data.paymentStatus === "Success") {
        navigate("/send-email?method=MBWAY");
      } else if (data.success && data.paymentStatus === "Pending") {
        // Continua
      } else if (data.success && data.paymentStatus === "Declined") {
        window.alert("Pagamento foi cancelado.");
        navigate("/order");
      } else {
        window.alert(
          "Lamentamos, mas não foi possível concluir o processo de pagamento. Por favor, tente novamente"
        );
        navigate("/order");
      }
    } catch (error) {
      console.warn(`Erro ao verificar status do pagamento: ${error.message}. Continuando processo sem interrupção.`);
    }
  };

  const cancelarPagamento = async () => {
    try {
      const response = await fetch(`${serverDomain}api/sibs/check-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactionID }),
      });

      const data = await response.json();

      if (data.success) {
        navigate("/send-email?method=MBWAY");
      } else {
        window.alert(data.message);
        navigate("/order");
      }
    } catch (error) {
      window.alert(`Erro ao cancelar o pagamento: ${error.message}`);
      navigate("/order");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 0) {
          clearInterval(timer);
          cancelarPagamento();
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, transactionID]);

  useEffect(() => {
    const statusChecker = setInterval(checkPaymentStatus, 5000);
    return () => clearInterval(statusChecker);
  }, [transactionID]);

  const progressPercentage = (timeLeft / totalTime) * 100;

  return (
    <div
      style={{
        margin: 'auto',
        border: '1px solid #e1e1e1',
        borderRadius: '8px',
        paddingTop: "20px",
        textAlign: "center",
        backgroundColor: "#f8f8f8",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          minWidth: "600px",
          padding: "10px",
          color: "#595959",
          margin: "0 auto",
        }}
      >
        <h2>Pagamento MBWAY pendente</h2>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "15px",
            borderBottom: "1px solid #e1e1e1",
          }}
        >
          <span>Foi emitido o pagamento para o número:</span>
          <span>
            <strong>{formattedPhone}</strong>
          </span>
        </div>

        <div style={{ padding: "20px", flexDirection: "column" }}>
          <p>Efetue o pagamento dentro de:</p>
          <div
            className="progress-circle"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: `conic-gradient(#4caf50 ${progressPercentage}%, #e1e1e1 ${progressPercentage}%)`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              margin: "20px auto 0",
            }}
          >
            <div
              className="progress-text"
              style={{
                position: "absolute",
                fontSize: "24px",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
              }}
            >
              {timeLeft > 0 ? formatTime(timeLeft) : "Tempo esgotado!"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPendingPage;
