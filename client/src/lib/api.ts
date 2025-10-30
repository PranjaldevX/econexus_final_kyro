// API Configuration and Helper Functions
// Update these URLs to match your actual backend deployments

// FastAPI backend - handles products, pickups, rewards
export const FASTAPI_BASE_URL = "http://localhost:8000"; // Change this to your FastAPI backend URL

// Flask backend - handles authentication
export const FLASK_BASE_URL = "http://localhost:5000"; // Change this to your Flask backend URL

// API Helper Functions
export async function fastApiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${FASTAPI_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  return response;
}

export async function flaskApiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${FLASK_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  return response;
}

// Specific API functions matching your backends
export const api = {
  // ==================== AUTHENTICATION APIs (Flask Backend) ====================
  
  // Customer Authentication
  registerCustomer: async (userData: { name: string; email: string; password: string }) => {
    const response = await flaskApiRequest('/api/auth/customer/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  loginCustomer: async (credentials: { email: string; password: string }) => {
    const response = await flaskApiRequest('/api/auth/customer/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  // Company Authentication
  registerCompany: async (companyData: { 
    name: string; 
    email: string; 
    password: string; 
    companyName: string; 
    registrationNumber: string; 
  }) => {
    const response = await flaskApiRequest('/api/auth/company/register', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
    return response.json();
  },

  loginCompany: async (credentials: { email: string; password: string }) => {
    const response = await flaskApiRequest('/api/auth/company/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  // Admin Authentication
  loginAdmin: async (credentials: { adminId: string; password: string }) => {
    const response = await flaskApiRequest('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  // Admin Company Management
  getPendingCompanies: async () => {
    const response = await flaskApiRequest('/api/admin/companies/pending');
    return response.json();
  },

  getAllCompanies: async () => {
    const response = await flaskApiRequest('/api/admin/companies');
    return response.json();
  },

  verifyCompany: async (companyId: string) => {
    const response = await flaskApiRequest('/api/admin/companies/verify', {
      method: 'POST',
      body: JSON.stringify({ companyId }),
    });
    return response.json();
  },

  rejectCompany: async (companyId: string) => {
    const response = await flaskApiRequest('/api/admin/companies/reject', {
      method: 'POST',
      body: JSON.stringify({ companyId }),
    });
    return response.json();
  },

  // Health Check
  healthCheck: async () => {
    const response = await flaskApiRequest('/health');
    return response.json();
  },

  // ==================== PRODUCT & BUSINESS APIs (FastAPI Backend) ====================

  // Product Management
  addProduct: async (productData: { email: string; added_at: string; product_rfid: string }) => {
    const response = await fastApiRequest('/add_product', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return response.json();
  },

  addProductCompany: async (productData: {
    company_email: string;
    product_name: string;
    category: string;
    material: string;
    size: string;
    batch_no: string;
    price: string;
    manufacture_date: string;
  }) => {
    const response = await fastApiRequest('/add_product_company', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return response.json();
  },

  getProductsByEmail: async (email: string) => {
    const response = await fastApiRequest(`/get_products_by_email?email=${encodeURIComponent(email)}`);
    return response.json();
  },

  getAllProducts: async () => {
    const response = await fastApiRequest('/all_products');
    return response.json();
  },

  getProductsByCompany: async (companyEmail: string) => {
    const response = await fastApiRequest(`/products_by_company/${encodeURIComponent(companyEmail)}`);
    return response.json();
  },

  getProductByRfid: async (rfid: string) => {
    const response = await fastApiRequest(`/product_by_rfid/${encodeURIComponent(rfid)}`);
    return response.json();
  },

  // Reward Calculation
  calculateReward: async (rewardData: {
    material: string;
    price: number;
    manufacture_date: string;
    added_date: string;
  }) => {
    const response = await fastApiRequest('/calculate-reward/', {
      method: 'POST',
      body: JSON.stringify(rewardData),
    });
    return response.json();
  },

  // Product Status Management
  updateProductStatus: async (statusData: {
    rfid: string;
    status: string;
    email: string;
  }) => {
    const response = await fastApiRequest('/update_product_status', {
      method: 'POST',
      body: JSON.stringify(statusData),
    });
    return response.json();
  },

  bulkUpdateProductStatus: async (bulkData: {
    email: string;
    rfids: string[];
    status: string;
  }) => {
    const response = await fastApiRequest('/bulk_update_product_status', {
      method: 'POST',
      body: JSON.stringify(bulkData),
    });
    return response.json();
  },

  getProductsByStatus: async (email: string, status: string) => {
    const response = await fastApiRequest(`/products_by_status/${encodeURIComponent(email)}/${encodeURIComponent(status)}`);
    return response.json();
  },

  // Pickup Management
  createPickup: async (pickupData: {
    email: string;
    location: string;
    preferredDate?: string;
  }) => {
    const response = await fastApiRequest('/api/pickups', {
      method: 'POST',
      body: JSON.stringify(pickupData),
    });
    return response.json();
  },

  getUserPickups: async (email: string) => {
    const response = await fastApiRequest(`/api/pickups/${encodeURIComponent(email)}`);
    return response.json();
  },

  getAllPickups: async () => {
    const response = await fastApiRequest('/api/pickups');
    return response.json();
  },

  updatePickupStatus: async (pickupId: string, status: string) => {
    const response = await fastApiRequest(`/api/pickups/${encodeURIComponent(pickupId)}/status`, {
      method: 'PUT',
      body: JSON.stringify({ pickup_id: pickupId, status }),
    });
    return response.json();
  },

  deletePickup: async (pickupId: string) => {
    const response = await fastApiRequest(`/api/pickups/${encodeURIComponent(pickupId)}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  getPickupsByStatus: async (status: string) => {
    const response = await fastApiRequest(`/api/pickups/status/${encodeURIComponent(status)}`);
    return response.json();
  },

  // Utility
  getUsers: async () => {
    const response = await fastApiRequest('/users');
    return response.json();
  },

  testUpdate: async (rfid: string) => {
    const response = await fastApiRequest(`/test_update/${encodeURIComponent(rfid)}`);
    return response.json();
  },
};