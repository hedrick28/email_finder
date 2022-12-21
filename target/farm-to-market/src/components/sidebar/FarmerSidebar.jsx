import {
  faBars,
  faCartFlatbed,
  faCartPlus,
  faDashboard,
  faFileAlt,
  faWheatAwn,
  faX,
  faAdd,
  faSchool,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const FarmerSidebar = () => {
  const [toggle, setToggle] = useState(false);
  const [sub, setSub] = useState(false);
  return (
    <div className="wrapper">
      <div className="section">
        <div className="top_navbar">
          <div className="hamburger d-flex justify-content-center">
            <Link onClick={() => setToggle(!toggle)}>
              {toggle ? (
                <FontAwesomeIcon icon={faX} size="1x" />
              ) : (
                <FontAwesomeIcon icon={faBars} />
              )}
            </Link>
          </div>
        </div>
      </div>
      <div className={`${toggle ? "toggle-sidebar" : ""} sidebar`}>
        <ul>
          <li>
            <NavLink to="/dashboard">
              <span className="icon">
                <FontAwesomeIcon icon={faDashboard} />
              </span>
              <span className={`${toggle ? "show-item" : ""} item`}>
                Dashboard
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/products">
              <span className="icon">
                <FontAwesomeIcon icon={faWheatAwn} />
              </span>
              <span className={`${toggle ? "show-item" : ""} item`}>
                My products
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/mypurchases">
              <span className="icon">
                <FontAwesomeIcon icon={faCartFlatbed} />
              </span>
              <span className={`${toggle ? "show-item" : ""} item`}>
                My Purchases
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/orders">
              <span className="icon">
                <FontAwesomeIcon icon={faCartPlus} />
              </span>
              <span className={`${toggle ? "show-item" : ""} item`}>
                Orders
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/complaint/mycomplaints">
              <span className="icon">
                <FontAwesomeIcon icon={faFileAlt} />
              </span>
              <span className={`${toggle ? "show-item" : ""} item`}>
                Complaints
              </span>
            </NavLink>
          </li>
          <li>
            <Link to="/tutorials">
              <span className="icon">
                <FontAwesomeIcon icon={faSchool} />
              </span>
              <span className={`${toggle ? "show-item" : ""} item`}>
                Tutorials
              </span>
            </Link>
          </li>
          <li>
            <NavLink to="/advertisement">
              <span className="icon">
                <FontAwesomeIcon icon={faAdd} />
              </span>
              <span className={`${toggle ? "show-item" : ""} item`}>
                Advertisement
              </span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FarmerSidebar;
