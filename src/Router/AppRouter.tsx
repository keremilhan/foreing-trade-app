import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import CustomersTable from '../pages/CustomersTable';
import About from '../pages/About';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
import NewCustomerModule from '../pages/NewCustomerModule';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navbar />}>
                    <Route index element={<NewCustomerModule />} />
                    <Route path="customers" element={<CustomersTable />} />
                    <Route path="hakkimizda" element={<About />} />
                    <Route path="iletisim" element={<Contact />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
