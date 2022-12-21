import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Container, Form, Row } from "react-bootstrap";
import Joi from "joi";
import { allAccountUsers } from "../../services/user";

const AdminForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const values = location.state?.info;
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(
    values || {
      firstName: "",
      lastName: "",
      birthDate: "",
      mobile: "",
      email: "",
      userName: "",
      password: "",
      role: "admin",
    }
  );
  const [users, setUsers] = useState([]);

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
      .optional()
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
    role: Joi.string().allow("admin").optional(),
  });

  const handleChange = (event) => {
    setForm({ ...form, [event.currentTarget.name]: event.currentTarget.value });

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
      navigate("/users/admins");
    }
  };

  return (
    <Container className="mt-4 mb-4">
      <Form onSubmit={handleSubmit}>
        <Card>
          <Card.Header>
            <Card.Title>Add Admin User</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row className="mb-3">
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  size="1x"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Jose"
                  required
                />
                {errors.firstName && (
                  <div className="text-danger">First name is required.</div>
                )}
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  size="1x"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Rizal"
                  required
                />
                {errors.lastName && (
                  <div className="text-danger">Last name is required.</div>
                )}
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group>
                <Form.Label>Birthday</Form.Label>
                <Form.Control
                  type="date"
                  size="1x"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  required
                />
                {errors.birthDate && (
                  <div className="text-danger">
                    Birthday is required. Only ages 15 and above are allowed to
                    create an account.
                  </div>
                )}
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group>
                <Form.Label>Mobile number</Form.Label>
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <div className="input-group-text">+63</div>
                  </div>
                  <Form.Control
                    maxLength={10}
                    type="text"
                    size="1x"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="9163412345"
                    required
                  />
                </div>
                {errors.mobile && form.mobile.substring(0, 1) !== "0" && (
                  <div className="text-danger">
                    Mobile number is required (10 digits).
                  </div>
                )}
                {form.mobile !== "" && form.mobile.substring(0, 1) === "0" ? (
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
            </Row>
            <Row className="mb-3">
              <Form.Group>
                <Form.Label>Email Address (optional)</Form.Label>
                <Form.Control
                  type="email"
                  size="1x"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="joserizal11@gmail.com"
                />
                {errors.email && (
                  <div className="text-danger">
                    Email must be a valid email address.
                  </div>
                )}
                {isNotUniqueEmail() ? (
                  <div className="text-danger">
                    This email address is already existing. Please use another
                    email address.
                  </div>
                ) : null}
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group>
                <Form.Label> Username </Form.Label>
                <Form.Control
                  type="text"
                  size="1x"
                  name="userName"
                  value={form.userName}
                  onChange={handleChange}
                  placeholder="jRizal1234"
                  required
                />
                {errors.userName && (
                  <div className="text-danger">
                    Username is required (minimum of 7 characters).
                  </div>
                )}
                {isNotUniqueUserName() ? (
                  <div className="text-danger">
                    This username is already existing. Please use another
                    username.
                  </div>
                ) : null}
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group>
                <Form.Label> Password </Form.Label>
                <Form.Control
                  type="password"
                  size="1x"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && (
                  <div className="text-danger">
                    Password is required (minimum of 7 characters).
                  </div>
                )}
              </Form.Group>
            </Row>
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
              <button className="btn btn-f-primary" type="submit">
                &nbsp;&nbsp;Next&nbsp;&nbsp;
              </button>
            </div>
          </Card.Footer>
        </Card>
      </Form>
    </Container>
  );
};

export default AdminForm;
