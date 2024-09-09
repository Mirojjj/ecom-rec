import { Image } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ImageSlider = ({ slides }) => {
  return (
    <Carousel
      infiniteLoop
      autoPlay
      showThumbs={false}
      showIndicators={true}
      showStatus={false}
      interval={3000}
      stopOnHover={true}
      dynamicHeight={false}
      showArrows={false}
    >
      {slides.map((slide) => {
        return (
          <Image
            src={slide.image}
            height="500px"
            width="800px"
            borderRadius="xl"
            objectFit="cover"
            boxShadow="lg"
          />
        );
      })}
    </Carousel>
  );
};

export default ImageSlider;
