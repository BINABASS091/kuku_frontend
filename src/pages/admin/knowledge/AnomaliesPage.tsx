import MasterDataManager from '../../../components/MasterDataManager';

type Anomaly = {
  id: number;
  title: string;
  status: string;
  details: string;
};

export default function AnomaliesPage() {
  return (
    <MasterDataManager<Anomaly>
      title="Anomalies"
      endpoint="anomalies/"
      columns={[
        { key: 'title', header: 'Title' },
        { key: 'status', header: 'Status' },
        { key: 'details', header: 'Details' },
      ]}
      fields={[
        { type: 'text', name: 'title', label: 'Title', required: true },
        { type: 'text', name: 'status', label: 'Status', required: true },
        { type: 'textarea', name: 'details', label: 'Details' },
      ]}
    />
  );
}


