import React from "react";
import "./Testimonial.scss";
import { Box } from "@mui/material";
import Rating from '@mui/material/Rating';
import FacebookIcon from "../../../images/facebook-icon.svg";
import moment from "moment";
import { FormattedMessage } from "react-intl";

/**
 *
 * @typedef {Object} DataObject
 * @property {String} review
 * @property {String} name
 * @property {String} date
 * @property {String} image
 * @property {Boolean} facebook
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {DataObject} data
 */

/**
 *
 * @param {DefaultProps} props
 */

const Testimonial = (props) => {
  const { data } = props;

  return (
    <Box className="testimonial">
      <img alt="Zignaly" className="avatar" src={data.image} />
      <Box
        alignItems="center"
        className="timeBox"
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
      >
        <span className="time"> {moment(new Date(data.date)).fromNow()} </span>
        {data.facebook && <img alt="Zignaly" className="icon" src={FacebookIcon} />}
      </Box>
      <Box
        alignItems="start"
        className="titleBox"
        display="flex"
        flexDirection="column"
        justifyContent="start"
      >
        <span className="title"> {data.name} </span>
        <p>
          {" "}
          <FormattedMessage id={data.review} />{" "}
        </p>
      </Box>
      <Box className="reviewBox" display="flex" flexDirection="row" justifyContent="flex-end">
        <Rating classes={{ icon: "stars" }} readOnly value={5} />
      </Box>
    </Box>
  );
};

export default Testimonial;
