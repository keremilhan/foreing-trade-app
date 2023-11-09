import React from 'react';
import TextField from '@mui/material/TextField';

const DynamicTextField: React.FC<{
    name: string;
    label: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    helperText: string;
    disabled?: boolean;
}> = ({ name, label, value, onChange, onBlur, helperText, disabled }) => {
    return (
        <TextField
            sx={{ mb: 2 }}
            fullWidth
            id={name}
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            helperText={helperText}
            disabled={disabled}
        />
    );
};

export default DynamicTextField;
