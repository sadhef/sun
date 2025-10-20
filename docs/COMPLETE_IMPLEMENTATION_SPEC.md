# COMPLETE IMPLEMENTATION SPECIFICATION
## Sun Training Institute - React Implementation (100% Pixel-Perfect)

**Source**: `18Oct25_v3_final.html` (5991 lines) + `style.css` (598 lines)

---

## 📋 **TABLE OF CONTENTS**

1. [Data Structure](#data-structure)
2. [All Pages](#all-pages)
3. [All Modals](#all-modals)
4. [All Side Panels](#all-side-panels)
5. [Exact Component Specifications](#component-specifications)
6. [Implementation Checklist](#implementation-checklist)

---

## 🗄️ **DATA STRUCTURE**

```javascript
appData = {
  enquiries: [],        // Main enquiry records
  notes: {},            // Notes by enquiry ID
  activityLog: {},      // Activity log by enquiry ID
  clients: [],          // Client list with type (company/individual)
  schedules: [],        // Schedule/timetable entries
  trainers: [],         // Trainer details
  rooms: [],            // Room list
  students: [],         // Student database (for autocomplete)
  courses: [],          // Course list with costs
  classCapacity: {},    // Course capacity mapping
  historicalPrices: {}, // Price history tracking
  rateCards: {          // Rate card system
    byClient: {}        // Client-specific pricing
  },
  batchCounters: {},    // Batch number generation
  invoices: [],         // Invoice records
  batches: [],          // **NEW**: Batch management
  trainerLeaves: []     // Trainer leave requests
}
```

---

## 📄 **ALL PAGES (15 Pages)**

### 1. **Dashboard** (lines 602-716)
**Route**: `/dashboard`

**Layout**:
- 6 Stat Cards (2 rows x 3 cols)
  1. Pending Invoices (warning color, count + amount)
  2. Total Revenue (success color, total amount)
  3. Open Enquiries (blue, count)
  4. Pending Nominations (purple, count)
  5. Upcoming Classes (turquoise, 7-day count)
  6. Pending Leave Approvals (danger, count)

- 2 Dashboard Sections (1 row x 2 cols)
  1. Today's Schedule (list of classes with time)
  2. Recent Enquiries (last 5 with status badges)

**Features**:
- Stat cards are clickable → navigate to respective pages
- Real-time calculations from appData

---

### 2. **All Records Page** (lines 742-994)
**Route**: `/all-records`

**Features**:
- **Header**: Breadcrumb + "New Enquiry" button + View Options (Table/By Client/By Course)
- **Status Filters**: Dynamic colored buttons with counts (All, Draft, Quotation Sent, Agreement Pending, etc.)
- **Table Columns** (Table View):
  - #, Enquiry ID, Batch No., Client, Course, Pending, Cost/Discount, Training Date, Created Date, Status, Action
- **Grouped Views** (By Client/Course):
  - Group header rows with total pending badge
  - Client view: shows Course column
  - Course view: shows Client column
- **Action Buttons** (status-dependent):
  - Draft: "Send mail to client →", Edit, Notes, Delete
  - Quotation Sent: "Quotation Agreed?", Edit Quotation, Notes, Delete
  - Agreement Pending: "Send Agreement →", Edit Quotation, Notes, Delete
  - Agreement Sent: "Confirm Agreement?", Edit Agreement, Notes, Delete
  - Other statuses: View, Notes, (Invoice icon if exists)
- **Sorting**: Clickable column headers with sort icons
- **Search**: Global search filters in real-time

---

### 3. **Pending Enquiries Page** (lines 742-994, filterType='pending')
**Route**: `/enquiries/pending`

**Same as All Records** but filters to:
- Draft
- Quotation Sent
- Agreement Pending
- Agreement Sent

---

### 4. **New Enquiry Workflow** (lines 1629-1828)
**Route**: `/enquiries/new`

**3-Step Workflow**:

**Step 1**: New Client Details (lines 1629-1704)
- Company Name*, Contact Person*, Contact Number*, Email*
- Government Document (optional file upload)
- Button: "Save & Continue" → Step 2

**Step 2**: Create Enquiries for Client (lines 1706-1828)
- Shows client details (readonly)
- Paste area to auto-fill quantities (Process button)
- Table with ALL courses:
  - Checkbox, Course Name, Qty (number input), Training Date (datepicker), Cost/Person (number input), Total Cost (calculated)
- Buttons: "← Back", "Save Drafts & Exit", "Generate Quotation →"
- Generate Quotation → Opens Quotation Modal

**Walk-in Client Flow** (lines 1830-1918):
- Student Name*, Civil ID*, Contact Number*, Email
- Creates individual client type
- Adds to student database
- Proceeds to course selection

---

### 5. **Add Nomination Page** (lines 1171-1447)
**Route**: `/nomination/add`

**Layout**:
1. **Client Selection** (dropdown with all clients)
   - Buttons: "+ Add New Client", "Walk-in Client"
2. **Course Selection** (dropdown, shown after client selected)
3. **Batch Management**:
   - Checks for existing batches with available seats
   - Modal: "Join existing batch" OR "Create new batch"
4. **Batch Nomination Modal** (THE KEY MODAL - see Modals section)

---

### 6. **Pending Nominations Page** (lines 996-1168)
**Route**: `/nomination/pending`

**Features**:
- View Options: Table / By Client / By Course
- Status Filters: All, Pending Nomination, Partially Nominated, Fully Nominated, Scheduled
- **Table Columns**:
  - #, Nomination ID, Batch No., Course (or Client), Nominated/Class Capacity, Training Date, Created Date, Status, Action
- **Actions**:
  - Edit button (opens batch nomination modal)
  - Confirm button (green checkmark icon)
  - Notes, Delete
- **Grouped Views**: Same pattern as All Records

---

### 7. **Course Schedule Page** (lines 2127-2394)
**Route**: `/schedule`

**Two Views**:

**Monthly Calendar** (lines 2166-2256):
- Month/Year navigation (prev/next buttons)
- 7x6 grid calendar
- Each day shows:
  - Event items (time + course name)
  - Blue background for client events
  - Orange background for internal events
  - Click event → opens Schedule Detail Modal

**Weekly Schedule** (lines 2258-2394):
- Week navigation
- Table: Room (rows) × Days (cols) × Time (rows within room)
- Time slots: 7:00 AM - 6:00 PM (11 slots)
- Lunch break at 1:00 PM (gray row spanning all days)
- Event blocks with rowspan for duration
- Shows course name + trainer name
- Click event → opens Schedule Detail Modal

---

### 8. **Class Roster Page** (lines 1449-1528)
**Route**: `/roster`

**Table Columns**:
- #, Enquiry ID, Batch No., Client, Course, Training Date, Nominated/Requested, Status, Action

**Actions**:
- "View" button → Opens Class Roster Modal (shows nominee table)
- "Completed?" button (for Scheduled classes) → Marks as Completed, prompts to generate invoice

---

### 9. **Trainer Page** (lines 4678-5035)
**Route**: `/trainer`

**Two Tabs**:

**Tab 1: Trainer List**
- Button: "+ Add Trainer"
- Table Columns: #, Trainer Name, Email, Phone, Status (Active/Inactive), Specializations, Action (Edit/Delete)

**Tab 2: Leave Management**
- Table: Leave Request ID, Trainer, Leave Type, Start Date, End Date, Days, Reason, Status, Action
- Actions: Approve (green), Reject (red)

---

### 10. **Rate Card Page** (lines 5036-5396)
**Route**: `/rate-card`

**Initial View**: Client List
- Displays all company clients as clickable cards
- "Baseline Rate Card" button at top

**Baseline Rate Card**:
- Table: Course Name, Baseline Cost, Last Updated
- Edit in-place

**Client-Specific Rate Card**:
- Breadcrumb: Rate Card > Client Name
- Table: Course Name, Baseline Cost, Discount %, Final Cost, Last Updated
- Edit discount percentages
- Save button

---

### 11. **Results Page** (lines 4436-4677)
**Route**: `/results`

**Table Columns**:
- #, Enquiry ID, Batch No., Client, Course, Training Date, Status, Action

**Action**:
- "Enter Results" button → Opens Results Modal

---

### 12. **Feedback Page**
**Route**: `/feedback`
- Placeholder (not fully implemented in HTML)

---

### 13. **Reports Page** (lines 5397-5465)
**Route**: `/reports`

**Features**:
- Date range selector (from/to)
- Generate Report button
- Chart.js integration for visualizations
- Revenue trends, enquiry sources, etc.

---

### 14. **Invoices Page** (lines 5708-5896)
**Route**: `/invoices`

**Table Columns**:
- #, Invoice ID, Client, Total Amount, Status, Issue Date, Due Date, Action

**Status Colors**:
- Draft (gray)
- Sent (orange)
- Paid (green)

**Actions**:
- "View" → Opens Invoice Modal
- "Send" → Downloads invoice + opens email client
- "Mark as Paid" button

---

### 15. **Certificates Page** (lines 5466-5707)
**Route**: `/certificates`

**Table Columns**:
- #, Certificate ID, Student Name, Civil ID, Course, Issue Date, Action

**Actions**:
- "Generate Certificate" button → Opens Certificate Modal
- "Download PDF" button

---

### 16. **Revenue Page** (lines 5897-end)
**Route**: `/revenue`

**Features**:
- Date range selector
- Chart.js revenue chart
- Summary cards:
  - Total Revenue
  - Pending Payments
  - Paid Invoices Count

---

## 🔔 **ALL MODALS (15+ Modals)**

### 1. **Quotation Modal** (lines 2673-2818)
**Trigger**: "Send mail to client →" button (Draft status)

**Content**:
- Client details (readonly)
- Editable table: Course, Qty, Cost/Person, Total
- Grand Total (calculated)
- "Send Quotation" button → Downloads as .doc + opens email

**Behavior**:
- Changes enquiry status from Draft → Quotation Sent
- Logs activity

---

### 2. **Agreement Modal** (lines 1920-2038, 2040-2125)
**Trigger**: "Send Agreement →" button (Agreement Pending status)

**Content**:
- Formal training services agreement
- Sections: Parties, Services (table), Terms & Conditions
- Editable table (if in edit mode): Course, Date, Qty, Unit Price, Total
- Buttons: "Send Agreement" OR "Save Agreement Changes"

**Behavior**:
- Send → Downloads as .doc + opens email + changes status to Agreement Sent
- Edit mode: Updates quantities/costs + logs changes

---

### 3. **Batch Nomination Modal** (THE MOST COMPLEX - lines 2819-3302)
**Trigger**:
- "Nominate" button (Pending Nomination status)
- "Edit" button (Pending Nominations page)

**Content**:
- **Header**: Batch ID, Course Name, Date, Session
- **Info Section**: Client, Batch Capacity, Nominated/Pending counts
- **Nominees Table**:
  - Columns: #, Civil ID (autocomplete from students DB), Student Name, Contact #, Email, Language (dropdown), Time, Notes, Action (delete row)
  - "+ Add Nominee" button
- **Footer Buttons**:
  - "Save Nominees" (saves to batch)
  - If new batch: "Save Batch" (generates batch ID, saves to appData.batches)

**Autocomplete Logic** (lines 3140-3186):
- As user types Civil ID → fetches matching students from appData.students
- Shows dropdown with Civil ID + Name
- Click → auto-fills all fields

**Validation**:
- Cannot exceed class capacity
- Civil ID required for each nominee
- Duplicate Civil IDs not allowed in same batch

**Special Modes**:
- **isNew**: Creating brand new batch
- **isJoining**: Joining existing batch (from another client)

---

### 4. **Join Batch Modal** (lines 1386-1444)
**Trigger**: When selecting course with existing batches available

**Content**:
- Lists all available batches for the course
- Each batch shows: Batch ID, Course, Clients in Batch, Date, Session, Available Seats
- Buttons per batch: "Join in this Batch"
- Footer: "Create a New Separate Class"

---

### 5. **Schedule Modal** (used for multiple purposes)
**Reusable modal for**:
- Batch joining (above)
- Class roster viewing
- Schedule creation

---

### 6. **Schedule Detail Modal** (lines 3303-3426)
**Trigger**: Click event in calendar (monthly/weekly view)

**Content**:
- Schedule details: Course, Date, Time, Room, Trainer
- Enquiry details: Client, Requested count
- Edit fields: Room (dropdown), Trainer (dropdown), Start/End time
- Buttons: "Save Changes", "Delete Schedule"

---

### 7. **Notes Modal** (lines 2489-2671)
**Trigger**: Notes icon in action column

**Content**:
- **Two Tabs**: User Notes | Activity Log
- **User Notes Tab**:
  - List of existing notes
  - Add note textarea + Save button
- **Activity Log Tab**:
  - Timeline of all activities (auto-logged)
  - Shows action, details, timestamp

---

### 8. **Class Roster Modal** (lines 1530-1576)
**Trigger**: "View" button on Class Roster page

**Content**:
- Nominee table: #, Civil ID, Student Name, Contact #, Email, Language
- "Download as Excel" button → Downloads CSV

---

### 9. **Results Modal** (lines 4313-4435)
**Trigger**: "Enter Results" button

**Content**:
- Table: #, Student Name, Result (Pass/Fail dropdown), Marks (optional)
- "Save Results" button

**Behavior**:
- Updates enquiry.nominees with results
- Logs activity

---

### 10. **Certificate Modal** (lines 3612-3760)
**Trigger**: After results entered → "Generate Certificate" button

**Content**:
- Certificate template with student details
- Download PDF button

---

### 11. **Invoice Modal** (lines 3761-3906)
**Trigger**:
- "Generate Invoice" (after class completion)
- "View Invoice" button

**Content**:
- Invoice header: Invoice #, Date, Client details
- Table: Description (Course + Date), Qty, Unit Price, Total
- Grand Total
- Payment Terms
- Buttons: "Download PDF", "Send via Email", "Mark as Paid"

---

### 12. **Edit Enquiry Modal** (lines 2940-3109)
**Trigger**: Edit icon in action column

**Content**:
- Editable fields: Client, Course, Requested, Start Date, End Date, Cost
- "Save Changes" button

---

### 13. **View Enquiry Modal** (lines 3110-3139)
**Trigger**: View icon (non-draft statuses)

**Content**:
- Readonly display of all enquiry fields
- Status badge
- "Close" button

---

### 14. **Confirmation Modal** (lines 2396-2433)
**Trigger**: Any delete/critical action

**Content**:
- Message text
- "Confirm" button (primary)
- "Cancel" button (secondary)

**Usage**:
```javascript
showConfirmation("Are you sure?", () => {
  // Action on confirm
});
```

---

### 15. **Pending Details Modal** (lines 3427-3464)
**Trigger**: Info icon (ⓘ) next to Pending count

**Content**:
- Requested: X
- Nominated: Y
- Pending: Z

---

## 🎛️ **ALL SIDE PANELS (3 Panels)**

### 1. **Reminder Panel** (lines 3907-4010)
**Trigger**: Bell icon in top bar

**Content**:
- **Two Tabs**: Upcoming | Overdue
- **Upcoming Tab**: Classes within next 7 days
- **Overdue Tab**: Classes with start date < today and status != Completed
- Each item shows: Course, Client, Date, Status
- Badge on bell icon shows overdue count

---

### 2. **Availability Panel** (lines 4011-4155)
**Trigger**: "Check Availability" button in nomination workflow

**Content**:
- Calendar month view
- Days with classes are marked:
  - Partial (green) - some seats available
  - Full (yellow) - no seats available
- Click day → shows time slots with status (Available/Booked/Reserved)
- Time slots: 9:00-10:00, 10:00-11:00, ..., 17:00-18:00

---

### 3. **Pending Peers Panel** (lines 4156-4242)
**Trigger**: "View Pending Peers" link (shown when joining batch)

**Content**:
- Lists all other enquiries that will join the same batch
- Shows: Client, Course, Requested count

---

## 🎨 **EXACT COMPONENT SPECIFICATIONS**

### StatusBadge Component
**All Status Colors** (from style.css lines 136-169):
```css
Draft → #778899 (slate-gray)
Quotation Sent → #f39c12 (warning)
Agreement Pending → #16a085 (turquoise)
Agreement Sent → #e67e22 (carrot-orange)
Pending Nomination → #8e44ad (wisteria)
Partially Nominated → #f39c12 (warning)
Fully Nominated → #3498db (peter-river)
Scheduled → #27ae60 (success)
Active/Approved → #27ae60 (success)
Completed → #34495e (wet-asphalt)
Rejected → #c0392b (pomegranate)
Certificate Pending → #8e44ad (wisteria)
Certificate Issued → #2980b9 (belize-hole)
Payment Pending → #e67e22 (carrot-orange)
Payment Received → #27ae60 (success)
Paid → #27ae60 (success)
Cancelled → #95a5a6
```

### DataTable Component
**Exact Structure**:
- Sortable columns have: `class="sortable" data-sort-key="..." data-sort-type="..."`
- Sort icons change: `fa-sort` → `fa-sort-up` (asc) / `fa-sort-down` (desc)
- Grouped views have group header rows with background `#f9f9f9`

### ActionIcons Component
**Icon Colors**:
- Edit: `var(--action-icon-color)` (#6d6d6d)
- Delete: `var(--danger-color)` (#d7685b)
- View: `var(--action-icon-color)`
- Notes: `#8492a6` (slate gray)
- Hover: `opacity: 0.7`, `scale: 1.1`

---

## ✅ **IMPLEMENTATION CHECKLIST**

### Phase 1: Core Structure
- [ ] Dashboard (6 cards + 2 widgets)
- [ ] All Records (Table + Grouped views)
- [ ] Pending Enquiries
- [ ] New Enquiry (3-step workflow)

### Phase 2: Nomination System
- [ ] Add Nomination (client/course selection)
- [ ] Batch Nomination Modal (with autocomplete)
- [ ] Join Batch Modal
- [ ] Pending Nominations (Table + filters)

### Phase 3: Scheduling
- [ ] Schedule Page (Monthly + Weekly views)
- [ ] Schedule Detail Modal
- [ ] Class Roster Page
- [ ] Class Roster Modal (with CSV download)

### Phase 4: Admin Pages
- [ ] Trainer Page (List + Leave Management)
- [ ] Rate Card (Baseline + Client-specific)
- [ ] Results Page
- [ ] Results Modal

### Phase 5: Financial
- [ ] Invoices Page
- [ ] Invoice Modal (with PDF download)
- [ ] Certificates Page
- [ ] Certificate Modal
- [ ] Revenue Page (with Chart.js)
- [ ] Reports Page

### Phase 6: Supporting Features
- [ ] Notes Modal (Notes + Activity Log tabs)
- [ ] Edit/View Enquiry Modals
- [ ] Quotation Modal
- [ ] Agreement Modal
- [ ] Reminder Panel (side panel)
- [ ] Availability Panel (side panel)
- [ ] Pending Peers Panel (side panel)
- [ ] Confirmation Modal
- [ ] Global Search (with debounce)
- [ ] Table Sorting (all tables)
- [ ] Status Filters (all list pages)

---

## 🔧 **KEY TECHNICAL DETAILS**

### Date Handling
- Format: `YYYY-MM-DD` for storage
- Display: `DD/MM/YYYY` (GB locale)
- Use Litepicker for date range selection

### Search Implementation (lines 195-263)
- Debounced input (300ms delay)
- Searches across: enquiryId, client name, course name, status
- Search clear button (× icon)
- Preserved in appState.searchFilter

### Sorting Implementation (lines 805-816)
- Each table has unique `data-view-id`
- State stored in `tableSortState[viewId]`
- Sort types: string, number, date
- Sort direction: asc/desc

### Modal Pattern (lines 2434-2488)
```javascript
function openModal(modal) {
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('show'), 10);
}

function closeModal(modal) {
  modal.classList.remove('show');
  setTimeout(() => modal.style.display = 'none', 300);
}
```

### Activity Logging (lines 2672)
```javascript
function logActivity(enquiryId, action, details = "") {
  if (!appData.activityLog[enquiryId]) {
    appData.activityLog[enquiryId] = [];
  }
  appData.activityLog[enquiryId].push({
    action,
    details,
    timestamp: new Date().toISOString()
  });
}
```

---

## 📦 **DATA PERSISTENCE**

All data stored in `localStorage`:
```javascript
localStorage.setItem('appData', JSON.stringify(appData));
```

Load on app init:
```javascript
const stored = localStorage.getItem('appData');
appData = stored ? JSON.parse(stored) : initialData;
```

---

## 🎯 **SUCCESS CRITERIA**

✅ **100% Visual Match**: Every pixel, color, font, spacing matches HTML
✅ **100% Functional Match**: Every button, modal, workflow works identically
✅ **100% Data Match**: Same data structure, same localStorage usage
✅ **Responsive**: Mobile-friendly as per CSS media queries

---

**TOTAL PAGES**: 15
**TOTAL MODALS**: 15+
**TOTAL SIDE PANELS**: 3
**TOTAL COMPONENTS**: 50+

**Estimated Lines of React Code**: ~15,000-20,000 lines

This is the COMPLETE specification extracted from the 6000-line HTML file.
