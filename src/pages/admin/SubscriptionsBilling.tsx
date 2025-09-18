import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Heading } from '@chakra-ui/react';
import SubscriptionManagement from './SubscriptionManagement';
import SubscriptionTypesPage from './subscriptions/SubscriptionTypesPage';
import ResourcesPage from './subscriptions/ResourcesPage';
import PaymentsPage from './subscriptions/PaymentsPage';
import BillingReportsPage from './subscriptions/BillingReportsPage';

export default function SubscriptionsBilling() {
  return (
    <Box p={4}>
      <Heading mb={4}>Subscriptions & Billing</Heading>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>All Subscriptions</Tab>
          <Tab>Subscription Types</Tab>
          <Tab>Resources</Tab>
          <Tab>Payments</Tab>
          <Tab>Billing Reports</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SubscriptionManagement />
          </TabPanel>
          <TabPanel>
            <SubscriptionTypesPage />
          </TabPanel>
          <TabPanel>
            <ResourcesPage />
          </TabPanel>
          <TabPanel>
            <PaymentsPage />
          </TabPanel>
          <TabPanel>
            <BillingReportsPage />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
