import { useState } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { driveService } from './services/driveService';
import { useDriveData } from './hooks/useDriveData';
import FileTable from './components/FileTable';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { data: driveData, isLoading, error } = useDriveData(isAuthenticated);

    const handleAuth = async () => {
        try {
            const { url } = await driveService.getAuthUrl();
            window.location.href = url;
        } catch (error) {
            console.error('Erreur d\'authentification:', error);
        }
    };

    const handleExport = async () => {
        try {
            const blob = await driveService.exportToCsv();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'drive_listing.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Google Drive Listing
                </Typography>

                {!isAuthenticated ? (
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleAuth}
                    >
                        Se connecter avec Google
                    </Button>
                ) : isLoading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <ErrorMessage message={error.message} />
                ) : (
                    <>
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            onClick={handleExport}
                            sx={{ mb: 2 }}
                        >
                            Exporter en CSV
                        </Button>
                        <FileTable data={driveData} />
                    </>
                )}
            </Box>
        </Container>
    );
}

export default App;
