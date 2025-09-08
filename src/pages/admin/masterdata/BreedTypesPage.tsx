import MasterDataManager from '../../../components/MasterDataManager';

type BreedType = {
  id: number;
  name: string;
  description: string;
};

export default function BreedTypesPage() {
  return (
    <MasterDataManager<BreedType>
      title="Breed Types"
      endpoint="breed-types/"
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'description', header: 'Description' },
      ]}
      fields={[
        { type: 'text', name: 'name', label: 'Name', required: true, placeholder: 'e.g., Broiler' },
        { type: 'textarea', name: 'description', label: 'Description', placeholder: 'Short description' },
      ]}
    />
  );
}


