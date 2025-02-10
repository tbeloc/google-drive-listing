import { useState } from 'react'
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress
} from '@mui/material'
import { useQuery } from 'react-query'
import axios from 'axios'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const { data: driveData, isLoading, error } = useQuery(
    'driveData',
    async () => {
      const response = await axios.get('http://localhost:3000/api/drive-data')
      return response.data
    },
    {
      enabled: isAuthenticated,
    }
  )

  const handleAuth = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth-url')
      window.location.href = response.data.url
    } catch (error) {
      console.error('Erreur d\'authentification:', error)
    }
  }

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
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">
            Erreur lors du chargement des données: {error.message}
          </Typography>
        ) : (
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
                {driveData?.map((item, index) => (
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
        )}
      </Box>
    </Container>
  )
}

export default App
