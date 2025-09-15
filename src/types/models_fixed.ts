// ============================================================================
// AUTHENTICATION MODELS
// ============================================================================

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  phone?: string;
  role: 'ADMIN' | 'FARMER' | 'EXPERT' | 'ACCOUNTANT';
  is_active: boolean;
  date_joined: string;
  last_login?: string;
  profile_picture?: string;
}

export interface Farmer {
  farmerID: number;
  user: number; // FK to User
  name: string;
  location: string;
  user_details?: User;
}

// ============================================================================
// FARMS APP MODELS
// ============================================================================

export interface Farm {
  farmID: number; // Primary key
  farmer: number; // FK to Farmer
  name: string;
  location: string;
  size: string;
  // Related fields
  devices?: Device[];
  batches?: Batch[];
  farmer_details?: Farmer;
}

export interface Device {
  deviceID: number;
  farm: number | Farm; // Can be ID or populated object
  device_id: string;
  name: string;
  cell_no: string;
  picture: string;
  status: boolean;
  // Related fields
  readings?: Reading[];
  farm_details?: Farm;
}

// ============================================================================
// BREED MODELS
// ============================================================================

export interface BreedType {
  breed_typeID: number;
  breedType: string;
  breeds?: Breed[];
}

export interface Breed {
  breedID: number;
  breedName: string;
  breedType: number; // FK to BreedType
  breed_details?: BreedType;
}

// ============================================================================
// BATCH MODELS
// ============================================================================

export interface Batch {
  batchID: number;
  farm: number; // FK to Farm
  breed: number; // FK to Breed
  quantity: number;
  dateAdded: string;
  current_quantity: number;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  // Related fields
  farm_details?: Farm;
  breed_details?: Breed;
  activities?: BatchActivity[];
  schedules?: ActivitySchedule[];
}

export interface BatchActivity {
  activityID: number;
  batch: number; // FK to Batch
  activityName: string;
  activityDescription: string;
  activityDay: string;
  batch_details?: Batch;
}

export interface ActivitySchedule {
  scheduleID: number;
  batch: number; // FK to Batch
  activity_name: string;
  scheduled_date: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
  batch_details?: Batch;
}

// ============================================================================
// CONDITION MODELS
// ============================================================================

export interface ConditionType {
  condition_typeID: number;
  name: string;
  tier: 'INDIVIDUAL' | 'NORMAL' | 'PREMIUM';
}

export interface BirdCondition {
  conditionID: number;
  batch: number; // FK to Batch
  condition_type: number; // FK to ConditionType
  quantity: number;
  date_reported: string;
  status: 'ACTIVE' | 'TREATED' | 'RESOLVED';
  batch_details?: Batch;
  condition_type_details?: ConditionType;
}

// ============================================================================
// SUBSCRIPTION MODELS
// ============================================================================

export interface Subscription {
  subscriptionID: number;
  farmer: number; // FK to Farmer
  tier: 'INDIVIDUAL' | 'NORMAL' | 'PREMIUM';
  start_date: string;
  end_date: string;
  is_active: boolean;
  farm_size: string;
  farmer_details?: Farmer;
}

export interface BreedGrowth {
  growthID: number;
  breed: number; // FK to Breed
  week: number;
  expected_weight: number;
  actual_weight?: number;
  breed_details?: Breed;
}

// ============================================================================
// SENSOR MODELS
// ============================================================================

export interface SensorType {
  sensor_typeID: number;
  type_name: string;
  unit: string;
}

export interface Reading {
  readingID: number;
  device: number; // FK to Device
  sensor_type: number; // FK to SensorType
  value: number;
  timestamp: string;
  device_details?: Device;
  sensor_type_details?: SensorType;
}

// ============================================================================
// API RESPONSE MODELS
// ============================================================================

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface ApiError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

// ============================================================================
// DASHBOARD MODELS
// ============================================================================

export interface DashboardStats {
  total_farms: number;
  total_devices: number;
  active_devices: number;
  total_batches: number;
  active_batches: number;
  total_birds: number;
  total_farmers: number;
  revenue_this_month: number;
}

export interface RecentActivity {
  id: number;
  type: 'farm' | 'batch' | 'device' | 'user';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  farm?: string;
}

export interface SystemAlert {
  id: number;
  type: 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface TopFarm {
  farm: Farm;
  total_birds: number;
  active_devices: number;
  efficiency_score: number;
}

// ============================================================================
// FORM MODELS
// ============================================================================

export interface UserFormData {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  phone?: string;
  role: 'ADMIN' | 'FARMER' | 'EXPERT' | 'ACCOUNTANT';
  password?: string;
}

export interface FarmFormData {
  farmer: number;
  name: string;
  location: string;
  size: string;
}

export interface BatchFormData {
  farm: number;
  breed: number;
  quantity: number;
  dateAdded: string;
}

export interface BreedFormData {
  breedName: string;
  breedType: number;
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type EntityType = 'users' | 'farms' | 'batches' | 'breeds';

export interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: EntityType;
  editingItem?: any;
  onSuccess?: () => void;
}
