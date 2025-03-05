import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router";

function SampleNextArrow(props) {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} absolute top-1/2 right-3 z-50 transform -translate-y-1/2 cursor-pointer`}
      onClick={onClick}
    >
      <svg
        width="46"
        height="46"
        viewBox="0 0 46 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="23"
          cy="23"
          r="22.5"
          transform="matrix(-1 0 0 1 46 0)"
          stroke="#000"
          fill="white"
        />
        <path
          d="M20.1535 29.3982C20.3049 29.3982 20.4564 29.3403 20.572 29.2248L26.4911 23.3056C26.7224 23.0744 26.7224 22.6998 26.4911 22.4687L20.572 16.5496C20.3407 16.3183 19.9661 16.3183 19.735 16.5496C19.5039 16.7809 19.5037 17.1554 19.735 17.3865L25.2356 22.8872L19.735 28.3878C19.5037 28.6191 19.5037 28.9936 19.735 29.2248C19.8506 29.3403 20.0021 29.3982 20.1535 29.3982Z"
          fill="#000"
        />
      </svg>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} absolute top-1/2 left-3 z-50 transform -translate-y-1/2 cursor-pointer`}
      onClick={onClick}
    >
      <svg
        width="46"
        height="46"
        viewBox="0 0 46 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="23" cy="23" r="22.5" stroke="#000" fill="white" />
        <path
          d="M25.8465 29.3982C25.6951 29.3982 25.5436 29.3403 25.428 29.2248L19.5089 23.3056C19.2776 23.0744 19.2776 22.6998 19.5089 22.4687L25.428 16.5496C25.6593 16.3183 26.0339 16.3183 26.265 16.5496C26.4961 16.7809 26.4963 17.1554 26.265 17.3865L20.7644 22.8872L26.265 28.3878C26.4963 28.6191 26.4963 28.9936 26.265 29.2248C26.1494 29.3403 25.9979 29.3982 25.8465 29.3982Z"
          fill="#000"
        />
      </svg>
    </div>
  );
}

const Banner = () => {
  var settings = {
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div className="banner-div">
          <Link to="collections/torrido">
            <picture>
              <source
                media="(max-width:600px)"
                srcSet="https://rupa-corporate.myshopify.com/cdn/shop/files/TORRIDO_42d04118-a1db-4b6d-aa22-e4971b80cf86.jpg?v=1732100078"
              />
              <img
                className="banner-img w-full h-auto"
                src="https://rupa-corporate.myshopify.com/cdn/shop/files/RUPA-TORRIDO.jpg?v=1732100055"
                height="604"
                width="1366"
                alt="Torrido"
              />
            </picture>
          </Link>
        </div>
        <div className="banner-div">
          <Link to="collections/colors">
            <picture>
              <source
                media="(max-width:600px)"
                srcSet="https://rupa-corporate.myshopify.com/cdn/shop/files/LIVE-COLORS_1108a529-6fe3-41ee-9bb7-b9e08803a930.jpg?v=1732099419"
              />
              <img
                className="banner-img w-full h-auto"
                src="https://rupa-corporate.myshopify.com/cdn/shop/files/LIVE-COLORS.jpg?v=1732099370"
                height="604"
                width="1366"
                alt="Colors"
              />
            </picture>
          </Link>
        </div>
        <div className="banner-div">
          <Link to="collections/jon">
            <picture>
              <source
                media="(max-width:600px)"
                srcSet="https://rupa-corporate.myshopify.com/cdn/shop/files/JON-THERMAL-RKjpg_631a20d5-de53-4625-88b6-3fffe5d4cb6f.jpg?v=1732099317"
              />
              <img
                className="banner-img w-full h-auto"
                src="https://rupa-corporate.myshopify.com/cdn/shop/files/JON-THERMAL-RK.jpg?v=1732099849"
                height="604"
                width="1366"
                alt="jon"
              />
            </picture>
          </Link>
        </div>
      </Slider>
    </div>
  );
};

export default Banner;
