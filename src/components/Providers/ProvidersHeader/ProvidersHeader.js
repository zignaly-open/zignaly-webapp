import React from 'react';
import "./ProvidersHeader.sass"
import { Box } from '@material-ui/core';
import Link from '../../LocalizedLink';

const ProvidersHeader = () => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="center"
      className="providersHeader"
    >
      <Link
        to="/copyTraders/browse"
        className="dashboardLink"
        activeClassName="active"
      >
        Browse
      </Link>
      <Link
        to="/copyTraders/analytics"
        className="dashboardLink"
        activeClassName="active"
      >
        Analytics
      </Link>
    </Box>
  )
}

export default ProvidersHeader
