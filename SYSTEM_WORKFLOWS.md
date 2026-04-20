# Alanaatii - System Workflows & Data Mapping (Detailed)

This document provides a forensic breakdown of the Alanaatii platform's functional logic, mapping specific UI actions to backend state transitions and database models.

---

## 1. The Customer "Order-to-Delivery" Flow
Managing the luxury letter and gift customization experience.

### Phase 1: Product Selection & Pricing Strategy
- **Action**: User selects a product type on the [Products Page](file:///e:/Client-Projects/alanaatii/alanaatii-letters-gifts-main/src/pages/Products.tsx).
- **Internal Logic**: 
  - System queries `catalog_items` to pull base prices and images.
  - If "Only Script" is chosen, "Quantity" and "Shipping" steps are automatically bypassed in the `Stepper`.
- **Primary Model**: `catalog_items`.

### Phase 2: Urgency & Logistics (Rules Engine)
- **Action**: User selects a delivery date and enters a pincode in [OrderFlow.tsx](file:///e:/Client-Projects/alanaatii/alanaatii-letters-gifts-main/src/pages/OrderFlow.tsx).
- **Internal Logic**:
  - **Urgency Check**: Calculated by `pricing_day_rules`. If (Delivery Date - Current Date) < 28 days, a +₹100 `early_fee` is injected.
  - **Pincode Lookup**: System checks `pincode_rules` for the first 3 digits of the zip. If not found, a default ₹100 charge is applied to `pincode_fee`.
- **Primary Models**: `pricing_day_rules`, `pincode_rules`, `orders`.

### Phase 3: Relationship Intelligence
- **Action**: User selects a "Relation" (e.g., Lover, Teacher).
- **Internal Logic**:
  - The UI dynamically renders questions recorded in `mandatory_questions` associated with that `relation_type`.
  - Input is saved to `message_content` in the `orders` table.
- **Primary Models**: `mandatory_questions`, `relation_categories`.

### Phase 4: Fiscal Submission (Checkout)
- **Action**: User applies a coupon and uploads payment screenshot.
- **Internal Logic**:
  - **Discount**: `coupons` table is queried for absolute/percentage value. `current_uses` is incremented upon success.
  - **Transaction**: A new record is created in `transactions` with status `pending`.
  - **Asset Registry**: The screenshot is recorded in `assets` with `entity_type: payment_proof`.
- **Primary Models**: `transactions`, `assets`, `coupons`, `orders` (Initial status: `payment_pending`).

---

## 2. The Writer Creative Flow
How professionals interact with assignments and draft content.

### Phase 1: Assignment Engine
- **Action**: Admin verifies a payment.
- **Logic**: 
  - System executes a "Least-Loaded" query: `SELECT writer_id FROM active_writers ORDER BY job_count ASC LIMIT 1`.
  - A new `writer_assignments` record is created.
  - **Notification**: Sent to the writer via `notifications`.
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
  - If **Approved**: Order status moves to `approved` (Ready for physical writing).
  - If **Revision Requested**: Customer's feedback is saved to `script_versions.writer_note` (or a dedicated table) and status shifts to `revision_requested`.
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
| **Activate** | `AdminWriters.tsx` | `writers.status`| Writer added to auto-job queue |
| **Skill Up** | `AdminWriters.tsx` | `writers.languages`| Writer eligible for more job types |
| **Audit** | System Level | `audit_logs` | Accountability for staffing changes |

---

---

## 4. Deep Operations & Administrative Mastery
Managing the internal levers of the luxury platform beyond day-to-day orders.

### Global Service Controls (Service Pause)
- **Workflow**:
  1. Admin navigates to **Site Settings**.
  2. Toggles `IS_SERVICE_ACTIVE` to `false`.
  3. **Impact**: The `OrderFlow.tsx` displays a "Peak Load / Maintenance" banner, effectively preventing new checkouts during festivals or staff shortages.
- **Primary Model**: `site_settings`.

### The Writer Payout Visibility Loop
- **Workflow**:
  1. Admin generates a `payouts` record for a specific cycle.
  2. Writer receives a notification in the **Writer Dashboard**.
  3. Writer can view the breakdown of scripts included in the payout to verify against their history.
- **Primary Models**: `payouts`, `orders`, `notifications`.

### Content Moderation
- **Workflow**:
  1. Customer submits a review on [SubmitReview Page](file:///e:/Client-Projects/alanaatii/alanaatii-letters-gifts-main/src/pages/SubmitReview.tsx).
  2. Review is saved in `reviews` with `is_published = false`.
  3. Admin reviews content in moderation hub and toggles `is_published`.
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
| **Writer Assigned**| `writer_assignments` | `writers`, `orders` |
| **Script Submitted**| `script_versions` | `orders`, `writer_assignments` |
| **Refund Processed**| `transactions` (rejected) | `orders`, `audit_logs` |
| **Price Update** | `catalog_items` | `audit_logs` |

---

> [!IMPORTANT]
> **Data Integrity Constraint**: An `order` cannot move to `assigned_to_writer` until the associated `transaction` is marked as `verified` in the Payments Hub.
