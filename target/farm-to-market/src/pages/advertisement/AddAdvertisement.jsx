import React from "react";
import { useDispatch } from "react-redux";
import AdvertisementForm from "./AdvertisementForm";
import { add } from "../../redux/actions/advertisement";

const AddAdvertisement = () => {
  const dispatch = useDispatch();
  const handleSubmit = (image, data) => {
    dispatch(add(image, data));
  };
  return (
    <div>
      <AdvertisementForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddAdvertisement;
