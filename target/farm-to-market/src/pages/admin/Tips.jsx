import {
  faEye,
  faPencil,
  faPlusSquare,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getOwnerTips } from "../../services/tips";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useDispatch } from "react-redux";
import { deleteTip } from "../../redux/actions/tip";
import { getUserInfo } from "../../services/userInf";

const Tips = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tips, setTips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllTips();
  }, []);

  const handleDeleteTip = (id) => {
    dispatch(deleteTip(id, getUserInfo().data.role));
    setTimeout(() => {
      getAllTips();
    }, 200);
  };

  const getAllTips = () => {
    getOwnerTips().then((res) => {
      if (res.data && res.data.status === 1) {
        setTips(res.data.tips);
      }
    });
  };

  const filtered = tips.filter((value) => {
    if (searchTerm === undefined) {
      return value;
    } else if (searchTerm === "") {
      return value;
    } else if (value.title?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return value;
    } else if (
      value.content?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return value;
    }
  });

  const columns = [
    { dataField: "tip_id", text: "Tip ID", hidden: true },
    { dataField: "title", text: "Title", sort: true },
    { dataField: "content", text: "Content", sort: true },

    {
      dataField: "link",
      text: "Actions",
      formatter: (rowContent, row) => {
        return (
          <div className="d-flex">
            <Link
              className="btn btn-info btn-sm me-2"
              to={`/tip/details/${row.tip_id}`}
            >
              <FontAwesomeIcon icon={faEye} />
            </Link>
            <Link
              className="btn btn-f-primary btn-sm me-2"
              to={`/tip/edit/${row.tip_id}`}
            >
              <FontAwesomeIcon icon={faPencil} />
            </Link>
            <button
              className="btn btn-danger btn-sm me-2"
              onClick={() => handleDeleteTip(row.tip_id)}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        );
      },
    },
  ];

  const pagination = paginationFactory({
    sizePerPage: 5,
    lastPageText: "Last",
    firstPageText: "First",
    nextPageText: "Next",
    prePageText: "Prev",
    showTotal: true,
    alwaysShowAllBtns: true,
    onPageChange: function (page, sizePerPage) {},
    onSizePerPageChange: function (page, sizePerPage) {},
  });
  if (tips) {
    return (
      <div className="container mb-4 mt-4">
        {/* <Row className="mb-4">
          <Col lg={2}>
            <Link className="btn btn-f-primary w-100" to="/create/tip">
              <FontAwesomeIcon icon={faPlusSquare} />
              &nbsp;&nbsp;&nbsp;
              <span>Create Tip</span>
            </Link>
          </Col>
        </Row> */}
        <Card className="table-responsive">
          <Card.Body>
            <BootstrapTable
              striped
              hover
              caption={
                <div className="col-12 md-5 row d-flex justify-content-center align-content-center">
                  <Row>
                    <Col sm={4}>
                      <h5>All Tips</h5>
                    </Col>

                    <Col>
                      <div className="d-flex mb-2">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(event) => {
                            setSearchTerm(event.target.value);
                          }}
                          placeholder="Search for tips..."
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
                    <Col className="col-auto">
                      <button
                        className="btn btn-f-primary btn-sm justify-self-end"
                        onClick={() => navigate("/create/tip")}
                      >
                        <FontAwesomeIcon icon={faPlusSquare} />
                        &nbsp;Add
                      </button>
                    </Col>
                  </Row>
                </div>
              }
              bootstrap4
              keyField="tip_id"
              data={filtered}
              columns={columns}
              // rowEvents={rowEvents}
              pagination={pagination}
            ></BootstrapTable>
          </Card.Body>
        </Card>
      </div>
    );
  }
};

export default Tips;
