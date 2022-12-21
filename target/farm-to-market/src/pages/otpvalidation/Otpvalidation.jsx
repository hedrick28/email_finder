import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Otpvalidation.scss";

const Otpvalidation = () => {
  const [formValues, setFormValues] = useState({ OTP: "" });
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formValues.OTP == JSON.parse(localStorage.getItem("OTP"))) {
      toast.success("OTP confirmation success!");
      navigate("/reset-password");
      localStorage.removeItem("OTP");
    } else {
      toast.error("The OTP you entered is incorrect!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <div className="main-login">
      <div className="fpassword-contain">
        <h1>Enter OTP (One Time Password)</h1>
        <br />
        <form onSubmit={handleSubmit}>
          <label id="text-label">
            Your One Time Password has been sent to your mobile phone. Please
            enter the number below:
          </label>
          <input
            type="text"
            name="OTP"
            id="OTP"
            value={formValues.OTP}
            onChange={handleChange}
          />
          <button type="submit" id="sub_butt">
            Validate
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otpvalidation;
