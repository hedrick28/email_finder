import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { adDetails } from "../../services/advertisement";
import { add, addAdvertisement } from "../../redux/actions/advertisement";
import { useDispatch } from "react-redux";
import AdvertisementForm from "./AdvertisementForm";

const EditAds = () => {
  const dispatch = useDispatch();
  const param = useParams();
  const [ads, setAds] = useState(null);
  useEffect(() => {
    adDetails(+param.id).then((res) => {
      if (res.data && res.data.status === 1) {
        console.log(res);
        setAds(res.data.data);
      }
    });
  }, [param.id]);

  if (ads) {
    const {
      advertisement_id,
      productName,
      description,
      category,
      quantity,
      image,
      owner,
    } = ads;

    const handleSubmit = (image, data) => {
      const formData = { ...data, advertisement_id };
      if (!image) {
        dispatch(addAdvertisement(formData, "update"));
      } else {
        dispatch(add(image, formData, "update"));
      }
    };
    return (
      <div className="container">
        <AdvertisementForm
          initialValue={{
            productName,
            description,
            quantity,
            category,
            image,
            owner,
          }}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }
};

export default EditAds;
