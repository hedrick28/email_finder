import React, { useState, useEffect } from "react";
import { Container, Card, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusSquare,
  faVideo,
  faFile,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import {
  allVideoTutorials,
  allImageTutorials,
  allArticleTutorials,
  setVisibility,
  addView,
} from "../../services/tutorials";
import { getUserInfo } from "../../services/userInf";

const Tutorials = () => {
  const MAX_LENGTH = 43;
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    allVideoTutorials().then((response) => {
      if (getUserInfo().data.role === "admin") {
        setVideos(response.data);
      } else {
        setVideos(response.data.filter((video) => video.active === true));
      }
    });
    allImageTutorials().then((response) => {
      if (getUserInfo().data.role === "admin") {
        setImages(response.data);
      } else {
        setImages(response.data.filter((image) => image.active === true));
      }
    });
    allArticleTutorials().then((response) => {
      if (getUserInfo().data.role === "admin") {
        setArticles(response.data);
      } else {
        setArticles(response.data.filter((article) => article.active === true));
      }
    });
  }, []);

  const handleVisibility = (id, type) => {
    setVisibility(id).then((response) => {
      if (type === "video") {
        allVideoTutorials().then((response) => {
          if (getUserInfo().data.role === "admin") {
            setVideos(response.data);
          } else {
            setVideos(response.data.filter((video) => video.active === true));
          }
        });
      } else if (type === "image") {
        allImageTutorials().then((response) => {
          if (getUserInfo().data.role === "admin") {
            setImages(response.data);
          } else {
            setImages(response.data.filter((image) => image.active === true));
          }
        });
      } else {
        allArticleTutorials().then((response) => {
          if (getUserInfo().data.role === "admin") {
            setArticles(response.data);
          } else {
            setArticles(
              response.data.filter((article) => article.active === true)
            );
          }
        });
      }
    });
  };

  const handleViews = (tutorialDetail) => {
    const data = {
      viewOwner: getUserInfo() && getUserInfo().data,
      tutorial: tutorialDetail,
    };
    addView(data);
  };

  return (
    <Container className="mt-4 mb-4">
      {!videos.length &&
      !images.length &&
      !articles.length &&
      getUserInfo().data.role !== "admin" ? (
        "No available tutorials"
      ) : (
        <>
          <Row>
            <div>
              {videos.length > 0 && (
                <button
                  type="button"
                  className="btn btn-f-primary btn-sm"
                  style={{
                    color: "green",
                    marginRight: "15px",
                    marginTop: "20px",
                  }}
                  onClick={() => navigate("/tutorials/videos")}
                >
                  <FontAwesomeIcon icon={faVideo} />
                  &nbsp;Show All Videos
                </button>
              )}

              {getUserInfo().data.role === "admin" ? (
                <button
                  type="button"
                  className="btn btn-f-primary btn-sm"
                  style={{ color: "green", marginTop: "20px" }}
                  onClick={() =>
                    navigate("/tutorials/add", {
                      state: {
                        type: "Video",
                      },
                    })
                  }
                >
                  <FontAwesomeIcon icon={faPlusSquare} />
                  &nbsp;Add Videos
                </button>
              ) : null}
            </div>

            <Row xs={1} md={4} className="g-2">
              {videos.map((data, idx) =>
                idx < 4 ? (
                  <Col key={data.tutorial_id}>
                    <Card>
                      <Link
                        onClick={() => {
                          handleViews(data);
                        }}
                        to={`/tutorials/detail/${data.tutorial_id}`}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <Card.Img
                          width={"200px"}
                          height={"150px"}
                          variant="top"
                          src={require("../../assets/uploads/" + data.image)}
                        />

                        <Card.Body style={{ height: "150px" }}>
                          <Card.Title>{data.title}</Card.Title>
                          <Card.Text>
                            {data.description.length > MAX_LENGTH ? (
                              <>
                                {data.description.substring(0, MAX_LENGTH)}...
                              </>
                            ) : (
                              data.description
                            )}
                          </Card.Text>
                        </Card.Body>
                      </Link>
                      {getUserInfo().data.role === "admin" ? (
                        <Card.Footer>
                          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                            <button
                              className="btn btn-f-primary btn-sm me-md-2"
                              type="button"
                              onClick={() => {
                                handleVisibility(data.tutorial_id, data.type);
                              }}
                            >
                              {data.active === true ? "Hide" : "Show"}
                            </button>
                            <button
                              className="btn btn-f-primary btn-sm"
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/tutorials/edit/${data.tutorial_id}`,
                                  {
                                    state: {
                                      type: "Video",
                                    },
                                  }
                                )
                              }
                            >
                              &nbsp;Edit&nbsp;
                            </button>
                          </div>
                        </Card.Footer>
                      ) : null}
                    </Card>
                  </Col>
                ) : null
              )}
              {videos.length <= 0 && (
                <div>
                  <p>No videos available</p>
                </div>
              )}
            </Row>
          </Row>
          <Row className="mt-5">
            <div>
              {images.length > 0 && (
                <button
                  type="button"
                  className="btn btn-f-primary btn-sm"
                  style={{
                    color: "green",
                    marginRight: "15px",
                    marginTop: "20px",
                  }}
                  onClick={() => navigate("/tutorials/images")}
                >
                  <FontAwesomeIcon icon={faImage} />
                  &nbsp;Show All Images
                </button>
              )}

              {getUserInfo().data.role === "admin" ? (
                <button
                  type="button"
                  className="btn btn-f-primary btn-sm"
                  style={{ color: "green", marginTop: "20px" }}
                  onClick={() =>
                    navigate("/tutorials/add", {
                      state: {
                        type: "Image",
                      },
                    })
                  }
                >
                  <FontAwesomeIcon icon={faPlusSquare} />
                  &nbsp;Add Images
                </button>
              ) : null}
            </div>
            <Row xs={1} md={4} className="g-2">
              {images.map((data, idx) =>
                idx < 4 ? (
                  <Col key={data.tutorial_id}>
                    <Card>
                      <Link
                        onClick={() => {
                          handleViews(data);
                        }}
                        to={`/tutorials/detail/${data.tutorial_id}`}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <Card.Img
                          width={"200px"}
                          height={"150px"}
                          variant="top"
                          src={require("../../assets/uploads/" + data.image)}
                        />
                        <Card.Body style={{ height: "150px" }}>
                          <Card.Title>{data.title}</Card.Title>
                          <Card.Text>
                            {data.description.length > MAX_LENGTH ? (
                              <>
                                {data.description.substring(0, MAX_LENGTH)}...
                              </>
                            ) : (
                              data.description
                            )}
                          </Card.Text>
                        </Card.Body>
                      </Link>
                      {getUserInfo().data.role === "admin" ? (
                        <Card.Footer>
                          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                            <button
                              className="btn btn-f-primary btn-sm me-md-2"
                              type="button"
                              onClick={() => {
                                handleVisibility(data.tutorial_id, data.type);
                              }}
                            >
                              {data.active === true ? "Hide" : "Show"}
                            </button>
                            <button
                              className="btn btn-f-primary btn-sm"
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/tutorials/edit/${data.tutorial_id}`,
                                  {
                                    state: {
                                      type: "Image",
                                    },
                                  }
                                )
                              }
                            >
                              &nbsp;Edit&nbsp;
                            </button>
                          </div>
                        </Card.Footer>
                      ) : null}
                    </Card>
                  </Col>
                ) : null
              )}
              {images.length <= 0 && (
                <div>
                  <p>No images available</p>
                </div>
              )}
            </Row>
          </Row>
          <Row className="mt-5">
            <div>
              {articles.length > 0 && (
                <button
                  type="button"
                  className="btn btn-f-primary btn-sm"
                  style={{
                    color: "green",
                    marginRight: "15px",
                    marginTop: "20px",
                  }}
                  onClick={() => navigate("/tutorials/articles")}
                >
                  <FontAwesomeIcon icon={faFile} />
                  &nbsp;Show All Articles
                </button>
              )}

              {getUserInfo().data.role === "admin" ? (
                <button
                  type="button"
                  className="btn btn-f-primary btn-sm"
                  style={{ color: "green", marginTop: "20px" }}
                  onClick={() =>
                    navigate("/tutorials/add", {
                      state: {
                        type: "Article",
                      },
                    })
                  }
                >
                  <FontAwesomeIcon icon={faPlusSquare} />
                  &nbsp;Add Articles
                </button>
              ) : null}
            </div>
            <Row xs={1} md={4} className="g-2">
              {articles.map((data, idx) =>
                idx < 4 ? (
                  <Col key={data.tutorial_id}>
                    <Card>
                      <a
                        href={require("../../assets/uploads/" + data.article)}
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: "none", color: "black" }}
                        onClick={() => {
                          handleViews(data);
                        }}
                      >
                        <Card.Img
                          width={"200px"}
                          height={"150px"}
                          variant="top"
                          src={require("../../assets/uploads/" + data.image)}
                        />
                        <Card.Body style={{ height: "150px" }}>
                          <Card.Title>{data.title}</Card.Title>
                          <Card.Text>
                            {data.description.length > MAX_LENGTH ? (
                              <>
                                {data.description.substring(0, MAX_LENGTH)}...
                              </>
                            ) : (
                              data.description
                            )}
                          </Card.Text>
                        </Card.Body>
                      </a>
                      {getUserInfo().data.role === "admin" ? (
                        <Card.Footer>
                          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                            <button
                              className="btn btn-f-primary btn-sm me-md-2"
                              type="button"
                              onClick={() => {
                                handleVisibility(data.tutorial_id, data.type);
                              }}
                            >
                              {data.active === true ? "Hide" : "Show"}
                            </button>
                            <button
                              className="btn btn-f-primary btn-sm"
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/tutorials/edit/${data.tutorial_id}`,
                                  {
                                    state: {
                                      type: "Article",
                                    },
                                  }
                                )
                              }
                            >
                              &nbsp;Edit&nbsp;
                            </button>
                          </div>
                        </Card.Footer>
                      ) : null}
                    </Card>
                  </Col>
                ) : null
              )}
              {articles.length <= 0 && (
                <div>
                  <p>No articles available</p>
                </div>
              )}
            </Row>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Tutorials;
