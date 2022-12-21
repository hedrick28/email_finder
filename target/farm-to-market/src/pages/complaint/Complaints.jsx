import React, { useEffect, useState } from "react";
import {
  faEye,
  faPencil,
  faPlusSquare,
  faCancel,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {
  myComplaints,
  complaintCancel,
  complaintsAboutMe,
} from "../../services/complaints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";

const Complaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [complaintsMe, setComplaintsMe] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [row, setRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    myComplaints().then((res) => {
      if (res.data.length > 0) {
        setComplaints(res.data);
      }
    });
    complaintsAboutMe().then((res) => {
      if (res.data.length > 0) {
        setComplaintsMe(
          res.data.filter((complaint) => {
            return complaint.status !== "Cancelled";
          })
        );
      }
    });
  }, []);

  const columnsMe = [
    { dataField: "complaint_id", text: "Complaint ID", hidden: true },
    { dataField: "referenceCode", text: "Reference Code", sort: true },
    { dataField: "businessName", text: "Accused", sort: true },
    { dataField: "reason", text: "Reason", sort: true },
    { dataField: "dateFiled", text: "Date Filed", sort: true },
    { dataField: "status", text: "Status", sort: true },
    {
      dataField: "dateSettled",
      text: "Date Settled",
      sort: true,
      formatter: (rowContent, row) => {
        return (
          <div className="d-flex">
            {row.dateSettled ? row.dateSettled : "-"}
          </div>
        );
      },
    },
    {
      dataField: "link",
      text: "Actions",
      formatter: (rowContent, row) => {
        return (
          <div className="d-flex">
            <Link
              className="btn btn-info btn-sm me-2 "
              to={`/complaint/mycomplaints/detail/${row.complaint_id}`}
            >
              <FontAwesomeIcon icon={faEye} />
            </Link>
          </div>
        );
      },
    },
  ];

  const columns = [
    { dataField: "complaint_id", text: "Complaint ID", hidden: true },
    { dataField: "referenceCode", text: "Reference Code", sort: true },
    { dataField: "businessName", text: "Accused", sort: true },
    { dataField: "reason", text: "Reason", sort: true },
    { dataField: "dateFiled", text: "Date Filed", sort: true },
    { dataField: "status", text: "Status", sort: true },
    {
      dataField: "dateSettled",
      text: "Date Settled",
      sort: true,
      formatter: (rowContent, row) => {
        return (
          <div className="d-flex">
            {row.dateSettled ? row.dateSettled : "-"}
          </div>
        );
      },
    },
    {
      dataField: "link",
      text: "Actions",
      formatter: (rowContent, row) => {
        return (
          <div className="d-flex">
            <Link
              className="btn btn-info btn-sm me-2 "
              to={`/complaint/mycomplaints/detail/${row.complaint_id}`}
            >
              <FontAwesomeIcon icon={faEye} />
            </Link>
            <Link
              className={
                row.status === "Pending"
                  ? "btn btn-f-primary btn-sm me-2 "
                  : "btn btn-f-primary me-2 btn-sm disabled"
              }
              to={`/complaint/mycomplaints/edit/${row.complaint_id}`}
            >
              <FontAwesomeIcon icon={faPencil} />
            </Link>
            <button
              className="btn btn-danger btn-sm me-2"
              disabled={row.status !== "Pending" && row.status !== "Reviewing"}
              onClick={() => {
                handleCancelModal(row);
              }}
            >
              <FontAwesomeIcon icon={faCancel} />
            </button>
          </div>
        );
      },
    },
  ];

  const defaultSorted = [
    {
      dataField: "complaint_id",
      order: "desc",
    },
  ];

  const handleCancelReport = (complaint) => {
    complaintCancel(complaint.complaint_id).then((res) => {
      if (res.data && res.data.status === 1) {
        toast.success(res.data.message);
        myComplaints().then((res) => {
          if (res.data.length > 0) {
            setComplaints(res.data);
          }
        });
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
    setIsShow(false);
  };

  const handleCancelModal = (row) => {
    setRow(row);
    setIsShow(true);
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

  const filtered = complaints.filter((value) => {
    if (searchTerm === undefined) {
      return value;
    } else if (searchTerm === "") {
      return value;
    } else if (
      value.referenceCode?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return value;
    } else if (
      value.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return value;
    } else if (value.reason?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return value;
    } else if (value.dateFiled?.includes(searchTerm)) {
      return value;
    } else if (value.dateSettled?.includes(searchTerm)) {
      return value;
    } else if (value.status?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return value;
    }
  });

  return (
    <div className="container mt-4 mb-4">
      {isShow && (
        <Modal show={isShow}>
          <Modal.Header>
            <Modal.Title>Complaint {row.referenceCode}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Are you sure you want to cancel report? Once cancelled, you cannot
              edit or uncancel complain.
            </p>
          </Modal.Body>

          <Modal.Footer>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsShow(false);
              }}
            >
              No
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={() => handleCancelReport(row)}
            >
              Yes
            </button>
          </Modal.Footer>
        </Modal>
      )}
      <Row className="mb-4">
        {complaintsMe.length > 0 ? (
          <>
            <div className="alert alert-warning" role="alert">
              Someone has reported you. The administration is currently
              investigating. Keep your lines open.
            </div>
            <Card className="table-responsive">
              <Card.Body>
                <BootstrapTable
                  striped
                  hover
                  caption={
                    <div className="col-12 md-5 row d-flex justify-content-center align-content-center">
                      <h5>Complaints About Me</h5>
                    </div>
                  }
                  bootstrap4
                  keyField="complaint_id"
                  data={complaintsMe}
                  columns={columnsMe}
                  defaultSorted={defaultSorted}
                  pagination={pagination}
                ></BootstrapTable>
              </Card.Body>
            </Card>
          </>
        ) : null}
      </Row>
      {complaints ? (
        <Card className="table-responsive">
          <Card.Body>
            <BootstrapTable
              striped
              hover
              caption={
                <div className="col-12 md-5 row d-flex justify-content-center align-content-center">
                  <Row>
                    <Col sm={4}>
                      <h5>My Complaints</h5>
                    </Col>

                    <Col>
                      <div className="d-flex mb-2">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(event) => {
                            setSearchTerm(event.target.value);
                          }}
                          placeholder="Search for complaints..."
                        />
                        <button
                          type="button"
                          // className="btn btn-f-primary btn-sm"
                          style={{
                            color: "white",
                            marginRight: "15px",
                            background: "green",
                          }}
                          onClick={() => setSearchTerm("")}
                        >
                          Clear
                        </button>
                      </div>
                    </Col>
                    <Col className="col-auto">
                      <button
                        className="btn btn-f-primary btn-sm justify-self-end"
                        onClick={() => navigate("/complaint/add")}
                      >
                        <FontAwesomeIcon icon={faPlusSquare} />
                        &nbsp;Add
                      </button>
                    </Col>
                  </Row>
                </div>
              }
              bootstrap4
              keyField="complaint_id"
              data={filtered}
              columns={columns}
              defaultSorted={defaultSorted}
              pagination={pagination}
            ></BootstrapTable>
          </Card.Body>
        </Card>
      ) : null}
    </div>
  );
};

export default Complaints;
