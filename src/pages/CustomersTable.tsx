import React, { useState } from 'react';
import Form from '../components/Form';
import { DataGridTable } from '../components/DataGridTable';
import { useAppSelector } from '../redux/hooks';
import { selectCustomers } from '../redux/slices/customers';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Box, Button } from '@mui/material';
import { utils, writeFile } from 'xlsx';

const CustomersTable = () => {
    const customers = useAppSelector(selectCustomers);
    const [selectedRows, setSelectedRows] = useState([]);

    const handleSelectionChange = (selection: any) => {
        setSelectedRows(selection.map((index: any) => customers[index].id));
    };

    const exportSelectedRows = (selectedRows: any) => {
        // Convert the selected rows data to Excel format
        const rows = selectedRows.map((rowId: any) => {
            const rowData = customers.find((row: any) => row.id === rowId);
            return rowData;
        });

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const watermark = XLSX.utils.format_cell({ t: 's', v: 'Watermark Text' });
        worksheet['!background'] = [watermark];
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Selected Rows');

        // Generate the Excel file and save it
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(data, 'selected_rows.xlsx');
    };

    // function exportSelectedRows(selectedRows: any, data: any) {
    //     const rows: any = [];

    //     selectedRows.forEach((selectedIndex: any) => {
    //         const rowData = data[selectedIndex];

    //         if (rowData.products) {
    //             rowData.products.forEach((product: any) => {
    //                 const productNames = product.product_name.split(',');
    //                 const hsCodes = product.hs_code.split(',');
    //                 const prices = product.price.split(',');

    //                 for (let i = 0; i < productNames.length; i++) {
    //                     const productRow = {
    //                         exporter: rowData.exporter,
    //                         exporter_country: rowData.exporter_country,
    //                         importer: rowData.importer,
    //                         importer_country: rowData.importer_country,
    //                         authority_person: rowData.authority_person,
    //                         contact_mail: rowData.contact_mail,
    //                         contact_number: rowData.contact_number,
    //                         address: rowData.address,
    //                         product_name: productNames[i] || '',
    //                         hs_code: hsCodes[i] || '',
    //                         price: prices[i] || '',
    //                     };

    //                     rows.push(productRow);
    //                 }
    //             });
    //         }
    //     });

    //     const worksheet = utils.json_to_sheet(rows);
    //     const workbook = utils.book_new();
    //     utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
    //     const excelBuffer = writeFile(workbook, 'selected_rows.xlsx', { type: 'buffer' });

    //     saveAs(new Blob([excelBuffer]), 'selected_rows.xlsx');
    // }

    const handleExport = () => {
        exportSelectedRows(selectedRows);
    };

    console.log('selectedRows 37', selectedRows);

    return (
        <Box>
            {customers.length > 0 ? (
                <DataGridTable checkboxSelection handleSelectionChange={handleSelectionChange} data={customers} />
            ) : (
                <div>No Data</div>
            )}

            <Button
                onClick={handleExport}
                // fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, width: '200px' }}
            >
                Exceli kaydet
            </Button>
        </Box>
    );
};

export default CustomersTable;
