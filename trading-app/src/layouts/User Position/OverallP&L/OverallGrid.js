import React from 'react'
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components

// Material Dashboard 2 React example components



// Data

import OverallPL from './Overall P&L';
import DataTable from '../../../examples/Tables/DataTable';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';

const OverallGrid = () => {
    // const { columns, rows } = authorsTableData();
    const { columns, rows } = OverallPL();
    const { columns: pColumns, rows: pRows } = OverallPL();
    return (<>
                <MDBox pt={6} pb={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Card>
                                <MDBox
                                    mx={2}
                                    mt={-3}
                                    py={1}
                                    px={2}
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                    sx={{
                                        display: 'flex',
                                        justifyContent: "space-between",
                                      }}>

                                    <MDTypography variant="h6" color="white" py={1}>
                                        Over All P&L
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={3}>
                                    <DataTable
                                        table={{ columns, rows }}
                                        isSorted={false}
                                        entriesPerPage={false}
                                        showTotalEntries={false}
                                        noEndBorder
                                    />
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid> 
                </MDBox> 
                </>
    )
}

export default OverallGrid;