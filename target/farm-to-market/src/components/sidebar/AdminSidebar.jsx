import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faDashboard,
  faLightbulb,
  faUsers,
  faX,
  faFileAlt,
  faSchool,
  faUserShield,
  faAdd,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const [toggle, setToggle] = useState(false);
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
            <NavLink to="/users/admins">
              <span className="icon">
                <FontAwesomeIcon icon={faUserShield} />
                {/* <i className="fas fa-user-shield"></i> */}
              </span>
              <span className={`${toggle ? "show-item" : ""} item`}>
                Admins
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/users/suppliers">
              <span className="icon">
                <FontAwesomeIcon icon={faUsers} />
              </span>
              <span className={`${toggle ? "show-item" : ""} item`}>
                Suppliers
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/users/farmers">
              <span className="icon">
                <FontAwesomeIcon icon={faUserCircle} />
              </span>
              <span className={`${toggle ? "show-item" : ""} item`}>
                Farmers
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/complaint/all">
              <span className="icon">
                <FontAwesomeIcon icon={faFileAlt} />
              </span>
              <span className={`${toggle ? "show-item" : ""} item`}>
                Complaints
              </span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/tips">
              <span className="icon">
                <FontAwesomeIcon icon={faLightbulb} />
              </span>
              <span className={`${toggle ? "show-item" : ""} item`}>Tips</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/tutorials">
              <span className="icon">
                <FontAwesomeIcon icon={faSchool} />
              </span>
              <span className={`${toggle ? "show-item" : ""} item`}>
                Tutorials
              </span>
            </NavLink>
            <NavLink to="/all/advertisement">
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

export default AdminSidebar;
