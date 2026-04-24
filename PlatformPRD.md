# Alanaatii - Platform Product Requirements Document (PRD)

## 1. Overview
Alanaatii is a premium luxury calligraphy and gifting platform. This document defines the comprehensive technical requirements, business logic, and operational flows for the **Admin**, **Writer**, and **Customer** portals to guide the Django DRF backend implementation.

### Technology Stack
- **Backend**: Django & Django REST Framework (DRF)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens) with Role-Based Access Control (RBAC)
- **Storage**: AWS S3 or Cloudinary for payment screenshots and assets.

---

## 2. Core Functional Modules

### 2.1 Catalog & Inventory Management
- **Description**: Centralized registry for all platform offerings.
- **Functionalities**:
  - **CRUD Catalog Items**: Manage titles, descriptions, prices, and images for:
    - Letter Themes (Love, Birthday, etc.)
    - Calligraphy Styles (English, Telugu, Handwritten, etc.)
    - Premium Papers
    - Packaging Boxes
    - Add-on Gifts (Teddies, Chocolates, etc.)
  - **Script Packages**: Define 'Basic' vs 'Premium' script services with fixed pricing.
- **Flow**: Admin updates item → Site frontend fetches `/api/catalog/` → Displays current pricing and availability to customer.
- **Associated Tables**: `catalog_items`

### 2.2 Business Rules & Configuration
- **Pincode Engine**: Map 3-digit/6-digit zip prefixes to specific delivery fees.
- **Urgency Pricing**: Automated +₹ surcharge calculation if `delivery_date` is less than 4 weeks from `created_at`.
- **Dynamic Questions**: Map "Mandatory Questions" to specific `relation` types (e.g., if relation is "Parent", ask "What is your favorite childhood memory?").
- **Promotions**: Coupon system supporting:
  - Percentage-based vs. Flat discounts.
  - Active/Inactive toggles and expiration dates.
  - Usage tracking (`max_uses` vs. `current_uses`).
- **Associated Tables**: `pricing_day_rules`, `pincode_rules`, `mandatory_questions`, `coupons`, `site_settings`, `relation_categories`

### 2.3 User & Profile Management
- **Authentication**: Standard explicit Login/Signup via email/password alongside Implicit Login (first-time guest checkout triggers `User` creation).
- **Auto-Account Provisioning**: Backend generates a temporary password or magic link for first-time guest buyers.
- **Address Book**: Users can save/update multiple addresses with "Primary" flags.
- **Occasion Reminders**: Capture and store important dates (Birthdays, Anniversaries) to trigger future marketing notifications.
- **Associated Tables**: `users`, `user_addresses`

### 2.4 Writer Management (Admin)
- **Writer Creation & Verification Flow**:
  1. Admin enters new writer's email and details.
  2. System sends an OTP (verification code) to the entered email.
  3. The system prompts the Admin for this OTP.
  4. Admin retrieves the OTP (from the writer) and enters it to finalize account creation.
- **Monitoring**: Track writer status (Active/Away) and performance review.
- **Associated Tables**: `writers`, `payouts` (for future compensation tracking)

### 2.5 Script Writer Profile & Security (Writer Portal)
- **Profile Management**: Writers can manage their personal details and language skills.
- **Password Update Flow**: 
  1. Writer initiates password update in their profile section.
  2. System sends an OTP to their registered email.
  3. Writer must enter the OTP to verify identity and confirm the password change.
- **Associated Tables**: `writers`

### 2.6 Admin Analytics & Oversight
- **Dashboard & Analytics**: High-level and detailed metrics (Revenue, Active Orders by stage, Writer performance, Turnaround times).
- **Script Oversight**: Admins have a dedicated view (`AdminScripts`) to monitor all drafted content, intervene, or override writer submissions if necessary.
- **Associated Tables**: `admins` (admin profiles), `audit_logs`

### 2.7 Payments, Refunds & Support
- **Financials**: Process refunds for canceled or rejected orders.
- **Support & Engagement**: Manage user inquiries (`Contact.tsx`), FAQs, and review/publish customer testimonials.
- **Landing Page CMS**: Manage the "8 Steps" track shown on the Index page.
- **Associated Tables**: `transactions`, `refunds`, `support_messages`, `reviews`, `faq`, `site_content_steps`

---

## 3. Operational Flows (Fulfillment Lifecycle)

