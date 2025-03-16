import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import logo from "../assets/logo.png";
import Games from "./Games";

function ResponsiveAppBar({ setGridSize }) {
    const [open, setOpen] = React.useState(false);
    const [gamesOpen, setGamesOpen] = React.useState(false);
    const [level, setLevel] = React.useState(3);

    const handleClose = () => setOpen(false);

    return (
        <AppBar position="static" sx={{ backgroundColor: '#2054ff', boxShadow: 'none' }}>
            <Games setGamesOpen={setGamesOpen} gamesOpen={gamesOpen} />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Set Level</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <InputLabel>Level</InputLabel>
                        <Select value={level} onChange={(e) => setLevel(e.target.value)} label="Level">
                            <MenuItem value={2}>Level 1 - 2x2</MenuItem>
                            <MenuItem value={3}>Level 2 - 3x3</MenuItem>
                            <MenuItem value={4}>Level 3 - 4x4</MenuItem>
                            <MenuItem value={5}>Level 4 - 5x5</MenuItem>
                            <MenuItem value={6}>Level 5 - 6x6</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => { setGridSize(level); handleClose(); }}>Confirm</Button>
                </DialogActions>
            </Dialog>

            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                        <Box
                            component="img"
                            src={logo}
                            alt="logo"
                            sx={{
                                height: { xs: 30, md: 40 },
                                width: 'auto',
                                maxWidth: '100%',
                                objectFit: 'contain'
                            }}
                        />
                        <Typography 
                            variant="h6" 
                            noWrap 
                            component="a" 
                            href="/" 
                            sx={{
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: { xs: '.1rem', md: '.2rem' },
                                color: '#FFFFFF',
                                textDecoration: 'none',
                                fontSize: { xs: '0.75rem', md: '1.25rem' } 
                            }}
                        >
                            MATHMOSAIC
                        </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                            onClick={() => setOpen(true)} 
                            sx={{ color: '#FFFFFF', fontWeight: 600, textTransform: 'none', fontSize: { xs: '0.6rem', md: '1rem' } }}
                        >
                            Set Level
                        </Button>
                        <Button 
                            onClick={() => setGamesOpen(true)} 
                            sx={{ color: '#FFFFFF', fontWeight: 600, textTransform: 'none', fontSize: { xs: '0.6rem', md: '1rem' } }}
                        >
                            History
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;
