export interface Customer {
    id: string;
    importer: string;
    importer_country: string;
    exporter: string;
    exporter_country: string;
    authority_person: string;
    contact_mail: string;
    contact_number: number;
    address: string;
    products: Product[];
}

export interface Product {
    product_name: string;
    hs_code: string;
    price: string;
}
