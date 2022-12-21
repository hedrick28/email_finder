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
import { getAllAd, adDelete } from "../../services/advertisement";
import { toast } from "react-toastify";

const AdminAdvertisement = () => {
  const [ads, setAds] = useState(null);
  useEffect(() => {
    getAllAds();
  }, []);

  const getAllAds = () => {
    getAllAd().then((res) => {
      console.log();
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
      dataField: "link",
      text: "Actions",
      formatter: (rowContent, row) => {
        return (
          <div className="d-flex">
            <Link
              className="btn btn-info me-2"
              to={`/advertisement/details/${row.advertisement_id}`}
            >
              <FontAwesomeIcon icon={faEye} />
            </Link>
            <button
              className="btn btn-danger me-2"
              onClick={() => handleDelete(row.advertisement_id)}
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
export default AdminAdvertisement;
