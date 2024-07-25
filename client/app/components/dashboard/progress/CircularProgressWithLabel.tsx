import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

interface CircularProgressWithLabelProps {
  value: number;
  variant?: 'determinate' | 'indeterminate';
  color?: string;
}

const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = (props) => {
  const { value, variant = 'determinate', color, ...otherProps } = props;

  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        variant={variant}
        value={value}
        style={{ color }}
        {...otherProps}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularProgressWithLabel;
