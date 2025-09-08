import MasterDataManager from '../../../components/MasterDataManager';

type SubscriptionType = {
  id: number;
  name: string;
  price: number;
  duration_days: number;
  features: string[] | string;
};

export default function SubscriptionTypesPage() {
  return (
    <MasterDataManager<SubscriptionType>
      title="Subscription Types"
      endpoint="subscription-types/"
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'price', header: 'Price' },
        { key: 'duration_days', header: 'Duration (days)' },
        { key: 'features', header: 'Features', render: (r) => Array.isArray(r.features) ? r.features.join(', ') : r.features },
      ]}
      fields={[
        { type: 'text', name: 'name', label: 'Name', required: true },
        { type: 'text', name: 'price', label: 'Price', required: true },
        { type: 'text', name: 'duration_days', label: 'Duration (days)', required: true },
        { type: 'textarea', name: 'features', label: 'Features (comma-separated)' },
      ]}
      normalizeIn={(v) => ({ ...v, price: Number(v.price), duration_days: Number(v.duration_days), features: typeof v.features === 'string' ? v.features.split(',').map((x: string) => x.trim()) : v.features })}
    />
  );
}


