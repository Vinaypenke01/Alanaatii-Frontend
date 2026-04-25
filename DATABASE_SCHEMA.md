# Alanaatii - Detailed Database Schema

This document outlines the database architecture for the Alanaatii platform, derived from the admin management interfaces and business requirements.

## 1. Core Workflow Entities

### `orders`
Stores all customer orders for scripts, letters, and gift sets.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | PRIMARY KEY | Unique Order ID (e.g., ORD-001) |
| `product_type` | `ENUM` | NOT NULL | `script`, `letter`, `letterBox`, `letterBoxGift`, `letterPaper` |
| `letter_theme` | `VARCHAR(100)` | NOT NULL | Category (e.g., "Love Letter", "Birthday") |
| `text_style` | `VARCHAR(50)` | NOT NULL | Typography selection (e.g., "Handwritten") |
| `paper_id` | `VARCHAR(36)` | FK | Link to `catalog_papers` |
| `box_id` | `VARCHAR(36)` | FK (Nullable) | Link to `catalog_boxes` |
| `gift_id` | `VARCHAR(36)` | FK (Nullable) | Link to `catalog_gifts` |
| `status` | `ENUM` | DEFAULT 'pending'| Lifecycle state (see Order Status section) |
| `total_amount` | `DECIMAL(10,2)` | NOT NULL | Final calculated price in ₹ |
| `delivery_date` | `DATE` | NOT NULL | Customer preferred delivery date |
| `customer_name` | `VARCHAR(100)` | NOT NULL | Name of the person ordering (Sender) |
| `customer_phone`| `VARCHAR(20)` | NOT NULL | Phone/WhatsApp of the sender |
| `customer_email`| `VARCHAR(150)` | NOT NULL | Email of the sender |
| `recipient_name`| `VARCHAR(100)` | NULLABLE | Name of the letter recipient (can be filled post-order) |
| `recipient_phone`| `VARCHAR(20)` | NULLABLE | Phone number of the recipient (can be filled post-order) |
| `primary_contact`| `ENUM` | NULLABLE | Who to contact for delivery (`sender` or `recipient`). Filled in Stage 2 post-payment form. |
| `relation` | `VARCHAR(50)` | NULLABLE | Relationship to the sender (can be filled post-order) |
| `message_content`| `TEXT` | NULLABLE | Customer's raw instructions/story (can be filled post-order) |
| `special_notes` | `TEXT` | NULLABLE | Custom requests for the writer |
| `express_script` | `BOOLEAN` | DEFAULT FALSE | +₹ fee for faster drafting |
| `script_content`| `TEXT` | NULLABLE | Final approved content for the letter |
| `payment_ss` | `VARCHAR(255)` | NULLABLE | URL to payment screenshot image |
| `coupon_id` | `VARCHAR(36)` | FK | |
| `pincode_fee` | `DECIMAL(10,2)` | | Calculated at checkout |
| `early_fee` | `DECIMAL(10,2)` | | Calculated if delivery < 4 weeks |
| `writer_id` | `VARCHAR(36)` | FK (Nullable) | Assigned `writers.id` |
| `created_by_id` | `VARCHAR(36)` | FK | User who created the record |
| `tracking_id` | `VARCHAR(100)` | NULLABLE | Courier tracking number |
| `courier_name` | `VARCHAR(50)` | NULLABLE | e.g. "Delhivery", "BlueDart" |
| `shipped_at` | `TIMESTAMP` | NULLABLE | |
| `est_arrival` | `DATE` | NULLABLE | |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Timestamp of order placement |
| `assigned_at` | `TIMESTAMP` | NULLABLE | When the writer was linked to the order |
| `submitted_at` | `TIMESTAMP` | NULLABLE | When the first script draft was uploaded |
| `approved_at` | `TIMESTAMP` | NULLABLE | When the customer gave final approval |
| `base_price` | `DECIMAL(10,2)` | | Component: Letter/Package price |
| `style_price` | `DECIMAL(10,2)` | | Component: Calligraphy selection |
| `box_price` | `DECIMAL(10,2)` | | Component: Luxury box selection |
| `gift_price` | `DECIMAL(10,2)` | | Component: Gift add-on selection |
| `delivery_price`| `DECIMAL(10,2)` | | Component: Shipping/Logistics fee |
| `express_price` | `DECIMAL(10,2)` | | Component: Early Delivery/Express fee |
| `discount_amt` | `DECIMAL(10,2)` | | Total discount from coupons/offers |
| `revision_note` | `TEXT` | NULLABLE | Feedback provided during revision phase |

