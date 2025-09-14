// Backend Django model interfaces - Keep in sync with Django models// TypeScript interfaces that exactly match Django backend models



// ============================================================================// User and Authentication Models

// ACCOUNTS APP MODELSexport interface User {

// ============================================================================  id: number;

  username: string;

export interface User {  email: string;

  id: number;  first_name: string;

  username: string;  last_name: string;

  email: string;  role: 'ADMIN' | 'FARMER' | 'ACCOUNTANT' | 'EXPERT';

  first_name: string;  is_active: boolean;

  last_name: string;  profile_image: string;

  role: 'ADMIN' | 'FARMER' | 'ACCOUNTANT' | 'EXPERT';  date_joined: string;

  is_active: boolean;  last_login?: string;

  profile_image: string;}

  date_joined: string;

  last_login: string | null;export interface Farmer {

  name?: string; // Computed property for display  id: number;

}  user: number | User; // Can be ID or populated object

  full_name: string;

export interface Farmer {  address: string;

  id: number;  email: string;

  user: number; // FK to User  phone: string;

  full_name: string;  created_date: string;

  address: string;}

  email: string;

  phone: string;// Farm and Device Models

  created_date: string;export interface Farm {

  // Related fields  farmID: number;

  user_details?: User;  farmer: number | Farmer; // Can be ID or populated object

}  name: string;

  location: string;

// ============================================================================  size: string;

// FARMS APP MODELS  devices?: Device[];

// ============================================================================  batches?: Batch[];

}

export interface Farm {

  farmID: number; // Primary keyexport interface Device {

  farmer: number; // FK to Farmer  deviceID: number;

  name: string;  farm: number | Farm; // Can be ID or populated object

  location: string;  device_id: string;

  size: string;  name: string;

  // Related fields  cell_no: string;

  farmer_details?: Farmer;  picture: string;

}  status: boolean;

  readings?: Reading[];

export interface Device {}

  deviceID: number; // Primary key

  farm: number; // FK to Farm// Breed Models

  device_id: string;export interface BreedType {

  name: string;  breed_typeID: number;

  cell_no: string;  breedType: string;

  picture: string;  breeds?: Breed[];

  status: boolean;}

  // Related fields

  farm_details?: Farm;export interface Breed {

}  breedID: number;

  breedName: string;

// ============================================================================  breed_typeID: number | BreedType;

// BREEDS APP MODELS  preedphoto: string;

// ============================================================================  batches?: Batch[];

}

export interface BreedType {

  breed_typeID: number; // Primary keyexport interface ActivityType {

  breedType: string;  activityTypeID: number;

}  activityType: string;

}

export interface Breed {

  breedID: number; // Primary keyexport interface BreedActivity {

  breedName: string;  breedActivityID: number;

  breed_typeID: number; // FK to BreedType  breedID: number | Breed;

  preedphoto: string;  activityTypeID: number | ActivityType;

  // Related fields  activityName: string;

  breed_type_details?: BreedType;  activityDescription: string;

}  minAge: number;

  maxAge: number;

export interface ActivityType {  breed_activity_status: 0 | 1 | 9; // INACTIVE | ACTIVE | ARCHIVED

  activityTypeID: number; // Primary key}

  activityType: string;

}// Batch Models

export interface Batch {

export interface BreedActivity {  batchID: number;

  breedActivityID: number; // Primary key  farmID: number | Farm;

  breedID: number; // FK to Breed  breedID: number | Breed;

  activityTypeID: number; // FK to ActivityType  arriveDate: string;

  age: number;  initAge: number;

  breed_activity_status: 0 | 1 | 9; // INACTIVE | ACTIVE | ARCHIVED  harvestAge: number;

  // Related fields  quanitity: number; // Keep legacy spelling

  breed_details?: Breed;  initWeight: number;

  activity_type_details?: ActivityType;  batch_status: 0 | 1 | 9; // INACTIVE | ACTIVE | ARCHIVED

}  schedules?: ActivitySchedule[];

}

export interface ConditionType {

  condition_typeID: number; // Primary keyexport interface ActivitySchedule {

  name: string;  activityID: number;

  unit: string;  batchID: number | Batch;

}  activityName: string;

  activityDescription: string;

export interface BreedCondition {  activityDay: string;

  breed_conditionID: number; // Primary key  activity_status: 0 | 1 | 9; // INACTIVE | ACTIVE | ARCHIVED

  breedID: number; // FK to Breed  activity_frequency: number;

  condictionMin: number;}

  conditionMax: number;

  condition_status: 0 | 1 | 9; // INACTIVE | ACTIVE | ARCHIVED// Subscription Models

  condition_typeID: number; // FK to ConditionTypeexport interface SubscriptionType {

  // Related fields  subscriptionTypeID: number;

  breed_details?: Breed;  name: string;

  condition_type_details?: ConditionType;  tier: 'INDIVIDUAL' | 'NORMAL' | 'PREMIUM';

}  farm_size: string;

  cost: string; // Decimal field comes as string

