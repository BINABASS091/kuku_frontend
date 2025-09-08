import MasterDataManager from '../../../components/MasterDataManager';

type Recommendation = {
  id: number;
  title: string;
  content: string;
};

export default function RecommendationsPage() {
  return (
    <MasterDataManager<Recommendation>
      title="Recommendations"
      endpoint="recommendations/"
      columns={[
        { key: 'title', header: 'Title' },
        { key: 'content', header: 'Content' },
      ]}
      fields={[
        { type: 'text', name: 'title', label: 'Title', required: true },
        { type: 'textarea', name: 'content', label: 'Content' },
      ]}
    />
  );
}


