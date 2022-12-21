import Joi from "joi";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "./Resetpassword.scss";
import { updatePass } from "../../services/user";

import { useNavigate } from "react-router-dom";

const Resetpassword = () => {
  const [formValues, setFormValues] = useState({
    newpassword: "",
    cpassword: "",
  });

  const [data, setData] = useState({
    mobile: "",
    password: "",
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    setData({
      mobile: JSON.parse(localStorage.getItem("MOBILE")),
      password: formValues.newpassword,
    });
    if (formValues.newpassword !== formValues.cpassword) {
      toast.error("Password did not match!");
      console.log(data);
    } else {
      console.log(formValues.newpassword !== formValues.cpassword);
      toast.success("Password changed successfully!");
      updatePass(data);
      navigate("/login");
    }
  };

  const isFormInvalid = () => {
    const result = schema.validate(formValues);
    return !!result.error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    const { error } = schema
      .extract(e.currentTarget.name)
      .label(e.currentTarget.name)
      .validate(e.currentTarget.value);
    if (error) {
      setErrors({
        ...errors,
        [e.currentTarget.name]: error.details[0].message,
      });
    } else {
      delete errors[e.currentTarget.name];
      setErrors(errors);
    }
  };

  const schema = Joi.object({
    newpassword: Joi.string()
      .min(7)
      .max(30)
      .pattern(/[a-zA-Z0-9]/)
      .required(),
    cpassword: Joi.string().required(),
  });

  return (
    <div className="main-login">
      <div className="rpass-contain">
        <h1>Reset Password</h1>
        <br />
        <form onSubmit={handleSubmit}>
          <label>New Password</label>
          <input
            placeholder="New Password"
            type="text"
            name="newpassword"
            id="newpassword"
            value={formValues.newpassword}
            onChange={handleChange}
          />
          {errors.newpassword && (
            <div className="text-danger">
              Password is required (minimum of 7 characters).
            </div>
          )}
          <label>Confirm Password</label>
          <input
            placeholder="Confirm Password"
            type="text"
            id="cpassword"
            name="cpassword"
            value={formValues.cpassword}
            onChange={handleChange}
          />

          <button type="submit" id="sub_butt" disabled={isFormInvalid()}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Resetpassword;
