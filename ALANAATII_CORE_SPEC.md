# Alanaatii: Core Technical Specification (Shared)

This document contains the foundational data models, state management logic, and shared utilities utilized by the User, Admin, and Writer modules.

---

## 1. Global Interfaces & Types (`src/lib/mockData.ts`)

### 1.1. `OrderStatus` (Union Type)
Defines the valid states of an order in the Alanaatii lifecycle.
- **Values**: `payment_pending`, `order_placed`, `assigned_to_writer`, `accepted_by_writer`, `script_in_progress`, `script_submitted`, `customer_review`, `revision_requested`, `approved`, `under_writing`, `out_for_delivery`, `delivered`.

### 1.2. `Order` (Interface)
The master data model for a transaction.
| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier (e.g., "ORD-001") |
| `productType` | `ProductType` | (`script` \| `letterPaper` \| `letter` \| `letterBox` \| `letterBoxGift`) |
| `letterType` | `string` | The chosen theme/occasion |
| `textStyle` | `string` | The chosen calligraphy/handwriting style |
| `status` | `OrderStatus` | Current lifecycle state |
| `total` | `number` | Final price after all charges and discounts |
| `assignedWriterId` | `string | undefined` | Links to a `ScriptWriter` ID |
| `scriptContent` | `string | undefined`| The actual text written by the writer |
| `paymentScreenshot`| `string | undefined`| URL to the UPI receipt image |
| `userAnswers` | `Array<{q, a}>` | Results from the relationship-based questionnaire |

### 1.3. `ScriptWriter` (Interface)
| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier |
| `name` | `string` | Full name of the writer |
| `email` | `string` | Professional email |
| `password` | `string | undefined` | Initial password provisioned by Admin |
| `status` | `"active" \| "inactive"` | Operational status |

---

## 2. State Management (`src/lib/orderStore.ts`)

Powered by **Zustand**. Maintains persistence across the multi-step `OrderFlow`.

### 2.1. `OrderState` (Interface)
| State Field | Type | Default |
| :--- | :--- | :--- |
| `step` | `number` | `0` |
| `productType` | `ProductType` | `"letter"` |
| `appliedCoupon`| `string | null` | `null` |
| `paperQuantity`| `number` | `1` |
| `expressScript` | `boolean` | `false` |

### 2.2. Functions
- **`setStep(s: number): void`**
    - **Logic**: Moves the wizard to a specific index.
- **`setField(key: string, value: any): void`**
    - **Logic**: Updates a specific key in the store (e.g., `recipientName`).
- **`reset(): void`**
    - **Logic**: Reverts all fields to their `initial` state.

---

## 3. Global Utilities & Data Logic

### 3.1. `getDeliveryCharge(pincode: string): number`
- **Source**: `src/lib/data.ts`
- **Logic**: Extracts the first 3 digits of the pincode. Checks against `deliveryCharges` lookup table.
- **Default**: ₹100 if prefix not found.

### 3.2. `cn(...inputs: ClassValue[]): string`
- **Source**: `src/lib/utils.ts`
- **Logic**: Merges Tailwind classes using `clsx` and `tailwind-merge`. Essential for dynamic UI variations in dashboards.
