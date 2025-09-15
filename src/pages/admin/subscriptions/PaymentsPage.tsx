import MasterDataManager from '../../../components/MasterDataManager';

type Payment = {
  id: number;
  paymentID: number;
  farmerSubscriptionID: number | { id: number; farmer?: any; subscription_type?: any };
  amount: number;
  payment_date: string;
  due_date?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  status_display?: string;
  transaction_id?: string;
  receipt?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export default function PaymentsPage() {
  return (
    <MasterDataManager<Payment>
      title="Subscription Payments"
      endpoint="payments/"
      columns={[
        { 
          key: 'farmerSubscriptionID', 
          header: 'Subscription', 
          render: (r) => typeof r.farmerSubscriptionID === 'object' 
            ? `Subscription #${r.farmerSubscriptionID.id}` 
            : `Subscription #${r.farmerSubscriptionID}` 
        },
        { key: 'amount', header: 'Amount (KES)', render: (r) => `KES ${Number(r.amount).toLocaleString()}` },
        { key: 'status', header: 'Status' },
        { key: 'payment_date', header: 'Payment Date', render: (r) => new Date(r.payment_date).toLocaleDateString() },
        { key: 'due_date', header: 'Due Date', render: (r) => r.due_date ? new Date(r.due_date).toLocaleDateString() : '-' },
        { key: 'transaction_id', header: 'Transaction ID' },
      ]}
      fields={[
        { type: 'text', name: 'farmerSubscriptionID', label: 'Farmer Subscription ID', required: true, placeholder: 'e.g., 1' },
        { type: 'text', name: 'amount', label: 'Amount (KES)', required: true, placeholder: 'e.g., 100000' },
        { 
          type: 'select', 
          name: 'status', 
          label: 'Payment Status',
          required: true,
          options: [
            { label: 'Pending', value: 'PENDING' },
            { label: 'Completed', value: 'COMPLETED' },
            { label: 'Failed', value: 'FAILED' },
            { label: 'Refunded', value: 'REFUNDED' }
          ]
        },
        { type: 'text', name: 'due_date', label: 'Due Date (optional, YYYY-MM-DD)', placeholder: 'e.g., 2024-12-31' },
        { type: 'text', name: 'transaction_id', label: 'Transaction ID (optional)', placeholder: 'e.g., TXN123456789' },
        { type: 'textarea', name: 'notes', label: 'Notes (optional)', placeholder: 'Payment notes or comments' },
      ]}
      normalizeIn={(v) => ({ 
        ...v, 
        farmerSubscriptionID: Number(v.farmerSubscriptionID), 
        amount: Number(v.amount) 
      })}
    />
  );
}


