import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import logo from "./wheat_PNG47.png";
import welcomeimg from "./welcome.jpg";
import Joi from "joi";
import { login } from "../../services/auth";
import { toast } from "react-toastify";
import { numberOnlyInput } from "../../services/inputService";

function Login() {
  const [formValues, setFormValues] = useState({ mobile: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    login(formValues).then((res) => {
      if (res.data && res.data.status === 1) {
        localStorage.setItem("ftm", JSON.stringify(res.data));
        navigate("/dashboard");
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
    console.log(formValues.mobile.substring(1));
  };

  const schema = Joi.object({
    mobile: Joi.string().required(),
    password: Joi.string().required(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    const { error } = schema
      .extract(e.currentTarget.name)
      .label(e.currentTarget.name)
      .validate(e.currentTarget.value);
    if (error) {
      setFormErrors({
        ...formErrors,
        [e.currentTarget.name]: error.details[0].message,
      });
    } else {
      delete formErrors[e.currentTarget.name];
      setFormErrors(formErrors);
    }
  };

  return (
    <div className="main-login">
      <div className="login-contain">
        <div className="left-side">
          <div className="img-class">
            <img src={logo} alt="" id="img-id"></img>
          </div>
          <form onSubmit={handleSubmit}>
            <label>Mobile Number</label>
            <input
              placeholder="9012345678"
              type="text"
              name="mobile"
              id="mobile"
              onKeyPress={(e) => numberOnlyInput(e, 10)}
              value={formValues.mobile}
              onChange={handleChange}
            />
            {formErrors.userName && (
              <div className="text-danger">Username is required.</div>
            )}
            <label>Password</label>
            <input
              placeholder="Password"
              type="password"
              id="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
            />
            {formErrors.password && (
              <div className="text-danger">Password is required</div>
            )}
            <button type="submit" id="sub_butt">
              Submit
            </button>
          </form>
          <div className="footer">
            <h4>
              <Link className="link" to="/ForgotPassword">
                Forgot Password?
              </Link>
            </h4>
          </div>
        </div>
        <div className="right-side d-flex ">
          <div className="welcomeimg">
            <img
              src={require("../../assets/logo/logo.png")}
              alt=""
              id="wel-img-id"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
