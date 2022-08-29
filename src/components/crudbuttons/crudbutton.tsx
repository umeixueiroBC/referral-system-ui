import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteOutlinedIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/Edit';
import SaveOutlinedIcon from '@mui/icons-material/Save';

export default function CrudButton() {
  return (
    <Box sx={{ '& button': { m: 1 } }}>
      <div>
        <IconButton color="primary" component="span">
          <EditOutlinedIcon />
        </IconButton>
        {/* <IconButton color="primary" component="span">
          <SaveOutlinedIcon />
        </IconButton> */}
        <IconButton color="primary" component="span">
          <DeleteOutlinedIcon />
        </IconButton>
      </div>
    </Box>
  );
}
