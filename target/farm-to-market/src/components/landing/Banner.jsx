import React from "react";
import grains from "../../assets/products/grains.jpg";
import vegetables from "../../assets/products/vegetables.jpg";
import crops from "../../assets/products/crops.jpg";
import farm from "../../assets/products/farm.png";
import farm1 from "../../assets/products/farm2.png";
import Carousel from "react-bootstrap/Carousel";

const Banner = () => {
  return (
    <div className="banner-container  mt-4">
      <div className="banner-wrapper d-flex container">
        <div className="banner-carousel">
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={crops}
                alt="First slide"
                height="300"
              />
              <Carousel.Caption>
                <h3>Root Crops</h3>
                <p>
                  Root crops contain dietary fibers such as cellulose,
                  hemicellulose and lignins which attract water into the gut and
                  help prevent constipation. They also serve as “cholesterol
                  binders” so we could excrete them and help lower blood
                  cholesterol levels.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={grains}
                alt="Second slide"
                height="300"
              />

              <Carousel.Caption>
                <h3>Grains</h3>
                <p>
                  Grains are important sources of many nutrients, including
                  fiber, B vitamins (thiamin, riboflavin, niacin and folate) and
                  minerals (iron, magnesium and selenium). People who eat whole
                  grains as part of a healthy diet have a reduced risk of some
                  chronic diseases.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={vegetables}
                alt="Third slide"
                height="300"
              />

              <Carousel.Caption>
                <h3>Vegetables</h3>
                <p>
                  Vegetables, like fruits, are low in calories and fats but
                  contain good amounts of vitamins and minerals. All the
                  Green-Yellow-Orange vegetables are rich sources of calcium,
                  magnesium, potassium, iron, beta-carotene, vitamin B-complex,
                  vitamin-C, vitamin-A, and vitamin K.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
        <div className="banner-image">
          <div className="top-image">
            <img src={farm} />
          </div>
          <div className=" bottom-image">
            <img src={farm1} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
