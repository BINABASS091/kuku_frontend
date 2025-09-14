// Simple type definitions to avoid circular dependencies
export interface DashboardStats {
  totalUsers: number;
  totalFarmers: number;
  activeFarms: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  totalDevices: number;
  systemHealth: number;
  pendingTasks: number;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
  name?: string;
}

export interface Farm {
  farmID: number;
  name: string;
  location: string;
  size: string;
  farmer: number;
}

export interface Batch {
  batchID: number;
  farmID: number;
  breedID: number;
  arriveDate: string;
  initAge: number;
  harvestAge: number;
  quanitity: number;
  initWeight: number;
  batch_status: number;
}

export interface Breed {
  breedID: number;
  breedName: string;
  breed_typeID: number;
  preedphoto: string;
}