<div align="center">
  <img src="https://img.icons8.com/color/96/000000/recycling.png" alt="econexus Logo" width="100"/>
  
  # 🌱 econexus
  ### Sustainable Product Lifecycle Platform
  
  <p align="center">
    <a href="https://general-laurie-scambot8-6320a7ec.koyeb.app/signin">Demo</a> •
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#team">Team</a> •
    <a href="#setup">Setup</a>
  </p>
  
  [![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://general-laurie-scambot8-6320a7ec.koyeb.app/login)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
</div>

---

## 📋 Table of Contents
- [About The Project](#about-the-project)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Team Members](#team-members)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 🌍 About The Project

**econexus** is a comprehensive web-based circular economy platform designed to track and manage the complete lifecycle of products from manufacturing to recycling. The platform enables manufacturers to register products with unique identifiers (RFID/NFC/Barcode/QR), allows customers to register used items for recycling collection, and provides blockchain-inspired transaction chains for complete lifecycle transparency.

### Key Highlights
- 🏭 **Multi-Role Support**: Separate dashboards for Companies, Customers, and Admins
- 🔗 **Blockchain-Inspired Tracking**: Immutable transaction chains for product lifecycle
- 📱 **Mobile-First Design**: Scan-first functionality with QR/Barcode support
- ♻️ **Recycling Management**: End-to-end pickup request and batch processing system
- 🔒 **Secure Authentication**: Role-based access control with OTP for customers

---

## 🎯 Problem Statement

### **Sustainability & Waste Management Challenge**

> *Rapid urbanization and modern lifestyles are generating unprecedented levels of waste — plastic, food, and electronic — while consuming enormous amounts of energy and natural resources. Most waste management systems are reactive, not preventive, and individuals often lack awareness of their environmental footprint.*

**Challenge**: How can technology be used to track, reduce, and repurpose waste, while also encouraging communities to adopt sustainable practices in their daily lives?

### Our Solution

econexus addresses this challenge by:
- ✅ Providing **complete product lifecycle tracking** from manufacturing to recycling
- ✅ Creating **transparency** through blockchain-inspired immutable transaction records
- ✅ Enabling **easy customer participation** through QR/barcode scanning
- ✅ Facilitating **efficient recycling collection** through structured pickup requests
- ✅ Empowering **data-driven decisions** with comprehensive analytics dashboards

---

## ✨ Features

<table>
  <tr>
    <td valign="top" width="33%">
      <h3>🏢 For Companies</h3>
      <ul>
        <li>Product registration with unique codes</li>
        <li>Bulk CSV upload support</li>
        <li>Product lifecycle monitoring</li>
        <li>Transaction history visualization</li>
        <li>Analytics dashboard</li>
      </ul>
    </td>
    <td valign="top" width="33%">
      <h3>👤 For Customers</h3>
      <ul>
        <li>Passwordless OTP login</li>
        <li>QR/Barcode scanning</li>
        <li>Pickup request submission</li>
        <li>Request tracking</li>
        <li>Product lifecycle view</li>
      </ul>
    </td>
    <td valign="top" width="33%">
      <h3>👨‍💼 For Admins</h3>
      <ul>
        <li>Company verification</li>
        <li>Pickup request management</li>
        <li>Recycling batch creation</li>
        <li>System-wide analytics</li>
        <li>User management</li>
      </ul>
    </td>
  </tr>
</table>

### Core Functionality

- **Product Registration**: Companies can register products with RFID/NFC/QR/Barcode identifiers
- **Transaction Chains**: Blockchain-inspired immutable history tracking every product event
- **Smart Scanning**: Mobile camera integration for quick product identification
- **Pickup System**: Customers can request recycling pickups with location and date preferences
- **Batch Processing**: Admins organize collected items into recycling batches
- **Real-time Analytics**: Dashboard statistics for all stakeholders

---

## 🛠 Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4.20-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21.2-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-0.39.1-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)

</div>

### Detailed Stack

<table>
  <tr>
    <th>Category</th>
    <th>Technologies</th>
  </tr>
  <tr>
    <td><strong>Frontend Framework</strong></td>
    <td>React 18, TypeScript, Vite</td>
  </tr>
  <tr>
    <td><strong>UI Components</strong></td>
    <td>Shadcn/ui, Radix UI, Tailwind CSS</td>
  </tr>
  <tr>
    <td><strong>State Management</strong></td>
    <td>TanStack Query (React Query)</td>
  </tr>
  <tr>
    <td><strong>Routing</strong></td>
    <td>Wouter</td>
  </tr>
  <tr>
    <td><strong>Form Handling</strong></td>
    <td>React Hook Form, Zod Validation</td>
  </tr>
  <tr>
    <td><strong>Backend Server</strong></td>
    <td>Express.js, TypeScript (TSX)</td>
  </tr>
  <tr>
    <td><strong>Database</strong></td>
    <td>PostgreSQL (Neon), Drizzle ORM</td>
  </tr>
  <tr>
    <td><strong>Authentication</strong></td>
    <td>Express Session, Passport.js, Bcrypt</td>
  </tr>
  <tr>
    <td><strong>QR/Barcode Scanning</strong></td>
    <td>html5-qrcode</td>
  </tr>
  <tr>
    <td><strong>Data Visualization</strong></td>
    <td>Recharts</td>
  </tr>
  <tr>
    <td><strong>File Processing</strong></td>
    <td>PapaParse (CSV)</td>
  </tr>
  <tr>
    <td><strong>Icons & Animations</strong></td>
    <td>Lucide React, Framer Motion</td>
  </tr>
</table>

---

## 🏗 Architecture

```
econexus/
├── client/                 # Frontend React Application
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page components
│       ├── hooks/         # Custom React hooks
│       └── lib/           # Utilities and helpers
│
├── server/                # Backend Express Server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── auth.ts           # Authentication logic
│   ├── middleware.ts     # Custom middleware
│   ├── seed.ts           # Database seeding
│   └── vite.ts           # Vite integration
│
└── shared/               # Shared types and schemas
    └── schema.ts         # Drizzle database schema
```

### Key Architectural Features

- **SPA Architecture**: Single Page Application with client-side routing
- **RESTful API**: Clean separation between frontend and backend
- **Type Safety**: End-to-end TypeScript for reduced bugs
- **Role-Based Access Control**: Middleware-based authorization
- **Session Management**: Secure HTTP-only cookies
- **Blockchain-Inspired Chains**: Immutable transaction history

---

## 👥 Team Members

<table>
  <tr>
    <td align="center">
      <img src="https://img.icons8.com/color/96/000000/user-male-circle--v1.png" width="100px;" alt=""/>
      <br />
      <sub><b>Pranjal Yadav</b></sub>
      <br />
      <sub>Frontend Developer</sub>
      <br />
      <p>🎨 Designed and developed the complete frontend interface using React, TypeScript, and Tailwind CSS. Implemented the responsive UI components, scanner interface, and role-based dashboards.</p>
    </td>
    <td align="center">
      <img src="https://img.icons8.com/color/96/000000/user-male-circle--v1.png" width="100px;" alt=""/>
      <br />
      <sub><b>Mujeem Khan</b></sub>
      <br />
      <sub>Backend Developer</sub>
      <br />
      <p>⚙️ Built the backend architecture with Express.js, PostgreSQL, and Drizzle ORM. Handled database design, API development, authentication system, and debugging.</p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://img.icons8.com/color/96/000000/user-male-circle--v1.png" width="100px;" alt=""/>
      <br />
      <sub><b>Pranjal Varshney</b></sub>
      <br />
      <sub>Ideation & Strategy</sub>
      <br />
      <p>💡 Led the brainstorming sessions and conceptualized the solution for the sustainability challenge. Defined the product vision and core features.</p>
    </td>
    <td align="center">
      <img src="https://img.icons8.com/color/96/000000/user-male-circle--v1.png" width="100px;" alt=""/>
      <br />
      <sub><b>Danish Ahmad</b></sub>
      <br />
      <sub>Ideation & Strategy</sub>
      <br />
      <p>🧠 Contributed to idea generation and problem analysis. Helped shape the platform's approach to solving waste management challenges.</p>
    </td>
  </tr>
</table>

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v20 or higher)
- **PostgreSQL** database
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/econexus.git
   cd econexus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret_key
   NODE_ENV=development
   PORT=5000
   ```

4. **Push database schema**
   ```bash
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   Navigate to http://localhost:5000
   ```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 📖 Usage

### Test Credentials

The application comes with pre-seeded test accounts:

<table>
  <tr>
    <th>Role</th>
    <th>Login Credentials</th>
  </tr>
  <tr>
    <td><strong>Admin</strong></td>
    <td>
      Admin ID: <code>admin_001</code><br/>
      Password: <code>admin123</code>
    </td>
  </tr>
  <tr>
    <td><strong>Company (Verified)</strong></td>
    <td>
      Email: <code>company@example.com</code><br/>
      Password: <code>company123</code>
    </td>
  </tr>
  <tr>
    <td><strong>Company (Pending)</strong></td>
    <td>
      Email: <code>pending@example.com</code><br/>
      Password: <code>test123</code>
    </td>
  </tr>
  <tr>
    <td><strong>Customer</strong></td>
    <td>
      Use any email to receive OTP<br/>
      (OTP is logged to console in development)
    </td>
  </tr>
</table>

### Quick Start Guide

1. **For Companies**:
   - Login with company credentials
   - Register products with unique codes
   - Upload bulk products via CSV
   - Monitor product lifecycle

2. **For Customers**:
   - Login with email OTP
   - Scan product QR/barcode
   - Submit recycling pickup requests
   - Track request status

3. **For Admins**:
   - Login with admin credentials
   - Verify new companies
   - Manage pickup requests
   - Create recycling batches

---

## 📸 Screenshots

<div align="center">
  <h3>Login Page</h3>
  <img src="https://via.placeholder.com/800x450.png?text=econexus+Login" alt="Login Page" width="80%"/>
  
  <h3>Company Dashboard</h3>
  <img src="https://via.placeholder.com/800x450.png?text=Company+Dashboard" alt="Company Dashboard" width="80%"/>
  
  <h3>Scanner Interface</h3>
  <img src="https://via.placeholder.com/800x450.png?text=QR+Scanner" alt="Scanner" width="80%"/>
</div>

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

---

## 📞 Contact

Project Link: [https://github.com/yourusername/econexus](https://github.com/uniquekh/final_eco_nexus.git)

---

<div align="center">
  <p>Made with ❤️ by Team econexus</p>
  <p>
    <a href="#top">⬆️ Back to Top</a>
  </p>
</div>
