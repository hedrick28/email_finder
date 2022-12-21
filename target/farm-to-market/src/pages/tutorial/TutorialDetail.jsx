import React, { useState, useEffect } from "react";
import {
  tutorialDetails,
  addComment,
  getComments,
  maxViewCount,
  deleteComment,
  editComment,
} from "../../services/tutorials";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Form, Dropdown, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faTrash,
  faPencil,
  faStar,
  faLeftLong,
  faVideo,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { getUserInfo } from "../../services/userInf";
import Rating from "react-rating";
import { faStar as solidStar } from "@fortawesome/free-regular-svg-icons";
import { myRate, rate, allRating } from "../../services/tutorials";
import { toast } from "react-toastify";

const TutorialDetail = () => {
  const param = useParams();
  const navigate = useNavigate();
  const [tutorialDetail, setTutorialDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({
    comment: "",
    owner: getUserInfo() && getUserInfo().data,
    tutorial: 0,
  });
  const [buttonVisibility, setbuttonVisibility] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const userInfo = getUserInfo() && getUserInfo().data;
  const [averageRate, setAverageRate] = useState(null);
  const [allTutorialRating, setAllTutorialRating] = useState(null);
  const [maxCount, setMaxCount] = useState(0);
  const [show, setShow] = useState({ show: false, comment: {} });

  useEffect(() => {
    tutorialDetails(+param.id).then((res) => {
      if (res.data && res.data.status === 1) {
        setTutorialDetail(res.data.data);
      } else if (res.data && res.data.status === 0) {
        navigate("/tutorials");
      }
    });
    getComments(+param.id).then((res) => {
      setComments(res.data);
    });
    getMyRate(+param.id);
    getAllRating(+param.id);
    getMaxViewCount(+param.id);
  }, [param.id]);

  const calcDate = (date1) => {
    const dt_date1 = new Date(date1);
    const dt_date2 = new Date();

    const date1_time_stamp = dt_date1.getTime();
    const date2_time_stamp = dt_date2.getTime();

    let calc;

    if (date1_time_stamp > date2_time_stamp) {
      calc = new Date(date1_time_stamp - date2_time_stamp);
    } else {
      calc = new Date(date2_time_stamp - date1_time_stamp);
    }
    const calcFormatTmp =
      calc.getDate() + "-" + (calc.getMonth() + 1) + "-" + calc.getFullYear();
    const calcFormat = calcFormatTmp.split("-");
    const days_passed = Number(Math.abs(calcFormat[0]) - 1);
    const months_passed = Number(Math.abs(calcFormat[1]) - 1);
    const years_passed = Number(Math.abs(calcFormat[2]) - 1970);

    const yrsTxt = ["year", "years"];
    const mnthsTxt = ["month", "months"];
    const daysTxt = ["day", "days"];

    const result =
      (years_passed === 1
        ? years_passed + " " + yrsTxt[0] + " "
        : years_passed > 1
        ? years_passed + " " + yrsTxt[1] + " "
        : "") +
      (months_passed === 1
        ? months_passed + " " + mnthsTxt[0]
        : months_passed > 1
        ? months_passed + " " + mnthsTxt[1] + " "
        : "") +
      (days_passed === 1
        ? days_passed + " " + daysTxt[0]
        : days_passed > 1
        ? days_passed + " " + daysTxt[1]
        : "");

    return result.trim();
  };

  const handleChange = (event) => {
    setbuttonVisibility(true);
    setForm({
      ...form,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    form.tutorial = tutorialDetail;
    addComment(form).then((data) => {
      getComments(tutorialDetail.tutorial_id).then((res) => {
        setComments(res.data);
        form.comment = "";
      });
    });
  };

  const handleCancel = () => {
    form.comment = "";
    setbuttonVisibility(false);
  };

  const handleRating = (e) => {
    if (getUserInfo()) {
      const data = {
        rating: e,
        ratingOwner: getUserInfo() && getUserInfo().data,
        tutorial: tutorialDetail,
      };
      rate(data).then((res) => {
        if (res.data && res.data.status === 1) {
          getMyRate(data.tutorial.tutorial_id);
          getAllRating(data.tutorial.tutorial_id);
        }
      });
    } else {
      navigate("/login");
    }
  };

  const getMyRate = (id) => {
    myRate(id, userInfo.user_id).then((res) => {
      if (res.data && res.data.status === 1) {
        setMyRating(res.data.data.rating);
      }
    });
  };

  const getAllRating = (id) => {
    allRating(id).then((res) => {
      if (res.data && res.data.length > 0) {
        setAllTutorialRating(res.data);
        let totalRating = 0;
        res.data.map((t) => {
          return (totalRating += t.rating);
        });
        let average = totalRating / res.data.length;
        setAverageRate(Math.round(average * 10) / 10);
      }
    });
  };

  const getEachRate = (num) => {
    if (allTutorialRating) {
      const r = allTutorialRating.filter((rate) => rate.rating === num);

      return r.length;
    }
  };

  const getMaxViewCount = (id) => {
    maxViewCount(id).then((res) => {
      setMaxCount(res.data);
    });
  };

  const handleDeleteComment = (id) => {
    deleteComment(id).then((res) => {
      if (res.data && res.data.status === 1) {
        toast.success(res.data.message);
        getComments(tutorialDetail.tutorial_id).then((res) => {
          setComments(res.data);
        });
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
        getComments(tutorialDetail.tutorial_id).then((res) => {
          setComments(res.data);
        });
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
  };

  if (tutorialDetail) {
    return (
      <Container>
        <Row className="mt-3">
          <div>
            <button
              type="button"
              className="btn btn-f-primary btn-sm"
              style={{
                color: "green",
                marginRight: "15px",
                justifySelf: "right",
              }}
              onClick={() => navigate("/tutorials")}
            >
              <FontAwesomeIcon icon={faLeftLong} />
              &nbsp;Back to Tutorials
            </button>

            {tutorialDetail.type === "video" ? (
              <button
                type="button"
                className="btn btn-f-primary btn-sm"
                style={{
                  color: "green",
                  marginRight: "15px",
                  justifySelf: "right",
                }}
                onClick={() => navigate("/tutorials/videos")}
              >
                <FontAwesomeIcon icon={faVideo} />
                &nbsp;Show All Videos
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-f-primary btn-sm"
                style={{
                  color: "green",
                  marginRight: "15px",
                  justifySelf: "right",
                }}
                onClick={() => navigate("/tutorials/images")}
              >
                <FontAwesomeIcon icon={faImage} />
                &nbsp;Show All Images
              </button>
            )}
          </div>
        </Row>
        <Row className="mt-3">
          {tutorialDetail.type === "video" ? (
            <video width="500" height="350" loop muted autoPlay controls>
              <source
                src={require("../../assets/uploads/" + tutorialDetail.video)}
                type="video/webm"
              />
            </video>
          ) : (
            <img
              alt="thumbnail"
              width="500"
              height="350"
              src={require("../../assets/uploads/" + tutorialDetail.image)}
            />
          )}
          <Row>
            <Col sm={12}>
              <h4 className="m-3">{tutorialDetail.title}</h4>
            </Col>
          </Row>

          <div className="mb-2">
            <Row>
              <Col sm={1}>
                <img
                  src={
                    tutorialDetail.profile
                      ? require(`../../assets/uploads/${tutorialDetail.profile}`)
                      : require(`../../assets/uploads/empty.jpg`)
                  }
                  alt="profile"
                  width="50"
                  className="rounded-circle me-3"
                />
              </Col>
              <Col sm={9}>
                <span style={{ float: "left" }}>
                  <strong>{tutorialDetail.owner.userName}</strong>
                </span>
                <small>
                  &nbsp;&bull;&nbsp;
                  {calcDate(tutorialDetail.dateCreated) ? (
                    <span>{calcDate(tutorialDetail.dateCreated)} ago</span>
                  ) : (
                    <span> just today </span>
                  )}
                </small>
                <small>
                  &nbsp;&bull;&nbsp;
                  {maxCount} {maxCount > 1 ? "views" : "view"}
                </small>
              </Col>
              <Col sm={2} className="col-auto">
                <div className="mb-3">
                  <div className="title">Rate</div>
                  <Rating
                    onClick={(e) => handleRating(e)}
                    initialRating={myRating}
                    emptySymbol={<FontAwesomeIcon icon={solidStar} />}
                    fullSymbol={
                      <FontAwesomeIcon icon={faStar} color="#ee4d2d" />
                    }
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div
            className="rounded m-2"
            style={{
              wordWrap: "break-word",
              background: "#f2f2f2",
              width: "98%",
            }}
          >
            <p className="pt-3 pb-2">{tutorialDetail.description}</p>
          </div>
        </Row>
        {allTutorialRating && (
          <div className="card product-card-report report mb-4 mt-4">
            <div className="card-body">
              <div className="title">Tutorial Rating</div>
              <Row>
                {averageRate && (
                  <Col sm={12} lg={3} className="mb-2">
                    <div>{averageRate} out of 5</div>
                    <div>
                      <Rating
                        readonly
                        initialRating={averageRate}
                        emptySymbol={<FontAwesomeIcon icon={solidStar} />}
                        fullSymbol={
                          <FontAwesomeIcon icon={faStar} color="#ee4d2d" />
                        }
                      />
                    </div>
                  </Col>
                )}
                <Col sm={12} lg={9}>
                  <Row>
                    <Col sm={2} className=" rating-report m-1">
                      <div>5 Star {`(${getEachRate(5)})`}</div>
                    </Col>
                    <Col sm={2} className=" rating-report m-1">
                      <div>4 Star {`(${getEachRate(4)})`}</div>
                    </Col>
                    <Col sm={2} className=" rating-report m-1">
                      <div>3 Star {`(${getEachRate(3)})`}</div>
                    </Col>
                    <Col sm={2} className=" rating-report m-1">
                      <div>2 Star {`(${getEachRate(2)})`}</div>
                    </Col>
                    <Col sm={2} className=" rating-report m-1">
                      <div>1 Star {`(${getEachRate(1)})`}</div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        )}

        <Row className="mt-3 mb-5">
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <div className="d-flex justify-content-between">
                <p> {comments.length} Comments</p>
              </div>

              <Form.Control
                as="textarea"
                rows={2}
                type="text"
                size="1x"
                id="comment"
                name="comment"
                value={form.comment}
                onChange={handleChange}
                placeholder="Add a comment"
              ></Form.Control>
            </Form.Group>
            {buttonVisibility ? (
              <div className="md-5 mt-3">
                <span style={{ float: "right" }}>
                  <button
                    className="btn btn-f-primary w-10 btn-sm "
                    type="button"
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      handleCancel();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-f-primary w-10 btn-sm"
                    type="submit"
                  >
                    Submit
                  </button>
                </span>
              </div>
            ) : null}
          </Form>
          <Row>
            {comments
              ? comments.map((data, idx) => (
                  <div className="mt-2" key={idx}>
                    <Row>
                      <Col sm={1}>
                        <img
                          src={
                            data.owner.profile
                              ? require(`../../assets/uploads/${data.owner.profile}`)
                              : require(`../../assets/uploads/empty.jpg`)
                          }
                          alt="profile"
                          width="50"
                          className="rounded-circle me-3"
                        />
                      </Col>
                      <Col sm={10}>
                        <span className="fw-bold">
                          {data.owner.userName}&bull;
                        </span>
                        <small>
                          {calcDate(data.dateCreated) ? (
                            <span>{calcDate(data.dateCreated)} ago</span>
                          ) : (
                            <span> just today </span>
                          )}
                        </small>

                        <p>{data.comment}</p>
                      </Col>
                      <Col sm={1}>
                        {data.owner.user_id === userInfo.user_id && (
                          <div className=" d-flex justify-content-end">
                            <Dropdown>
                              <Dropdown.Toggle className="notif-dropdown">
                                <FontAwesomeIcon icon={faEllipsisV} />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={() =>
                                    handleDeleteComment(data.comment_id)
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faTrash}
                                    color="#30830c"
                                    className="me-3"
                                  />
                                  <span>Delete</span>
                                </Dropdown.Item>

                                <Dropdown.Item
                                  onClick={() => handleOpenModal(data)}
                                >
                                  <FontAwesomeIcon
                                    icon={faPencil}
                                    color="#30830c"
                                    className="me-3"
                                  />
                                  <span>Edit</span>
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </div>
                ))
              : null}
          </Row>
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
      </Container>
    );
  }
};

export default TutorialDetail;
