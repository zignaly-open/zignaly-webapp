import React from "react"
import PropTypes from "prop-types"
import "./CustomFilters.scss"
import { Box } from "@material-ui/core"
import CustomButtom from "../CustomButton"

const CustomFilters = props => {
  const { onClose, onClear, title } = props

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      className="customFilters"
    >
      <Box
        className="filters"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <span className="title">{title}</span>
        {props.children}
      </Box>
      <Box
        className="actions"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <CustomButtom onClick={onClear} className="text-purple">
          Clear All
        </CustomButtom>
        <CustomButtom onClick={onClose} className="text-purple">
          Hide
        </CustomButtom>
      </Box>
    </Box>
  )
}

CustomFilters.propTypes = {
  onClose: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

export default CustomFilters
