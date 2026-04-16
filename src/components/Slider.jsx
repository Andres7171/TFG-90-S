import { motion } from "motion/react";
import "./../styles/Slider.css";

const SLIDER_ITEMS = [
  "WORLDWIDE SHIPPING",
  "90'S TYPE SHIT",
  "HIP HOP CULTURE",
];

// Repetimos 8 veces para que el track sea suficientemente largo
// La animación mueve -50%, así que necesitamos que la mitad ya cubra el ancho
const items = [...Array(8)].flatMap(() => SLIDER_ITEMS);

export function Slider() {
  return (
    <div className="sliderHeader overflow-hidden w-100 py-2  ">
      <motion.div
        className="d-flex"
        style={{ width: "max-content" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
        }}
      >
        {items.map((item, i) => (
          <span key={i} className="slider-item text-warning">
            • {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
