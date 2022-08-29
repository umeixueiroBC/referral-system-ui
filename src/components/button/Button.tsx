import * as React from 'react';
import { Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import './button.scss';

export default function CreateButton() {
  return (
    <Stack spacing={2} direction="row">
      <div className='apex-button'>
        <a href="/create">
          <Button type='submit' variant="contained" endIcon={<AddIcon />}>
            Create Referral
          </Button>
        </a>
      </div>
    </Stack>
  );
}
