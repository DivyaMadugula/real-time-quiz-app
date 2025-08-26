import { styled } from '@mui/material/styles';
import { Box, Button, Card, CardContent } from '@mui/material';

export const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 345,
  textAlign: 'center',
  boxShadow: '0px 5px 15px rgba(0,0,0,0.2)',
  borderRadius: '15px',
}));

export const FormContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  padding: '10px 0',
  fontSize: '1rem',
}));