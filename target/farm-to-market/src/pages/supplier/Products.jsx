import React, { useEffect, useState } from "react";
import {
  faEye,
  faPencil,
  faPlusSquare,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { myProducts, productDelete } from "../../services/product";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState(null);
  useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = () => {
    myProducts().then((res) => {
      if (res) {
        setProducts(res.data);
      }
    });
  };

  const columns = [
    { dataField: "product_id", text: "Product ID", hidden: true },
    { dataField: "productName", text: "Product Name", sort: true },
    { dataField: "description", text: "Description", sort: true },
    { dataField: "price", text: "Price", sort: true },
    { dataField: "stock", text: "Stock", sort: true },
    { dataField: "unit", text: "Unit", sort: true },
    {
      dataField: "link",
      text: "Actions",
      formatter: (rowContent, row) => {
        return (
          <div className="d-flex">
            <Link
              className="btn btn-info me-2"
              to={`/product/details/${row.product_id}`}
            >
              <FontAwesomeIcon icon={faEye} />
            </Link>
            <Link
              className="btn btn-f-primary me-2"
              to={`/product/edit/${row.product_id}`}
            >
              <FontAwesomeIcon icon={faPencil} />
            </Link>
            <button
              className="btn btn-danger me-2"
              onClick={() => handleDelete(row.product_id)}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        );
      },
    },
  ];

  const defaultSorted = [
    {
      dataField: "productName",
      order: "desc",
    },
  ];

  const handleDelete = (id) => {
    productDelete(id).then((res) => {
      if (res.data && res.data.status === 1) {
        toast.success(res.data.message);
        getAllProducts();
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
  };

  const pagination = paginationFactory({
    sizePerPage: 5,
    lastPageText: "Last",
    firstPageText: "First",
    nextPageText: "Prev",
    prePageText: "Next",
    showTotal: true,
    alwaysShowAllBtns: true,
    onPageChange: function (page, sizePerPage) {},
    onSizePerPageChange: function (page, sizePerPage) {},
  });
  if (products) {
    return (
      <div className="container mt-4 mb-4">
        <Row className="mb-4">
          <Col lg={3}>
            <Link className="btn btn-f-primary w-100" to="/product/add">
              <FontAwesomeIcon icon={faPlusSquare} />
              &nbsp;&nbsp;&nbsp;
              <span>Add Product</span>
            </Link>
          </Col>
        </Row>
        <Card>
          <Card.Body>
            <BootstrapTable
              striped
              hover
              caption="All Products"
              bootstrap4
              keyField="product_id"
              data={products}
              columns={columns}
              defaultSorted={defaultSorted}
              // rowEvents={rowEvents}
              pagination={pagination}
            ></BootstrapTable>
          </Card.Body>
        </Card>
      </div>
    );
  }
};

export default Products;
