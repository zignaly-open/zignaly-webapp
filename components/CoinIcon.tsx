import React from "react";
import cloudinary from "lib/cloudinary";
import Image from "next/image";

const CoinIcon = ({
  slug,
  width = 32,
  height = 32,
}: {
  slug: string;
  width?: number;
  height?: number;
}) => {
  const image = cloudinary({ folder: "coins-slug", id: slug.replace(/ /g, "").toLowerCase() });
  return <Image src={image} width={width} height={height} />;
};

export default CoinIcon;