### `script_versions` (Submissions)
Tracks revisions for order content. Every submission by a writer is recorded here.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | PRIMARY KEY | |
| `order_id` | `VARCHAR(36)` | FK | Reference to `orders.id` |
| `writer_id` | `VARCHAR(36)` | FK | The writer who authored this version |
| `version_num` | `INT` | NOT NULL | 1 (Initial), 2 (Revision), etc. |
| `content` | `TEXT` | NOT NULL | Content at this specific version |
| `writer_note` | `TEXT` | NULLABLE | Contextual note for the customer |
| `created_by_id` | `VARCHAR(36)` | FK | User ID of the creator |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | |

### `order_status_history`
Audit trail of every state change in an order's lifecycle.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | PRIMARY KEY | |
| `order_id` | `VARCHAR(36)` | FK | Reference to `orders.id` |
| `old_status` | `ENUM` | NOT NULL | Previous state |
| `new_status` | `ENUM` | NOT NULL | New state |
| `changed_by_id`| `VARCHAR(36)` | FK | Admin/Writer/System ID |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | When the status changed |

### `transactions`
Records each payment attempt/screenshot upload for an order.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | PRIMARY KEY | |
| `order_id` | `VARCHAR(36)` | FK | Reference to `orders.id` |
| `amount` | `DECIMAL(10,2)` | NOT NULL | |
| `screenshot_url`| `VARCHAR(255)` | NOT NULL | |
| `status` | `ENUM` | DEFAULT 'pending'| `pending`, `verified`, `rejected` |
| `notes` | `TEXT` | NULLABLE | Reason for rejection |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | |

---

## 2. Personnel & Access Entities
Management of staff, writers, and customer accounts.

### `admins`
Internal administrative accounts.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | PRIMARY KEY | |
| `full_name` | `VARCHAR(100)` | NOT NULL | |
| `email` | `VARCHAR(150)` | UNIQUE, NOT NULL| |
| `password` | `VARCHAR(255)` | NOT NULL | Hashed |
| `role` | `ENUM` | NOT NULL | `super_admin`, `manager`, `moderator` |
| `is_active` | `BOOLEAN` | DEFAULT TRUE | |

### `writers`
Managed via the Script Writer Onboarding panel.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | PRIMARY KEY | Unique Writer identifier |
| `full_name` | `VARCHAR(100)` | NOT NULL | |
| `email` | `VARCHAR(150)` | UNIQUE, NOT NULL| Login and notification email |
| `phone` | `VARCHAR(20)` | NULLABLE | Primary contact number |
| `phone_alt` | `VARCHAR(20)` | NULLABLE | Secondary contact number |
| `address` | `TEXT` | NULLABLE | Residential address |
| `languages` | `JSON` | NOT NULL | Array of skills (English, Telugu, etc.) |
| `password` | `VARCHAR(255)` | NOT NULL | Hashed login password |
| `status` | `ENUM` | DEFAULT 'active'| `active` (receives jobs), `inactive` (away) |
| `created_by_id`| `VARCHAR(36)` | FK | Admin who onboarded the writer |
| `created_at` | `TIMESTAMP` | | |

---

## 3. Account & Auth Entities
Managing credentials and profiles for customers and staff.

