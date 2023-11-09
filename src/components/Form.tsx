import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Accordion, AccordionDetails, AccordionSummary, IconButton, Input, Modal } from '@mui/material';
import DynamicTextField from './DynamicTextField';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { useRef, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DropzoneArea, DropzoneAreaBase, FileObject } from 'material-ui-dropzone';
import * as XLSX from 'xlsx';
import { DataGridTable } from './DataGridTable';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectCustomers, setCustomers } from '../redux/slices/customers';
import { v4 as uuidv4 } from 'uuid';

const defaultTheme = createTheme();

const formFields = [
    { name: 'exporter', label: 'İhracatçı Firma ismi' },
    { name: 'exporter_country', label: 'İhracatçı Ülke' },
    { name: 'importer', label: 'İthalatçı Firma ismi' },
    { name: 'importer_country', label: 'İthalatçı Ülke' },
    { name: 'authourity_person', label: 'Yetkili Ad Soyad' },
    { name: 'contact_mail', label: 'Yetkili E-mail' },
    { name: 'contact_number', label: 'Yetkili Telefon' },
    { name: 'address', label: 'Adres' },
];
let productFields = [
    { name: 'product_name', label: 'Ürün ismi' },
    { name: 'hs_code', label: 'GTİP No' },
    { name: 'price', label: 'Fiyat' },
];
const initialFormFields = {
    importer: '',
    importer_country: '',
    exporter: '',
    exporter_country: '',
    authority_person: '',
    contact_mail: '',
    contact_number: 0,
    address: '',
};
const initialProductsData = [
    {
        product_1: {
            product_name: '',
            hs_code: '',
            price: '',
        },
    },
];

