import { useEffect, useState } from 'react';
import MasterDataManager from '../../../components/MasterDataManager';
import api from '../../../services/api';

type Reading = {
  id: number;
  device: { id: number; name: string } | number;
  sensor_type: { id: number; name: string; unit: string } | number;
  value: number;
  timestamp: string;
};

export default function ReadingsPage() {
  const [deviceOptions, setDeviceOptions] = useState<{label: string; value: number}[]>([]);
  const [sensorOptions, setSensorOptions] = useState<{label: string; value: number}[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [devicesRes, sensorsRes] = await Promise.all([
          api.get('devices/'),
          api.get('sensor-types/')
        ]);
        setDeviceOptions((devicesRes.data.results || devicesRes.data || []).map((d: any) => ({ label: d.name || `Device ${d.id}`, value: d.id })));
        setSensorOptions((sensorsRes.data.results || sensorsRes.data || []).map((s: any) => ({ label: s.name, value: s.id })));
      } catch (_e) {}
    };
    fetchOptions();
  }, []);

  return (
    <MasterDataManager<Reading>
      title="Readings"
      endpoint="readings/"
      columns={[
        { key: 'timestamp', header: 'Timestamp' },
        { key: 'device', header: 'Device', render: (r) => (typeof r.device === 'object' ? r.device.name : r.device) },
        { key: 'sensor_type', header: 'Sensor', render: (r) => (typeof r.sensor_type === 'object' ? `${r.sensor_type.name} (${r.sensor_type.unit})` : r.sensor_type) },
        { key: 'value', header: 'Value' },
      ]}
      fields={[
        { type: 'text', name: 'timestamp', label: 'Timestamp (ISO or YYYY-MM-DD HH:MM:SS)', required: true },
        { type: 'select', name: 'device', label: 'Device', required: true, options: deviceOptions },
        { type: 'select', name: 'sensor_type', label: 'Sensor Type', required: true, options: sensorOptions },
        { type: 'text', name: 'value', label: 'Value', required: true },
      ]}
      normalizeIn={(v) => ({ ...v, device: Number(v.device), sensor_type: Number(v.sensor_type), value: Number(v.value) })}
    />
  );
}


