import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';


import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import './NewsSwiper.css';

export default  () => {
  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      className="mySwiper"
      navigation
      autoplay={true}
      pagination={{ clickable: true }}
      modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
    >
      <SwiperSlide className="slide">
        <div className="slide-image-container">
          <img
            className="slide-image dimmed"
            src="https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-674010.jpg&fm=jpg"
            alt="Slide 1"
          />
          <div className="slide-text-container">
            <div className="slide-header">Header Text</div>
            <div className="slide-text">This is some text for the slide.</div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide className="slide">
        <div className="slide-image-container">
          <img
            className="slide-image dimmed"
            src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
            alt="Slide 2"
          />
          <div className="slide-text-container">
            <div className="slide-header">Another Header</div>
            <div className="slide-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide className="slide">
        <div className="slide-image-container">
          <img
            className="slide-image dimmed"
            src="https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg"
            alt="Slide 3"
          />
          <div className="slide-text-container">
            <div className="slide-header">Yet Another Header</div>
            <div className="slide-text">And some more text for the slide.</div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};