interface FormFields {
    importer: string;
    importer_country: string;
    exporter: string;
    exporter_country: string;
    authority_person: string;
    contact_mail: string;
    contact_number: number;
    address: string;
    [key: string]: string | number;
}
const Form = () => {
    const customers = useAppSelector(selectCustomers);
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<FormFields>(initialFormFields);
    const [productData, setProductData] = useState<any>({
        product_name: '',
        hs_code: '',
        price: '',
    });
    const [products, setProducts] = useState<any[]>([]);
    const [tempCustomers, setTempCustomers] = useState<any>([]);
    // const [customers, setCustomers] = useState<any>();
    const [headers, setHeaders] = useState<any>();
    const [files, setFiles] = useState<any[]>([]);
    const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    const handleProductDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProductData((prevproductData: any) => ({
            ...prevproductData,
            [name]: value,
        }));
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // Perform any validation or additional logic onBlur if needed
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here with the formData state
        console.log('products', products);
        console.log('formData', formData);
    };

    const handleProductAdd = () => {
        const newProduct = {
            ...productData,
        };

        setProducts((prevProducts: any) => [...prevProducts, newProduct]);
        setProductData({
            product_name: '',
            hs_code: '',
            price: '',
        });
    };

    const handleFileUpload = async (files: File[]) => {
        if (files.length === 0) {
            return;
        }
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' }); // or use ExcelJS to load the workbook

            const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // assuming the data is in the first sheet

            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // convert sheet to JSON
            console.log('jsonData', jsonData);

            const excelData = jsonData;

            const headers: any = excelData[0];
            const customerData = excelData.slice(1).map((row: any) => {
                const customer: any = {};
                customer.products = [];

                headers.forEach((header: any, index: any) => {
                    if (header === 'product_name' || header === 'hs_code' || header === 'price') {
                        if (header === 'product_name') {
                            const productNames = row[index]
                                ? row[index].split(',').map((product: any) => product.trim())
                                : [];
                            const hsCodes = row[headers.indexOf('hs_code')]
                                ? row[headers.indexOf('hs_code')].split(',').map((hsCode: any) => hsCode.trim())
                                : [];
                            const prices = row[headers.indexOf('price')]
                                ? row[headers.indexOf('price')].split(',').map((price: any) => price.trim())
                                : [];

                            for (let i = 0; i < productNames.length; i++) {
                                const productName = productNames[i] || '';
                                const hsCode = hsCodes[i] || '';
                                const price = prices[i] || '';

                                const productInfo: any = {};
                                productInfo.product_name = productName;
                                productInfo.hs_code = hsCode;
                                productInfo.price = price;
                                customer.products.push(productInfo);
                            }
                        }
                    } else {
                        const value = row[index] || '';
                        customer[header] = value;
                    }
                });

                return customer;
            });

            setTempCustomers(customerData.map((obj: any) => ({ ...obj, id: uuidv4() })));
            setOpen(true);
            setHeaders(headers);
        };

        reader.readAsArrayBuffer(file);
    };

    console.log(tempCustomers, 'tempCustomers');

    const handleApproveExcelDataToState = () => {
        dispatch(setCustomers(tempCustomers));
        setTempCustomers([]);
        setOpen(false);
        setFiles([]);
    };
    const handleDeclineExcelDataToState = () => {
        setTempCustomers([]);
        setOpen(false);
        setFiles([]);
    };
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        height: '90%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    console.log('customers', customers);
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    // const isLastProductEmpty = Object.values(productData[productData?.length - 1]).some((field) => field === '');
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main">
                <CssBaseline />
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <DataGridTable disableColumnMenu data={tempCustomers} />
                        <Button
                            onClick={handleApproveExcelDataToState}
                            // fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, width: '200px' }}
                        >
                            Exceli kaydet
                        </Button>
                        <Button
                            onClick={handleDeclineExcelDataToState}
                            // fullWidth
                            color="error"
                            variant="contained"
                            sx={{ mt: 3, mb: 2, ml: 2, width: '200px' }}
                        >
                            Vazgeç
                        </Button>
                    </Box>
                </Modal>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <IconButton size="small" aria-label="logo">
                        <img width={450} src="./assets/udb_logo.jpg" alt="logo" />
                    </IconButton>
                    <Typography component="h1" variant="h5">
                        UDB Müşteri Kayıt Modülü
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Typography component="h4" variant="h5" mb={2}>
                            Müşteri Bilgileri
                        </Typography>
                        {formFields.map((field, index) => (
                            <DynamicTextField
                                key={index}
                                name={field.name}
                                label={field.label}
                                value={formData[field.name] || ''}
                                onChange={handleFormDataChange}
                                onBlur={handleBlur}
                                helperText=""
                            />
                        ))}
                        <Typography component="h4" variant="h5" mb={2} mt={4}>
                            Ürün Bilgileri
                        </Typography>
                        {products.map((product: any, index) => {
                            return (
                                <Accordion
                                    key={index}
                                    sx={{
                                        backgroundColor: 'yellow',
                                        marginBottom: '10px',
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography>{product.product_name}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Box width={'100%'} sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <Typography fontWeight={600} component="p">
                                                GTİP:
                                            </Typography>
                                            <Typography>{product.hs_code}</Typography>
                                        </Box>
                                        <Box width={'100%'} sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <Typography fontWeight={600} component="p">
                                                Fiyat:
                                            </Typography>
                                            <Typography>{product.price}</Typography>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                                // <div>
                                //     {product.product_name}
                                //     {product.hs_code}
                                //     {product.price}
                                // </div>
                            );
                        })}
                        {productFields.map((field, index) => (
                            <DynamicTextField
                                key={index}
                                name={field.name}
                                label={field.label}
                                value={productData[field.name]}
                                onChange={handleProductDataChange}
                                onBlur={handleBlur}
                                helperText=""
                            />
                        ))}
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            color="success"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleProductAdd}
                        >
                            Ürün ekle
                        </Button>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Kaydet
                        </Button>
                        {/* <Input color="primary" about=".xlsx, .xsl" fullWidth type="file" onChange={handleFileUpload} /> */}
                        <DropzoneAreaBase
                            fileObjects={files}
                            acceptedFiles={['.xlsx', '.xls']}
                            dropzoneText="Excel dosyası yüklemek için tıklayın veya dosyayı sürükleyin"
                            // onAdd={handleFileUpload}
                            onDrop={handleFileUpload}
                            filesLimit={1}
                            showAlerts={false}
                        />
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Form;
