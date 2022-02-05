import React, { useEffect, useState } from "react";
import cloudinary from "services/cloudinary";

const CoinIcon = ({
  coin,
  width = 32,
  height = 32,
}: {
  coin: string;
  width?: number;
  height?: number;
}) => {
  // const [image, setImage] = useState(null);
  // useEffect(() => {
  //   import(`../../images/coins/${coin.toLowerCase()}.svg`).then((img) => {
  //     setImage(img);
  //   });
  // }, []);
  const image = cloudinary({ folder: "coins", id: coin });
  return <img src={image} width={width} height={height} />;
};

export default CoinIcon;
