import MasterDataManager from '../../../components/MasterDataManager';

type Resource = {
  id: number;
  name: string;
  description: string;
};

export default function ResourcesPage() {
  return (
    <MasterDataManager<Resource>
      title="Resources"
      endpoint="resources/"
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


