import React from "react"
import PropTypes from "prop-types"
import "./ProvidersFilters.sass"
import { Box } from "@material-ui/core"
import CustomButtom from "../../CustomButton"

const ProvidersFilters = props => {
  const { onClose, onClear } = props

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      className="providersFilters"
    >
      <Box
        className="filters"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <span className="title">Filters</span>
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

ProvidersFilters.propTypes = {
  onClose: PropTypes.func,
  onClear: PropTypes.func,
}

export default ProvidersFilters
