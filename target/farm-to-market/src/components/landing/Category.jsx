import React from "react";
import { Link } from "react-router-dom";
import vegetables from "../../assets/products/vegetables.jpg";
import crops from "../../assets/products/crops.jpg";
import grains from "../../assets/products/grains.jpg";
import fruits from "../../assets/products/fruits.jpg";

const Category = () => {
  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Categories</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mt-2">
              <Link to="/category/vegetables">
                <div className="card">
                  <img
                    className="card-img-top"
                    src={vegetables}
                    alt="Card image cap"
                    height="185"
                  />
                  <div className="card-body">
                    <h5 className="card-title text-center">Vegetables</h5>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mt-2">
              <Link to="/category/rootcrops">
                <div className="card">
                  <img
                    className="card-img-top"
                    src={crops}
                    alt="Card image cap"
                    height="185"
                  />
                  <div className="card-body">
                    <h5 className="card-title text-center">Crops</h5>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mt-2">
              <Link to="/category/grains">
                <div className="card">
                  <img
                    className="card-img-top"
                    src={grains}
                    alt="Card image cap"
                    height="185"
                  />
                  <div className="card-body">
                    <h5 className="card-title text-center">Grains</h5>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mt-2">
              <Link to="/category/fruits">
                <div className="card">
                  <img
                    className="card-img-top"
                    src={fruits}
                    alt="Card image cap"
                    height="185"
                  />
                  <div className="card-body">
                    <h5 className="card-title text-center">Fruits</h5>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
