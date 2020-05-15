import React, { useState } from "react"
import PropTypes from "prop-types"
import { Box, Typography } from "@material-ui/core"
import { compose } from "recompose"
import withAppLayout from "../../../layouts/appLayout"
import withCopyTradersLayout from "../../../layouts/copyTradersLayout"
import withPageContext from "../../../pageContext"
import TraderCard from "../../../components/TraderCard"
import ProvidersFilters from "../../../components/Providers/ProvidersFilters"
import SelectTimeFrame from "../../../components/SelectTimeFrame"
import CustomSelect from "../../../components/CustomSelect"
import Helmet from "react-helmet"
import "./copyTradersBrowse.sass"

const CopyTradersBrowse = ({
  showFilters,
  showSort,
  toggleFilters,
  toggleSort,
}) => {
  const list = [1, 2, 3]
  const coins = ["BTC", "USDT"]
  const exchanges = ["Binance", "KuCoin"]

  const [coin, setCoin] = useState(coins[0])
  const [exchange, setExchange] = useState(exchanges[0])
  const handleTimeFrameChange = val => {
    console.log(val)
  }

  const handleCoinChange = val => {
    console.log(val)
    setCoin(val)
  }

  const handleExchangeChange = val => {
    setExchange(val)
  }

  const clearFilters = () => {
    setCoin("")
    setExchange("")
  }

  return (
    <Box className="ctBrowsePage">
      <Helmet>
        <title>Copy Traders</title>
      </Helmet>

      {showFilters && (
        <ProvidersFilters
          onClose={() => toggleFilters()}
          onClear={() => clearFilters()}
        >
          <CustomSelect
            options={coins}
            handleChange={handleCoinChange}
            value={coin}
            label="Coin"
          />
          <CustomSelect
            options={exchanges}
            handleChange={handleExchangeChange}
            value={exchange}
            label="Exchange"
          />
        </ProvidersFilters>
      )}
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h3" className="regularHeading">
          7 traders
        </Typography>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          {/* <SelectTimeFrame onChange={handleTimeFrameChange} /> */}
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="flex-start">
        <Box
          className="tradersBox"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          {list &&
            list.map(item => (
              <TraderCard key={item} data={item} showSummary={false} />
            ))}
        </Box>
      </Box>
    </Box>
  )
}

CopyTradersBrowse.propTypes = {
  toggleFilters: PropTypes.func,
  toggleSort: PropTypes.func,
  showFilters: PropTypes.bool,
  showSort: PropTypes.bool,
}

export default compose(
  withPageContext,
  withAppLayout,
  withCopyTradersLayout
)(CopyTradersBrowse)
