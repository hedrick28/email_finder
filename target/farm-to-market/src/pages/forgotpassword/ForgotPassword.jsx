import React, { useState } from "react";
import "./ForgotPassword.scss";
import { Link, useNavigate } from "react-router-dom";
import { forgotpassword } from "../../services/auth";
import { toast } from "react-toastify";
import Joi from "joi";

const ForgotPassword = () => {
  const [formValues, setFormValues] = useState({ mobile: "" });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    forgotpassword(formValues).then((res) => {
      console.log(res);
      if (res.data && res.data.status === 1) {
        localStorage.setItem("OTP", JSON.stringify(res.data.otp));
        localStorage.setItem("MOBILE", JSON.stringify(res.data.data.mobile));
        toast.info(res.data.message);
        navigate("/otp-validation");
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
  };

  const schema = Joi.object({
    mobile: Joi.string().required(),
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
      <div className="fpassword-contain">
        <h1>Forgot Password</h1>
        <br />
        <form onSubmit={handleSubmit}>
          <label>Mobile Number</label>
          <input
            placeholder="Mobile Number"
            type="text"
            name="mobile"
            id="mobile"
            value={formValues.mobile}
            onChange={handleChange}
          />
          {formErrors.userName && (
            <div className="text-danger">Mobile Number is required.</div>
          )}
          <button type="submit" id="sub_butt">
            Submit
          </button>
        </form>
        <div className="footer">
          <h4>
            <Link className="link" to="/login">
              Back to Login
            </Link>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
