import { authAPI, userAPI, farmerAPI, farmAPI, deviceAPI, breedAPI, batchAPI, masterDataAPI, sensorTypeAPI } from './api';


// Improved localStorage mock for Jest
let testAccessToken = '';
let testRefreshToken = '';
global.localStorage = {
  getItem: jest.fn((key) => {
    if (key === 'accessToken') return testAccessToken;
    if (key === 'refreshToken') return testRefreshToken;
    return null;
  }),
  setItem: jest.fn((key, value) => {
    if (key === 'accessToken') testAccessToken = value;
    if (key === 'refreshToken') testRefreshToken = value;
  }),
  removeItem: jest.fn((key) => {
    if (key === 'accessToken') testAccessToken = '';
    if (key === 'refreshToken') testRefreshToken = '';
  }),
  clear: jest.fn(() => {
    testAccessToken = '';
    testRefreshToken = '';
  }),
  length: 0,
  key: jest.fn((index: number) => null),
};

let breedTypeID: number | null = null;

beforeAll(async () => {
  // Authenticate before running any tests
  const credentials = { username: 'testuser', password: 'testpass123' };
  const loginRes = await authAPI.login(credentials);
  testAccessToken = loginRes.access;
  testRefreshToken = loginRes.refresh || '';
  global.localStorage.setItem('accessToken', testAccessToken);
  global.localStorage.setItem('refreshToken', testRefreshToken);

  // Fetch breed types for breed CRUD tests
  const breedTypes = await masterDataAPI.breedTypes.list();
  if (breedTypes.results && breedTypes.results.length > 0) {
    breedTypeID = breedTypes.results[0].id || breedTypes.results[0].breed_typeID;
  }
});

describe('API Endpoints', () => {
  it('should get current user after login', async () => {
    const user = await authAPI.getCurrentUser();
    expect(user).toBeDefined();
  });

  it('should fetch all users (admin only)', async () => {
    const users = await userAPI.list();
    expect(users.results).toBeDefined();
  });

  it('should fetch all farmers', async () => {
    const farmers = await farmerAPI.list();
    expect(farmers.results).toBeDefined();
  });

  it('should fetch all farms', async () => {
    const farms = await farmAPI.list();
    expect(farms.results).toBeDefined();
  });

  it('should fetch all devices', async () => {
    const devices = await deviceAPI.list();
    expect(devices.results).toBeDefined();
  });

  it('should fetch all breeds', async () => {

    const breeds = await breedAPI.list();
    expect(breeds.results).toBeDefined();
  });

  it('should fetch all batches', async () => {
    const batches = await batchAPI.list();
    expect(batches.results).toBeDefined();
  });

  it('should fetch all subscriptions', async () => {
    const subs = await masterDataAPI.farmerSubscriptions.list();
    expect(subs.results).toBeDefined();
  });

  it('should fetch all sensor types', async () => {
    const sensorTypes = await sensorTypeAPI.list();
    expect(sensorTypes.results).toBeDefined();
  });
});

describe('Farm API CRUD', () => {
  let createdFarmId: number | null = null;
  const farmData = {
    farmName: 'Test Farm',
    location: 'Test Location',
    farmSize: '100 acres',
  };

  it('should create a farm', async () => {
    const res = await farmAPI.create(farmData);
    console.log('Farm create response:', res);
    expect(res.farmID || res.id).toBeDefined();
    createdFarmId = res.farmID || res.id;
    expect(res.farmName).toBe(farmData.farmName);
  });

  it('should retrieve the created farm', async () => {
    expect(createdFarmId).toBeDefined();
    const farm = await farmAPI.retrieve(createdFarmId!);
    expect(farm.farmName).toBe(farmData.farmName);
    expect(farm.location).toBe(farmData.location);
  });

  it('should update the farm', async () => {
    expect(createdFarmId).toBeDefined();
    const updatedData = { farmName: 'Updated Test Farm', farmSize: '150 acres' };
    const updatedFarm = await farmAPI.update(createdFarmId!, updatedData);
    expect(updatedFarm.farmName).toBe(updatedData.farmName);
    expect(updatedFarm.farmSize).toBe(updatedData.farmSize);
  });

  it('should delete the farm', async () => {
    expect(createdFarmId).toBeDefined();
    await farmAPI.delete(createdFarmId!);
    // After deletion, retrieving should fail (404 or similar)
    let errorCaught = false;
    try {
      await farmAPI.retrieve(createdFarmId!);
    } catch (err: any) {
      errorCaught = true;
      expect(err.response?.status).toBe(404);
    }
    expect(errorCaught).toBe(true);
  });
});

