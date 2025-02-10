import React from 'react';
import { Typography } from '@mui/material';

const ErrorMessage = ({ message }) => (
    <Typography color="error" sx={{ my: 2 }}>
        Erreur: {message}
    </Typography>
);

export default ErrorMessage;
