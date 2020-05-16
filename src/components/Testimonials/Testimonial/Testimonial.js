import React from "react";
import "./Testimonial.scss";
import { Box } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import FacebookIcon from "../../../images/facebook-icon.svg";
import moment from "moment";

const Testimonial = (props) => {
  const { data } = props;

  return (
    <Box className="testimonial">
      <img src={data.image} alt="Zignaly" className="avatar" />
      <Box
        className="time-box"
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        <span className="time"> {moment(data.date).fromNow()} </span>
        {data.facebook && <img src={FacebookIcon} alt="Zignaly" className="icon" />}
      </Box>
      <Box
        className="title-box"
        display="flex"
        flexDirection="column"
        justifyContent="start"
        alignItems="start"
      >
        <span className="title"> {data.name} </span>
        <p> {data.review} </p>
      </Box>
      <Box className="review-box" display="flex" flexDirection="row" justifyContent="flex-end">
        <Rating value={5} readOnly classes={{ icon: "stars" }} />
      </Box>
    </Box>
  );
};

export default Testimonial;
