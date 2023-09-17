import React from "react";

const BgColor = () => {
  const randomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 25) + 70;
    const lightness = Math.floor(Math.random() * 25) + 70;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const bgColor = randomColor();

  return bgColor;
};

export default BgColor;
