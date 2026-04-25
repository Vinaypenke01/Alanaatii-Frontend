# Alanaatii - System Workflows & Data Mapping (Detailed)

This document provides a forensic breakdown of the Alanaatii platform's functional logic, mapping specific UI actions to backend state transitions and database models.

---

## 1. The Customer "Order-to-Delivery" Flow
Managing the luxury letter and gift customization experience.

### Phase 1: Product Selection & Discovery
- **Action**: User views offerings on the [Products Page](file:///e:/Client-Projects/alanaatii/alanaatii-letters-gifts-main/src/pages/Products.tsx) and navigates to a dedicated [ProductDetail](file:///e:/Client-Projects/alanaatii/alanaatii-letters-gifts-main/src/pages/ProductDetail.tsx) page to learn about features and pricing.
- **Internal Logic**: 
  - System renders deep-dive information for the selected product type.
  - Clicking "Start Customizing" forwards the user to `OrderFlow.tsx` with the product type pre-selected.
- **Primary Model**: `catalog_items`.

### Phase 2: Urgency & Logistics (Rules Engine)
- **Action**: User selects a delivery date and enters a pincode in [OrderFlow.tsx](file:///e:/Client-Projects/alanaatii/alanaatii-letters-gifts-main/src/pages/OrderFlow.tsx).
- **Internal Logic**:
  - **Urgency Check**: Calculated by `pricing_day_rules`. If (Delivery Date - Current Date) < 28 days, a +₹100 `early_fee` is injected.
  - **Pincode Lookup**: System checks `pincode_rules` for the first 3 digits of the zip. If not found, a default ₹100 charge is applied to `pincode_fee`.
- **Primary Models**: `pricing_day_rules`, `pincode_rules`, `orders`.

### Phase 3: Staged Data Collection (Checkout Details vs Dashboard Questionnaire)
The customization process is broken into two stages to ensure we collect all necessary data without overwhelming the user during checkout.

- **Stage 1 — Checkout (Basic Script Details)** ([OrderFlow.tsx](file:///e:/Client-Projects/alanaatii/alanaatii-letters-gifts-main/src/pages/OrderFlow.tsx)):
  - During the "Details" step, the user provides:
    - Sender info (`customer_name`, `customer_phone`, `customer_email`).
    - Basic Recipient info (`recipient_name`, `recipient_phone`, `primary_contact`).
    - The core letter instruction (`relation`, `message_content`, `special_notes`).

- **Stage 2 — Dashboard (Relationship Questionnaire)** ([UserPendingDetails.tsx](file:///e:/Client-Projects/alanaatii/alanaatii-letters-gifts-main/src/pages/dashboard/UserPendingDetails.tsx)):
  - After payment is verified, the order status transitions to `awaiting_details`.
  - The user must complete a relationship-specific questionnaire (e.g., "How did you meet?").
  - They can access this form from their Dashboard via:
    1. **"Required Details" sidebar tab** ([UserRequiredDetailsList.tsx](file:///e:/Client-Projects/alanaatii/alanaatii-letters-gifts-main/src/pages/dashboard/UserRequiredDetailsList.tsx)).
    2. **Orange "Action Required" alert** on the order card.
  - **Gating Rule**: The writer assignment engine is blocked (`status` remains `awaiting_details`) until the user submits this questionnaire (i.e., `user_answers` is populated). Once submitted, status advances to `order_placed` and the assignment engine activates.
- **Primary Models**: `mandatory_questions`, `relation_categories`.

### Phase 4: Fiscal Submission (Checkout)
- **Action**: User applies a coupon and uploads payment screenshot.
- **Internal Logic**:
  - **Discount**: `coupons` table is queried for absolute/percentage value. `current_uses` is incremented upon success.
  - **Transaction**: A new record is created in `transactions` with status `pending`.
  - **Asset Registry**: The screenshot is recorded in `assets` with `entity_type: payment_proof`.
- **Primary Models**: `transactions`, `assets`, `coupons`, `orders` (Initial status: `payment_pending`).
- **Admin Verification Action**: Admin uses the **Verify Payments** hub. Clicking "View Breakdown" opens a comprehensive modal showing the payment screenshot alongside the itemized project breakdown (Price of Letter, Style, Box, etc.) to ensure fiscal accuracy before approval.
- **Approval Workflow**: Approving a payment triggers the **Auto-Assignment Engine** immediately, transitioning status to `assigned_to_writer`.

---

## 2. The Writer Creative Flow
How professionals interact with assignments and draft content.

### Phase 1: Assignment Engine
- **Action**: Admin verifies a payment.
- **Logic**: 
  - System executes a **Least-Loaded** query to find the writer with the fewest active jobs.
  - A new `writer_assignments` record is created, and `assigned_at` is timestamped.
  - **Notification**: Sent to the writer via `notifications`.
  - **Tracking**: The assignment is now visible in the **Admin Writer Detail** history tabs.
- **Primary Models**: `writers`, `writer_assignments`, `notifications`, `order_status_history`.

### Phase 2: Drafting & Collaboration
- **Action**: Writer works in the [WriterEditor](file:///e:/Client-Projects/alanaatii/alanaatii-letters-gifts-main/src/pages/writer/WriterEditor.tsx).
- **Logic**:
  - **Auto-Save**: Every 30 seconds, content is pushed to `writer_drafts` to prevent data loss.
  - **Version Control**: Clicking "Submit" clears `writer_drafts` and adds a new record to `script_versions`.
- **Primary Models**: `writer_drafts`, `script_versions`, `orders` (status: `script_submitted`).

### Phase 3: Customer Feedback Loop
- **Action**: Customer views script in [UserOrderDetail](file:///e:/Client-Projects/alanaatii/alanaatii-letters-gifts-main/src/pages/dashboard/UserOrderDetail.tsx).
- **Logic**:
  - If **Approved**: Order status moves to `approved` (Ready for physical writing), and `approved_at` is timestamped.
  - If **Revision Requested**: Customer's feedback is saved to `orders.revision_feedback` and status shifts to `revision_requested`.
  - **Copy Utility**: Admins can use the **Copy Script** button in the order modal to grab the approved text for physical execution.
- **Primary Models**: `script_versions`, `orders`, `notifications`.

---

## 3. The Writer Recruitment & Management Hub (Detailed)
The [AdminWriters](file:///e:/Client-Projects/alanaatii/alanaatii-letters-gifts-main/src/pages/admin/AdminWriters.tsx) page serves as the centralized hub for building and managing the professional writing roster.

### Core Functionalities:
1.  **Direct Credential Provisioning**:
    - **UI Action**: Admin enters `email`, `password`, and `full_name`.
    - **Backend Logic**: A new record is created in the `writers` table. These credentials allow the writer to log in to the **Writer Dashboard**.
2.  **Comprehensive Professional Profiling**:
    - **Skill Mapping**: Admin tags writer with `languages` (e.g., Telugu, English). This data is stored as a JSON array and is used by the **Assignment Engine** to match writers to specific letter requests.
    - **Contact Depth**: Captures `phone` (Primary) and `phone_alt` (Secondary) along with `address` for complete personnel records.
3.  **The "Safety Switch" (Availability Control)**:
    - **UI Action**: Admin toggles `status` between `active` and `inactive`.
    - **Logic**: When set to `inactive`, the writer is instantly excluded from the **Auto-Assignment Engine** loop. This prevents scripts from being assigned to writers who are on leave or off-duty.
4.  **Credential Management**:
    - **Action**: Admin can update passwords or emails for existing writers if they are lost or compromised.
5.  **Roster Cleanup**:
    - **Action**: Admin can delete a profile via the "Delete" action.
    - **Constraint**: The system should prevent deletion if the writer has `active_jobs`. Instead, they must be set to `inactive` until their queue is clear.

### Technical Mapping Table:
| Action | Controller / Page | Affected Table | Business Outcome |
| :--- | :--- | :--- | :--- |
| **Recruit** | `AdminWriters.tsx` | `writers` | New staff member onboarded |
| **Verify Payment**| `AdminPayments.tsx` | `orders` | Itemized audit vs Screenshot |
| **Auto-Assign** | `AdminPayments.tsx` | `writer_assignments`| Least-loaded writer gets the job |
| **Manage Order** | `AdminOrders.tsx` | `orders.status` | 12-tab status-based filtering |
| **Skill Up** | `AdminWriters.tsx` | `writers.languages`| Writer eligible for more job types |
| **Audit** | System Level | `audit_logs` | Accountability for staffing changes |

---

---

## 4. Deep Operations & Administrative Mastery
Managing the internal levers of the luxury platform beyond day-to-day orders.

### Global Site Settings & Overrides
- **Workflow**:
  1. Admin navigates to **Global Settings** ([AdminSettings.tsx](file:///e:/Client-Projects/alanaatii/alanaatii-letters-gifts-main/src/pages/admin/AdminSettings.tsx)).
  2. Updates public configuration like `master_upi_id`, `support_email`, or toggles `maintenance_mode`.
  3. **Impact**: The checkout flow automatically pulls the new UPI ID. Toggling Maintenance Mode immediately restricts public access. The "Auto-Assign Writers" toggle enables or disables the backend routing engine.
- **Primary Model**: `site_settings`.

### The Writer Payout Visibility Loop
- **Workflow**:
  1. Admin generates a `payouts` record for a specific cycle.
  2. Writer receives a notification in the **Writer Dashboard**.
  3. Writer can view the breakdown of scripts included in the payout to verify against their history.
- **Primary Models**: `payouts`, `orders`, `notifications`.

### Content Moderation (Testimonials)
- **Workflow**:
  1. Customer submits a review on [SubmitReview Page](file:///e:/Client-Projects/alanaatii/alanaatii-letters-gifts-main/src/pages/SubmitReview.tsx).
  2. Review is saved in `reviews` with `is_published = false`.
  3. Admin navigates to **Review Moderation** ([AdminReviews.tsx](file:///e:/Client-Projects/alanaatii/alanaatii-letters-gifts-main/src/pages/admin/AdminReviews.tsx)) to read, delete, or toggle the `is_published` flag to feature it on the landing page.
- **Primary Models**: `reviews`.

---

## 5. Fulfillment Edge Cases & Safety Nets
Handling exceptions in the luxury experience.

### Order Cancellation Lifecycle
- **Scenario A (Pre-Payment Approval)**: User can cancel via Dashboard; `transaction` is rejected, and order is archived.
- **Scenario B (Pre-Assignment)**: Admin can cancel if request is caught before `writer_id` is linked. Full refund flow triggered.
- **Scenario C (In-Production)**: Cancellation is **blocked** once `writer_assignments.status = accepted` to protect the artist's time and commission.
- **Primary Models**: `orders`, `transactions`, `refunds`.

### Privacy-Centric Script Retention
- **Policy**: To protect the sensitive and personal nature of letters, scripts are not stored indefinitely.
- **Workflow**: 90 days after `status = delivered`, a system job (or manual admin sweep) purges the `content` field from `script_versions`, leaving only metadata for audit.
- **Primary Models**: `script_versions`, `audit_logs`.

---

## 6. Summary of Data Dependencies
A high-level view of how tables rely on each other.

| Flow Event | Writing Table | Dependent Lookups |
| :--- | :--- | :--- |
| **New Order** | `orders`, `transactions` | `catalog_items`, `coupons`, `users` |
| **Questionnaire Submitted** | `orders` (userAnswers) | `mandatory_questions`, `relation_categories` |
| **Writer Assigned**| `writer_assignments` | `writers`, `orders` |
| **Script Submitted**| `script_versions` | `orders`, `writer_assignments` |
| **Refund Processed**| `transactions` (rejected) | `orders`, `audit_logs` |
| **Price Update** | `catalog_items` | `audit_logs` |

---

> [!IMPORTANT]
> **Data Integrity Constraint**: An `order` cannot move to `assigned_to_writer` until the associated `transaction` is marked as `verified` in the Payments Hub.

> [!IMPORTANT]
> **Gating Constraint**: An `order` in `awaiting_details` status cannot advance to `assigned_to_writer` until the user submits the mandatory Relationship Questionnaire (`userAnswers` array is non-empty).
