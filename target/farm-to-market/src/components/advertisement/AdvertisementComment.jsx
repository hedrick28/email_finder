import {
  faEllipsisV,
  faPencil,
  faStar,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Card, Col, Collapse, Dropdown, Modal, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteComment,
  editComment,
  getAdsComment,
} from "../../services/adsComment";
import { getUserInfo } from "../../services/userInf";
import Rating from "react-rating";
import { comment as sendComment } from "../../services/adsComment";

const AdvertisementComment = ({ advertisement }) => {
  const [commentList, setCommentList] = useState(null);
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState({ show: false, comment: {} });
  const navigate = useNavigate();
  const userInfo = getUserInfo() && getUserInfo().data;
  useEffect(() => {
    getAdsCommentByID();
  }, []);

  const handleComment = () => {
    if (getUserInfo()) {
      const data = {
        comment,
        commentor: getUserInfo() && getUserInfo().data,
        advertisement,
      };

      sendComment(data).then((res) => {
        if (res.data && res.data.status === 1) {
          getAdsCommentByID();
          setComment("");
        }
      });
    } else {
      navigate("/login");
    }
  };

  const getAdsCommentByID = () => {
    getAdsComment(advertisement.advertisement_id).then((res) => {
      if (res.data) {
        setCommentList(res.data);
      }
    });
  };

  const handleViewComment = (e) => {
    e.preventDefault();
    setOpen(!open);
  };

  const handleDeleteComment = (id) => {
    deleteComment(id).then((res) => {
      if (res.data && res.data.status === 1) {
        toast.success(res.data.message);
        getAdsCommentByID();
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
  };

  const handleOpenModal = (data) => {
    setShow({ show: true, comment: { ...data } });
  };

  const handleEditSubmit = () => {
    editComment(show.comment).then((res) => {
      if (res.data && res.data.status === 1) {
        toast.success(res.data.message);
        setShow({ show: false });
        getAdsCommentByID();
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
  };

  return (
    <Row>
      <Col>
        <Card>
          <Card.Body className="details-f">
            <Row>
              <Col lg={12}>
                <div className="card product-card-report">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <p className="title">Comments</p>
                      <Link
                        onClick={handleViewComment}
                        aria-controls="comment"
                        aria-expanded={open}
                      >
                        {open ? "Close Comments" : "View Comments"}
                      </Link>
                    </div>
                    <Collapse in={open}>
                      <div>
                        {commentList &&
                          commentList.map((c, idx) => (
                            <div key={idx} className="mb-4">
                              <Row>
                                <Col sm={2}>
                                  <img
                                    src={
                                      c.commentor.profile
                                        ? require(`../../assets/uploads/${c.commentor.profile}`)
                                        : require(`../../assets/uploads/empty.jpg`)
                                    }
                                    alt="profile"
                                    width="50"
                                    className="rounded-circle me-3"
                                  />
                                </Col>
                                <Col sm={10}>
                                  <div className="text-capitalize">
                                    <span className="fw-bold">
                                      {c.commentor.firstName}{" "}
                                      {c.commentor.lastName}
                                    </span>

                                    <p>{c.commentDate}</p>
                                  </div>

                                  <p className="text-capitalize">{c.comment}</p>
                                </Col>{" "}
                                {((userInfo && userInfo.role === "admin") ||
                                  c.advertisement.owner.user_id ===
                                    userInfo.user_id ||
                                  c.commentor.user_id === userInfo.user_id) && (
                                  <div className=" d-flex justify-content-end">
                                    <Dropdown>
                                      <Dropdown.Toggle className="notif-dropdown">
                                        <FontAwesomeIcon icon={faEllipsisV} />
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        <Dropdown.Item
                                          onClick={() =>
                                            handleDeleteComment(c.comment_id)
                                          }
                                        >
                                          <FontAwesomeIcon
                                            icon={faTrash}
                                            color="#30830c"
                                            className="me-3"
                                          />
                                          <span>Delete</span>
                                        </Dropdown.Item>
                                        {c.commentor.user_id ===
                                          userInfo.user_id && (
                                          <Dropdown.Item
                                            onClick={() => handleOpenModal(c)}
                                          >
                                            <FontAwesomeIcon
                                              icon={faPencil}
                                              color="#30830c"
                                              className="me-3"
                                            />
                                            <span>Edit</span>
                                          </Dropdown.Item>
                                        )}
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                )}
                              </Row>
                              <hr />
                            </div>
                          ))}
                        {commentList &&
                          commentList.length <= 0 &&
                          "No available comment"}
                      </div>
                    </Collapse>
                    <div className="input-group rounded mt-4">
                      <input
                        type="search"
                        className="form-control"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <button
                        disabled={comment === "" ? true : false}
                        className="btn btn-f-primary border-0"
                        id="search-addon"
                        onClick={handleComment}
                      >
                        COMMENT
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
              {/* <Col lg={4}>
                  <ProductCardWidgets product={product} />
                </Col> */}
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Modal show={show.show} onHide={() => setShow({ show: false })}>
        <Modal.Header>Update</Modal.Header>
        <Modal.Body>
          <input
            className="form-control"
            value={show.comment ? show.comment.comment : ""}
            onChange={(e) =>
              setShow({
                comment: { ...show.comment, comment: e.target.value },
                show: true,
              })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShow({ show: false })}
          >
            Cancel
          </button>
          <button className="btn btn-f-primary" onClick={handleEditSubmit}>
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
};

export default AdvertisementComment;
