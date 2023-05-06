import { Image } from "@chakra-ui/react";
import { Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";

interface Props {
  images: string[];
}

export const Gallery: React.FC<Props> = ({ images }) => {
  return (
    <Swiper modules={[Scrollbar]} scrollbar={{ hide: false }} centeredSlides>
      {images.map((i) => (
        <SwiperSlide>
          <Image width="100%" maxH="500px" objectFit="cover" src={i} key={i} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
