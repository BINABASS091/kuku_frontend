import MasterDataManager from '../../../components/MasterDataManager';

type Breed = {
  id: number;
  name: string;
  breed_type: { id: number; name: string } | number;
  description: string;
};

export default function BreedsPage() {
  return (
    <MasterDataManager<Breed>
      title="Breeds"
      endpoint="breeds/"
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'breed_type', header: 'Breed Type', render: (row) => (typeof row.breed_type === 'object' ? row.breed_type.name : row.breed_type) },
        { key: 'description', header: 'Description' },
      ]}
      fields={[
        { type: 'text', name: 'name', label: 'Name', required: true },
        // Expecting backend to accept breed_type as id
        { type: 'text', name: 'breed_type', label: 'Breed Type ID', required: true, placeholder: 'Enter Breed Type ID' },
        { type: 'textarea', name: 'description', label: 'Description' },
      ]}
      normalizeIn={(values) => ({ ...values, breed_type: Number(values.breed_type) })}
    />
  );
}


