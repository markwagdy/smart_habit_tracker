import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import { getHabits, addHabit, addLog } from '../apis/habits';
import Heatmap from 'react-calendar-heatmap';
import { useSnackbar } from 'notistack';
import { useAuth } from '../contexts/AuthContext';




function DashboardPage({ darkMode, setDarkMode }) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    tag: '',
    progressStatus: 'Not Started'
  });
  const { enqueueSnackbar } = useSnackbar();
  const [heatmapModalOpen, setHeatmapModalOpen] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [selectedHabitName, setSelectedHabitName] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  const { logout } = useAuth();


  useEffect(() => {
    fetchHabits();
  }, []);


  const handleViewHeatmap = (habit) => {
    console.log('Selected Habit:', habit?.logs[0]?.date);
    const logs = habit.logs?.map(log => ({ date: new Date(log.date) })) || [];
    setSelectedLogs(logs);
    setSelectedHabitName(habit.name);
    setHeatmapModalOpen(true);
  };
  const handleLogout = () => {
    logout();
  }



  const fetchHabits = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getHabits();
      if (Array.isArray(response)) {
        setHabits(response);
      } else {
        setHabits([]);
        setError('No habits found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setError(null);
    setSuccessMessage('');
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewHabit({
      name: '',
      description: '',
      tag: '',
      progressStatus: 'Not Started'
    });
    setError(null);
    setSuccessMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHabit(prev => ({ ...prev, [name]: value }));
  };

  const handleMarkAsDone = async (habitId) => {
    try {
      const result = await addLog(habitId);
      enqueueSnackbar(result.detail || 'Marked as done!', { variant: 'success' });
      await fetchHabits();
    } catch (err) {
      const backendMessage =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        err.message;
      enqueueSnackbar(backendMessage || 'Failed to mark as done', {
        variant: 'error',
        autoHideDuration: 3000,
      });
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    if (!newHabit.name.trim() || !newHabit.tag) {
      setError('Habit name and tag are required');
      return;
    }

    try {
      const response = await addHabit(newHabit);
      if (!response) throw new Error('Failed to create habit');

      setSuccessMessage('Habit created successfully!');
      await fetchHabits();
      handleCloseModal();
    } catch (err) {
      const backendMessage =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.name?.[0] ||
        err.response?.data?.tag?.[0] ||
        err.message;

      setError(backendMessage || 'Failed to create habit');
      enqueueSnackbar(backendMessage || 'Failed to create habit', {
        variant: 'error',
        autoHideDuration: 3000,
      });
    }
  };

  const filteredHabits = selectedTag === 'All' ? habits : habits.filter(habit => habit.tag === selectedTag);

  if (loading && habits.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(120deg, #5b2fcb, #2575fc)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={80} thickness={4} sx={{ color: '#fff' }} />
      </Box>
    );
  }

  if (error && habits.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(120deg, #5b2fcb, #2575fc)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', textAlign: 'center', p: 3 }}>
        <Box>
          <Typography variant="h5">Error loading habits: {error}</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={fetchHabits}>Retry</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh', width: '100vw', background: darkMode ? '#121212' : 'linear-gradient(120deg, #4a17ca, #689cf7)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: 8, px: 3, color: darkMode ? '#f0f0f0' : '#222',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
          sx={{ fontWeight: 600 }}
        >
          Logout
        </Button>
      </Box>
      <Container
        maxWidth="md"
        sx={{
          backgroundColor: darkMode ? '#1e1e1e' : '#fff',
          borderRadius: 4,
          boxShadow: '0 20px 35px rgba(0,0,0,0.15)',
          padding: 5,
          maxHeight: '90vh',
          overflowY: 'scroll',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >


        <Button
          variant="outlined"
          size="small"
          sx={{ color: darkMode ? '#fff' : '#2575fc', borderColor: darkMode ? '#fff' : '#2575fc' }}
          onClick={() => setDarkMode(prev => !prev)}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>


        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ letterSpacing: '0.05em', color: darkMode ? '#f0f0f0' : '#222' }}>Welcome to Smart Habit Tracker</Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>}


        {habits.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, border: '2px dashed #ccc', borderRadius: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>No habits created yet</Typography>
            <Button variant="contained" size="large" onClick={handleOpenModal} sx={{ backgroundColor: '#2575fc', '&:hover': { backgroundColor: '#185bcc' } }}>
              Create Your First Habit
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#555' }}>Your Habits</Typography>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Filter by Tag</InputLabel>
                <Select
                  value={selectedTag}
                  label="Filter by Tag"
                  onChange={(e) => setSelectedTag(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Health">Health</MenuItem>
                  <MenuItem value="Productivity">Productivity</MenuItem>
                  <MenuItem value="Self-Care">Self-Care</MenuItem>
                  <MenuItem value="Fitness">Fitness</MenuItem>
                  <MenuItem value="Learning">Learning</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Grid container spacing={4}>
              {filteredHabits.map((habit) => (
                <Grid item xs={12} sm={6} md={4} key={habit.id}>
                  <Paper elevation={8} sx={{
                    p: 4, borderRadius: 4, transition: 'all 0.3s ease', cursor: 'default', '&:hover': {
                      transform: 'translateY(-8px)', boxShadow: darkMode ? '0 30px 50px rgba(255, 255, 255, 0.1)' : '0 30px 50px rgba(37, 117, 252, 0.35)'
                      , backgroundColor: darkMode ? '#2c2c2c' : '#fff',
                    }
                  }}>
                    <Typography variant="h6" fontWeight={800} gutterBottom sx={{ color: darkMode ? 'white' : '#0d1b2a' }}>{habit.name}</Typography>
                    <Typography sx={{ mb: 1, fontSize: '0.95rem', color: darkMode ? 'white' : '#333' }}>{habit.description}</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '0.85rem' }}>Tag: {habit.tag}</Typography>
                    <Typography sx={{ fontSize: '0.85rem', mt: 1 }} color="success.main">
                      Streak: {habit.streak} days
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleMarkAsDone(habit.id)}
                      disabled={habit.last_completed === new Date().toISOString().split('T')[0]}
                      sx={{
                        mt: 2, backgroundColor: darkMode ? '#66bb6a' : '#4caf50',
                        '&:hover': {
                          backgroundColor: darkMode ? '#43a047' : '#388e3c',
                        },
                      }}
                    >
                      Mark as Done Today
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewHeatmap(habit)}
                      sx={{ mt: 1, ml: 1, borderColor: '#2575fc', color: '#2575fc', '&:hover': { borderColor: '#185bcc', color: '#185bcc' } }}
                    >
                      View Heatmap
                    </Button>




                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button variant="outlined" size="large" onClick={handleOpenModal} sx={{ borderColor: '#2575fc', color: '#2575fc', '&:hover': { borderColor: '#185bcc' } }}>
                Add New Habit
              </Button>
            </Box>
          </>
        )}

        <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Habit</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} id="habit-form" sx={{ mt: 2 }}>
              <TextField fullWidth margin="normal" label="Habit Name" name="name" value={newHabit.name} onChange={handleInputChange} required />
              <TextField fullWidth margin="normal" label="Description" name="description" value={newHabit.description} onChange={handleInputChange} multiline rows={3} />
              <FormControl fullWidth margin="normal">
                <InputLabel>Tag *</InputLabel>
                <Select name="tag" value={newHabit.tag} onChange={handleInputChange} label="Tag *" required>
                  <MenuItem value="Health">Health</MenuItem>
                  <MenuItem value="Productivity">Productivity</MenuItem>
                  <MenuItem value="Self-Care">Self-Care</MenuItem>
                  <MenuItem value="Fitness">Fitness</MenuItem>
                  <MenuItem value="Learning">Learning</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" form="habit-form" variant="contained" disabled={!newHabit.name || !newHabit.tag} sx={{ backgroundColor: '#2575fc', '&:hover': { backgroundColor: '#185bcc' } }}>
              Create Habit
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={heatmapModalOpen} onClose={() => setHeatmapModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Activity Heatmap - {selectedHabitName}</DialogTitle>
          <DialogContent>
            <Box sx={{ my: 3 }}>
              <Heatmap
                startDate={new Date('2024-01-01')}
                endDate={new Date()}
                values={selectedLogs}
                classForValue={(value) => {
                  if (!value || !value.date) return 'color-empty';
                  return 'color-filled';
                }}
                showMonthLabels
              />

            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setHeatmapModalOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

      </Container>

    </Box>
  );
}

export default DashboardPage;