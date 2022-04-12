import React from "react";
import Image from "next/image";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const ImageWithBasePath: typeof Image = (props) => {
  const url = props.src?.startsWith("/") ? `${basePath || ""}${props.src}` : props.src;
  return <Image {...props} src={url} />;
};

export default ImageWithBasePath;
