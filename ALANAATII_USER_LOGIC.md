# Alanaatii: User Action & Workflow Registry

This document defines the complete operational workflow for the Customer/User. It lists every manual action possible in the User Journey, the specific data fields required, and the logical impact on the system.

---

## 1. Interaction Lifecycle: Orders & Drafting
The customer experience is driven by specific triggers and personal data mapping.

### **1.1. Order-Time Creation**
- **Action: Onboarding**: Account creation happens **during the ordering process**.
- **Logic**: The `Email` provided during checkout becomes the primary key for logic access and dashboard authentication.

### **1.2. The Relation Form Mapping**
- **Trigger**: Once the Admin verifies payment, the status becomes `verified`, and the user receives a notification with a **Form Fill Link**.
| **Action** | **Required Data Fields** | **Data Type** | **Operational Outcome** |
| :--- | :--- | :--- | :--- |
| **Account Creation** | `Full Name`, `Email`, `Phone` | Mixed | Account is **automatically provisioned** using checkout data. |
| **Login (Access Gate)**| UI Action | Notification | User clicks the **Login Link** in notification to enter dashboard. |
| **Identity Mapping** | `Verification Email` | String | Must match the email entered during checkout. |
| | `Verification Phone` | String | Must match the phone entered during checkout. |
| **Relation Context** | `Relation Details` | String | Personal stories, memories, and specific details. |
| **Submit Form** | Trigger (Click) | Trigger | 1. Transitions status to `scripting`. |
| | | | 2. **Notifies Writer**: "You got a new lead." |

---

## 2. Script Review & Approval Workflow
**Context**: Ensuring the creative content meets the customer's expectations.

### **2.1. The Verify Link**
- **Trigger**: Writer submits the draft. Status becomes `script_submitted`. The user receives a notification with a **Login & Verify Link**.
| Action | Required Inputs | Operational Outcome |
| :--- | :--- | :--- |
| **Accept Script** | Trigger (Satisfied) | 1. Transitions status to `writing_stage`. |
| | | 2. **Notifies Admin**: "Script Approved by Customer." |
| **Request Change** | `revisionText` | 1. Transitions status back to `revision_requested`. |
| | | 2. **Strict Rule**: Writer must address this within **24 hours**. |

---

## 3. Post-Fulfillment: Delivery & Feedback
| Action | Required Data Fields | Data Type | Operational Outcome |
| :--- | :--- | :--- | :--- |
| **Rate Service** | `Star Rating` (1-5) | Number | Final closure for the writer's performance log. |
| | `Comment` | String | Displays in the public review wall (optional). |

---

## 4. User Profile Management
- **Action**: Update `name`, `email`, and `address` to ensure future orders are even faster.
- **Connection**: Demographic data used by Admin for order logistics.