### `users` (Customers)
Primary account for customers using the dashboard.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | PRIMARY KEY | |
| `full_name` | `VARCHAR(100)` | NOT NULL | |
| `email` | `VARCHAR(150)` | UNIQUE, NOT NULL| Primary login |
| `phone_wa` | `VARCHAR(20)` | NOT NULL | Focus on WhatsApp for alerts |
| `password` | `VARCHAR(255)` | NOT NULL | Hashed |
| `address_def` | `TEXT` | NULLABLE | Default shipping address |
| `city_def` | `VARCHAR(50)` | NULLABLE | |
| `pincode_def` | `VARCHAR(6)` | NULLABLE | |
| `birthday` | `DATE` | NULLABLE | For luxury gift reminders |
| `anniversary` | `DATE` | NULLABLE | |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | |

### `user_addresses`
Stores multiple saved addresses for recurring customers.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | PRIMARY KEY | |
| `user_id` | `VARCHAR(36)` | FK | |
| `label` | `VARCHAR(50)` | | e.g. "Home", "Office", "Partner" |
| `receiver_name`| `VARCHAR(100)` | | |
| `phone` | `VARCHAR(20)` | | |
| `address` | `TEXT` | | |
| `city` | `VARCHAR(50)` | | |
| `pincode` | `VARCHAR(6)` | | |
| `is_primary` | `BOOLEAN` | | |

---

## 3. Financial Entities
Tracking revenue and writer compensation.

### `payouts`
Payments made to script writers for completed work.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | PRIMARY KEY | |
| `writer_id` | `VARCHAR(36)` | FK | |
| `amount` | `DECIMAL(10,2)` | NOT NULL | |
| `status` | `ENUM` | DEFAULT 'pending'| `pending`, `processed`, `failed` |
| `reference_id` | `VARCHAR(100)` | NULLABLE | Bank/UPI reference number |
| `period_start` | `DATE` | NOT NULL | Cycle start |
| `period_end` | `DATE` | NOT NULL | Cycle end |
| `processed_at` | `TIMESTAMP` | NULLABLE | |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | |

### `refunds`
Dedicated tracking for financial reversals.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | PRIMARY KEY | |
| `order_id` | `VARCHAR(36)` | FK | |
| `amount` | `DECIMAL(10,2)` | NOT NULL | |
| `reason` | `TEXT` | NOT NULL | |
| `status` | `ENUM` | DEFAULT 'pending'| `pending`, `completed` |
| `processed_at` | `TIMESTAMP` | NULLABLE | |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | |

---

## 4. Catalog & Management Entities
Components managed in the **Management Hub**.

### `catalog_items`
*(Alternatively split into specific tables like `papers`, `boxes`, `gifts`, `styles`)*
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | PRIMARY KEY | |
| `category` | `ENUM` | NOT NULL | `paper`, `box`, `gift`, `style`, `package` |
| `title` | `VARCHAR(100)` | NOT NULL | Display name |
| `price` | `DECIMAL(10,2)` | NOT NULL | Base cost |
| `description` | `TEXT` | NULLABLE | Marketing details |
| `image_url` | `VARCHAR(255)` | NULLABLE | Product preview image path |
| `is_active` | `BOOLEAN` | DEFAULT TRUE | Visibility toggle |
| `created_by_id`| `VARCHAR(36)` | FK | Admin who added the component |

---

## 5. Business Rule Entities

### `pricing_day_rules`
Defines urgency thresholds for tiered pricing.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | PRIMARY KEY | |
| `days_limit` | `INT` | UNIQUE | Threshold (e.g., 7 days) |
| `extra_charge` | `DECIMAL(10,2)` | NOT NULL | Surcharge in ₹ |
| `created_by_id`| `VARCHAR(36)` | FK | |

### `pincode_rules`
Regional delivery management.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | PRIMARY KEY | |
| `zip_prefix` | `VARCHAR(10)` | UNIQUE | e.g. "500" for Hyderabad |
| `delivery_fee` | `DECIMAL(10,2)` | NOT NULL | Base shipping for this prefix |
| `created_by_id`| `VARCHAR(36)` | FK | |

### `mandatory_questions`
Managed in the Relation Questions panel.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | PRIMARY KEY | |
| `relation_type`| `VARCHAR(50)` | NOT NULL | e.g. "Teacher", "Lover" |
| `question_text`| `TEXT` | NOT NULL | Prompt displayed to customer |
| `created_by_id`| `VARCHAR(36)` | FK | |

