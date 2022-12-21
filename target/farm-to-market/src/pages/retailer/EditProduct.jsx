import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../components/farmer/ProductForm";
import { productDetails } from "../../services/product";
import { add, addProduct } from "../../redux/actions/product";
import { useDispatch } from "react-redux";

const EditProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const param = useParams();
  const [product, setProduct] = useState(null);
  useEffect(() => {
    productDetails(+param.id).then((res) => {
      if (res.data && res.data.status === 1) {
        setProduct(res.data.data);
      }
    });
  }, [param.id]);

  if (product) {
    const {
      product_id,
      productName,
      description,
      price,
      unit,
      stock,
      image,
      owner,
      category,
      shippingFee,
    } = product;

    const handleSubmit = (image, data) => {
      const formData = { ...data, product_id };
      if (!image) {
        dispatch(addProduct(formData, "update"));
      } else {
        dispatch(add(image, formData, "update"));
      }
    };
    return (
      <div className="container">
        <ProductForm
          initialValue={{
            productName,
            description,
            price,
            unit,
            stock,
            image,
            owner,
            category,
            shippingFee,
          }}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }
};

export default EditProduct;
