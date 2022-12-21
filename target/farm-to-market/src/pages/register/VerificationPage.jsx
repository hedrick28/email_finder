import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Container, Form, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Joi from "joi";
import { register } from "../../redux/actions/auth";
import { verifyOTP, generateOTPEmail, deleteOTP } from "../../services/user";
import { inputOtp, sendOTP } from "../../services/gcash";

const VerificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const info = location.state?.form;
  const timeMax = 3;
  const [contact, setContact] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(timeMax);
  const [errorsMobile, setErrorsMobile] = useState(null);
  const [formMobile, setFormMobile] = useState({
    code1: "",
    code2: "",
    code3: "",
    code4: "",
    code5: "",
    code6: "",
  });
  const [errors1, setErrors1] = useState({});
  const [errorsEmail, setErrorsEmail] = useState(null);

  useEffect(() => {
    handleVerifyMobile();
  }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prev) => prev - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          handleDeleteOTP();
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  const schema1 = Joi.object({
    code1: Joi.number().min(0).required(),
    code2: Joi.number().min(0).required(),
    code3: Joi.number().min(0).required(),
    code4: Joi.number().min(0).required(),
    code5: Joi.number().min(0).required(),
    code6: Joi.number().min(0).required(),
  });

  const handleGetOTP = () => {
    verifyOTP(info.userName).then((res) => {
      if (res.data && res.data.status === 1) {
        setContact(res.data.data);
      } else if (res.data && res.data.status === 0) {
        console.log("no otp");
      }
    });
  };

  const handleVerifyMobile = () => {
    setIsVisible(true);
    sendOTP(info.mobile)
      .then((res) => {
        if (res.data && res.data.status === 200) {
          setErrorsMobile(null);
          setMinutes(timeMax);
          setSeconds(0);
        }
      })
      .catch((err) => {
        setErrorsMobile(err.response.data.errors.mobile[0]);
      });
  };

  const handleVerifyEmail = () => {
    formMobile.code1 = "";
    formMobile.code2 = "";
    formMobile.code3 = "";
    formMobile.code4 = "";
    formMobile.code5 = "";
    formMobile.code6 = "";

    const contactInfo = {
      contact: info.email,
      userName: info.userName,
    };

    generateOTPEmail(contactInfo).then((res) => {
      if (res.data && res.data.status === 1) {
        handleGetOTP();
        setMinutes(timeMax);
        setSeconds(0);
        toast.info(res.data.message);
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
  };

  const handleSubmitEmail = (event) => {
    event.preventDefault();
    let code =
      formMobile.code1 +
      formMobile.code2 +
      formMobile.code3 +
      formMobile.code4 +
      formMobile.code5 +
      formMobile.code6;
    if (code === contact?.otp) {
      setErrorsEmail(null);
      handleDeleteOTP();
      handleRegister();
    } else {
      if (seconds === 0 && minutes === 0) {
        setErrorsEmail("The OTP is expired. Click Resend OTP");
        toast.error(
          "The OTP is expired. Please click resend if you wish to try again."
        );
      } else {
        setErrorsEmail("The OTP is incorrect.");
        toast.error("The OTP is incorrect.");
      }
    }
  };

  const handleDeleteOTP = () => {
    deleteOTP(info.userName);
    setContact(null);
    handleGetOTP();
  };

  const handleRegister = () => {
    if (info.role === "admin") {
      dispatch(register(info)).then((data) => {
        navigate("/users/admins");
      });
    } else {
      dispatch(register(info)).then((data) => {
        navigate("/login");
      });
    }
  };

  const handleBack = () => {
    if (info.role === "admin") {
      handleDeleteOTP();
      navigate("/users/admins/add", {
        state: {
          info,
        },
      });
    } else {
      handleDeleteOTP();
      navigate("/register", {
        state: {
          info,
        },
      });
    }
  };

  const handleChange1 = (event) => {
    setFormMobile({
      ...formMobile,
      [event.currentTarget.name]: event.currentTarget.value.slice(0, 1),
    });

    const { error1 } = schema1
      .extract(event.currentTarget.name)
      .label(event.currentTarget.name)
      .validate(event.currentTarget.value);
    if (error1) {
      setErrors1({
        ...errors1,
        [event.currentTarget.name]: error1.details[0].message,
      });
    } else {
      delete errors1[event.currentTarget.name];
      setErrors1(errors1);
    }

    const { maxLength, value, name } = event.target;
    const [fieldName, fieldIndex] = name.split("e");
    let fieldIntIndex = parseInt(fieldIndex, 10);

    if (value.length > 0 && value.length >= maxLength) {
      if (fieldIntIndex < 6) {
        const nextfield = document.querySelector(
          `input[name=code${fieldIntIndex + 1}]`
        );

        if (nextfield !== null) {
          nextfield.focus();
        }
      }
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();

    let otpcode =
      formMobile.code1 +
      formMobile.code2 +
      formMobile.code3 +
      formMobile.code4 +
      formMobile.code5 +
      formMobile.code6;
    const data = { otp: otpcode, mobile: "0" + info.mobile };
    if (seconds === 0 && minutes === 0) {
      toast.error(
        "The OTP is expired. Please click resend if you wish to try again."
      );
      setErrorsMobile("The OTP is expired. Click Resend OTP");
    } else {
      inputOtp(data)
        .then((res) => {
          if (res.data && res.data.status === 200) {
            setErrorsMobile(null);
            if (info.email === "") {
              handleRegister();
            } else {
              setIsVisible(false);
              handleVerifyEmail();
            }
          }
        })
        .catch((err) => {
          setErrorsMobile("The OTP is incorrect.");
          toast.error("The OTP is incorrect.");
        });
    }
  };

  const isFormInvalid1 = () => {
    const result = schema1.validate(formMobile);
    return !!result.error;
  };

  if (isVisible) {
    return (
      <Container className="mt-3 mb-3" style={{ height: "30rem" }}>
        <div className="d-flex justify-content-center">
          <form onSubmit={handleSendOtp}>
            <Card
              style={{
                width: "23rem",
                margin: "4rem",
              }}
            >
              <Card.Header>
                <Card.Title>
                  <div className="col-12 md-10 row d-flex justify-content-center align-content-center">
                    Verify Your Mobile Number
                  </div>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Form.Group>
                    <Form.Label>
                      Enter the 6-digit authentication code sent to your
                      registered mobile number.
                    </Form.Label>
                    <div className="mt-2">
                      {!!errorsMobile && (
                        <small className="text-danger">{errorsMobile}</small>
                      )}
                    </div>

                    <div className="d-flex justify-content-center mt-2 n1-wrapper">
                      <input
                        type="number"
                        className="form-control n-1"
                        name="code1"
                        value={formMobile.code1.slice(0, 1)}
                        onChange={handleChange1}
                      />
                      <input
                        type="number"
                        className="form-control n-1"
                        name="code2"
                        value={formMobile.code2}
                        onChange={handleChange1}
                      />
                      <input
                        type="number"
                        className="form-control n-1"
                        name="code3"
                        value={formMobile.code3}
                        onChange={handleChange1}
                      />
                      <input
                        type="number"
                        className="form-control n-1"
                        name="code4"
                        value={formMobile.code4}
                        onChange={handleChange1}
                      />
                      <input
                        type="number"
                        className="form-control n-1"
                        name="code5"
                        value={formMobile.code5}
                        onChange={handleChange1}
                      />
                      <input
                        type="number"
                        className="form-control n-1"
                        name="code6"
                        value={formMobile.code6}
                        onChange={handleChange1}
                      />
                    </div>
                  </Form.Group>
                </Row>

                {minutes === 0 && seconds === 0 ? (
                  <Row>
                    <Col className="mt-1">OTP expired</Col>
                    <Col className="mt-1 text-primary col-auto">
                      <button
                        style={{ color: "blue" }}
                        className="btn btn-light btn-sm"
                        type="button"
                        onClick={() => handleVerifyMobile()}
                      >
                        Resend OTP
                      </button>
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col lg={8} className="mt-1">
                      OTP expires in 0{minutes}:{seconds < 10 ? 0 : null}
                      {seconds}
                    </Col>
                  </Row>
                )}
              </Card.Body>
              <Card.Footer>
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <button
                    className="btn btn-f-primary me-md-2"
                    type="button"
                    onClick={() => {
                      handleBack();
                    }}
                  >
                    &nbsp;&nbsp;Back&nbsp;&nbsp;
                  </button>
                  <button
                    className="btn btn-f-primary"
                    disabled={isFormInvalid1()}
                    type="submit"
                  >
                    &nbsp;&nbsp;Next&nbsp;&nbsp;
                  </button>
                </div>
              </Card.Footer>
            </Card>
          </form>
        </div>
      </Container>
    );
  } else if (!isVisible && (info.email !== null || info.email !== "")) {
    return (
      <Container className="mt-3 mb-3" style={{ height: "30rem" }}>
        <div className="d-flex justify-content-center">
          <Form onSubmit={handleSubmitEmail}>
            <Card style={{ width: "23rem", margin: "4rem" }}>
              <Card.Header>
                <Card.Title>
                  <div className="col-12 md-10 row d-flex justify-content-center align-content-center">
                    Verify Your Email Address
                  </div>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Form.Group>
                    <Form.Label>
                      Enter the verification code sent to your email Address.
                    </Form.Label>
                    <div className="mt-2">
                      {!!errorsEmail && (
                        <small className="text-danger">{errorsEmail}</small>
                      )}
                    </div>
                    <div className="d-flex justify-content-center mt-2 n1-wrapper">
                      <input
                        type="number"
                        className="form-control n-1"
                        name="code1"
                        value={formMobile.code1.slice(0, 1)}
                        onChange={handleChange1}
                      />
                      <input
                        type="number"
                        className="form-control n-1"
                        name="code2"
                        value={formMobile.code2}
                        onChange={handleChange1}
                      />
                      <input
                        type="number"
                        className="form-control n-1"
                        name="code3"
                        value={formMobile.code3}
                        onChange={handleChange1}
                      />
                      <input
                        type="number"
                        className="form-control n-1"
                        name="code4"
                        value={formMobile.code4}
                        onChange={handleChange1}
                      />
                      <input
                        type="number"
                        className="form-control n-1"
                        name="code5"
                        value={formMobile.code5}
                        onChange={handleChange1}
                      />
                      <input
                        type="number"
                        className="form-control n-1"
                        name="code6"
                        value={formMobile.code6}
                        onChange={handleChange1}
                      />
                    </div>
                  </Form.Group>
                </Row>

                {minutes === 0 && seconds === 0 ? (
                  <Row>
                    <Col className="mt-1">OTP expired</Col>
                    <Col className="mt-1 text-primary col-auto">
                      <button
                        style={{ color: "blue" }}
                        className="btn btn-light btn-sm"
                        type="button"
                        onClick={() => handleVerifyEmail()}
                      >
                        Resend OTP
                      </button>
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col lg={8} className="mt-1">
                      OTP expires in 0{minutes}:{seconds < 10 ? 0 : null}
                      {seconds}
                    </Col>
                  </Row>
                )}
              </Card.Body>
              <Card.Footer>
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <button
                    className="btn btn-f-primary me-md-2"
                    type="button"
                    onClick={() => {
                      handleBack();
                    }}
                  >
                    &nbsp;&nbsp;Back&nbsp;&nbsp;
                  </button>
                  <button
                    className="btn btn-f-primary"
                    type="submit"
                    disabled={isFormInvalid1()}
                  >
                    Submit
                  </button>
                </div>
              </Card.Footer>
            </Card>
          </Form>
        </div>
      </Container>
    );
  }
};

export default VerificationPage;
