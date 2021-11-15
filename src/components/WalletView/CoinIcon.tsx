import React, { useEffect, useState } from "react";

const CoinIcon = ({
  coin,
  width = 32,
  height = 32,
}: {
  coin: string;
  width?: number;
  height?: number;
}) => {
  const [image, setImage] = useState(null);
  useEffect(() => {
    import(`../../images/coins/${coin.toLowerCase()}.svg`).then((img) => {
      setImage(img);
    });
  }, []);

  return image && <img src={image.default} width={width} height={height} />;
};

export default CoinIcon;