describe('Batch API CRUD', () => {
  let createdBatchId: number | null = null;
  // You may need to adjust farmID and breedID to valid IDs in your DB
  const batchData = {
    farmID: 1, // Replace with a valid farmID
    breedID: 1, // Replace with a valid breedID
    arriveDate: '2025-10-02',
    initAge: 0,
    harvestAge: 10,
    quanitity: 100,
    initWeight: 1,
    batch_status: 1,
  };

  it('should create a batch', async () => {
    const res = await batchAPI.create(batchData);
    console.log('Batch create response:', res);
    expect(res.batchID || res.id).toBeDefined();
    createdBatchId = res.batchID || res.id;
    expect(res.quanitity).toBe(batchData.quanitity);
  });

  it('should retrieve the created batch', async () => {
    expect(createdBatchId).toBeDefined();
    const batch = await batchAPI.list();
    const found = batch.results.find((b: any) => b.batchID === createdBatchId);
    expect(found).toBeDefined();
    expect(found.quanitity).toBe(batchData.quanitity);
  });

  it('should update the batch', async () => {
    expect(createdBatchId).toBeDefined();
    const updatedData = { quanitity: 200 };
    const updatedBatch = await batchAPI.update(createdBatchId!, updatedData);
    expect(updatedBatch.quanitity).toBe(updatedData.quanitity);
  });

  it('should delete the batch', async () => {
    expect(createdBatchId).toBeDefined();
    await batchAPI.delete(createdBatchId!);
    // After deletion, retrieving should fail (not found in list)
    const batch = await batchAPI.list();
    const found = batch.results.find((b: any) => b.batchID === createdBatchId);
    expect(found).toBeUndefined();
  });
});

describe('Breed API CRUD', () => {
  let createdBreedId: number | null = null;
  // breedTypeID will be set in beforeAll
  const breedData = {
    breedName: 'Test Breed',
    breed_typeID: () => breedTypeID, // Use valid ID at runtime
  };

  it('should create a breed', async () => {
    const res = await breedAPI.create({
      breedName: breedData.breedName,
      breed_typeID: breedTypeID,
    });
    console.log('Breed create response:', res);
    expect(res.breedID || res.id).toBeDefined();
    createdBreedId = res.breedID || res.id;
    expect(res.breedName).toBe(breedData.breedName);
  });

  it('should retrieve the created breed', async () => {
    expect(createdBreedId).toBeDefined();
    const breeds = await breedAPI.list();
    const found = breeds.results.find((b: any) => b.breedID === createdBreedId);
    expect(found).toBeDefined();
    expect(found.breedName).toBe(breedData.breedName);
  });

  it('should update the breed', async () => {
    expect(createdBreedId).toBeDefined();
    const updatedData = { breedName: 'Updated Test Breed' };
    const updatedBreed = await breedAPI.update(createdBreedId!, updatedData);
    expect(updatedBreed.breedName).toBe(updatedData.breedName);
  });

  it('should delete the breed', async () => {
    expect(createdBreedId).toBeDefined();
    await breedAPI.delete(createdBreedId!);
    // After deletion, retrieving should fail (not found in list)
    const breeds = await breedAPI.list();
    const found = breeds.results.find((b: any) => b.breedID === createdBreedId);
    expect(found).toBeUndefined();
  });
});

describe('Device API CRUD', () => {
  let createdDeviceId: number | null = null;
  // You may need to adjust farmID to a valid ID in your DB
  const deviceData = {
    farmID: 1, // Replace with a valid farmID
    device_id: 'test-device-123',
    name: 'Test Device',
    cell_no: '1234567890',
    picture: 'device_default.png',
    status: true,
  };

  it('should create a device', async () => {
    const res = await deviceAPI.create(deviceData);
    console.log('Device create response:', res);
    expect(res.deviceID || res.id).toBeDefined();
    createdDeviceId = res.deviceID || res.id;
    expect(res.name).toBe(deviceData.name);
  });

  it('should retrieve the created device', async () => {
    expect(createdDeviceId).toBeDefined();
    const devices = await deviceAPI.list();
    const found = devices.results.find((d: any) => d.deviceID === createdDeviceId);
    expect(found).toBeDefined();
    expect(found.name).toBe(deviceData.name);
  });

  it('should update the device', async () => {
    expect(createdDeviceId).toBeDefined();
    const updatedData = { name: 'Updated Test Device' };
    const updatedDevice = await deviceAPI.update(createdDeviceId!, updatedData);
    expect(updatedDevice.name).toBe(updatedData.name);
  });

  it('should delete the device', async () => {
    expect(createdDeviceId).toBeDefined();
    await deviceAPI.delete(createdDeviceId!);
    // After deletion, retrieving should fail (not found in list)
    const devices = await deviceAPI.list();
    const found = devices.results.find((d: any) => d.deviceID === createdDeviceId);
    expect(found).toBeUndefined();
  });
});

describe('Farmer Role API Endpoints', () => {
  let farmerAccessToken = '';
  let farmerRefreshToken = '';

  beforeAll(async () => {
    const credentials = { username: 'abuu@gmail.com', password: '123@abuu' };
    const loginRes = await authAPI.login(credentials);
    farmerAccessToken = loginRes.access;
    farmerRefreshToken = loginRes.refresh || '';
    global.localStorage.setItem('accessToken', farmerAccessToken);
    global.localStorage.setItem('refreshToken', farmerRefreshToken);
  });

  it('should get current user as farmer', async () => {
    const user = await authAPI.getCurrentUser();
    expect(user).toBeDefined();
    expect(user.email || user.username).toBe('abuu@gmail.com');
  });

  it('should fetch farms accessible to farmer', async () => {
    const farms = await farmAPI.list();
    expect(farms.results).toBeDefined();
    expect(Array.isArray(farms.results)).toBe(true);
  });

  it('should NOT fetch all users (admin only)', async () => {
    let errorCaught = false;
    try {
      await userAPI.list();
    } catch (err: any) {
      errorCaught = true;
      expect(err.response?.status).toBe(403);
    }
    expect(errorCaught).toBe(true);
  });

  // Add more farmer-specific endpoint tests as needed
});
