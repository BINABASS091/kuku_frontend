import { useEffect, useState } from 'react';
import MasterDataManager from '../../../components/MasterDataManager';
import api from '../../../services/api';

type Batch = {
  id: number;
  farm: { id: number; name: string; location?: string } | number;
  breed?: { id: number; name: string; type: number; type_detail: { id: number; name: string }; photo?: string };
  arrive_date: string;
  init_age: number;
  harvest_age: number;
  quantity: number;
  init_weight: number;
  status: number | string;
  // Legacy fields for compatibility
  name?: string;
  size?: number;
  start_date?: string;
  end_date?: string | null;
};

export default function BatchesPage() {
  const [farmOptions, setFarmOptions] = useState<{label: string; value: number}[]>([]);
  const [breedOptions, setBreedOptions] = useState<{label: string; value: number}[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [farmsRes, breedsRes] = await Promise.all([
          api.get('farms/'),
          api.get('breeds/')
        ]);
        const farms = (farmsRes.data.results || farmsRes.data || []).map((f: any) => ({ label: f.name, value: f.id }));
        const breeds = (breedsRes.data.results || breedsRes.data || []).map((b: any) => ({ label: b.name, value: b.id }));
        setFarmOptions(farms);
        setBreedOptions(breeds);
      } catch (_e) {
        // ignore
      }
    };
    fetchOptions();
  }, []);

  return (
    <MasterDataManager<Batch>
      title="Batches"
      endpoint="batches/"
      columns={[
        { key: 'farm', header: 'Farm', render: (row) => (typeof row.farm === 'object' ? row.farm.name : `Farm ${row.farm}`) },
        { key: 'breed', header: 'Breed', render: (row) => row.breed?.name || 'No breed' },
        { key: 'quantity', header: 'Quantity' },
        { key: 'arrive_date', header: 'Arrive Date' },
        { key: 'init_age', header: 'Initial Age (days)' },
        { key: 'harvest_age', header: 'Harvest Age (days)' },
        { key: 'init_weight', header: 'Initial Weight (g)' },
        { key: 'status', header: 'Status', render: (row) => typeof row.status === 'number' ? `Status ${row.status}` : row.status },
      ]}
      fields={[
        { type: 'select', name: 'farm', label: 'Farm', required: true, options: farmOptions },
        { type: 'select', name: 'breed', label: 'Breed', required: true, options: breedOptions },
        { type: 'text', name: 'quantity', label: 'Quantity', required: true, placeholder: 'Number of birds' },
        { type: 'text', name: 'arrive_date', label: 'Arrive Date (YYYY-MM-DD)', required: true },
        { type: 'text', name: 'init_age', label: 'Initial Age (days)', required: true, placeholder: 'Age in days' },
        { type: 'text', name: 'harvest_age', label: 'Harvest Age (days)', required: true, placeholder: 'Harvest age in days' },
        { type: 'text', name: 'init_weight', label: 'Initial Weight (g)', required: true, placeholder: 'Weight in grams' },
        { type: 'text', name: 'status', label: 'Status', required: true, placeholder: 'Status number' },
      ]}
      normalizeIn={(v) => ({ 
        ...v, 
        farm: Number(v.farm), 
        breed: Number(v.breed),
        quantity: Number(v.quantity),
        init_age: Number(v.init_age),
        harvest_age: Number(v.harvest_age),
        init_weight: Number(v.init_weight),
        status: Number(v.status)
      })}
    />
  );
}