| `id` | `VARCHAR(36)` | PRIMARY KEY | |
| `code` | `VARCHAR(20)` | UNIQUE | e.g. LOVE20 |
| `discount_val` | `DECIMAL(10,2)` | NOT NULL | percentage or flat |
| `discount_type`| `ENUM` | NOT NULL | `percentage`, `flat` |
| `max_uses` | `INT` | NULLABLE | Max total redemptions |
| `current_uses` | `INT` | DEFAULT 0 | Current redemption count |
| `valid_from` | `DATE` | NOT NULL | |
| `valid_until` | `DATE` | NOT NULL | Expiration date |
| `min_order` | `DECIMAL(10,2)` | DEFAULT 0 | |
| `is_active` | `BOOLEAN` | DEFAULT TRUE | |
| `created_by_id`| `VARCHAR(36)` | FK | |

### `relation_categories`
Dynamic list of relationship types (e.g., Teacher, Lover).
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | PRIMARY KEY | |
| `name` | `VARCHAR(50)` | UNIQUE, NOT NULL| Display name |
| `is_active` | `BOOLEAN` | DEFAULT TRUE | |
| `created_by_id`| `VARCHAR(36)` | FK | |

---

## 6. Writer Portal Entities
Entities specifically supporting the writer's creative and administrative tools.

### `writer_assignments`
Tracks the lifecycle of job requests sent to writers.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | PRIMARY KEY | |
| `order_id` | `VARCHAR(36)` | FK | Link to the specific order |
| `writer_id` | `VARCHAR(36)` | FK | Link to the targeted writer |
| `status` | `ENUM` | DEFAULT 'pending'| `pending`, `accepted`, `declined` |
| `decline_reason`| `TEXT` | NULLABLE | Reason provided if job is rejected |
| `assigned_at` | `TIMESTAMP` | DEFAULT NOW() | When assignment was offered |
| `responded_at` | `TIMESTAMP` | NULLABLE | When writer accepted/declined |
| `created_by_id` | `VARCHAR(36)` | FK | Admin who triggered assignment |

### `writer_drafts`
Supports auto-save functionality within the Writer Editor.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `order_id` | `VARCHAR(36)` | PRIMARY KEY | One draft per order per writer |
| `writer_id` | `VARCHAR(36)` | PK, FK | |
| `draft_content` | `TEXT` | NOT NULL | Current unsubmitted work |
| `last_saved_at` | `TIMESTAMP` | DEFAULT NOW() | |

---

## 7. Global Configuration & Support
Platform-wide settings and customer support entries.

