# Alanaatii: Writer Action & Workflow Registry

This document defines the complete operational workflow for the professional Script Writer. It lists every manual action possible in the Writer Portal, the specific data fields required, and the logical impact on the system.

---

## 1. Task Acquisition: The New Lead
**Context**: Professional writers receive leads after the customer provides detailed relationship mapping.

### **1.1. Notification Integration**
- **Action: Notification**: When a User submits their relation form, the status transitions to `scripting`.
- **System Action**: Writer receives notification: **"You got a new lead."**

### **1.2. Acceptance Workflow**
| Action | Required Data Fields | Data Type | Operational Outcome |
| :--- | :--- | :--- | :--- |
| **Accept Lead** | `Order id` | String | Sets writer's active session to focal order. |
| **Review Details**| UI Component | Logic (Sidebar) | Displays the user's mapped relation stories. |

---

## 2. Creative Drafting Terminal
**Context**: Drafting the script stage of the fulfillment process.

| Action | Required Data Fields | Data Type | Operational Outcome |
| :--- | :--- | :--- | :--- |
| **Persist Content** | `scriptContent` | String | Saves local character-buffer for the lead. |
| **Submit Content** | `scriptContent` | String | 1. Transitions status to `script_submitted`. |
| | | | 2. **Notifies Customer**: Trigger Verify Link. |

---

## 3. High-Priority Revisions (24-Hour SLA)
**Context**: Handling customer change requests under strict time constraints.

### **3.1. Revision Constraint**
- **Trigger**: Customer rejects the draft and requests a change.
- **STRICT RULE**: All revision requests must be **reviewed and closed within 24 hours**. 
- **Action**: Writer must amend the `scriptContent` to meet specific customer revision feedback.

### **3.2. Resubmission**
| Action | Required Data Fields | Data Type | Operational Outcome |
| :--- | :--- | :--- | :--- |
| **Resubmit Script** | `scriptContent` | String | Resets status to `script_submitted`. |

---

## 4. Transition to Physical Production
**Context**: Moving from the digital script to the actual writing stage.

| Action | Triggering Source | Outcome |
| :--- | :--- | :--- |
| **Writing Stage** | User clicks "Accept/Approve" | 1. Status: `scripting` -> `writing_stage`. |
| | | 2. **Notifies Admin**: "Script approved. Production starts." |

---

## 5. Performance Monitoring
- **Logic**: Dashboard tracks the 24-hour revision timer.
- **Metric**: Total scripts moved from `scripting` to `writing_stage`.
