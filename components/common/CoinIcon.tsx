import React from "react";
import cloudinary from "utils/cloudinary";
import Image from "next/image";

const CoinIcon = ({
  coin,
  width = 32,
  height = 32,
}: {
  coin: string;
  width?: number;
  height?: number;
}) => {
  // const imageUrl = cloudinary({ folder: "coins-slug", id: slug.replace(/ /g, "").toLowerCase() });
  const imageUrl = cloudinary({ folder: "coins-binance", id: coin });
  // return <Image src={`./${coin}`} width={width} height={height} />;
  return <Image height={height} layout="fixed" src={imageUrl} width={width} />;
};

export default CoinIcon;
