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
  const [dimensions, setDimensions] = useState<{width: number, height: number} | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkDimensions = () => {
      if (containerRef.current) {
        const { width, height: containerHeight } = containerRef.current.getBoundingClientRect();
        if (width > 0 && containerHeight > 0) {
          setDimensions({ width, height: containerHeight });
        }
      }
    };

    // Check immediately
    const timer = setTimeout(() => {
      checkDimensions();
    }, 50);

    // Set up a longer fallback
    const fallbackTimer = setTimeout(() => {
      setDimensions({ width: 400, height: fallbackHeight });
    }, 200);

    // Also check on window resize
    const handleResize = () => {
      checkDimensions();
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [fallbackHeight]);

  // Clone the child and add explicit width/height props
  const childWithDimensions = dimensions ? React.cloneElement(children, {
    width: Math.max(dimensions.width - 20, 200),
    height: Math.max(dimensions.height - 20, 200),
    ...children.props
  }) : null;

  return (
    <Box 
      ref={containerRef}
      h={height} 
      minH={minHeight}
      w="100%"
      position="relative"
    >
      {dimensions && childWithDimensions ? (
        <ResponsiveContainer width="100%" height="100%" minHeight={minHeight}>
          {childWithDimensions}
        </ResponsiveContainer>
      ) : (
        <Skeleton height={fallbackHeight} width="100%" borderRadius="md" />
      )}
    </Box>
  );
};

export default SafeChartContainer;
