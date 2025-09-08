import MasterDataManager from '../../../components/MasterDataManager';

type SensorType = {
  id: number;
  name: string;
  unit: string;
  description: string;
};

export default function SensorTypesPage() {
  return (
    <MasterDataManager<SensorType>
      title="Sensor Types"
      endpoint="sensor-types/"
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'unit', header: 'Unit' },
        { key: 'description', header: 'Description' },
      ]}
      fields={[
        { type: 'text', name: 'name', label: 'Name', required: true },
        { type: 'text', name: 'unit', label: 'Unit', required: true, placeholder: 'e.g., °C, %' },
        { type: 'textarea', name: 'description', label: 'Description' },
      ]}
    />
  );
}


