import MasterDataManager from '../../../components/MasterDataManager';

type SubscriptionType = {
  id: number;
  subscriptionTypeID: number;
  name: string;
  tier: 'INDIVIDUAL' | 'NORMAL' | 'PREMIUM';
  farm_size: string;
  cost: number;
  max_hardware_nodes: number;
  max_software_services: number;
  includes_predictions: boolean;
  includes_analytics: boolean;
  description: string;
  active_subscriptions_count?: number;
  total_revenue?: number;
  tier_display?: string;
};

export default function SubscriptionTypesPage() {
  return (
    <MasterDataManager<SubscriptionType>
      title="Subscription Types"
      endpoint="subscription-types/"
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'tier', header: 'Tier' },
        { key: 'farm_size', header: 'Farm Size' },
        { key: 'cost', header: 'Cost (KES)', render: (r) => `KES ${Number(r.cost).toLocaleString()}` },
        { key: 'max_hardware_nodes', header: 'Max Hardware' },
        { key: 'max_software_services', header: 'Max Software' },
        { key: 'includes_predictions', header: 'Predictions', render: (r) => r.includes_predictions ? 'Yes' : 'No' },
        { key: 'includes_analytics', header: 'Analytics', render: (r) => r.includes_analytics ? 'Yes' : 'No' },
        { key: 'active_subscriptions_count', header: 'Active Subs' },
      ]}
      fields={[
        { type: 'text', name: 'name', label: 'Subscription Name', required: true, placeholder: 'e.g., Premium Plan' },
        { 
          type: 'select', 
          name: 'tier', 
          label: 'Tier', 
          required: true,
          options: [
            { label: 'Individual/Small', value: 'INDIVIDUAL' },
            { label: 'Normal/Medium', value: 'NORMAL' },
            { label: 'Premium/Large', value: 'PREMIUM' }
          ]
        },
        { type: 'text', name: 'farm_size', label: 'Farm Size', required: true, placeholder: 'e.g., Small, Medium, Large' },
        { type: 'text', name: 'cost', label: 'Cost (KES)', required: true, placeholder: 'e.g., 100000' },
        { type: 'text', name: 'max_hardware_nodes', label: 'Max Hardware Nodes', required: true, placeholder: 'e.g., 5' },
        { type: 'text', name: 'max_software_services', label: 'Max Software Services', required: true, placeholder: 'e.g., 10' },
        { 
          type: 'select', 
          name: 'includes_predictions', 
          label: 'Includes Predictions',
          options: [
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' }
          ]
        },
        { 
          type: 'select', 
          name: 'includes_analytics', 
          label: 'Includes Analytics',
          options: [
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' }
          ]
        },
        { type: 'textarea', name: 'description', label: 'Description', placeholder: 'Subscription plan description' },
      ]}
      normalizeIn={(v) => ({
        ...v,
        cost: Number(v.cost),
        max_hardware_nodes: Number(v.max_hardware_nodes),
        max_software_services: Number(v.max_software_services),
        includes_predictions: v.includes_predictions === 'true' || v.includes_predictions === true,
        includes_analytics: v.includes_analytics === 'true' || v.includes_analytics === true
      })}
    />
  );
}


