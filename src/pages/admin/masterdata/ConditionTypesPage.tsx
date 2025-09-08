import MasterDataManager from '../../../components/MasterDataManager';

type ConditionType = {
  id: number;
  name: string;
  description: string;
};

export default function ConditionTypesPage() {
  return (
    <MasterDataManager<ConditionType>
      title="Condition Types"
      endpoint="condition-types/"
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'description', header: 'Description' },
      ]}
      fields={[
        { type: 'text', name: 'name', label: 'Name', required: true },
        { type: 'textarea', name: 'description', label: 'Description' },
      ]}
    />
  );
}


