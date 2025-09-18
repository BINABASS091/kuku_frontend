import React, { useState, useEffect, useRef } from 'react';
import { Box, Skeleton } from '@chakra-ui/react';
import { ResponsiveContainer } from 'recharts';

interface SafeChartContainerProps {
  children: React.ReactElement;
  minHeight?: number;
  height?: string | number;
  fallbackHeight?: number;
}

const SafeChartContainer: React.FC<SafeChartContainerProps> = ({ 
  children, 
  minHeight = 300, 
  height = "100%",
  fallbackHeight = 300
}) => {
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkDimensions = () => {
      if (containerRef.current) {
        const { width, height: containerHeight } = containerRef.current.getBoundingClientRect();
        if (width > 0 && containerHeight > 0) {
          setIsReady(true);
        }
      }
    };

    // Check immediately
    checkDimensions();

    // Set up a timeout as fallback
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    // Clean up
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box 
      ref={containerRef}
      h={height} 
      minH={minHeight}
      w="100%"
    >
      {isReady ? (
        <ResponsiveContainer width="100%" height="100%" minHeight={minHeight}>
          {children}
        </ResponsiveContainer>
      ) : (
        <Skeleton height={fallbackHeight} width="100%" borderRadius="md" />
      )}
    </Box>
  );
};

export default SafeChartContainer;
