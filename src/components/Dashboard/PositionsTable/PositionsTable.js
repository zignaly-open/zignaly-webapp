import React from 'react';
import './PositionsTable.sass';
import {Box, Table, TableHead, TableBody, TableRow, TableCell} from '@material-ui/core';

const PositionSettingsForm = (props) => {
    const rows = [1,2,3,4,5,6,7];

    return(
        <Box className="positionsTable" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Box className="tableBox" display="flex" flexDirection="row" justifyContent="center">
                <Table className="table">
                    <TableHead className="head">
                        <TableRow className="row">
                            <TableCell align="left" className="cell">Time</TableCell>
                            <TableCell align="left" className="cell">Type</TableCell>
                            <TableCell align="left" className="cell">Pair</TableCell>
                            <TableCell align="left" className="cell">Trader</TableCell>
                            <TableCell align="left" className="cell">Invested</TableCell>
                            <TableCell align="left" className="cell">Entry Price</TableCell>
                            <TableCell align="left"className="cell" >Current Price</TableCell>
                            <TableCell align="left" className="cell">P/L %</TableCell>
                            <TableCell align="left" className="cell">P/L #</TableCell>
                            <TableCell align="left" className="cell">Net Profit</TableCell>
                            <TableCell align="left" className="cell">Risk</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="body">
                    {rows.map((row) => (
                        <TableRow key={row} className="row">
                            <TableCell align="left" className="cell">{"time"}</TableCell>
                            <TableCell align="left" className="cell">{"data"}</TableCell>
                            <TableCell align="left" className="cell">{"data"}</TableCell>
                            <TableCell align="left" className="cell">{"data"}</TableCell>
                            <TableCell align="left" className="cell">{"time"}</TableCell>
                            <TableCell align="left" className="cell">{"data"}</TableCell>
                            <TableCell align="left" className="cell">{"data"}</TableCell>
                            <TableCell align="left" className="cell">{"data"}</TableCell>
                            <TableCell align="left" className="cell">{"time"}</TableCell>
                            <TableCell align="left" className="cell">{"data"}</TableCell>
                            <TableCell align="left" className="cell">{"time"}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    )
}

export default PositionSettingsForm;