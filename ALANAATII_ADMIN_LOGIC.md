# Alanaatii: Admin Action & Workflow Registry

This document defines the complete operational workflow for the Administrator. It lists every manual action possible in the Admin Dashboard, the specific data fields required, and the logical impact on the system.

---

## 1. Operational Lifecycle: Transition & Notifications
The platform follows a strict status sequence triggered by Admin, User, and Writer actions.

| Step | State Identifier | Triggering Action | Systemic Notification |
| :--- | :--- | :--- | :--- |
| **01** | `payment_pending` | User submits Order. | Admin: "New payment to verify." |
| **02** | `verified` | **Admin verifies payment.** | **User**: Gets notification with **Form Fill Link**. |
| **03** | `scripting` | User submits Relation Form. | **Writer**: "You got a new lead." |
| **04** | `script_submitted` | Writer completes draft. | **User**: Gets notification with **Login & Verify Link**. |
| **05** | `writing_stage` | **User accepts script.** | **Admin**: "Script by [Writer] Approved." |
| **06** | `dispatched` | Admin marks as sent. | User: "Your letter is on the way!" |
| **07** | `delivered` | Admin/Logistics finalizes. | User: "Order Delivered. Rate us." |

---

## 2. Catalog & Product Management
**Context**: Defining the shop's inventory and selectable services.

### **2.1. Manage Store Items (Letters, Boxes, Gifts, Papers, Scripts, Styles)**
| Action | Required Data Fields | Data Type | Operational Outcome |
| :--- | :--- | :--- | :--- |
| **Add/Edit Item** | `Title`, `Price`, `Description`, `Image` | String, Number, String, File | Sets the catalog metadata. |
| **Personalization** | `Relation`, `Question Text` | String (Select), String | Maps questions to specific relationships. |

---

## 3. Operations & Payments Verification

### **3.1. Payment Verification (`AdminPayments.tsx`)**
| Action | Required Action | Logical Outcome |
| :--- | :--- | :--- |
| **Mark as Verified**| Admin clicks "Verify" | 1. Status: `payment_pending` -> `verified`. |
| | | 2. **Auto-Trigger**: User receives Profile/Relation link via Notification. |

---

## 4. Workforce & Assignment

### **4.1. Assignment Logic**
- **Action**: Auto-Assignment happens immediately upon payment verification.
- **Manual Override**: Admin can re-assign the `Writer ID` in the `AdminOrders.tsx` view.

---

## 5. Order Management & Overrides
**Context**: Manual override control for any order status or participant.

### **5.1. Status Overrides (`AdminOrders.tsx`)**
| Action | Target Stage | Outcome |
| :--- | :--- | :--- |
| **Advance to Dispatch**| Select `dispatched` | Order enters delivery logistics. |
| **Close Order** | Select `delivered` | Transaction closes; Review UI unlocks for User. |

---

## 6. Workforce Performance Audit
- **Action**: Admin monitors time-to-close for revisions.
- **Rule**: Writers must close revision requests within **24 hours**. Admin gets a notification if this SLA is breached.
