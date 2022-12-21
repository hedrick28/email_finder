import React, { useState, useEffect } from "react";
import Joi from "joi";
import { useNavigate } from "react-router-dom";
import { allTutorials } from "../../services/tutorials";
import { getUserInfo } from "../../services/userInf";
import { Card, Container, Form, Row, Col } from "react-bootstrap";
import lodash from "../../services/lodash";

const TutorialForm = ({ onSubmit, initialValue, info }) => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(
    initialValue || {
      title: "",
      description: "",
      video: "",
      isAgree: "",
      image: "",
      article: "",
      type: info?.toLowerCase(),
      owner: getUserInfo() && getUserInfo().data,
    }
  );
  const [imageData, setImageData] = useState(null);
  const [imagePrev, setImagePrev] = useState(
    initialValue ? require(`../../assets/uploads/${initialValue.image}`) : null
  );
  const [videoData, setVideoData] = useState(null);
  const [videoPrev, setVideoPrev] = useState(
    initialValue ? require(`../../assets/uploads/${initialValue.image}`) : null
  );
  const [articleData, setArticleData] = useState(null);
  const [articlePrev, setArticlePrev] = useState(
    initialValue ? require(`../../assets/uploads/${initialValue.image}`) : null
  );

  const [tutorials, setTutorials] = useState([]);
  const [fileErrorVid, setFileErrorVid] = useState("");
  const [fileErrorImg, setFileErrorImg] = useState("");
  const [fileErrorArt, setFileErrorArt] = useState("");

  useEffect(() => {
    allTutorials().then((res) => {
      setTutorials(res.data);
    });
  }, []);

  const schema = Joi.object({
    title: Joi.string().trim().max(100).required(),
    description: Joi.string().trim().max(250).required(),
    video:
      info === "Video"
        ? Joi.string().required()
        : Joi.string().allow("").optional(),
    isAgree: Joi.string().required(),
    image:
      info === "Article"
        ? Joi.string().allow("").optional()
        : Joi.string().required(),
    article:
      info === "Article"
        ? Joi.string().required()
        : Joi.string().allow("").optional(),
    type: Joi.string().allow("").optional(),
    owner: Joi.object().allow({}).allow().required(),
  });

  const handleFileChange = (e) => {
    e.preventDefault();

    let file = e.target.files[0];
    var imageData1 = new FormData();
    imageData1.append("imageFile", file);
    setImageData(imageData1);
    setImagePrev(URL.createObjectURL(file));
    setForm({ ...form, [e.currentTarget.name]: file.name });

    if (e.target.files.length < 1) {
      return;
    }
    if (isValidImageUploaded(file)) {
      setFileErrorImg("");
    } else {
      setFileErrorImg("Please choose a valid image.");
    }
  };

  const handleFileChangeVideo = (e) => {
    e.preventDefault();

    let file = e.target.files[0];
    var imageData1 = new FormData();
    imageData1.append("imageFile", file);
    setVideoData(imageData1);
    setVideoPrev(URL.createObjectURL(file));
    setForm({ ...form, [e.currentTarget.name]: file.name });
    if (e.target.files.length < 1) {
      return;
    }
    if (isValidVideoUploaded(file)) {
      setFileErrorVid("");
    } else {
      setFileErrorVid("Please choose a valid video.");
    }
  };

  const handleFileChangeArticle = (e) => {
    e.preventDefault();

    let file = e.target.files[0];
    var imageData1 = new FormData();
    imageData1.append("imageFile", file);
    setArticleData(imageData1);
    setArticlePrev(URL.createObjectURL(file));
    setForm({ ...form, [e.currentTarget.name]: file.name });

    if (e.target.files.length < 1) {
      return;
    }
    if (isValidArticleUploaded(file)) {
      setFileErrorArt("");
    } else {
      setFileErrorArt("Please choose a valid file.");
    }
  };

  const isValidVideoUploaded = (file) => {
    const validExtensions = ["mp4"];
    const fileExtension = file.type.split("/")[1];
    return validExtensions.includes(fileExtension);
  };

  const isValidImageUploaded = (file) => {
    const validExtensions = ["png", "jpeg", "jpg"];
    const fileExtension = file.type.split("/")[1];
    return validExtensions.includes(fileExtension);
  };

  const isValidArticleUploaded = (file) => {
    const validExtensions = ["pdf"];
    const fileExtension = file.type.split("/")[1];
    return validExtensions.includes(fileExtension);
  };

  const handleChange = (e, type = "input") => {
    setForm({ ...form, [e.currentTarget.name]: e.currentTarget.value });

    const { error } = schema
      .extract(e.currentTarget.name)
      .label(lodash(e.currentTarget.name))
      .validate(e.currentTarget.value);

    if (error) {
      setErrors({
        ...errors,
        [e.currentTarget.name]: error.details[0].message,
      });
    } else {
      delete errors[e.currentTarget.name];
      setErrors(errors);
    }
  };

  const handleChangeCheckBox = (event) => {
    let check = "";
    if (form.isAgree === "") {
      check = "true";
      delete errors[event.currentTarget.name];
      setErrors(errors);
    } else {
      check = "";
      setErrors({
        ...errors,
        isAgree: "Please agree with the terms and conditions",
      });
    }
    setForm({ ...form, isAgree: check });
  };

  const isFormInvalid = () => {
    const result = schema.validate(form);

    return !!result.error;
  };

  const handleCheckTitle = () => {
    if (initialValue) {
      if (initialValue.title === form.title) {
        return false;
      }
    } else {
      let title = tutorials.find(
        (data) => data.title?.toLowerCase() === form.title?.toLowerCase()
      );
      if (title) {
        return true;
      }
      return false;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(imageData, videoData, articleData, form);
  };

  return (
    <Container className="mt-4 mb-4">
      <Form onSubmit={handleSubmit}>
        <Card>
          <Card.Header>
            <Card.Title>
              {initialValue ? "Edit " + info : "Add " + info}
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  list="datalistOptions"
                  type="text"
                  size="1x"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                />
                {errors.title && (
                  <div className="text-danger">
                    Please state the title of this video.
                  </div>
                )}
                {handleCheckTitle() ? (
                  <div className="text-danger">
                    This title is already existing. Please use another title.
                  </div>
                ) : null}
              </Form.Group>
            </Row>
            <Row>
              <Form.Group>
                <Form.Label className="mt-3">Description</Form.Label>
                <Form.Control
                  type="text"
                  size="1x"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
                {errors.description && (
                  <div className="text-danger">
                    Please state description of this video (maximum of 250
                    characters).
                  </div>
                )}
              </Form.Group>
            </Row>
            {info === "Video" ? (
              <Row className="justify-content-center ">
                <Form.Label className="mt-3">Upload Video</Form.Label>

                <div className="d-flex flex-row justify-content-center align-items-center">
                  <label
                    htmlFor="video"
                    className="btn input-f-primary"
                    tabIndex="0"
                    typeof="file"
                  >
                    <input
                      name="video"
                      accept="image/*"
                      type="file"
                      id="video"
                      className="account-file-input input-file-upload"
                      onChange={handleFileChangeVideo}
                    />
                  </label>
                </div>
                <div className="d-flex flex-row justify-content-center align-items-center ">
                  <p className="text-mute mb-0">Allowed MP4 only.</p>
                </div>
                <div className="d-flex flex-row justify-content-center align-items-center ">
                  {fileErrorVid && (
                    <div className="text-danger">{fileErrorVid}</div>
                  )}
                </div>
              </Row>
            ) : null}

            <Row className="justify-content-center ">
              <Form.Label className="mt-3">Upload Image</Form.Label>

              <div className="d-flex align-items-start justify-content-center align-items-sm-center gap-4">
                <img
                  src={imagePrev ? imagePrev : ""}
                  alt="image"
                  className="image"
                  id="image"
                  width={"200px"}
                  height={"150px"}
                />
              </div>

              <div className="d-flex flex-row justify-content-center align-items-center">
                <label
                  htmlFor="image"
                  className="btn input-f-primary"
                  tabIndex="0"
                  typeof="file"
                >
                  <input
                    name="image"
                    accept="image/*"
                    type="file"
                    id="image"
                    className="account-file-input input-file-upload"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <div className="d-flex flex-row justify-content-center align-items-center ">
                <p className="text-mute mb-0">Allowed JPG, JPEG or PNG.</p>
              </div>
              <div className="d-flex flex-row justify-content-center align-items-center ">
                {fileErrorImg && (
                  <div className="text-danger">{fileErrorImg}</div>
                )}
              </div>
            </Row>

            {info === "Article" ? (
              <Row className="justify-content-center ">
                <Form.Label className="mt-3">Upload Article</Form.Label>

                <div className="d-flex flex-row justify-content-center align-items-center">
                  <label
                    htmlFor="article"
                    className="btn input-f-primary"
                    tabIndex="0"
                    typeof="file"
                  >
                    <input
                      name="article"
                      accept="image/*"
                      type="file"
                      id="article"
                      className="account-file-input input-file-upload"
                      onChange={handleFileChangeArticle}
                    />
                  </label>
                </div>
                <div className="d-flex flex-row justify-content-center align-items-center ">
                  <p className="text-mute mb-0">Allowed PDF only.</p>
                </div>
                <div className="d-flex flex-row justify-content-center align-items-center ">
                  {fileErrorArt && (
                    <div className="text-danger">{fileErrorArt}</div>
                  )}
                </div>
              </Row>
            ) : null}
            <Row>
              <Form.Group>
                <Form.Label className="mt-3">
                  Please be mindful that sharing inaapropriate videos will lead
                  to your dismembership.
                </Form.Label>
                <div className="col-12">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isAgree"
                      checked={form.isAgree === "true"}
                      onChange={handleChangeCheckBox}
                      id="isAgree"
                    />
                    <label className="form-check-label" htmlFor="isAgree">
                      Agree to terms and conditions
                    </label>
                  </div>
                </div>

                {!!errors.isAgree && (
                  <div className="text-danger">
                    Please agree with the terms and conditions.
                  </div>
                )}
              </Form.Group>
            </Row>
          </Card.Body>
          <Card.Footer>
            <div className="d-grid gap-2 d-md-flex justify-content-md-center">
              <button
                type="button"
                className="btn btn-f-primary me-md-2"
                onClick={() => {
                  navigate("/tutorials");
                }}
              >
                &nbsp;&nbsp;Back&nbsp;&nbsp;
              </button>
              <button
                type="submit"
                disabled={
                  isFormInvalid() ||
                  initialValue === form ||
                  (initialValue !== form
                    ? fileErrorArt || fileErrorImg || fileErrorVid
                    : false)
                }
                className="btn btn-f-primary"
              >
                Submit
              </button>
            </div>
          </Card.Footer>
        </Card>
      </Form>
    </Container>
  );
};

export default TutorialForm;
