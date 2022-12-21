import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { inputOtp, sendOTP } from "../../services/gcash";
import { numberOnlyInput } from "../../services/inputService";
import { payWithGcash } from "../../services/transaction";

const GcashPayment = () => {
  const [number, setNumber] = useState("");
  const [next, setNext] = useState(false);
  const [proceed, setProceed] = useState(false);
  const [otp, setOtp] = useState("");
  const [transaction, setTransaction] = useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);
  useEffect(() => {
    if (!!sessionStorage.getItem("transaction")) {
      setTransaction(JSON.parse(sessionStorage.getItem("transaction")));
    } else {
      navigate("/");
    }
  }, []);

  const handleNext = (e) => {
    e.preventDefault();
    sendOTP(number)
      .then((res) => {
        if (res.data && res.data.status === 200) {
          setNext(true);
          setErrors(null);
        }
      })
      .catch((err) => {
        setErrors(err.response.data.errors.mobile[0]);
      });
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    const data = { otp: otp, mobile: "0" + number };
    inputOtp(data)
      .then((res) => {
        if (res.data && res.data.status === 200) {
          setProceed(true);
          setErrors(null);
        }
      })
      .catch((err) => {
        setErrors(err.response.data.message);
      });
  };

  const handleChange = (e) => {
    const { maxLength, value, name } = e.target;
    const [fieldName, fieldIndex] = name.split("-");

    let fieldIntIndex = parseInt(fieldIndex, 10);
    setOtp("" + otp + e.target.value);

    // Check if no of char in field == maxlength
    if (value.length >= maxLength) {
      if (fieldIntIndex < 6) {
        const nextfield = document.querySelector(
          `input[name=field-${fieldIntIndex + 1}]`
        );

        if (nextfield !== null) {
          nextfield.focus();
        }
      }
    }
  };

  const isFormValid1 = () => {
    if (number === "" || number.length > 10 || number.length < 10) {
      return true;
    }
    return false;
  };

  const isFormValid2 = () => {
    if (otp === "" || otp.length > 6 || otp.length < 6) {
      return true;
    }
    return false;
  };

  const handlePay = () => {
    payWithGcash(transaction).then((res) => {
      if (res.data && res.data.status === 1) {
        sessionStorage.removeItem("transaction");
        navigate(`/checkout/status/success/${res.data.data.code}`);
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
  };
  return (
    <div className="gcash-container mb-4">
      <div className="top"></div>
      <div className="bottom">
        <div className="container">
          <div className="card mb-4">
            <div className="d-flex justify-content-center">
              <img
                src={require("../../assets/logo/gcash-logo.png")}
                width="200"
              />
            </div>
            <div className="card-body">
              {proceed ? (
                <>
                  <div className="ms-4 me-4 mb-2">
                    <small className="fw-bold">PAY WITH</small>
                    <Row className="mb-2">
                      <Col xs={6}>
                        <small>GCash</small>
                      </Col>
                      <Col xs={6} className="text-end">
                        <input type="radio" defaultChecked />
                      </Col>
                    </Row>
                  </div>
                  <div className="ms-4 me-4 mb-4">
                    <small className="fw-bold">YOU ARE ABOUT TO PAY</small>
                    <Row>
                      <Col xs={6}>
                        <small>Amount</small>
                      </Col>
                      <Col xs={6} className="text-end">
                        <small>PHP {transaction.grandTotal}.00</small>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6}>
                        <small>Discount</small>
                      </Col>
                      <Col xs={6} className="text-end">
                        <small>No Available Voucher</small>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col xs={6}>
                        <small>Total</small>
                      </Col>
                      <Col xs={6} className="text-end">
                        <small>
                          <sup>PHP</sup>
                          {transaction.grandTotal}.00
                        </small>
                      </Col>
                    </Row>
                    <div className="text-center mt-4">
                      <small>
                        Please review to ensure that the details are correct
                        before you proceed
                      </small>
                    </div>
                    <button
                      className="btn btn-f-primary w-100 mt-4"
                      onClick={handlePay}
                    >
                      PAY PHP {transaction.grandTotal}.00
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {next ? (
                    <form onSubmit={handleSendOtp}>
                      <span>
                        Enter the 6-digit authentication code sent to your
                        registered mobile number.
                      </span>

                      <div className="mt-2">
                        {!!errors && (
                          <small className="text-danger">{errors}</small>
                        )}
                      </div>

                      <div className="d-flex justify-content-center mt-4 n1-wrapper">
                        <input
                          className="form-control n-1"
                          name="field-1"
                          length="1"
                          value={otp.length >= 0 && otp.charAt(0)}
                          onChange={handleChange}
                          onKeyDown={(e) => numberOnlyInput(e, 1)}
                        />
                        <input
                          className="form-control n-1"
                          name="field-2"
                          length="1"
                          value={otp.length >= 0 && otp.charAt(1)}
                          onChange={handleChange}
                          onKeyDown={(e) => numberOnlyInput(e, 1)}
                        />
                        <input
                          className="form-control n-1"
                          name="field-3"
                          length="1"
                          value={otp.length >= 0 && otp.charAt(2)}
                          onChange={handleChange}
                          onKeyDown={(e) => numberOnlyInput(e, 1)}
                        />
                        <input
                          className="form-control n-1"
                          name="field-4"
                          length="1"
                          value={otp.length >= 0 && otp.charAt(3)}
                          onChange={handleChange}
                          onKeyDown={(e) => numberOnlyInput(e, 1)}
                        />
                        <input
                          className="form-control n-1"
                          name="field-5"
                          length="1"
                          value={otp.length >= 0 && otp.charAt(4)}
                          onChange={handleChange}
                          onKeyDown={(e) => numberOnlyInput(e, 1)}
                        />
                        <input
                          className="form-control n-1"
                          name="field-6"
                          length="1"
                          value={otp.length >= 0 && otp.charAt(5)}
                          onChange={handleChange}
                          onKeyDown={(e) => numberOnlyInput(e, 1)}
                        />
                      </div>
                      <button
                        className="btn btn-primary w-100"
                        disabled={isFormValid2()}
                        type="submit"
                      >
                        Next
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleNext}>
                      <h6>Login to pay with Gcash</h6>
                      <span className="m-n">Mobile No.</span>
                      <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">
                          +63
                        </span>
                        <input
                          type="text"
                          className="form-control n-2"
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                        />
                      </div>
                      {!!errors && (
                        <small className="text-danger">{errors}</small>
                      )}
                      <button
                        disabled={isFormValid1()}
                        className="btn btn-primary w-100"
                        type="submit"
                      >
                        Next
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GcashPayment;
