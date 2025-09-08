import MasterDataManager from '../../../components/MasterDataManager';

type HealthCondition = {
  id: number;
  name: string;
  description: string;
  severity: string;
};

export default function HealthConditionsPage() {
  return (
    <MasterDataManager<HealthCondition>
      title="Health Conditions"
      endpoint="patient-healths/"
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'severity', header: 'Severity' },
        { key: 'description', header: 'Description' },
      ]}
      fields={[
        { type: 'text', name: 'name', label: 'Name', required: true },
        { type: 'text', name: 'severity', label: 'Severity', required: true },
        { type: 'textarea', name: 'description', label: 'Description' },
      ]}
    />
  );
}


