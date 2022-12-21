import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Joi from "joi";
import { Card, Container, Form, Row, Col } from "react-bootstrap";
import { allAccountUsers } from "../../services/user";

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const values = location.state?.info;
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(
    values || {
      firstName: "",
      lastName: "",
      birthDate: "",
      mobile: "",
      email: "",
      userName: "",
      password: "",
      role: "",
      businessName: "",
    }
  );

  useEffect(() => {
    allAccountUsers().then((response) => {
      setUsers(response.data);
    });
    navigate(location.pathname, {});
  }, []);

  const schema = Joi.object({
    firstName: Joi.string().trim().min(1).required(),
    lastName: Joi.string().trim().min(1).required(),
    birthDate: Joi.string()
      .required()
      .custom((value, helper) => {
        var dob = new Date(value.split(" ")[0]);
        var dateNow = new Date();
        if (dateNow.getFullYear() - dob.getFullYear() < 15) {
          return helper.message(
            "Invalid birth date, age must be greater than or equal to 15"
          );
        } else {
          return true;
        }
      }),
    mobile: Joi.string()
      .trim()
      .length(10)
      .pattern(/[9]{1}[0-9]{9}/)
      .required(),
    email: Joi.string()
      .trim()
      .allow("")
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "biz"] } })
      .optional(),
    userName: Joi.string()
      .trim()
      .alphanum()
      .min(7)
      .max(25)
      .trim(true)
      .required(),
    password: Joi.string()
      .trim()
      .min(7)
      .max(30)
      .pattern(/[a-zA-Z0-9]/)
      .required(),
    role: Joi.string().required(),
    businessName: Joi.string().trim().min(1).required(),
  });

  const handleChange = (event) => {
    if (event.currentTarget.name === "businessName") {
      setForm({
        ...form,
        [event.currentTarget.name]: event.currentTarget.value,
      });
    } else {
      setForm({
        ...form,
        [event.currentTarget.name]: event.currentTarget.value.trim(),
      });
    }

    const { error } = schema
      .extract(event.currentTarget.name)
      .label(event.currentTarget.name)
      .validate(event.currentTarget.value);
    if (error) {
      setErrors({
        ...errors,
        [event.currentTarget.name]: error.details[0].message,
      });
    } else {
      delete errors[event.currentTarget.name];
      setErrors(errors);
    }
  };

  const isFormInvalid = () => {
    const result = schema.validate(form);
    return !!result.error;
  };

  const isNotUniqueUserName = () => {
    let user = users.find((data) => data.userName === form.userName);
    if (user) {
      return true;
    }
    return false;
  };

  const isNotUniqueBusinessName = () => {
    let businessname = users.find(
      (data) =>
        data.businessName?.toLowerCase() === form.businessName?.toLowerCase()
    );
    if (businessname) {
      return true;
    }
    return false;
  };

  const isNotUniqueMobile = () => {
    let mobileNumber = users.find((data) => data.mobile === form.mobile);
    if (mobileNumber) {
      return true;
    }
    return false;
  };

  const isNotUniqueEmail = () => {
    let emailAddress = users.find((data) => data.email === form.email);

    if (emailAddress && emailAddress.email !== "") {
      return true;
    }
    return false;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      isFormInvalid() ||
      isNotUniqueUserName() ||
      isNotUniqueBusinessName() ||
      isNotUniqueMobile() ||
      isNotUniqueEmail()
    ) {
      return null;
    } else {
      handleVerifyMobile();
    }
  };

  const handleVerifyMobile = () => {
    navigate(`/verify/${form.userName}`, {
      state: {
        form,
      },
    });
  };

  const handleBack = () => {
    if (
      window.confirm(
        "Are you sure you want to go back? Your progress won't be save."
      )
    ) {
      navigate("/");
    }
  };

  return (
    <Container className="mt-4 mb-4">
      <Form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-center">
          <Card>
            <Card.Header>
              <Card.Title>
                <div className="col-12 row d-flex justify-content-center align-content-center">
                  Create an Account
                </div>
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col lg={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      size="1x"
                      id="firstName"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Jose"
                      required
                    ></Form.Control>
                    {errors.firstName && (
                      <div className="text-danger">First name is required.</div>
                    )}
                  </Form.Group>
                </Col>
                <Col lg={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      size="1x"
                      id="lastName"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Rizal"
                      required
                    ></Form.Control>
                    {errors.lastName && (
                      <div className="text-danger">Surname is required.</div>
                    )}
                  </Form.Group>
                </Col>
                <Col lg={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control
                      type="date"
                      size="1x"
                      id="birthDate"
                      name="birthDate"
                      value={form.birthDate}
                      onChange={handleChange}
                      required
                    ></Form.Control>
                    {errors.birthDate && (
                      <>
                        <div className="text-danger">Birthday is required.</div>
                        <div className="text-danger">
                          Must be 15yrs and above.
                        </div>
                      </>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col lg={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Mobile Number</Form.Label>
                    <div className="input-group mb-2">
                      <div className="input-group-prepend">
                        <div className="input-group-text">+63</div>
                      </div>
                      <Form.Control
                        maxLength={10}
                        type="text"
                        size="1x"
                        id="mobile"
                        name="mobile"
                        value={form.mobile}
                        onChange={handleChange}
                        placeholder="9163412345"
                        required
                      ></Form.Control>
                    </div>

                    {errors.mobile && form.mobile.substring(0, 1) !== "0" && (
                      <div className="text-danger">
                        Mobile number is required (10 digits).
                      </div>
                    )}
                    {form.mobile !== "" &&
                    form.mobile.substring(0, 1) === "0" ? (
                      <>
                        <div className="text-danger">
                          If your number starts with 0, write only the next 10
                          digits.
                        </div>
                      </>
                    ) : null}
                    {form.mobile !== "" &&
                    form.mobile.substring(0, 1) !== "9" &&
                    form.mobile.substring(0, 1) !== "0" ? (
                      <div className="text-danger">Must start with 9.</div>
                    ) : null}
                    {isNotUniqueMobile() ? (
                      <>
                        <div className="text-danger">
                          This mobile number is already existing.
                        </div>
                        <div className="text-danger">
                          Please use another mobile number.
                        </div>
                      </>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col lg={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Email Address (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      size="1x"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="joserizal11@gmail.com"
                    ></Form.Control>
                    {errors.email && (
                      <div className="text-danger">
                        Email must be a valid email address.
                      </div>
                    )}
                    {isNotUniqueEmail() ? (
                      <>
                        <div className="text-danger">
                          This email address is already existing.
                        </div>
                        <div className="text-danger">
                          Please use another email address.
                        </div>
                      </>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col lg={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      size="1x"
                      id="userName"
                      name="userName"
                      value={form.userName}
                      onChange={handleChange}
                      placeholder="jRizal1234"
                      required
                    ></Form.Control>
                    {errors.userName && (
                      <div className="text-danger">
                        Username is required (min. of 7 characters).
                      </div>
                    )}

                    {isNotUniqueUserName() ? (
                      <>
                        <div className="text-danger">
                          This username is already existing.
                        </div>
                        <div className="text-danger">
                          Please use another username.
                        </div>
                      </>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col lg={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      size="1x"
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    ></Form.Control>
                    {errors.password && (
                      <div className="text-danger">
                        Password is required (min. of 7 characters).
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col lg={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Register as (choose one) : </Form.Label>
                    <Row>
                      <Col lg={3}>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="role"
                            id="farmer"
                            value="farmer"
                            checked={form.role === "farmer"}
                            onChange={handleChange}
                            required
                          />

                          <label className="form-check-label" htmlFor="farmer">
                            Farmer
                          </label>
                        </div>
                      </Col>
                      <Col lg={3}>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="role"
                            id="supplier"
                            value="supplier"
                            checked={form.role === "supplier"}
                            onChange={handleChange}
                            required
                          />

                          <label
                            className="form-check-label"
                            htmlFor="supplier"
                          >
                            Supplier
                          </label>
                        </div>
                      </Col>
                    </Row>

                    {errors.role && (
                      <div className="text-danger">Choose one.</div>
                    )}
                  </Form.Group>
                </Col>
                <Col lg={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Business Name</Form.Label>
                    <Form.Control
                      type="text"
                      size="1x"
                      id="businessName"
                      name="businessName"
                      value={form.businessName}
                      onChange={handleChange}
                      placeholder="jRizalFarm"
                      required
                    ></Form.Control>
                    {errors.businessName && (
                      <div className="text-danger">
                        Business Name is required.
                      </div>
                    )}

                    {isNotUniqueBusinessName() ? (
                      <>
                        <div className="text-danger">
                          This business name is already existing.
                        </div>
                        <div className="text-danger">
                          Please use another business name.
                        </div>
                      </>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <div className="d-grid gap-2 d-md-flex justify-content-md-center m-3">
                <button
                  className="btn btn-f-primary me-md-2"
                  type="button"
                  onClick={() => {
                    handleBack();
                  }}
                >
                  Back
                </button>
                <button className="btn btn-f-primary" type="submit">
                  Next
                </button>
              </div>
            </Card.Footer>
          </Card>
        </div>
      </Form>
    </Container>
  );
};

export default RegisterPage;
