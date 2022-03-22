import React, { useState } from "react";
import "./Testimonials.scss";
import { Box } from "@mui/material";
import Testimonial from "./Testimonial";
import CustomButton from "../CustomButton";
import testominalFeed from "../../utils/testimonialFeed.json";
import { FormattedMessage } from "react-intl";

const Testimonials = () => {
  const [pageSize, setPageSize] = useState(6);

  const loadMoreData = () => {
    let size = pageSize + 6 > testominalFeed.length ? testominalFeed.length : pageSize + 6;
    setPageSize(size);
  };

  const testimonials = testominalFeed.slice(0, pageSize);

  return (
    <Box className="testimonials">
      <span className="title">
        <FormattedMessage id="testimonials.title" />
      </span>
      <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between">
        {testimonials.map((item) => (
          <Testimonial data={item} key={item.id} />
        ))}
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="center">
        <CustomButton
          className="loadMoreButton"
          disabled={pageSize === testominalFeed.length}
          onClick={loadMoreData}
        >
          <FormattedMessage id="testimonials.loadmore" />
        </CustomButton>
      </Box>
    </Box>
  );
};

export default Testimonials;
