# Workflow Guide

This guide explains the business logic and workflows for all major features in the Training Management System.

---

## 📚 Table of Contents
1. [Enquiry Lifecycle](#enquiry-lifecycle)
2. [Nomination System](#nomination-system)
3. [Batch Management](#batch-management)
4. [Scheduling Process](#scheduling-process)
5. [Invoicing Workflow](#invoicing-workflow)
6. [Certificate Issuance](#certificate-issuance)
7. [Leave Management](#leave-management)
8. [Rate Card System](#rate-card-system)

---

## 🔄 Enquiry Lifecycle

### Overview
Enquiries go through a defined workflow from creation to completion.

### Status Flow
```
Draft → Quotation Sent → Agreement Pending → Agreement Sent →
Pending Nomination → Nominated → Scheduled → Completed
```

### Detailed Workflow

#### 1. Create Enquiry (Draft)
**Actors:** Admin, Training Coordinator
**Process:**
1. Select client (existing/new/walk-in)
2. Select course(s)
3. Enter requested quantity
4. Select training date
5. Cost automatically populated from baseline/rate card
6. Save as Draft

**Business Logic:**
- If client has rate card → use discounted price
- If no rate card → use baseline course price
- Record creation date and user

#### 2. Send Quotation
**Actors:** Admin, Training Coordinator
**Process:**
1. Review draft enquiry
2. Optionally edit cost/quantity
3. Click "Send Quotation"
4. System generates quotation PDF
5. System sends email to client contact
6. Status changes to "Quotation Sent"

**Business Logic:**
- Can select multiple enquiries for same client
- Combined into single quotation document
- Log activity: "Quotation sent to [email] on [date]"
- Store quotation sent date

#### 3. Quotation Agreed by Client
**Actors:** Admin, Training Coordinator (after client confirmation)
**Process:**
1. Client reviews and agrees (offline/phone)
2. User clicks "Quotation Agreed?"
3. Status changes to "Agreement Pending"

**Business Logic:**
- This is a manual confirmation step
- Can edit quotation before this step
- Cannot edit quotation after agreement pending

#### 4. Send Agreement
**Actors:** Admin, Training Coordinator
**Process:**
1. Review agreed enquiries
2. Click "Send Agreement"
3. System generates training agreement PDF
4. Can select multiple courses for same client
5. Agreement includes terms, conditions, pricing
6. System sends email to client
7. Status changes to "Agreement Sent"

**Business Logic:**
- Agreement can be edited before sending
- Log activity: "Agreement sent to [email] on [date]"
- Store agreement sent date

#### 5. Finalize Agreement
**Actors:** Admin, Training Coordinator (after client signs)
**Process:**
1. Client signs agreement (offline/DocuSign)
2. User clicks "Confirm Agreement?"
3. System prompts to upload signed copy
4. Status changes to "Pending Nomination"

**Business Logic:**
- Store agreement signed date
- This triggers the nomination workflow
- Cannot go back to previous statuses

#### 6. Nomination Process
See [Nomination System](#nomination-system)

#### 7. Schedule Class
See [Scheduling Process](#scheduling-process)

#### 8. Mark Completed
**Actors:** Admin, Training Coordinator
**Process:**
1. After class is delivered
2. Click "Class Completed?"
3. System prompts to enter results
4. Status changes to "Completed"
5. System prompts: "Generate invoice for [client]?"

**Business Logic:**
- Only scheduled enquiries can be marked complete
- Triggers invoice generation workflow
- Can add class notes and feedback

### State Transitions

| From Status | To Status | Action | Can Reverse? |
|-------------|-----------|--------|--------------|
| Draft | Quotation Sent | Send Quotation | Yes (edit quotation) |
| Quotation Sent | Agreement Pending | Client Agrees | Yes |
| Agreement Pending | Agreement Sent | Send Agreement | Yes (edit agreement) |
| Agreement Sent | Pending Nomination | Finalize Agreement | No |
| Pending Nomination | Nominated | Add Nominees | Yes |
| Nominated | Scheduled | Create Schedule | Yes (reschedule) |
| Scheduled | Completed | Mark Complete | No |
| Any | Cancelled | Cancel | No |

---

## 👥 Nomination System

### Overview
Nomination is the process of assigning specific students to a training class.

### Three Client Types

#### 1. Existing Company Client
**Process:**
1. Select client from dropdown
2. Select course
3. System checks for existing batches with available seats
4. If available: show "Join Batch" modal
5. If not: create new batch
6. Add nominee details (Civil ID, Name, Email, Language)

#### 2. New Company Client
**Process:**
1. Click "Add New Client"
2. Enter company details:
   - Client Name
   - Contact Person
   - Contact Number
   - Email
3. System creates client record
4. Proceeds to course selection
5. Same batch logic as existing client

#### 3. Walk-in Individual
**Process:**
1. Click "Walk-in Client"
2. Enter individual details:
   - Student Name (becomes client name)
   - Civil ID
   - Contact Number
   - Email
3. System creates client AND student record
4. Proceeds to course selection
5. Same batch logic

### Batch Join/Merge Decision

**When selecting course, system checks:**
```
Are there existing batches for this course with available capacity?
```

**If YES:**
- Show "Join Batch" modal
- List available batches with:
  - Batch ID
  - Date
  - Session
  - Available seats
  - Current clients in batch
- Options:
  1. "Join this Batch" → Add to existing batch
  2. "Create New Batch" → Create separate batch

**If NO:**
- Automatically create new batch
- Proceed to nominee entry

### Batch Creation Logic

**When creating new batch:**
1. Generate batch ID: `BATCH-[COURSE_CODE]-[COUNTER]`
2. Set class capacity from course default or enquiry quantity
3. Initialize with 0 nominees
4. Link to enquiry

**When joining existing batch:**
1. Link enquiry to existing batch
2. Increment nominated count
3. Decrement pending seats

### Nominee Entry

**For each nominee:**
```javascript
{
  civilId: "Required - 12 digits",
  name: "Required",
  phone: "Optional",
  email: "Optional",
  language: "Required - dropdown (16 languages)",
  time: "Optional - AM/PM preference",
  notes: "Optional"
}
```

**Validation:**
- Civil ID must be unique within batch
- Check if student exists in system
- If exists → auto-fill details
- If new → create student record

### Nomination Status

| Status | Meaning | Criteria |
|--------|---------|----------|
| Pending Nomination | No nominees added | nominated = 0 |
| Partially Nominated | Some nominees added | 0 < nominated < classCapacity |
| Fully Nominated | All seats filled | nominated >= classCapacity |
| Nominated | Has nominees, ready to schedule | nominated > 0 |

### Confirmation Workflow

After adding nominees:
1. Click "Confirm Nomination"
2. System validates:
   - All required fields filled
   - At least 1 nominee
   - No duplicate Civil IDs
3. Status changes to "Nominated"
4. System prompts: "Schedule this class now?"

---

## 📦 Batch Management

### Batch Structure

```javascript
{
  batchId: "BATCH-FW-001",
  course: "Fire Warden",
  date: "2025-03-15",
  session: "Morning",
  classCapacity: 15,
  nominated: 12,
  pending: 3,
  nominees: [...]  // Array of nominee objects
}
```

### Multi-Client Batches

**Key Feature:** Multiple clients can join the same batch

**Example:**
```
Batch: BATCH-FW-001
Class Capacity: 15

Client A (Company ABC): 5 students
Client B (Company XYZ): 7 students
Client C (Walk-in Individual): 1 student

Total Nominated: 13/15
Available: 2 seats
```

**Business Logic:**
- Each client has separate enquiry linked to batch
- Invoice generated per client based on their students
- Certificates issued per student
- Roster shows all students with their client

### Batch Counter System

**Implementation:**
```javascript
// Counter stored per course
batchCounters: {
  "Fire Warden": 15,
  "First Aid": 8,
  "IOSH": 3
}

// When creating batch
function generateBatchId(courseName) {
  const counter = batchCounters[courseName] || 0;
  batchCounters[courseName] = counter + 1;
  const courseCode = getCourseCode(courseName); // e.g., "FW"
  return `BATCH-${courseCode}-${String(counter + 1).padStart(3, '0')}`;
}
```

### Batch Lifecycle

1. **Created** - When first enquiry nominates for a course/date
2. **Filling** - As more clients join
3. **Full** - When nominated >= classCapacity
4. **Scheduled** - When schedule is created
5. **In Progress** - During class delivery
6. **Completed** - After class ends

---

## 📅 Scheduling Process

### Overview
Convert nominated enquiries into scheduled classes with trainer and room assignments.

### Prerequisites
- Enquiry status = "Nominated"
- At least 1 nominee added
- Batch created

### Scheduling Workflow

#### 1. Open Schedule Modal
**From:** Pending Nominations page → "Confirm Nomination" button
**Shows:**
- Course name
- Client name(s)
- Number of students
- Requested date

#### 2. Select Details
**Required Fields:**
- Training Date (pre-filled from enquiry)
- Session (Morning/Afternoon/Evening/Full Day)
- Trainer (dropdown)
- Room (dropdown)
- Start Time
- End Time

**Optional:**
- Notes

#### 3. Availability Check
**System checks:**
```
Trainer Availability:
- Is trainer available on this day?
- Is trainer already scheduled at this time?
- Does trainer have approved leave?

Room Availability:
- Is room available (not in maintenance)?
- Is room already booked at this time?
- Does room capacity >= class size?
```

**Conflict Detection:**
```javascript
function checkConflicts(date, startTime, endTime, trainer, room) {
  const conflicts = {
    trainerConflict: false,
    roomConflict: false,
    details: []
  };

  // Check overlapping schedules
  const overlapping = schedules.filter(s =>
    s.date === date &&
    s.status === 'Scheduled' &&
    timeOverlaps(s.startTime, s.endTime, startTime, endTime)
  );

  overlapping.forEach(s => {
    if (s.trainer === trainer) {
      conflicts.trainerConflict = true;
      conflicts.details.push(`Trainer busy: ${s.course} (${s.startTime}-${s.endTime})`);
    }
    if (s.room === room) {
      conflicts.roomConflict = true;
      conflicts.details.push(`Room booked: ${s.course} (${s.startTime}-${s.endTime})`);
    }
  });

  return conflicts;
}
```

#### 4. Create Schedule
**On Save:**
1. Generate schedule ID: `SCH-[DATE]-[COUNTER]`
2. Create schedule record
3. Link to enquiry and batch
4. Update enquiry status to "Scheduled"
5. Log activity

#### 5. View Schedule

**Two Views:**

**Weekly Schedule (Grid View):**
```
        Monday    Tuesday   Wednesday  Thursday  Friday
Room 1  [Event]   [Event]   [Empty]    [Event]   [Event]
Room 2  [Empty]   [Event]   [Event]    [Empty]   [Event]
Room 3  [Event]   [Empty]   [Event]    [Event]   [Empty]
```

**Monthly Calendar:**
```
Sun  Mon  Tue  Wed  Thu  Fri  Sat
                  1    2    3    4
 5    6    7    8    9   10   11
     [2]  [3]  [1]  [4]  [2]
```
Numbers = event count per day

### Rescheduling

**Process:**
1. Open existing schedule
2. Edit date/time/trainer/room
3. System checks new conflicts
4. Save updates
5. Original schedule marked as "Rescheduled"
6. New schedule created
7. Log activity: "Rescheduled from [old] to [new]"

---

## 💰 Invoicing Workflow

### Trigger Points

#### 1. After Class Completion
**Automatic Prompt:**
```
"Class marked as completed. Generate invoice for [Client]?"
[Generate Invoice] [Later]
```

#### 2. Manual Creation
**From:** Invoices page → "New Invoice" button

### Invoice Generation Process

#### 1. Select Client
- Auto-filled if triggered from completion
- Or select from dropdown

#### 2. Select Enquiries
**System shows:**
- Completed enquiries for client
- Not yet invoiced
- Checkboxes to select multiple

#### 3. Invoice Items
**For each selected enquiry:**
```javascript
{
  enquiryId: "ENQ-123",
  course: "Fire Warden",
  quantity: 15,  // Number of students
  unitPrice: 45.00,  // From rate card or baseline
  discount: 10%,  // From rate card
  total: 607.50  // (15 * 45) - 10% = 607.50
}
```

#### 4. Calculate Totals
```javascript
Subtotal = sum of all item totals
Tax = Subtotal * taxRate (if applicable)
Total Amount = Subtotal + Tax
```

#### 5. Set Payment Terms
- Issue Date (auto: today)
- Due Date (default: +30 days)
- Currency (default: KWD)
- Payment Terms (text field)

#### 6. Generate Invoice Number
```
Format: INV-[YEAR]-[MONTH]-[COUNTER]
Example: INV-2025-03-015
```

#### 7. Save as Draft or Send

**Draft:**
- Status = "Draft"
- Can edit later

**Send:**
- Generate PDF
- Send email to client
- Status = "Sent"
- Record sent date

### Invoice PDF Structure

```
----------------------------------
        SUN TRAINING INSTITUTE
           [Company Address]
           [Contact Details]
----------------------------------

Invoice #: INV-2025-03-015
Date: 15/03/2025
Due Date: 15/04/2025

Bill To:
[Client Name]
[Contact Person]
[Email]
[Phone]

----------------------------------
ITEM              QTY  PRICE  DISC  TOTAL
----------------------------------
Fire Warden        15  45.00   10%  607.50
First Aid           8  35.00    5%  266.00
----------------------------------
                        Subtotal:  873.50
                        Tax (0%):    0.00
                        TOTAL:     873.50 KWD
----------------------------------

Notes: Payment due within 30 days

Generated with Sun Training System
```

### Payment Tracking

**Status Flow:**
```
Draft → Sent → Paid
              └→ Overdue (if past due date)
```

**Mark as Paid:**
1. Click "Mark as Paid"
2. Enter payment date
3. Enter payment method
4. Optional: attach receipt
5. Status = "Paid"

**Overdue Detection:**
- Cron job runs daily
- Checks invoices with status "Sent"
- If dueDate < today → status = "Overdue"

---

## 🎖️ Certificate Issuance

### Prerequisites
- Enquiry status = "Completed"
- Results entered for all students
- Students marked as "Pass"

### Workflow

#### 1. Trigger
**Two ways:**

**A. Automatic (Batch):**
1. Go to Results page
2. Select completed class
3. Enter results for all students
4. Click "Generate Certificates"
5. System creates certificate for each "Pass" student

**B. Manual (Individual):**
1. Go to Certificates page
2. Click "New Certificate"
3. Select enquiry
4. Select student
5. Enter details
6. Generate

#### 2. Certificate Details

```javascript
{
  certificateNumber: "CERT-2025-001",
  student: {
    civilId: "299012345678",
    name: "Ahmed Ali"
  },
  course: "Fire Warden",
  completionDate: "2025-03-15",
  issueDate: "2025-03-16",
  expiryDate: "2028-03-15",  // If applicable
  grade: "Pass",
  score: 85,
  trainer: "John Smith",
  verificationCode: "ABC123XYZ"
}
```

#### 3. Generate PDF

**Certificate Template:**
```
┌─────────────────────────────────────────┐
│                                         │
│    SUN TRAINING INSTITUTE              │
│                                         │
│    CERTIFICATE OF COMPLETION           │
│                                         │
│    This is to certify that             │
│                                         │
│    [STUDENT NAME]                      │
│    Civil ID: [CIVIL ID]                │
│                                         │
│    Has successfully completed          │
│                                         │
│    [COURSE NAME]                       │
│                                         │
│    On [DATE]                           │
│                                         │
│    Instructor: [TRAINER NAME]          │
│                                         │
│    Certificate #: [NUMBER]             │
│    Verification: [CODE]                │
│                                         │
│    [Signature]      [Stamp]            │
│                                         │
└─────────────────────────────────────────┘
```

#### 4. Issue Certificate
- Status changes to "Issued"
- Record issue date
- Can print or email to student

#### 5. Verification
**Public endpoint:** `/api/v1/certificates/verify/[CODE]`

Returns:
```json
{
  "valid": true,
  "certificate": {
    "number": "CERT-2025-001",
    "student": "Ahmed Ali",
    "course": "Fire Warden",
    "issueDate": "2025-03-16"
  }
}
```

---

## 🏖️ Leave Management

### Overview
Trainers can request leave, admins approve/reject.

### Leave Request Process

#### 1. Submit Leave
**By:** Trainer
**Process:**
1. Go to Trainer profile
2. Click "Request Leave"
3. Fill form:
   - Leave Type (Sick/Annual/Unpaid/Emergency/Other)
   - Start Date
   - End Date
   - Reason
   - Optional: Upload medical certificate
4. Submit
5. Status = "Pending"

#### 2. Approval Workflow
**By:** Admin
**Process:**
1. Go to Leave Management
2. See pending requests
3. Click on request to view details
4. System shows:
   - Trainer details
   - Leave dates
   - Number of days
   - Reason
   - Conflicts (if trainer has scheduled classes)
5. Options:
   - **Approve** → Status = "Approved"
   - **Reject** → Enter reason, Status = "Rejected"

#### 3. Conflict Handling

**If trainer has scheduled classes during leave:**
```
WARNING: Trainer has scheduled classes:
- 2025-03-21: Fire Warden (Room 1, 9:00-13:00)
- 2025-03-22: First Aid (Room 2, 14:00-18:00)

Actions required:
□ Reassign classes to another trainer
□ Reschedule classes
□ Cancel classes

Proceed with approval?
```

#### 4. Leave Calendar
**Shows:**
- All approved leaves
- Color-coded by trainer
- Hover to see details

---

## 💳 Rate Card System

### Overview
Manage pricing at two levels: Baseline and Client-Specific.

### Baseline Rate Card

**Purpose:** Default prices for all courses

**Management:**
1. Go to Rate Card page
2. Click "Baseline Rates"
3. Table shows all courses with current prices
4. Can edit individual prices
5. Changes apply to all new enquiries
6. Price history tracked

### Client Rate Card

**Purpose:** Custom pricing for specific clients

**Setup:**
1. Go to Rate Card page
2. Click on client name
3. Shows baseline prices
4. Can set discount % per course
5. System calculates final price
6. Set validity period

**Example:**
```
Client: ABC Company
Valid: 01/01/2025 - 31/12/2025

Course          Baseline  Discount  Final Price
Fire Warden     50.00     10%       45.00
First Aid       35.00     5%        33.25
IOSH           150.00     15%      127.50
```

### Price Application Logic

**When creating enquiry:**
```javascript
function getPrice(client, course) {
  // 1. Check if client has active rate card
  const rateCard = getRateCard(client);

  if (rateCard && rateCard.isActive && isWithinValidity(rateCard)) {
    const courseRate = rateCard.courses.find(c => c.course === course);
    if (courseRate) {
      return courseRate.finalPrice;
    }
  }

  // 2. Fall back to baseline
  const courseInfo = getCourse(course);
  return courseInfo.cost;
}
```

### Price History

**Tracks:**
- All price changes
- Date of change
- Previous price
- New price
- Changed by (user)

**View:**
- Click "Price History" on any course
- Shows timeline of all changes

---

## ✅ Best Practices

### Data Integrity
1. Always validate enquiry status before status transitions
2. Check conflicts before scheduling
3. Verify nominees before marking as nominated
4. Ensure results entered before generating certificates

### User Experience
1. Show confirmations for irreversible actions
2. Provide clear error messages
3. Auto-save drafts
4. Show progress indicators

### Business Rules
1. Cannot edit quotation after agreement pending
2. Cannot delete enquiry if has nominees
3. Cannot delete schedule if completed
4. Cannot modify invoice if paid

### Notifications
1. Email on quotation sent
2. Email on agreement sent
3. Email on invoice sent
4. Email on leave approved/rejected
5. System notification on status changes

---

## 🔍 Implementation Checklist

For each workflow:
- [ ] Backend API endpoints
- [ ] Database models and relationships
- [ ] Frontend components
- [ ] State management
- [ ] Form validation
- [ ] Error handling
- [ ] Loading states
- [ ] Success/error messages
- [ ] Activity logging
- [ ] Email notifications
- [ ] PDF generation (where applicable)
- [ ] Permissions/role checks
- [ ] Testing (unit + integration)

---

This completes the workflow guide. Reference this document when implementing business logic in controllers and components.
