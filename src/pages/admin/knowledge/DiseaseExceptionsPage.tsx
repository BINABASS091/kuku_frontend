import MasterDataManager from '../../../components/MasterDataManager';

type DiseaseException = {
  id: number;
  name: string;
  description: string;
};

export default function DiseaseExceptionsPage() {
  return (
    <MasterDataManager<DiseaseException>
      title="Disease Exceptions"
      endpoint="exception-diseases/"
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


