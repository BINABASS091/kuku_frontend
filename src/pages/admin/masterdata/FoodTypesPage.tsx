import MasterDataManager from '../../../components/MasterDataManager';

type FoodType = {
  id: number;
  name: string;
  description: string;
};

export default function FoodTypesPage() {
  return (
    <MasterDataManager<FoodType>
      title="Food Types"
      endpoint="food-types/"
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


