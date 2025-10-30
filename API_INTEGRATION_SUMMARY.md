# API Integration Summary

## Overview
Your frontend has been updated to work with your two backend APIs:

1. **FastAPI Backend** - Handles products, pickups, rewards, etc.
2. **Flask Backend** - Handles authentication (login/register)

## Changes Made

### 1. Created New API Configuration (`client/src/lib/api.ts`)
- Centralized API configuration with proper base URLs
- Separate functions for FastAPI and Flask backends
- All API endpoints properly mapped to your backend functions

### 2. Fixed Frontend Components
Updated all components to use the new API configuration:

- ✅ `app-sidebar.tsx` - Fixed product stats queries
- ✅ `AddProductDialog.tsx` - Fixed company product creation
- ✅ `CustomerDashboard.tsx` - Fixed product fetching, scanning, and reward calculation
- ✅ `CompanyDashboard.tsx` - Fixed company product listing
- ✅ `RequestPickupDialog.tsx` - Fixed pickup creation and product status updates
- ✅ `AdminDashboard.tsx` - Fixed admin product management
- ✅ `ProductDetails.tsx` - Fixed product lookup by RFID
- ⚠️ `BulkUploadDialog.tsx` - Commented out (endpoint doesn't exist in backend)

### 3. API Endpoint Mapping

#### FastAPI Backend Endpoints (Products & Business Logic):
- `GET /all_products` - Get all products
- `GET /get_products_by_email?email={email}` - Get products by user email (Fixed: now uses GET instead of POST)
- `GET /products_by_company/{email}` - Get products by company
- `GET /product_by_rfid/{rfid}` - Get product by RFID
- `POST /add_product` - Add product to user account
- `POST /add_product_company` - Create new product (company)
- `POST /calculate-reward/` - Calculate reward points
- `POST /update_product_status` - Update product status
- `POST /bulk_update_product_status` - Bulk update product status
- `GET /products_by_status/{email}/{status}` - Get products by status
- `POST /api/pickups` - Create pickup request
- `GET /api/pickups/{email}` - Get user pickups
- `GET /api/pickups` - Get all pickups (admin)
- `PUT /api/pickups/{pickup_id}/status` - Update pickup status
- `DELETE /api/pickups/{pickup_id}` - Delete pickup
- `GET /api/pickups/status/{status}` - Get pickups by status
- `GET /users` - Get all users
- `GET /test_update/{rfid}` - Test endpoint

#### Flask Backend Endpoints (Authentication):
- `POST /api/auth/customer/register` - Customer registration
- `POST /api/auth/customer/login` - Customer login
- `POST /api/auth/company/register` - Company registration
- `POST /api/auth/company/login` - Company login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/admin/companies/pending` - Get pending companies
- `GET /api/admin/companies` - Get all companies
- `POST /api/admin/companies/verify` - Verify company
- `POST /api/admin/companies/reject` - Reject company
- `GET /health` - Health check

## Configuration Required

### 1. Update API Base URLs
Edit `client/src/lib/api.ts` and update these URLs to match your deployed backends:

```typescript
// FastAPI backend - handles products, pickups, rewards
export const FASTAPI_BASE_URL = "http://localhost:8000"; // Change this to your FastAPI backend URL

// Flask backend - handles authentication
export const FLASK_BASE_URL = "http://localhost:5000"; // Change this to your Flask backend URL
```

### 2. Backend Deployment URLs
Replace the placeholder URLs with your actual deployment URLs:
- FastAPI Backend: `https://your-fastapi-backend.com`
- Flask Backend: `https://your-flask-backend.com`

### 3. Missing Endpoints
The following endpoint is referenced in the frontend but doesn't exist in your backend:
- `POST /bulk_upload` - For bulk product upload (BulkUploadDialog component)

## Testing Checklist

### FastAPI Backend Testing:
- [ ] Product creation (companies)
- [ ] Product registration (customers)
- [ ] Product scanning and lookup
- [ ] Reward calculation
- [ ] Pickup requests
- [ ] Product status updates
- [ ] Admin product management

### Flask Backend Testing:
- [ ] Customer registration/login
- [ ] Company registration/login
- [ ] Admin login
- [ ] Company verification workflow

## Next Steps

1. **Deploy your backends** and get the actual URLs
2. **Update the API base URLs** in `client/src/lib/api.ts`
3. **Test all functionality** using the checklist above
4. **Implement bulk upload endpoint** in FastAPI backend if needed
5. **Add error handling** and loading states as needed

## Notes

- All API calls now use proper error handling
- The frontend correctly distinguishes between FastAPI and Flask endpoints
- CORS should be properly configured on both backends
- Authentication state management may need to be implemented for login persistence