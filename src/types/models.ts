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
  profile_image?: string;
}

export interface Farmer {
  id: number;
  farmerID?: number; // For compatibility
  user: number; // FK to User
  farmerName: string;
  address: string;
  email: string;
  phone: string;
  created_date: string;
  user_details?: User;
  
  // Compatibility properties
  name?: string;
  location?: string;
}

// ============================================================================
// FARMS APP MODELS
// ============================================================================

export interface Farm {
  farmID: number; // Primary key
  farmerID: number; // FK to Farmer
  farmName: string;
  location: string;
  farmSize: string;
  // Related fields
  devices?: Device[];
  batches?: Batch[];
  farmer_details?: Farmer;
  
  // Compatibility properties
  farmer?: number;
  name?: string;
  size?: string;
}

export interface Device {
  deviceID: number;
  farmID: number; // FK to Farm
  device_id: string;
  name: string;
  cell_no: string;
  picture: string;
  status: boolean;
  // Related fields
  readings?: Reading[];
  farm_details?: Farm;
  
  // Compatibility properties
  farm?: number | Farm;
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
  breed_typeID: number; // FK to BreedType
  preedphoto?: string;
  breed_details?: BreedType;
  
  // Compatibility properties
  breedType?: number;
}

export interface ActivityType {
  activityTypeID: number;
  activityType: string;
}

export interface BreedActivity {
  breedActivityID: number;
  breedID: number; // FK to Breed
  activityTypeID: number; // FK to ActivityType
  age: number;
  breed_activity_status: number; // 1=Active, 0=Inactive, 9=Archived
  breed_details?: Breed;
  activity_type_details?: ActivityType;
}

export interface ConditionType {
  condition_typeID: number;
  conditionName: string;
  condition_unit: string;
}

export interface BreedCondition {
  breed_conditionID: number;
  breedID: number; // FK to Breed
  condition_typeID: number; // FK to ConditionType
  condictionMin: number;
  conditionMax: number;
  condition_status: number; // 1=Active, 0=Inactive, 9=Archived
  breed_details?: Breed;
  condition_type_details?: ConditionType;
}

export interface FoodType {
  foodTypeID: number;
  foodName: string;
}

export interface BreedFeeding {
  breedFeedingID: number;
  breedID: number; // FK to Breed
  foodTypeID: number; // FK to FoodType
  age: number;
  quantity: number;
  frequency: number;
  breed_feed_status: number; // 1=Active, 0=Inactive, 9=Archived
  breed_details?: Breed;
  food_type_details?: FoodType;
}

export interface BreedGrowth {
  breedGrowthID: number;
  breedID: number; // FK to Breed
  age: number;
  minWeight: number;
  breed_details?: Breed;
}

// ============================================================================
// BATCH MODELS
// ============================================================================

export interface Batch {
  batchID: number;
  farmID: number; // FK to Farm
  breedID: number; // FK to Breed
  arriveDate: string;
  initAge: number;
  harvestAge: number;
  quanitity: number; // Note: Backend has typo "quanitity"
  initWeight: number;
  batch_status: number; // 1=Active, 0=Inactive, 9=Archived
  // Related fields
  farm_details?: Farm;
  breed_details?: Breed;
  activities?: BatchActivity[];
  schedules?: ActivitySchedule[];
  
  // Compatibility properties
  farm?: number;
  breed?: number;
  quantity?: number;
  dateAdded?: string;
  current_quantity?: number;
  status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
}

export interface ActivitySchedule {
  activityID: number;
  batchID: number; // FK to Batch
  activityName: string;
  activityDescription: string;
  activityDay: string;
  activity_status: number; // 1=Active, 0=Inactive, 9=Archived
  activity_frequency: number;
  batch_details?: Batch;
  
  // Compatibility properties
  scheduleID?: number;
  batch?: number;
  activity_name?: string;
  scheduled_date?: string;
  status?: 'PENDING' | 'COMPLETED' | 'OVERDUE';
}

export interface BatchActivity {
  batchActivityID: number;
  batchID: number; // FK to Batch
  breedActivityID: number; // FK to BreedActivity
  batchActivityName: string;
  batchActivityDate: string;
  batchActivityDetails: string;
  batchAcitivtyCost: number; // Note: Backend has typo "batchAcitivtyCost"
  batch_details?: Batch;
  breed_activity_details?: BreedActivity;
  
