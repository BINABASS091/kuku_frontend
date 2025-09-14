import { SimpleGrid, Tooltip, Button, Icon, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import type { QuickActionsProps } from '../../dashboard/types';

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
      {actions.map((action, index) => {
        const linkProps = action.isExternal
          ? { as: 'a', href: action.href, target: '_blank', rel: 'noopener noreferrer' }
          : { as: Link, to: action.href };
        return (
          <Tooltip key={index} label={action.description} placement="top">
            <Button
              {...linkProps as any}
              leftIcon={<Icon as={action.icon} />}
              colorScheme={action.color}
              variant="outline"
              size="lg"
              h="auto"
              py={6}
              flexDirection="column"
              gap={2}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              <Text>{action.label}</Text>
            </Button>
          </Tooltip>
        );
      })}
    </SimpleGrid>
  );
}
