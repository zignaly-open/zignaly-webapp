import React from "react";
import Image from "next/image";

const ImageWithBasePath: typeof Image = (props) => {
  const url = props.src?.startsWith("/") ? `${process.env.BASE_PATH || ""}${props.src}` : props.src;
  return <Image {...props} src={url} />;
};

export default ImageWithBasePath;