  // Compatibility properties
  activityID?: number;
  batch?: number;
  activityName?: string;
  activityDescription?: string;
  activityDay?: string;
}

export interface BatchFeeding {
  batchFeedingID: number;
  batchID: number; // FK to Batch
  feedingDate: string;
  feedingAmount: number;
  status: number; // 1=Active, 0=Inactive, 9=Archived
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

export interface SubscriptionType {
  subscriptionTypeID: number;
  name: string;
  tier: 'INDIVIDUAL' | 'NORMAL' | 'PREMIUM';
  farm_size: string;
  cost: number;
  max_hardware_nodes: number;
  max_software_services: number;
  includes_predictions: boolean;
  includes_analytics: boolean;
  description: string;
  
  // Compatibility properties
  id?: number;
}

export interface Resource {
  resourceID: number;
  name: string;
  resource_type: 'HARDWARE' | 'SOFTWARE' | 'PREDICTION' | 'ANALYTICS';
  category: 'FEEDING' | 'THERMAL' | 'WATERING' | 'WEIGHTING' | 'DUSTING' | 'PREDICTION' | 'ANALYTICS' | 'INVENTORY';
  unit_cost: number;
  status: boolean;
  is_basic: boolean;
  description: string;
  created_at: string;
  updated_at: string;
  
  // Compatibility properties
  id?: number;
}

export interface FarmerSubscription {
  farmerSubscriptionID: number;
  farmerID: number; // FK to Farmer
  subscription_typeID: number; // FK to SubscriptionType
  start_date: string;
  end_date?: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED';
  auto_renew: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
  farmer_details?: Farmer;
  subscription_type_details?: SubscriptionType;
  
  // Compatibility properties
  id?: number;
  farmer?: number;
  subscription_type?: number;
  is_active?: boolean;
}

export interface FarmerSubscriptionResource {
  farmerSubscriptionResourceID: number;
  farmerSubscriptionID: number; // FK to FarmerSubscription
  resourceID: number; // FK to Resource
  quantity: number;
  status: boolean;
  allocated_at: string;
  updated_at: string;
  farmer_subscription_details?: FarmerSubscription;
  resource_details?: Resource;
  
  // Compatibility properties
  id?: number;
}

export interface Payment {
  paymentID: number;
  farmerSubscriptionID: number; // FK to FarmerSubscription
  amount: number;
  payment_date: string;
  due_date?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transaction_id?: string;
  receipt?: string;
  notes: string;
  created_at: string;
  updated_at: string;
  farmer_subscription_details?: FarmerSubscription;
  
  // Compatibility properties
  id?: number;
}

// Legacy compatibility interface
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
  sensorTypeID: number;
  sensorTypeName: string;
  measurementUnit: string;
  
  // Compatibility properties
  sensor_typeID?: number;
  type_name?: string;
  unit?: string;
  name?: string;
}

export interface Reading {
  readingID: number;
  deviceID: number; // FK to Device
  sensor_typeID: number; // FK to SensorType
  value: number;
  timestamp: string;
  device_details?: Device;
  sensor_type_details?: SensorType;
  
  // Compatibility properties
  device?: number;
  sensor_type?: number;
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
  // Add compatibility for AdminDashboard
  totalUsers?: number;
  totalFarmers?: number;
  activeFarms?: number;
  monthlyRevenue?: number;
  activeSubscriptions?: number;
  totalDevices?: number;
  // System health metrics
  systemHealth?: number;
  pendingTasks?: number;
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

// Create Data Types
export interface CreateFarmerData {
  farmerName: string;
  address: string;
  email: string;
  phone: string;
  user: number;
}

export interface CreateFarmData {
  farmerID: number;
  farmName: string;
  location: string;
  farmSize: string;
}

export interface CreateBatchData {
  farmID: number;
  breedID: number;
  quanitity: number; // Note: Backend has typo
  arriveDate: string;
  initAge: number;
  harvestAge: number;
  initWeight: number;
}

export interface CreateDeviceData {
  farmID: number;
  device_id: string;
  name: string;
  cell_no: string;
  picture?: string;
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
