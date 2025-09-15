import MasterDataManager from '../../../components/MasterDataManager';

type Resource = {
  id: number;
  resourceID: number;
  name: string;
  resource_type: 'HARDWARE' | 'SOFTWARE' | 'PREDICTION' | 'ANALYTICS';
  category: 'FEEDING' | 'THERMAL' | 'WATERING' | 'WEIGHTING' | 'DUSTING' | 'PREDICTION' | 'ANALYTICS' | 'INVENTORY';
  unit_cost: number;
  status: boolean;
  is_basic: boolean;
  description: string;
  resource_type_display?: string;
  category_display?: string;
  subscriptions_using_count?: number;
  total_allocations?: number;
};

export default function ResourcesPage() {
  return (
    <MasterDataManager<Resource>
      title="Subscription Resources"
      endpoint="resources/"
      columns={[
        { key: 'name', header: 'Resource Name' },
        { key: 'resource_type', header: 'Type' },
        { key: 'category', header: 'Category' },
        { key: 'unit_cost', header: 'Unit Cost (KES)', render: (r) => `KES ${Number(r.unit_cost).toLocaleString()}` },
        { key: 'status', header: 'Status', render: (r) => r.status ? 'Available' : 'Unavailable' },
        { key: 'is_basic', header: 'Basic Resource', render: (r) => r.is_basic ? 'Yes' : 'No' },
        { key: 'subscriptions_using_count', header: 'Active Uses' },
        { key: 'total_allocations', header: 'Total Allocated' },
      ]}
      fields={[
        { type: 'text', name: 'name', label: 'Resource Name', required: true, placeholder: 'e.g., Thermal Node' },
        { 
          type: 'select', 
          name: 'resource_type', 
          label: 'Resource Type', 
          required: true,
          options: [
            { label: 'Hardware Node', value: 'HARDWARE' },
            { label: 'Software Service', value: 'SOFTWARE' },
            { label: 'Prediction Service', value: 'PREDICTION' },
            { label: 'Analytics Service', value: 'ANALYTICS' }
          ]
        },
        { 
          type: 'select', 
          name: 'category', 
          label: 'Category', 
          required: true,
          options: [
            { label: 'Feeding Node', value: 'FEEDING' },
            { label: 'Thermal Node', value: 'THERMAL' },
            { label: 'Watering Node', value: 'WATERING' },
            { label: 'Weighting Node', value: 'WEIGHTING' },
            { label: 'Dusting Node', value: 'DUSTING' },
            { label: 'Prediction Service', value: 'PREDICTION' },
            { label: 'Analytics Service', value: 'ANALYTICS' },
            { label: 'Inventory Management', value: 'INVENTORY' }
          ]
        },
        { type: 'text', name: 'unit_cost', label: 'Unit Cost (KES)', required: true, placeholder: 'e.g., 20000' },
        { 
          type: 'select', 
          name: 'status', 
          label: 'Status',
          options: [
            { label: 'Available', value: 'true' },
            { label: 'Unavailable', value: 'false' }
          ]
        },
        { 
          type: 'select', 
          name: 'is_basic', 
          label: 'Basic Resource (Available to All)',
          options: [
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' }
          ]
        },
        { type: 'textarea', name: 'description', label: 'Description', placeholder: 'Resource description and usage details' },
      ]}
      normalizeIn={(v) => ({
        ...v,
        unit_cost: Number(v.unit_cost),
        status: v.status === 'true' || v.status === true,
        is_basic: v.is_basic === 'true' || v.is_basic === true
      })}
    />
  );
}


