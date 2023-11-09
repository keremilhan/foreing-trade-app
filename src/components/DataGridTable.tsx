import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridAlignment, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Table, TableRow } from '@mui/material';
import { useState } from 'react';

export const DataGridTable: React.FC<{
    data: any;
    disableColumnMenu?: boolean;
    checkboxSelection?: boolean;
    handleSelectionChange?: (params: any) => void;
    // setSelectedRows?: (param: any) => void;
}> = ({ data, disableColumnMenu, checkboxSelection, handleSelectionChange }) => {
    const rows = data.map((obj: any, index: number) => {
        return { ...obj, id: index };
    });

    const formFields = [
        { name: 'exporter', label: 'İhracatçı Firma ismi' },
        { name: 'exporter_country', label: 'İhracatçı Ülke' },
        { name: 'importer', label: 'İthalatçı Firma ismi' },
        { name: 'importer_country', label: 'İthalatçı Ülke' },
        { name: 'authourity_person', label: 'Ad Soyad' },
        { name: 'contact_mail', label: 'E-mail' },
        { name: 'contact_number', label: 'Telefon' },
        { name: 'address', label: 'Adres' },
        { name: 'product_name', label: 'Ürün ismi' },
        { name: 'hs_code', label: 'GTİP No' },
        { name: 'price', label: 'Fiyat' },
    ];

    const columns = formFields.map((obj: any) => {
        return {
            align: 'center' as GridAlignment,
            headerAlign: 'center' as GridAlignment,
            field: obj.name,
            headerName: obj.label,
            width: 150,
            hide: obj.name !== 'id' ? false : true,
            flex: obj.name === 'contact_number' ? 0 : 1,
            disableColumnMenu: disableColumnMenu,
            renderCell: (params: any) => {
                const fieldName = obj.name;
                console.log(params, 'params');
                if (fieldName === 'product_name' || fieldName === 'hs_code' || fieldName === 'price') {
                    const subRows = params.row.products?.map((obj: any, index: number) => {
                        return (
                            <TableRow
                                style={{
                                    borderBottom:
                                        params.row.products.length === 1 || index + 1 === params.row.products.length
                                            ? 0
                                            : 'thin solid lightgrey',
                                    textAlign: 'center',
                                }}
                            >
                                {obj[`${fieldName}`]}
                            </TableRow>
                        );
                    });
                    return <Table>{subRows}</Table>;
                }
            },
        };
    });

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <DataGrid
                sx={{
                    '& .MuiDataGrid-cell:focus, .MuiDataGrid-columnHeader:focus, .MuiDataGrid-columnHeader:focus-within':
                        {
                            outline: 'none !important',
                        },
                    whiteSpace: 'nowrap',
                    borderColor: 'black',
                    '& .MuiDataGrid-cell': {
                        borderWidth: 1,
                        borderColor: 'black',
                        padding: 0,
                    },
                    '& .MuiDataGrid-columnHeader': {
                        borderWidth: 1,
                        borderColor: 'gray',
                        // justifySelf: 'center',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        borderWidth: 1,
                        borderColor: 'black',
                        padding: 0,
                    },
                }}
                rows={rows}
                columns={columns}
                checkboxSelection={checkboxSelection}
                disableRowSelectionOnClick
                getRowHeight={() => 'auto'}
                pageSizeOptions={[10, 25, 50, 100]}
                initialState={{
                    ...data.initialState,
                    pagination: { paginationModel: { pageSize: 25 } },
                }}
                onRowSelectionModelChange={handleSelectionChange}
                // autoPageSize
            />
        </Box>
    );
};
