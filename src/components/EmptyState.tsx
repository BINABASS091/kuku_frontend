import {
  Box,
  VStack,
  Text,
  Icon,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  ViewIcon, 
  AddIcon, 
  SearchIcon,
  InfoIcon,
  CheckCircleIcon,
} from '@chakra-ui/icons';

interface EmptyStateProps {
  icon?: any;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'info' | 'warning' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export default function EmptyState({
  icon = ViewIcon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  size = 'md',
}: EmptyStateProps) {
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const titleColor = useColorModeValue('gray.800', 'white');

  const getVariantStyles = () => {
    switch (variant) {
      case 'info':
        return {
          iconColor: 'blue.500',
          bg: useColorModeValue('blue.50', 'blue.900'),
          borderColor: useColorModeValue('blue.200', 'blue.700'),
        };
      case 'warning':
        return {
          iconColor: 'orange.500',
          bg: useColorModeValue('orange.50', 'orange.900'),
          borderColor: useColorModeValue('orange.200', 'orange.700'),
        };
      case 'success':
        return {
          iconColor: 'green.500',
          bg: useColorModeValue('green.50', 'green.900'),
          borderColor: useColorModeValue('green.200', 'green.700'),
        };
      default:
        return {
          iconColor: 'gray.500',
          bg: useColorModeValue('gray.50', 'gray.700'),
          borderColor: useColorModeValue('gray.200', 'gray.600'),
        };
    }
  };

  const variantStyles = getVariantStyles();

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: 4,
          iconSize: '24px',
          titleSize: 'sm',
          descriptionSize: 'xs',
        };
      case 'lg':
        return {
          padding: 8,
          iconSize: '48px',
          titleSize: 'lg',
          descriptionSize: 'md',
        };
      default:
        return {
          padding: 6,
          iconSize: '32px',
          titleSize: 'md',
          descriptionSize: 'sm',
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Box
      p={sizeStyles.padding}
      bg={variantStyles.bg}
      border="1px solid"
      borderColor={variantStyles.borderColor}
      borderRadius="lg"
      textAlign="center"
    >
      <VStack spacing={3}>
        <Icon
          as={icon}
          w={sizeStyles.iconSize}
          h={sizeStyles.iconSize}
          color={variantStyles.iconColor}
        />
        <VStack spacing={1}>
          <Text
            fontSize={sizeStyles.titleSize}
            fontWeight="semibold"
            color={titleColor}
          >
            {title}
          </Text>
          {description && (
            <Text
              fontSize={sizeStyles.descriptionSize}
              color={textColor}
              maxW="300px"
            >
              {description}
            </Text>
          )}
        </VStack>
        {actionLabel && onAction && (
          <Button
            size="sm"
            colorScheme="blue"
            variant="outline"
            leftIcon={<AddIcon />}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </VStack>
    </Box>
  );
}

// Predefined empty state components for common scenarios
export const EmptyDataState = ({ title = "No Data Available", description = "There's no data to display at the moment." }: { title?: string; description?: string }) => (
  <EmptyState
    icon={SearchIcon}
    title={title}
    description={description}
    variant="info"
  />
);

export const EmptyActivitiesState = () => (
  <EmptyState
    icon={ViewIcon}
    title="No Recent Activity"
    description="No recent activities to display. Activities will appear here as they happen."
    variant="info"
  />
);

export const EmptyAlertsState = () => (
  <EmptyState
    icon={CheckCircleIcon}
    title="All Systems Normal"
    description="No system alerts at this time. Everything is running smoothly."
    variant="success"
  />
);

export const EmptyFarmsState = () => (
  <EmptyState
    icon={ViewIcon}
    title="No Farms Found"
    description="No farms are currently registered in the system."
    actionLabel="Add Farm"
    variant="info"
  />
);

export const EmptyStatsState = ({ label }: { label: string }) => (
  <EmptyState
    icon={InfoIcon}
    title={`No ${label} Data`}
    description={`No ${label.toLowerCase()} data is available at the moment.`}
    variant="info"
    size="sm"
  />
);
