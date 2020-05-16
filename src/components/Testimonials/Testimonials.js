import React, { useState, useEffect } from "react";
import style from "./Testimonials.module.scss";
import { Box } from "@material-ui/core";
import Testimonial from "./Testimonial";
import CustomButton from "../CustomButton";
import testominalFeed from "../../utils/testimonialFeed.json";

const Testimonials = () => {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    const feedData = size => {
      let arr = [];
      for (let a = 0; a < size; a++) {
        arr.push(testominalFeed[a]);
      }
      setData(arr);
    };

    feedData(pageSize);
  }, [pageSize]);

  const loadMoreData = () => {
    let size = pageSize + 6 > testominalFeed.length ? testominalFeed.length : pageSize + 6;
    setPageSize(size);
  };

  return (
    <Box className={style.testimonials}>
      <span className={style.title}>Testimonials</span>
      <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between">
        {data && data.map(item => <Testimonial data={item} key={item.id} />)}
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="center">
        <CustomButton
          className="load-more-btn"
          disabled={pageSize === testominalFeed.length}
          onClick={loadMoreData}
        >
          Load More
        </CustomButton>
      </Box>
    </Box>
  );
};

export default Testimonials;
