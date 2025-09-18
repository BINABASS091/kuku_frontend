import React from 'react';
import { Box } from '@chakra-ui/react';
import { ResponsiveContainer } from 'recharts';

interface ChartContainerProps {
  children: React.ReactElement;
  minHeight?: number;
  height?: string | number;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ 
  children, 
  minHeight = 300, 
  height = "100%" 
}) => {
  return (
    <Box h={height} minH={minHeight}>
      <ResponsiveContainer width="100%" height="100%" minHeight={minHeight}>
        {children}
      </ResponsiveContainer>
    </Box>
  );
};

export default ChartContainer;