export interface FoodType {  max_hardware_nodes: number;

  foodTypeID: number; // Primary key  max_software_services: number;

  name: string;  includes_predictions: boolean;

}  includes_analytics: boolean;

  description: string;

export interface BreedFeeding {}

  breedFeedingID: number; // Primary key

  quantity: number;export interface Resource {

  breed_feed_status: 0 | 1 | 9; // INACTIVE | ACTIVE | ARCHIVED  resourceID: number;

  breedID: number; // FK to Breed  name: string;

  foodTypeID: number; // FK to FoodType  type: 'HARDWARE' | 'SOFTWARE' | 'PREDICTION' | 'ANALYTICS';

  age: number;  category: 'FEEDING' | 'THERMAL' | 'WATERING' | 'WEIGHTING' | 'DUSTING' | 'PREDICTION' | 'ANALYTICS' | 'INVENTORY';

  frequency: number;  monthly_cost: string; // Decimal field

  // Related fields  description: string;

  breed_details?: Breed;  is_active: boolean;

  food_type_details?: FoodType;}

}

export interface FarmerSubscription {

export interface BreedGrowth {  subscriptionID: number;

  breedGrowthID: number; // Primary key  farmer: number | Farmer;

  breedID: number; // FK to Breed  subscription_type: number | SubscriptionType;

  age: number;  start_date: string;

  minWeight: number;  end_date?: string;

  // Related fields  is_active: boolean;

  breed_details?: Breed;  auto_renew: boolean;

}  created_at: string;

  updated_at: string;

export interface FeedingType {  total_cost?: string;

  feedingTypeID: number; // Primary key}

  feedingName: string;

  quanitityType: string; // Note: legacy spelling retained// Sensor Models

}export interface SensorType {

  sensorTypeID: number;

// ============================================================================  name: string;

// BATCHES APP MODELS  unit: string;

// ============================================================================  readings?: Reading[];

}

export interface Batch {

  batchID: number; // Primary keyexport interface Reading {

  farmID: number | null; // FK to Farm  readingID: number;

  breedID: number | null; // FK to Breed  deviceID: number | Device;

  arriveDate: string;  sensor_typeID: number | SensorType;

  initAge: number;  value: number;

  harvestAge: number;  timestamp: string;

  quanitity: number; // Note: legacy spelling retained}

  initWeight: number;

  batch_status: 0 | 1 | 9; // INACTIVE | ACTIVE | ARCHIVED// API Response Types

  // Related fieldsexport interface PaginatedResponse<T> {

  farm_details?: Farm;  count: number;

  breed_details?: Breed;  next?: string;

}  previous?: string;

  results: T[];

export interface ActivitySchedule {}

  activityID: number; // Primary key

  batchID: number | null; // FK to Batchexport interface APIError {

  activityName: string;  detail?: string;

  activityDescription: string;  message?: string;

  activityDay: string;  errors?: Record<string, string[]>;

  activity_status: 0 | 1 | 9; // INACTIVE | ACTIVE | ARCHIVED}

  activity_frequency: number;

  // Related fields// Dashboard Data Types

  batch_details?: Batch;export interface DashboardStats {

}  totalUsers: number;

  totalFarmers: number;

export interface BatchActivity {  activeFarms: number;

  batchActivityID: number; // Primary key  totalDevices: number;

  batchID: number | null; // FK to Batch  activeSubscriptions: number;

  breedActivityID: number | null; // FK to BreedActivity  monthlyRevenue: number;

  batchActivityName: string;  systemHealth: number;

  batchActivityDate: string;  pendingTasks: number;

  batchActivityDetails: string;  alerts: number;

  batchAcitivtyCost: string; // Decimal as string, note: legacy spelling retained}

  // Related fields

  batch_details?: Batch;export interface RecentActivity {

  breed_activity_details?: BreedActivity;  id: string;

}  action: string;

  time: string;

export interface BatchFeeding {  status: 'success' | 'warning' | 'error';

  batchFeedingID: number; // Primary key  user: string;

  batchID: number | null; // FK to Batch  details?: string;

  feedingDate: string;}

  feedingAmount: number;

  status: 0 | 1 | 9; // INACTIVE | ACTIVE | ARCHIVEDexport interface SystemAlert {

  // Related fields  id: string;

  batch_details?: Batch;  type: 'warning' | 'info' | 'error';

}  message: string;

  time: string;

// ============================================================================  count: number;

// SENSORS APP MODELS  severity: 'low' | 'medium' | 'high';

// ============================================================================}



export interface SensorType {// Form Data Types

  sensorTypeID: number; // Primary keyexport interface CreateFarmerData {

  name: string;  username: string;

  unit: string;  email: string;

}  password: string;

  first_name: string;

export interface Reading {  last_name: string;

  readingID: number; // Primary key  full_name: string;

  deviceID: number | null; // FK to Device  address: string;

  sensor_typeID: number | null; // FK to SensorType  phone: string;

  value: number;}

  timestamp: string;

  // Related fieldsexport interface CreateFarmData {

