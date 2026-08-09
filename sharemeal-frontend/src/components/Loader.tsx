import { Box, CircularProgress, Typography } from '@mui/material';
import './Loader.css';

interface LoaderProps {
  label?: string;
  fullHeight?: boolean;
}

function Loader({ label = 'Loading…', fullHeight = true }: LoaderProps) {
  return (
    <Box className={fullHeight ? 'loader-container loader-container--full' : 'loader-container'}>
      <CircularProgress color="primary" size={40} thickness={4} />
      {label && (
        <Typography variant="body2" className="loader-label">
          {label}
        </Typography>
      )}
    </Box>
  );
}

export default Loader;
