import React, { useState, useEffect } from "react";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Col, Dropdown, Row } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { allAdminUsers } from "../../services/user";
import { allFarmerUsers } from "../../services/user";
import { allSupplierUsers } from "../../services/user";
import { getUserInfo } from "../../services/userInf";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";
import {
  activateDeactivateUser,
  addOffense,
  getOffense,
} from "../../services/user";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";

const AccountsList = ({ userRole }) => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [content, setContent] = useState(null);
  const userInfo = getUserInfo();
  const [offenses, setOffenses] = useState([]);
  const [form, setForm] = useState({
    owner: "",
    reason: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = () => {
    if (userRole === "admins") {
      allAdminUsers().then((res) => {
        if (res) {
          setAccounts(res.data);
        }
      });
    } else if (userRole === "suppliers") {
      allSupplierUsers().then((res) => {
        if (res) {
          setAccounts(res.data);
        }
      });
    } else {
      allFarmerUsers().then((res) => {
        if (res) {
          setAccounts(res.data);
        }
      });
    }
  };

  const filtered = accounts.filter((value) => {
    if (searchTerm === undefined) {
      return value;
    } else if (searchTerm === "") {
      return value;
    } else if (
      value.userName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return value;
    } else if (
      value.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return value;
    } else if (
      value.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return value;
    }
  });

  const handleModal = (row) => {
    getOffense(row.user_id).then((res) => {
      setOffenses(res.data);
    });
    setContent(row);
    setIsShow(true);
    form.owner = row;
  };

  const handleActivateDeactivate = () => {
    if (content.activeDeactive === false) {
      addOffense(form);
    }
    activateDeactivateUser(content.user_id).then((res) => {
      if (res.data && res.data.status === 1) {
        toast.success(res.data.message);
        getAllUsers();
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
    setIsShow(false);
    setForm({
      owner: "",
      reason: "",
    });
  };

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const columns = [
    { dataField: "user_id", text: "User ID", sort: true, hidden: true },
    { dataField: "userName", text: "Username", sort: true, width: "10" },
    { dataField: "firstName", text: "First Name", sort: true },
    { dataField: "lastName", text: "Last Name", sort: true },
    {
      dataField: "businessName",
      text: "Business Name",
      sort: true,
      hidden: userRole === "admins",
    },
    {
      dataField: "activeDeactive",
      text: "Status",
      sort: true,
      formatter: (rowContent, row) => {
        if (row.activeDeactive === false) {
          if (row.approvalStatus === "For Approval") {
            return (
              <div className="d-flex justify-content-center">For Approval</div>
            );
          } else {
            if (row.role === "admin") {
              return (
                <div className="d-flex justify-content-center">Approved</div>
              );
            } else {
              return (
                <div className="d-flex justify-content-center">Disapproved</div>
              );
            }
          }
        } else {
          return <div className="d-flex justify-content-center">Deactive</div>;
        }
      },
    },
    {
      dataField: "link",
      text: "Actions",
      formatter: (rowContent, row) => {
        return (
          <div className="d-flex justify-content-center">
            <Dropdown>
              <Dropdown.Toggle></Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => navigate(`/users/detail/${row.user_id}`)}
                >
                  <span>View Details</span>
                </Dropdown.Item>
                {row.role !== "admin" && (
                  <Dropdown.Item
                    onClick={() =>
                      navigate(`/users/farmers/user/product/${row.user_id}`)
                    }
                  >
                    <span>View Products</span>
                  </Dropdown.Item>
                )}
                <Dropdown.Item
                  disabled={
                    userInfo.data.userName === row.userName ||
                    row.role === "superadmin"
                  }
                  onClick={() => {
                    handleModal(row);
                  }}
                >
                  {row.activeDeactive === false ? "Deactivate" : "Activate"}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const defaultSorted = [
    {
      dataField: "user_id",
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

  return (
    <div className="container mt-4 mb-4">
      {isShow && (
        <Modal show={isShow}>
          <Modal.Header>
            <Modal.Title>
              Are you sure you want to
              {content.activeDeactive === true ? " activate " : " deactivate "}
              user?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {content.activeDeactive === true ? (
              <p>
                The user has records of:
                {offenses.map((data) => (
                  <span key={data.offense_id}> {data.reason}, </span>
                ))}
              </p>
            ) : (
              <div>
                <Form.Label>
                  What is your reason for deactivating user?
                </Form.Label>
                <Form>
                  <Form.Control
                    type="text"
                    size="1x"
                    id="reason"
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    placeholder="e.g. resignation"
                  ></Form.Control>
                </Form>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsShow(false);
                form.reason = "";
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={content.activeDeactive === false && form.reason === ""}
              onClick={() => handleActivateDeactivate()}
            >
              Yes
            </button>
          </Modal.Footer>
        </Modal>
      )}
      {accounts ? (
        <Card className="table-responsive">
          <Card.Body>
            <BootstrapTable
              classes="text-center"
              striped
              hover
              caption={
                <div className="col-12 md-5 row d-flex justify-content-center align-content-center">
                  <Row>
                    <Col sm={4}>
                      <h5>
                        {userRole === "farmers"
                          ? "Farmer Accounts"
                          : userRole === "suppliers"
                          ? "Supplier Accounts"
                          : "Admin Accounts"}
                      </h5>
                    </Col>

                    <Col>
                      <div className="d-flex mb-2">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(event) => {
                            setSearchTerm(event.target.value);
                          }}
                          placeholder="Search for accounts..."
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
                      {userRole === "admins" ? (
                        <button
                          className="btn btn-f-primary btn-sm justify-self-end"
                          onClick={() => navigate(`/users/${userRole}/add`)}
                        >
                          <FontAwesomeIcon icon={faPlusSquare} />
                          &nbsp;Add
                        </button>
                      ) : null}
                    </Col>
                  </Row>
                </div>
              }
              bootstrap4
              keyField="user_id"
              data={filtered.filter((data) => data.userName !== "superadmin")}
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

export default AccountsList;
