import MasterDataManager from '../../../components/MasterDataManager';

type ActivityType = {
  id: number;
  name: string;
  description: string;
};

export default function ActivityTypesPage() {
  return (
    <MasterDataManager<ActivityType>
      title="Activity Types"
      endpoint="activity-types/"
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


