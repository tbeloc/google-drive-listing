import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';

const FileTable = ({ data }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Chemin</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Propriétaire</TableCell>
                        <TableCell>Permissions</TableCell>
                        <TableCell>Partage Externe</TableCell>
                        <TableCell>Dernière Modification</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.path}</TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>{item.owner}</TableCell>
                            <TableCell>{item.permissions}</TableCell>
                            <TableCell>{item.external_sharing}</TableCell>
                            <TableCell>{item.last_modified}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default FileTable;
