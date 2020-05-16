import React from "react";
import "./Testimonial.scss";
import { Box } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import FacebookIcon from "../../../images/facebook-icon.svg";
import moment from "moment";

const Testimonial = props => {
  const { data } = props;

  return (
    <Box className="testimonial">
      <img alt="Zignaly" className="avatar" src={data.image} />
      <Box
        alignItems="center"
        className="time-box"
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
      >
        <span className="time"> {moment(data.date).fromNow()} </span>
        {data.facebook && <img alt="Zignaly" className="icon" src={FacebookIcon} />}
      </Box>
      <Box
        alignItems="start"
        className="title-box"
        display="flex"
        flexDirection="column"
        justifyContent="start"
      >
        <span className="title"> {data.name} </span>
        <p> {data.review} </p>
      </Box>
      <Box className="review-box" display="flex" flexDirection="row" justifyContent="flex-end">
        <Rating classes={{ icon: "stars" }} readOnly value={5} />
      </Box>
    </Box>
  );
};

export default Testimonial;
