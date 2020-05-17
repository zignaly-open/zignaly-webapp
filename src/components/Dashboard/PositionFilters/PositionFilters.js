import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import CustomFilters from "../../CustomFilters"
import CustomSelect from "../../CustomSelect"

const PositionFilters = ({ onChange, onClose }) => {
  const types = ["All types", "type 1"]
  const mdas = ["MDA"]
  const traders = ["All Traders"]

  const [type, setType] = useState(types[0])
  const [mda, setMDA] = useState(mdas[0])
  const [trader, setTrader] = useState(traders[0])

  const clearFilters = () => {
    setType("")
    setMDA("")
    setTrader("")
  }

  useEffect(() => {
    if (onChange) {
      onChange(type, mda, trader)
    }
  }, [type, mda, trader])

  return (
    <CustomFilters title="Filters" onClose={onClose} onClear={clearFilters}>
      <CustomSelect options={types} onChange={setType} value={type} label="" />
      <CustomSelect options={mdas} onChange={setMDA} value={mda} label="" />
      <CustomSelect
        options={traders}
        onChange={setTrader}
        value={trader}
        label=""
      />
    </CustomFilters>
  )
}

PositionFilters.propTypes = {
  onChange: PropTypes.func,
  onClose: PropTypes.func,
}

export default PositionFilters
