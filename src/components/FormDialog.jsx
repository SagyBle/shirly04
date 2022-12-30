import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import './styles/GetARoom.css'


export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button className="create-room-button" onClick={handleClickOpen}>
        צור חדר חדש +
      </Button>
      <Dialog open={open} onClose={handleClose}>
        
        <DialogTitle>יצירת חדר חדש</DialogTitle>
        <DialogContent>
          

          <TextField
            autoFocus
            margin="dense"
            
            id="room-name"
            label="שם החדר"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="room-description"
            label="תיאור החדר"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="room-capacity"
            label="כמות המשתתפים"
            type="number"
            min="1"
            max="50"
            fullWidth
            variant="standard"
            className='textfield'
          />
        </DialogContent>
        <DialogActions>
          <Button   
          sx={{
            width: '100px',
            color: 'success.main',
            font: "ariel",
            
          }}
          onClick={handleClose}>חזור</Button>
          <Button className='create-room-button' onClick={handleClose}>צור חדר</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}