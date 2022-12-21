import React, { useEffect, useState } from "react";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Col, Row } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { allComplaints, complaintReview } from "../../services/complaints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Complaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    getAllComplaints();
  }, []);

  const getAllComplaints = () => {
    allComplaints().then((res) => {
      if (res) {
        setComplaints(res.data);
      }
    });
  };

  const handleReview = (id) => {
    complaintReview(id).then((res) => {
      if (res.data && res.data.status === 1) {
        toast.success(res.data.message);
        allComplaints().then((res) => {
          if (res) {
            setComplaints(res.data);
          }
        });
        navigate(`/complaint/detail/${id}`);
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
  };

  const handleView = (id) => {
    navigate(`/complaint/detail/${id}`);
  };

  const columns = [
    { dataField: "complaint_id", text: "Complaint ID", hidden: true },
    { dataField: "referenceCode", text: "Reference Code", sort: true },
    { dataField: "owner.businessName", text: "Accuser", sort: true },
    { dataField: "businessName", text: "Accused", sort: true },
    { dataField: "reason", text: "Reason", sort: true },
    { dataField: "dateFiled", text: "Date Filed", sort: true },
    { dataField: "status", text: "Status", sort: true },
    {
      dataField: "link",
      text: "Actions",
      formatter: (rowContent, row) => {
        return (
          <div className="d-flex">
            {row.status === "Pending" ? (
              <button
                className="btn btn-info btn-sm me-2"
                onClick={() => {
                  handleReview(row.complaint_id);
                }}
              >
                Review
              </button>
            ) : (
              <button
                className="btn btn-info btn-sm me-2"
                onClick={() => {
                  handleView(row.complaint_id);
                }}
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const defaultSorted = [
    {
      dataField: "referenceCode",
      order: "desc",
    },
  ];

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
                      <h5>All Complaints</h5>
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
