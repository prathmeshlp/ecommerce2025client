import React from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { CarouselItem } from "../../types/types";
// import { useNavigate } from "react-router-dom";

interface ProductCarouselProps {
  items: CarouselItem[];
}

const carouselSettings = {
  dots: true,
  fade: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  waitForAnimate: true,
};

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ items }) => {
//   const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="mb-8"
    >
      <Slider {...carouselSettings} aria-label="Featured Products Carousel">
        {items.map((item, index) => (
          <div key={index} className="relative h-96">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover rounded-lg shadow-md"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-white p-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold mb-2"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-lg md:text-xl"
              >
                {item.subtitle}
              </motion.p>
            </div>
          </div>
        ))}
      </Slider>
    </motion.div>
  );
};