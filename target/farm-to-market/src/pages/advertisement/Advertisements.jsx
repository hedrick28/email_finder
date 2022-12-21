import React, { useEffect, useState } from "react";
import {
  faEye,
  faPencil,
  faPlusSquare,
  faTrashAlt,
  faArchive,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { myAds, adDelete } from "../../services/advertisement";
import { toast } from "react-toastify";

const Advertisements = () => {
  const [ads, setAds] = useState(null);
  useEffect(() => {
    getAllAds();
  }, []);

  const getAllAds = () => {
    myAds().then((res) => {
      if (res) {
        setAds(res.data);
      }
    });
  };

  const columns = [
    { dataField: "advertisement_id", text: "Advertisement ID", hidden: true },
    { dataField: "productName", text: "Product Name", sort: true },
    { dataField: "description", text: "Description", sort: true },
    { dataField: "category", text: "Category", sort: true },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      formatter: (rowContent, row) => {
        if (!row.active_deactive) {
          return "This ad has been deleted.";
        }
      },
    },
    {
      dataField: "link",
      width: "200",
      text: "Actions",
      formatter: (rowContent, row) => {
        if (row.active_deactive) {
          return (
            <div className="d-flex">
              <Link
                className="btn btn-info me-2"
                to={`/advertisement/details/${row.advertisement_id}`}
              >
                <FontAwesomeIcon icon={faEye} />
              </Link>
              <Link
                className="btn btn-f-primary me-2"
                to={`/advertisement/edit/${row.advertisement_id}`}
              >
                <FontAwesomeIcon icon={faPencil} />
              </Link>
              <button
                className="btn btn-danger me-2"
                onClick={() => handleDelete(row.advertisement_id)}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          );
        }
        return (
          <Link
            className="btn btn-f-primary me-2"
            onClick={() => handleDelete(row.advertisement_id)}
          >
            <FontAwesomeIcon icon={faArchive} />
          </Link>
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
    adDelete(id).then((res) => {
      if (res.data && res.data.status === 1) {
        toast.success(res.data.message);
        getAllAds();
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
  if (ads) {
    return (
      <div className="container mt-4 mb-4">
        <Row className="mb-4">
          <Col lg={2}>
            <Link className="btn btn-f-primary w-100" to="/addadvertisement">
              <FontAwesomeIcon icon={faPlusSquare} />
              &nbsp;&nbsp;&nbsp;
              <span>Add Advertisement</span>
            </Link>
          </Col>
        </Row>
        <Card>
          <Card.Body>
            <BootstrapTable
              striped
              hover
              caption="My Advertisements"
              bootstrap4
              keyField="advertisement_id"
              data={ads}
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
export default Advertisements;
