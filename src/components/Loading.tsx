import { Box, Spinner } from '@chakra-ui/react';

interface LoadingProps {
  fullPage?: boolean;
  size?: string;
}

const Loading = ({ fullPage = true, size = 'xl' }: LoadingProps) => {
  const spinner = (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size={size}
    />
  );

  if (fullPage) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
        bg="white"
        _dark={{ bg: 'gray.900' }}
      >
        {spinner}
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" p={8}>
      {spinner}
    </Box>
  );
};

export default Loading;
