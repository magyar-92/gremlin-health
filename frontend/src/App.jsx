import { Container, AppBar, Toolbar, Typography, Grid, Card, CardContent, Box } from '@mui/material'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Activities from './components/Activities'

export default function App() {
  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🏃 Gremlin Health
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Dashboard />
        <Activities />
      </Container>
    </Box>
  )
}
