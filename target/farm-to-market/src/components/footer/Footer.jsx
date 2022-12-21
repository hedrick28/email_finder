import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Messages from "../messeger/Messages";

const Footer = () => {
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(true);

  useEffect(() => {
    setShowFooter(!location.pathname.includes("gcash"));
  });
  return (
    <>
      <div className={showFooter ? "header-show" : "header-none"}>
        <nav className="navbar f-bg-primary-footer">
          <div className="container-fluid text-white justify-content-center">
            Contact Us at FarmToMarket&nbsp;&nbsp;&nbsp;&nbsp;Tel. No.: (+632)
            8-888-7000 &nbsp;&nbsp;&nbsp;Cell. No.:
            0916-3412345&nbsp;&nbsp;&nbsp; Email Address: farmToMarket@gmail.com
          </div>
          <div className="container-fluid text-white justify-content-center">
            {" © "}
            {new Date().getFullYear()} FarmToMarket - All right reserved
          </div>
        </nav>
      </div>
      <Messages />
    </>
  );
};

export default Footer;
