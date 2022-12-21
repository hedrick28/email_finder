import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import TutorialForm from "../../components/tutorial/TutorialForm";
import { tutorialDetails } from "../../services/tutorials";
import {
  addVideo,
  addImage,
  addArticle,
  addTutorial,
} from "../../redux/actions/tutorial";
import { useDispatch } from "react-redux";

const EditTutorial = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const info = location.state?.type;
  const param = useParams();
  const [tutorial, setTutorial] = useState(null);
  useEffect(() => {
    tutorialDetails(+param.id).then((res) => {
      if (res.data && res.data.status === 1) {
        setTutorial(res.data.data);
      }
    });
  }, [param.id]);

  if (tutorial) {
    const {
      tutorial_id,
      title,
      description,
      video,
      isAgree,
      image,
      article,
      type,
      owner,
    } = tutorial;

    const handleSubmit = (image, video, article, data) => {
      const formData = { ...data, tutorial_id };
      if (!image) {
        dispatch(addTutorial(formData, "update"));
      } else {
        if (info === "Video") {
          dispatch(addVideo(image, video, formData, "update"));
        }
        if (info === "Image") {
          dispatch(addImage(image, formData, "update"));
        }
        if (info === "Article") {
          dispatch(addArticle(article, formData, "update"));
        }
      }
      tutorialDetails(+param.id).then((res) => {
        if (res.data && res.data.status === 1) {
          setTutorial(res.data.data);
        }
      });

      navigate("/tutorials");
    };

    return (
      <div className="container">
        <TutorialForm
          initialValue={{
            title,
            description,
            video,
            isAgree,
            image,
            article,
            type,
            owner,
          }}
          onSubmit={handleSubmit}
          info={info}
        />
      </div>
    );
  }
};

export default EditTutorial;
