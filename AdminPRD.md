# Alanaatii - Admin Panel Product Requirements Document (PRD)

## 1. Overview
The Alanaatii Admin Panel is the centralized command center for managing the luxury calligraphy and gifting platform. It enables administrators to manage the end-to-end order lifecycle, verify payments, onboard writers, configure product catalogs, and handle customer support.

### Technology Stack
- **Backend Framework**: Django (Python)
- **API**: Django REST Framework (DRF)
- **Database**: PostgreSQL (as per schema design)
- **Auth**: JWT-based Authentication (Admin/Writer/User roles)

---

## 2. Core Modules & Features

### 2.1 Catalog & Inventory Management
Dynamic control over the products offered on the platform.
- **Features**:
  - CRUD operations for Letter Themes, Papers, Boxes, Gifts, and Text Styles.
  - Manage Script Packages (Basic/Premium).
  - Toggle visibility (Active/Inactive) for catalog items.
  - Update pricing and descriptions.
- **Associated Tables**:
  - `catalog_items`: Unified table for all product components (differentiated by `category`).

### 2.2 Business Rules & Configuration
Defining the platform's operating logic and pricing engines.
- **Features**:
  - **Pricing Rules**: Manage urgency fees (e.g., < 4 weeks delivery).
  - **Pincode Rules**: Regional shipping fees based on zip prefixes.
  - **Mandatory Questions**: Define questions asked to users based on their selected `relation`.
  - **Coupons**: Create and manage discount codes (Percentage/Flat).
- **Associated Tables**:
  - `pricing_day_rules`: Urgency fee thresholds.
  - `pincode_rules`: Shipping fee mapping.
  - `mandatory_questions`: Relation-based logic.
  - `coupons`: Discount engine data.
  - `site_settings`: Global constants (UPI ID, etc.).

### 2.3 Payment & Financial Management
Verifying customer payments and managing financial reversals.
- **Features**:
  - Verify payment screenshots uploaded by customers.
  - Approve/Reject transactions (triggers order status changes).
  - Process and track refunds.
  - Monitor revenue analytics and dashboard KPIs.
- **Associated Tables**:
  - `transactions`: Records of screenshot uploads and verification status.
  - `refunds`: Logs of processed financial reversals.
  - `orders`: For total value and payment state.

### 2.4 Writer Management
Overseeing the creative team and assignment lifecycles.
- **Features**:
  - Onboard new writers (Name, Email, Languages, Skills).
  - Monitor writer status (Active/Away).
  - View assignment history and performance metrics.
  - Manage job offers and acceptances.
- **Associated Tables**:
  - `writers`: Profile and credential storage.
  - `writer_assignments`: Historical data of job completion and job status.
  - `payouts`: (Planned) Financial tracking for staff.

### 2.5 Support & Engagement
Handling customer interactions and platform help content.
- **Features**:
  - Read and respond to support inquiries.
  - Review and publish customer testimonials (Reviews).
  - Manage FAQ content for self-service help.
- **Associated Tables**:
  - `support_messages`: Contact form submissions.
  - `reviews`: Customer testimonials linked to orders.
  - `faq`: Self-service help content.

### 2.6 Order & Script Management (Internal Operations)
Managing the execution of orders from placement to final delivery.
- **Features**:
  - View all orders with filtering by status and product type.
  - Assign writers to orders.
  - Review script drafts submitted by writers.
  - Update order status (Pending → Approved → Shipped → Delivered).
  - Track courier and tracking information.
- **Associated Tables**:
  - `orders`: Primary record of the transaction.
  - `order_status_history`: Audit trail for status changes.
  - `script_versions`: Storing all drafts and final content.

---

## 3. Backend Implementation (Django DRF)

### 3.1 Authentication & Permissions
- Use `rest_framework.permissions` to enforce role-based access.
- `IsAdminUser` for catalog and system configurations.
- Custom `IsWriter` for script editing and assignment acceptance.

### 3.2 Key API Endpoints
| Module | Endpoint | Methods | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/login/` | POST | JWT token generation |
| **Orders** | `/api/admin/orders/` | GET, PUT, PATCH | Manage all order data |
| **Payments** | `/api/admin/payments/` | GET, PATCH | Verify screenshots |
| **Catalog** | `/api/admin/catalog/` | GET, POST, PUT, DELETE | CRUD for all items |
| **Writers** | `/api/admin/writers/` | GET, POST, PATCH | Manage writer profiles |
| **Rules** | `/api/admin/rules/pincodes/`| GET, POST, DELETE | Shipping fee config |
| **Support** | `/api/admin/support/` | GET, PATCH | Manage inquiries |

### 3.3 Business Logic Requirements
- **Order Flow Trigger**: When a transaction status is updated to `verified`, the order status must automatically move to `order_placed`.
- **Assignment Logic**: When an order is assigned, a record must be created in `writer_assignments` and a notification triggered.
- **Auto-Provisioning**: Upon first order placement by a guest, a record in the `users` table should be created if it doesn't exist (linked by email).

---

## 4. Analytics & Auditing
- **Audit Logs**: Every sensitive action (Status change, Payment approval, Catalog edit) must be logged in `audit_logs` with the `admin_id` and timestamp.
- **Dashboard KPIs**:
  - Total Revenue (Verified Transactions).
  - Active Orders by Stage.
  - Writer Workload distribution.
