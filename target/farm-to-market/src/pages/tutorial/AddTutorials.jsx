import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import TutorialForm from "../../components/tutorial/TutorialForm";
import { addVideo, addImage, addArticle } from "../../redux/actions/tutorial";
import {
  allVideoTutorials,
  allImageTutorials,
  allArticleTutorials,
} from "../../services/tutorials";

const AddTutorials = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const info = location.state?.type;
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    handleUpdate();
  }, []);

  const handleSubmit = (image, video, article, data) => {
    if (info === "Video") {
      dispatch(addVideo(image, video, data)).then((data) => {
        handleUpdate();
        navigate("/tutorials");
      });
    }
    if (info === "Image") {
      dispatch(addImage(image, data)).then((data) => {
        handleUpdate();
        navigate("/tutorials");
      });
    }
    if (info === "Article") {
      dispatch(addArticle(image, article, data)).then((data) => {
        handleUpdate();
        navigate("/tutorials");
      });
    }
  };

  const handleUpdate = () => {
    allVideoTutorials().then((response) => {
      setVideos(response.data);
    });
    allImageTutorials().then((response) => {
      setImages(response.data);
    });
    allArticleTutorials().then((response) => {
      setArticles(response.data);
    });
  };
  return (
    <div>
      <TutorialForm onSubmit={handleSubmit} info={info} />
    </div>
  );
};

export default AddTutorials;
