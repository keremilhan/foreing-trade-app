import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Customer } from '../../types/common';
import { act } from '@testing-library/react';

interface customers {
    value: Customer[];
}

const initialState: customers = {
    value: [],
};

export const customersSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        setCustomers: (state, action: PayloadAction<Customer[]>) => {
            state.value = [...action.payload];
        },
    },
});

export const { setCustomers } = customersSlice.actions;
export const selectCustomers = (state: RootState) => state.customers.value;

export default customersSlice.reducer;