### 3.1 Order Placement & Payment Flow
1.  **Trigger**: Customer completes the multi-step `OrderFlow` UI.
2.  **Action**: Customer submits order details (Recipient info, selections, message).
3.  **System Response**:
    - Record created in `orders` with status `payment_pending`.
    - User account created if new (linked by email).
4.  **Payment Action**: Customer scans UPI QR and uploads screenshot (`payment_ss`).
5.  **Admin Response**: Admin reviews `/api/admin/payments/`.
    - **Approve**: `orders.status` → `order_placed`. Notification sent to Customer.
    - **Reject**: Transaction marked `rejected`. Customer notified to re-upload.

### 3.2 Writer Assignment & Script Flow
1.  **Trigger**: Order status becomes `order_placed`.
2.  **Action**: Admin selects a Writer based on language skills and clicks "Assign".
3.  **System Response**:
    - `orders.status` → `assigned_to_writer`.
    - `writer_assignments` record created (Status: `pending`).
    - Notification sent to Writer via WhatsApp/Email.
4.  **Writer Action**: Writer views `/api/writer/requests/`.
    - **Accept**: `assignments.status` → `accepted`; `orders.status` → `accepted_by_writer`.
    - **Decline**: `assignments.status` → `declined`. Notification to Admin to re-assign.
5.  **Drafting**: Writer uses Editor to save `writer_drafts`. Once done, clicks "Submit".
    - `script_versions` (v1) created.
    - `orders.status` → `script_submitted`.
    - Notification sent to Customer.

### 3.3 Customer Review & Revision Flow
1.  **Trigger**: Order status is `script_submitted`.
2.  **Action**: Customer reviews script in their dashboard.
    - **Approve**: `orders.status` → `approved`. Notification to Writer to start physical writing.
    - **Request Revision**: Customer submits feedback.
      - `orders.status` → `revision_requested`.
      - `script_versions` (v2) entry placeholder.
      - Notification sent to Writer.
3.  **Loop**: Writer updates script → Submits → Customer reviews again.

### 3.4 Physical Fulfillment & Delivery
1.  **Trigger**: Order status is `approved`.
2.  **Action**: Admin completes the physical calligraphy and packages the gift.
3.  **Status Update**: Artist/Admin updates status to `under_writing`.
4.  **Shipping**: Admin enters `tracking_id` and `courier_name`.
    - `orders.status` → `out_for_delivery`.
    - Notification sent to Customer with tracking link.
5.  **Completion**: Delivery partner confirms delivery.
    - `orders.status` → `delivered`.
    - Notification sent to Customer requesting a Review/Testimonial.

*Note: All order status changes are logged in `order_status_history`.*

---

## 4. Backend Implementation (Django DRF)

### 4.1 RBAC Policy (Roles)
- **Admin**: Full access to all modules and configurations.
- **Writer**: Access to assigned orders, editor, and personal assignments.
- **Customer**: Access to own orders, profile, and script review page.

### 4.2 Essential API Endpoints
| Role | Endpoint | Methods | Description |
| :--- | :--- | :--- | :--- |
| **All** | `/api/auth/login/` | POST | Login with email/password |
| **Customer**| `/api/orders/` | POST | Create new order (checkout) |
| **Customer**| `/api/my-orders/` | GET | List own orders & status |
| **Customer**| `/api/orders/<id>/approve/` | POST | Approve script draft |
| **Writer** | `/api/writer/requests/` | GET, PATCH | Accept/Decline jobs |
| **Writer** | `/api/writer/scripts/` | POST | Submit script draft |
| **Admin** | `/api/admin/payments/` | PATCH | Verify payment screenshot |
| **Admin** | `/api/admin/assign/` | POST | Link writer to order |
| **Admin** | `/api/admin/catalog/` | CRUD | Manage all product items |

### 4.3 Notification Triggers
The backend must trigger WhatsApp/Email alerts on the following events:
- Order Placed (to Admin)
- Payment Verified (to Customer)
- Job Assigned (to Writer)
- Script Submitted (to Customer)
- Revision Requested (to Writer)
- Script Approved (to Writer) & (to Admin)
- Shipped (to Customer)

*Note: All alerts are stored in the `notifications` table.*

---

## 5. Audit & Assets
- **Audit Logs**: Maintain a record of who changed which order status and when (`audit_logs`, `order_status_history`).
- **Assets Table**: Centralized mapping of all files (screenshots, product images) to their storage URLs and associated entities (`assets`).
