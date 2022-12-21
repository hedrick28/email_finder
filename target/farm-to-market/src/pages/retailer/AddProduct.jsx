import React from "react";
import { useDispatch } from "react-redux";
import ProductForm from "../../components/farmer/ProductForm";
import { add } from "../../redux/actions/product";

const AddProduct = () => {
  const dispatch = useDispatch();
  const handleSubmit = (image, data) => {
    dispatch(add(image, data));
  };
  return (
    <div>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddProduct;
