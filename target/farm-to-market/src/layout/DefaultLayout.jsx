import React, { Fragment } from "react";
import AdminContent from "../components/AdminContent";
import Supplier from "../components/SupplierContent";
import AdminSidebar from "../components/sidebar/AdminSidebar";
import Farmer from "../components/RetailerContent";
import { getUserInfo } from "../services/userInf";
import FarmerSidebar from "../components/sidebar/FarmerSidebar";
import SupplierSidebar from "../components/sidebar/SupplierSidebar";

const AdminLayout = () => {
  const userInfo = getUserInfo();
  const sample = true;
  if (userInfo && userInfo.data.role === "admin") {
    return (
      <div className="d-flex">
        <AdminSidebar />
        <div className="table-responsive d-flex w-100">
          <AdminContent />
        </div>
      </div>
    );
  } else if (userInfo && userInfo.data.role === "farmer") {
    return (
      <div className="d-flex ">
        <FarmerSidebar />
        <div className="table-responsive d-flex w-100">
          <Farmer />
        </div>
      </div>
    );
  } else if (userInfo && userInfo.data.role === "supplier") {
    return (
      <div className="d-flex">
        <SupplierSidebar />
        <div className="table-responsive d-flex w-100">
          <Supplier />
        </div>
      </div>
    );
  }
};

export default AdminLayout;