### `site_settings`
Global platform configuration managed via [AdminSettings.tsx](file:///e:/Client-Projects/alanaatii/alanaatii-letters-gifts-main/src/pages/admin/AdminSettings.tsx).
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | PRIMARY KEY | Always 1 (Single-row table) |
| `master_upi_id` | `VARCHAR(100)` | NOT NULL | Displayed on payment page |
| `support_email` | `VARCHAR(150)` | NOT NULL | Public contact email |
| `support_whatsapp`| `VARCHAR(20)` | NOT NULL | Public WhatsApp number |
| `maintenance_mode`| `BOOLEAN` | DEFAULT FALSE | Disables public website access |
| `auto_assign_writers`| `BOOLEAN` | DEFAULT TRUE| Auto-routes new orders to the assignment engine |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | |

### `support_messages`
Captures inquiries from the Contact page.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | PRIMARY KEY | |
| `name` | `VARCHAR(100)` | NOT NULL | |
| `email` | `VARCHAR(150)` | NOT NULL | |
| `message` | `TEXT` | NOT NULL | |
| `status` | `ENUM` | DEFAULT 'new' | `new`, `read`, `responded` |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | |

---

## 8. Customer & Content Entities
Supporting social proof and landing page content management.

### `reviews`
Tracks customer feedback for the landing page.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | PRIMARY KEY | |
| `order_id` | `VARCHAR(36)` | FK | Verified purchase link |
| `customer_name` | `VARCHAR(100)` | NOT NULL | Display name |
| `rating` | `INT` | CHECK (1-5) | |
| `content` | `TEXT` | NOT NULL | Testimonial body |
| `is_published` | `BOOLEAN` | DEFAULT FALSE | Admin visibility toggle |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | |

### `site_content_steps`
Configures the "8 Steps" track on the Index page.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `step_num` | `INT` | PRIMARY KEY | 1 through 8 |
| `title` | `VARCHAR(100)` | NOT NULL | |
| `description` | `TEXT` | NOT NULL | |
| `icon_slug` | `VARCHAR(50)` | NOT NULL | Lucide icon identifier |
| `created_by_id` | `VARCHAR(36)` | FK | |

### `faq`
Self-service help content for customers.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | PRIMARY KEY | |
| `question` | `TEXT` | NOT NULL | |
| `answer` | `TEXT` | NOT NULL | |
| `category` | `VARCHAR(50)` | DEFAULT 'General'| e.g. 'Shipping', 'Pricing' |
| `is_active` | `BOOLEAN` | DEFAULT TRUE | |
| `display_order` | `INT` | DEFAULT 0 | |
| `created_by_id` | `VARCHAR(36)` | FK | |

---

## 9. System Utilities & Audit
Infrastructure for security, analytics, and communication.

### `notifications`
Supports communication across Admin, User, and Writer portals.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | PRIMARY KEY | |
| `target_id` | `VARCHAR(36)` | FK | User/Writer/Admin ID |
| `target_role` | `ENUM` | NOT NULL | `user`, `writer`, `admin` |
| `order_id` | `VARCHAR(36)` | FK (Nullable) | Related transaction |
| `type` | `ENUM` | NOT NULL | `script`, `payment`, `revision`, etc. |
| `title` | `VARCHAR(100)` | NOT NULL | |
| `message` | `TEXT` | NOT NULL | |
| `is_read` | `BOOLEAN` | DEFAULT FALSE | |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | |

### `audit_logs`
High-level accountability for sensitive operations.
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | PRIMARY KEY | |
| `user_id` | `VARCHAR(36)` | FK | Admin or Writer who did the action |
| `action_key` | `VARCHAR(50)` | NOT NULL | e.g., `PAYMENT_VERIFIED` |
| `entity_type` | `VARCHAR(30)` | NOT NULL | e.g., `ORDER`, `WRITER`, `PRICING` |
| `entity_id` | `VARCHAR(36)` | NOT NULL | |
| `changes` | `JSON` | NULLABLE | Before/After snapshot |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | |

### `assets`
Unified registry for all uploaded media (screenshots, product photos).
| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | PRIMARY KEY | |
| `file_name` | `VARCHAR(255)` | NOT NULL | |
| `file_url` | `VARCHAR(255)` | NOT NULL | Storage path/link |
| `mime_type` | `VARCHAR(100)` | NOT NULL | e.g. `image/jpeg` |
| `entity_type` | `VARCHAR(50)` | NOT NULL | e.g. `order_payment`, `catalog_img` |
| `entity_id` | `VARCHAR(36)` | NOT NULL | Related record ID |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | |


---

## Status Reference

### Order Status Flow
1. `payment_pending` — Waiting for screenshot approval.
2. `order_placed` — Payment approved. Basic sender and script details (recipient, story, relation) collected.
3. `awaiting_details` — Payment verified. User must fill the mandatory Relationship Questionnaire before writing can begin. Link sent via email and accessible from Dashboard → Required Details.
4. `assigned_to_writer` — Details complete. Writer notified, awaiting acceptance.
5. `assignment_rejected` — Writer declined. Admin must re-assign.
6. `accepted_by_writer` — Script creation in progress.
7. `script_submitted` — Writer uploaded draft.
8. `customer_review` — Notification sent to user for approval.
9. `revision_requested` — Feedback provided by user.
10. `approved` — Ready for physical writing/execution.
11. `under_writing` — Artist is creating the physical letter.
12. `out_for_delivery` — Courier dispatched.
13. `delivered` — Final closure.