  device_details?: Device;  farmer: number;

  sensor_type_details?: SensorType;  name: string;

}  location: string;

  size: string;

// ============================================================================}

// SUBSCRIPTIONS APP MODELS

// ============================================================================export interface CreateBatchData {

  farmID: number;

export interface SubscriptionType {  breedID: number;

  subscriptionTypeID: number; // Primary key  arriveDate: string;

  name: string;  initAge: number;

  tier: 'INDIVIDUAL' | 'NORMAL' | 'PREMIUM';  harvestAge: number;

  farm_size: string;  quanitity: number;

  cost: string; // Decimal as string  initWeight: number;

  max_hardware_nodes: number;}

  max_software_services: number;

  includes_predictions: boolean;export interface CreateDeviceData {

  includes_analytics: boolean;  farm: number;

  description: string;  device_id: string;

}  name: string;

  cell_no: string;

export interface Resource {  picture?: string;

  resourceID: number; // Primary key}

  name: string;
  resource_type: 'HARDWARE' | 'SOFTWARE' | 'PREDICTION' | 'ANALYTICS';
  category: 'FEEDING' | 'THERMAL' | 'WATERING' | 'WEIGHTING' | 'DUSTING' | 'PREDICTION' | 'ANALYTICS' | 'INVENTORY';
  unit_cost: string; // Decimal as string
  status: boolean;
  is_basic: boolean;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface FarmerSubscription {
  farmerSubscriptionID: number; // Primary key
  farmerID: number | null; // FK to Farmer
  subscription_typeID: number | null; // FK to SubscriptionType
  start_date: string;
  end_date: string | null;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED';
  auto_renew: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
  // Related fields
  farmer_details?: Farmer;
  subscription_type_details?: SubscriptionType;
  // Computed properties
  is_active?: boolean;
  utilization?: {
    hardware: { used: number; limit: number; available: number };
    software: { used: number; limit: number; available: number };
  };
}

export interface FarmerSubscriptionResource {
  farmerSubscriptionResourceID: number; // Primary key
  farmerSubscriptionID: number | null; // FK to FarmerSubscription
  resourceID: number | null; // FK to Resource
  quantity: number;
  status: boolean;
  allocated_at: string;
  updated_at: string;
  // Related fields
  farmer_subscription_details?: FarmerSubscription;
  resource_details?: Resource;
}

export interface Payment {
  paymentID: number; // Primary key
  farmerSubscriptionID: number | null; // FK to FarmerSubscription
  amount: string; // Decimal as string
  payment_date: string;
  due_date: string | null;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transaction_id: string | null;
  receipt: string | null; // File path
  notes: string;
  created_at: string;
  updated_at: string;
  // Related fields
  farmer_subscription_details?: FarmerSubscription;
}

// ============================================================================
// DASHBOARD & API RESPONSE TYPES
// ============================================================================

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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ============================================================================
// FORM & COMPONENT TYPES
// ============================================================================

export interface CreateFarmData {
  name: string;
  location: string;
  size: string;
  farmer: number;
}

export interface CreateBatchData {
  farmID: number;
  breedID: number;
  arriveDate: string;
  initAge: number;
  harvestAge: number;
  quanitity: number;
  initWeight: number;
}

export interface CreateUserData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'ADMIN' | 'FARMER' | 'ACCOUNTANT' | 'EXPERT';
  password: string;
}

export interface CreateFarmerData extends CreateUserData {
  full_name: string;
  address: string;
  phone: string;
}

export interface UpdateFarmData extends Partial<CreateFarmData> {
  farmID: number;
}

export interface UpdateBatchData extends Partial<CreateBatchData> {
  batchID: number;
}

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RefreshTokenResponse {
  access: string;
}

// ============================================================================
// STATUS ENUMS FOR CONSISTENCY
// ============================================================================

export const StatusTypes = {
  INACTIVE: 0,
  ACTIVE: 1,
  ARCHIVED: 9
} as const;

export const UserRoles = {
  ADMIN: 'ADMIN',
  FARMER: 'FARMER', 
  ACCOUNTANT: 'ACCOUNTANT',
  EXPERT: 'EXPERT'
} as const;

export const SubscriptionTiers = {
  INDIVIDUAL: 'INDIVIDUAL',
  NORMAL: 'NORMAL',
  PREMIUM: 'PREMIUM'
} as const;

export const SubscriptionStatuses = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING', 
  SUSPENDED: 'SUSPENDED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED'
} as const;

export const ResourceTypes = {
  HARDWARE: 'HARDWARE',
  SOFTWARE: 'SOFTWARE',
  PREDICTION: 'PREDICTION',
  ANALYTICS: 'ANALYTICS'
} as const;

export const PaymentStatuses = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
} as const;

export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  time: string;
  count: number;
  severity: 'low' | 'medium' | 'high';
}

export interface RecentActivity {
  id: string;
  action: string;
  time: string;
  status: 'success' | 'warning' | 'error';
  user: string;
  details: string;
}