import MasterDataManager from '../../../components/MasterDataManager';

type Payment = {
  id: number;
  farmer_subscription: { id: number } | number;
  amount: number;
  status: string;
  reference: string;
  paid_at: string | null;
  method: string;
};

export default function PaymentsPage() {
  return (
    <MasterDataManager<Payment>
      title="Payments"
      endpoint="payments/"
      columns={[
        { key: 'farmer_subscription', header: 'Subscription', render: (r) => (typeof r.farmer_subscription === 'object' ? r.farmer_subscription.id : r.farmer_subscription) },
        { key: 'amount', header: 'Amount' },
        { key: 'status', header: 'Status' },
        { key: 'method', header: 'Method' },
        { key: 'paid_at', header: 'Paid At' },
        { key: 'reference', header: 'Reference' },
      ]}
      fields={[
        { type: 'text', name: 'farmer_subscription', label: 'Subscription ID', required: true },
        { type: 'text', name: 'amount', label: 'Amount', required: true },
        { type: 'text', name: 'status', label: 'Status', required: true },
        { type: 'text', name: 'method', label: 'Method' },
        { type: 'text', name: 'paid_at', label: 'Paid At (optional)' },
        { type: 'text', name: 'reference', label: 'Reference' },
      ]}
      normalizeIn={(v) => ({ ...v, farmer_subscription: Number(v.farmer_subscription), amount: Number(v.amount) })}
    />
  );
}


