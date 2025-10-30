# CircularChain - Sustainable Product Lifecycle Platform

## Overview

CircularChain is a web-based circular economy platform that enables manufacturers to register products with unique identifiers (RFID/NFC/Barcode/QR), allows customers to register used items for recycling collection, and provides comprehensive lifecycle tracking with blockchain-inspired transaction chains. The platform serves three distinct user roles (companies, customers, and admins) with role-specific dashboards and workflows for managing the complete product lifecycle from manufacturing to recycling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript in SPA (Single Page Application) mode
- Vite as build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and API communication

**UI Component System:**
- Shadcn/ui component library built on Radix UI primitives
- Material Design 3 principles with sustainability-focused customization
- Tailwind CSS for styling with custom design tokens
- Theme system supporting light/dark modes via context provider
- Custom color palette emphasizing forest green (sustainability) and slate blue (professional/tech)

**Design Philosophy:**
- Mobile-first approach with scan-first functionality
- Information-dense dashboards for admin/company roles
- Simplified interfaces for customer role
- Data legibility prioritized over decorative elements
- Role-appropriate complexity (denser admin views, simpler customer views)

**Key UI Patterns:**
- Role-based sidebar navigation (AppSidebar component)
- Reusable card components for products, pickups, and statistics
- Scanner interface with camera and manual entry modes
- Transaction chain visualization (blockchain-like display)
- Status badge system for product lifecycle states

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- Session-based authentication using express-session
- RESTful API architecture with role-based access control (RBAC)
- Middleware-based authorization (requireAuth, requireRole, requireCompany, requireCustomer, requireAdmin)

**Authentication Strategy:**
- **Company users:** Email + password authentication
- **Customer users:** Email OTP (One-Time Password) verification (passwordless flow)
- **Admin users:** Admin ID + password authentication
- Session persistence with HTTP-only cookies
- Password hashing via bcryptjs

**Transaction Chain System:**
- Blockchain-inspired immutable transaction history
- Each product event creates a new chained transaction with:
  - Unique transaction ID
  - Reference to previous transaction ID (chain linkage)
  - SHA-256 hash computed from transaction data
  - Actor information (role and ID)
  - Timestamp and optional location
- Provides audit trail and lifecycle transparency without actual blockchain implementation

**API Architecture:**
- Session-based authentication endpoints (`/api/auth/*`)
- Role-specific protected routes with middleware guards
- Bulk product upload capabilities for companies
- Pickup request management workflows
- Recycling batch tracking for admins

### Data Storage

**Database:**
- PostgreSQL as primary database (configured via DATABASE_URL environment variable)
- Drizzle ORM for type-safe database access and schema management
- Neon Database serverless driver for PostgreSQL connections

**Core Data Models:**
- **Users table:** Multi-role support (company/customer/admin) with role-specific fields
  - Company-specific: companyName, registrationNumber, verified status
  - Admin-specific: adminId
  - Customer: email-based with OTP authentication
- **Products table:** Product metadata with unique codes (RFID/NFC/QR/Barcode)
  - Fields: productCode, name, category, material, size, batchNo, manufactureDate, status
  - Foreign key to company (manufacturer)
- **Transactions table:** Immutable event chain for each product
  - Fields: txId, previousTxId, productId, status, actorId, actorRole, timestamp, location, hash
- **PickupRequests table:** Customer-initiated collection requests
- **RecyclingBatches table:** Admin-managed inventory batches sent to recyclers
- **OTPs table:** Temporary one-time passwords for customer authentication

**Schema Management:**
- Drizzle Kit for migrations (output: ./migrations)
- Type-safe schema definitions in shared/schema.ts
- Zod validation schemas derived from Drizzle schemas

### External Dependencies

**Third-Party Libraries:**
- **UI Components:** Radix UI primitives (@radix-ui/*) for accessible, unstyled components
- **Form Management:** React Hook Form with Zod resolvers (@hookform/resolvers)
- **Styling:** Tailwind CSS with class-variance-authority for variant management
- **Icons:** Lucide React for consistent iconography
- **Fonts:** Google Fonts (Inter for UI, JetBrains Mono for monospace codes)
- **Data Parsing:** PapaParse for CSV bulk uploads
- **Development:** Replit-specific plugins for dev banner, cartographer, and runtime error overlay

**Production Services:**
- PostgreSQL database (via Neon or compatible provider)
- Email/SMS service for OTP delivery (currently console-logged, requires integration)
- File upload storage for bulk product CSV imports (to be implemented)

**Environment Configuration:**
- `DATABASE_URL`: PostgreSQL connection string (required)
- `SESSION_SECRET`: Session encryption key (defaults to demo value, must override in production)
- `NODE_ENV`: Environment mode (development/production)

**Security Considerations:**
- HTTPS required in production (secure cookies)
- CSRF protection via session configuration
- Input validation via Zod schemas
- SQL injection protection via Drizzle ORM parameterized queries
- Password hashing with bcrypt (10 rounds)
- HTTP-only session cookies with 1-week expiration