import React from "react";
import Banner from "../../components/landing/Banner";
import Category from "../../components/landing/Category";
import Recommended from "../../components/landing/Recommended";

const Landing = () => {
  return (
    <div className="body-bg mb-4">
      <Banner />
      <Category />
      <Recommended />
    </div>
  );
};

export default Landing;
