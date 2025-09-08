import MasterDataManager from '../../../components/MasterDataManager';

type Medication = {
  id: number;
  name: string;
  dosage: string;
  description: string;
};

export default function MedicationsPage() {
  return (
    <MasterDataManager<Medication>
      title="Medications"
      endpoint="medications/"
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'dosage', header: 'Dosage' },
        { key: 'description', header: 'Description' },
      ]}
      fields={[
        { type: 'text', name: 'name', label: 'Name', required: true },
        { type: 'text', name: 'dosage', label: 'Dosage', required: true },
        { type: 'textarea', name: 'description', label: 'Description' },
      ]}
    />
  );
}


