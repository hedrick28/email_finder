import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { transactionStatus } from "../../services/transaction";

const TransactionSuccess = () => {
  const param = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    transactionStatus(param.code).then((res) => {
      if (res.data && res.data.status === 1) {
        setTimeout(() => {
          navigate("/");
        }, 5000);
      }
    });
  }, [param]);
  return (
    <Container className="mb-4 mt-4">
      <div className="text-center pt-4 pb-4 transaction-success">
        <h2 className="mt-4">Transaction Successful</h2>
        <FontAwesomeIcon icon={faCheck} size="xl" />
        <Link to="/" className="btn btn-f-primary link">
          Continue Shopping
        </Link>
      </div>
    </Container>
  );
};

export default TransactionSuccess;
