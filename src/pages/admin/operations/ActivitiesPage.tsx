import { useEffect, useState } from 'react';
import MasterDataManager from '../../../components/MasterDataManager';
import api from '../../../services/api';

type Activity = {
  id: number;
  batch: { id: number; name: string } | number;
  activity_type: { id: number; name: string } | number;
  date: string;
  notes: string;
};

export default function ActivitiesPage() {
  const [batchOptions, setBatchOptions] = useState<{label: string; value: number}[]>([]);
  const [typeOptions, setTypeOptions] = useState<{label: string; value: number}[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [batchesRes, typesRes] = await Promise.all([
          api.get('batches/'),
          api.get('activity-types/')
        ]);
        setBatchOptions((batchesRes.data.results || batchesRes.data || []).map((b: any) => ({ label: b.name || `Batch ${b.id}` , value: b.id })));
        setTypeOptions((typesRes.data.results || typesRes.data || []).map((t: any) => ({ label: t.name, value: t.id })));
      } catch (_e) {}
    };
    fetchOptions();
  }, []);

  return (
    <MasterDataManager<Activity>
      title="Activities"
      endpoint="batch-activities/"
      columns={[
        { key: 'date', header: 'Date' },
        { key: 'batch', header: 'Batch', render: (r) => (typeof r.batch === 'object' ? r.batch.name : r.batch) },
        { key: 'activity_type', header: 'Type', render: (r) => (typeof r.activity_type === 'object' ? r.activity_type.name : r.activity_type) },
        { key: 'notes', header: 'Notes' },
      ]}
      fields={[
        { type: 'text', name: 'date', label: 'Date (YYYY-MM-DD)', required: true },
        { type: 'select', name: 'batch', label: 'Batch', required: true, options: batchOptions },
        { type: 'select', name: 'activity_type', label: 'Activity Type', required: true, options: typeOptions },
        { type: 'textarea', name: 'notes', label: 'Notes' },
      ]}
      normalizeIn={(v) => ({ ...v, batch: Number(v.batch), activity_type: Number(v.activity_type) })}
    />
  );
}


