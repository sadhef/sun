# API Reference

Complete REST API documentation for the Training Management System.

---

## 📋 Base URL

```
Development: http://localhost:5000/api/v1
Production: https://your-domain.com/api/v1
```

---

## 🔐 Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Auth Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/me` | Get current user | Private |
| PUT | `/auth/update-profile` | Update user profile | Private |
| PUT | `/auth/change-password` | Change password | Private |

---

## 📊 Dashboard

| Method | Endpoint | Description | Access | Role |
|--------|----------|-------------|--------|------|
| GET | `/dashboard/stats` | Get dashboard statistics | Private | Admin |
| GET | `/dashboard/today-schedule` | Get today's schedule | Private | All |
| GET | `/dashboard/recent-enquiries` | Get recent enquiries (limit=5) | Private | All |

**Response Example:**
```json
{
  "success": true,
  "data": {
    "openEnquiries": 15,
    "pendingNominations": 8,
    "upcomingClasses": 12,
    "pendingLeaves": 3,
    "pendingInvoicesCount": 5,
    "pendingInvoicesAmount": 12500.00,
    "totalRevenue": 245000.00
  }
}
```

---

## 📝 Enquiries

| Method | Endpoint | Description | Access | Role |
|--------|----------|-------------|--------|------|
| GET | `/enquiries` | Get all enquiries | Private | All |
| GET | `/enquiries/:id` | Get enquiry by ID | Private | All |
| POST | `/enquiries` | Create new enquiry | Private | Admin, Coordinator |
| PUT | `/enquiries/:id` | Update enquiry | Private | Admin, Coordinator |
| DELETE | `/enquiries/:id` | Delete enquiry | Private | Admin |
| PATCH | `/enquiries/:id/status` | Update status | Private | Admin, Coordinator |
| POST | `/enquiries/:id/notes` | Add note | Private | All |
| POST | `/enquiries/send-quotation` | Send quotation email | Private | Admin, Coordinator |
| POST | `/enquiries/send-agreement` | Send agreement | Private | Admin, Coordinator |
| POST | `/enquiries/:id/add-nominees` | Add nominees | Private | Admin, Coordinator |

**Query Parameters (GET /enquiries):**
```
?status=Draft
&client=Company%20Name
&course=Fire%20Warden
&startDate=2025-01-01
&endDate=2025-12-31
&search=search%20term
&page=1
&limit=50
&sort=-date  // -date for desc, date for asc
```

**Create Enquiry Request:**
```json
{
  "client": "Company Name",
  "contactName": "John Doe",
  "contactPhone": "+965 XXXX XXXX",
  "contactEmail": "john@company.com",
  "course": "Fire Warden",
  "cost": 50.00,
  "requested": 15,
  "startDate": "2025-03-15",
  "endDate": "2025-03-15"
}
```

---

## 👥 Clients

| Method | Endpoint | Description | Access | Role |
|--------|----------|-------------|--------|------|
| GET | `/clients` | Get all clients | Private | All |
| GET | `/clients/:id` | Get client by ID | Private | All |
| POST | `/clients` | Create new client | Private | Admin, Coordinator |
| PUT | `/clients/:id` | Update client | Private | Admin |
| DELETE | `/clients/:id` | Delete client | Private | Admin |
| GET | `/clients/:id/enquiries` | Get client enquiries | Private | All |
| GET | `/clients/:id/rate-card` | Get client rate card | Private | All |

**Create Client Request:**
```json
{
  "name": "Company Name",
  "type": "company",  // or "individual"
  "contactPerson": "Jane Doe",
  "contactPhone": "+965 XXXX XXXX",
  "contactEmail": "jane@company.com"
}
```

---

## 🎓 Courses

| Method | Endpoint | Description | Access | Role |
|--------|----------|-------------|--------|------|
| GET | `/courses` | Get all courses | Private | All |
| GET | `/courses/:id` | Get course by ID | Private | All |
| POST | `/courses` | Create new course | Private | Admin |
| PUT | `/courses/:id` | Update course | Private | Admin |
| DELETE | `/courses/:id` | Delete course | Private | Admin |

**Create Course Request:**
```json
{
  "name": "Fire Warden",
  "code": "FW-001",
  "cost": 50.00,
  "duration": {
    "hours": 4,
    "days": 1
  },
  "classCapacity": 15,
  "category": "Safety",
  "description": "Fire safety training"
}
```

---

## 👨‍🎓 Students

| Method | Endpoint | Description | Access | Role |
|--------|----------|-------------|--------|------|
| GET | `/students` | Get all students | Private | All |
| GET | `/students/:id` | Get student by ID | Private | All |
| POST | `/students` | Create new student | Private | Admin, Coordinator |
| PUT | `/students/:id` | Update student | Private | Admin, Coordinator |
| DELETE | `/students/:id` | Delete student | Private | Admin |
| GET | `/students/:id/certificates` | Get student certificates | Private | All |
| GET | `/students/:id/results` | Get student results | Private | All |

**Create Student Request:**
```json
{
  "civilId": "299012345678",
  "name": "Ahmed Ali",
  "phone": "+965 XXXX XXXX",
  "email": "ahmed@email.com",
  "language": "English"
}
```

---

## 📦 Batches

| Method | Endpoint | Description | Access | Role |
|--------|----------|-------------|--------|------|
| GET | `/batches` | Get all batches | Private | All |
| GET | `/batches/:id` | Get batch by ID | Private | All |
| POST | `/batches` | Create new batch | Private | Admin, Coordinator |
| PUT | `/batches/:id` | Update batch | Private | Admin, Coordinator |
| DELETE | `/batches/:id` | Delete batch | Private | Admin |
| POST | `/batches/:id/add-nominees` | Add nominees to batch | Private | Admin, Coordinator |
| DELETE | `/batches/:id/nominees/:nomineeId` | Remove nominee | Private | Admin, Coordinator |
| GET | `/batches/available/:courseId` | Get available batches for course | Private | All |

**Create Batch Request:**
```json
{
  "batchId": "BATCH-001",
  "course": "Fire Warden",
  "date": "2025-03-15",
  "session": "Morning",
  "classCapacity": 15,
  "nominees": []
}
```

---

## 👨‍🏫 Trainers

| Method | Endpoint | Description | Access | Role |
|--------|----------|-------------|--------|------|
| GET | `/trainers` | Get all trainers | Private | All |
| GET | `/trainers/:id` | Get trainer by ID | Private | All |
| POST | `/trainers` | Create new trainer | Private | Admin |
| PUT | `/trainers/:id` | Update trainer | Private | Admin |
| DELETE | `/trainers/:id` | Delete trainer | Private | Admin |
| GET | `/trainers/:id/availability` | Get trainer availability | Private | All |
| GET | `/trainers/:id/schedules` | Get trainer schedules | Private | All |

**Query Parameters (GET /trainers/id/availability):**
```
?startDate=2025-03-01
&endDate=2025-03-31
```

---

## 🏢 Rooms

| Method | Endpoint | Description | Access | Role |
|--------|----------|-------------|--------|------|
| GET | `/rooms` | Get all rooms | Private | All |
| GET | `/rooms/:id` | Get room by ID | Private | All |
| POST | `/rooms` | Create new room | Private | Admin |
| PUT | `/rooms/:id` | Update room | Private | Admin |
| DELETE | `/rooms/:id` | Delete room | Private | Admin |
| GET | `/rooms/:id/availability` | Get room availability | Private | All |

---

## 📅 Schedules

| Method | Endpoint | Description | Access | Role |
|--------|----------|-------------|--------|------|
| GET | `/schedules` | Get all schedules | Private | All |
| GET | `/schedules/:id` | Get schedule by ID | Private | All |
| POST | `/schedules` | Create new schedule | Private | Admin, Coordinator |
| PUT | `/schedules/:id` | Update schedule | Private | Admin, Coordinator |
| DELETE | `/schedules/:id` | Delete schedule | Private | Admin |
| GET | `/schedules/weekly` | Get weekly schedule | Private | All |
| GET | `/schedules/monthly` | Get monthly schedule | Private | All |
| POST | `/schedules/:id/check-conflicts` | Check schedule conflicts | Private | All |

**Query Parameters (GET /schedules/weekly):**
```
?week=2025-W11  // ISO week format
&room=roomId
&trainer=trainerId
```

**Query Parameters (GET /schedules/monthly):**
```
?month=2025-03
&room=roomId
&trainer=trainerId
```

---

## 🏖️ Leaves

| Method | Endpoint | Description | Access | Role |
|--------|----------|-------------|--------|------|
| GET | `/leaves` | Get all leave requests | Private | All |
| GET | `/leaves/:id` | Get leave by ID | Private | All |
| POST | `/leaves` | Create leave request | Private | Trainer |
| PUT | `/leaves/:id` | Update leave request | Private | Trainer (own) |
| DELETE | `/leaves/:id` | Delete leave request | Private | Trainer (own) |
| PATCH | `/leaves/:id/approve` | Approve leave | Private | Admin |
| PATCH | `/leaves/:id/reject` | Reject leave | Private | Admin |

**Create Leave Request:**
```json
{
  "trainer": "trainerId",
  "startDate": "2025-03-20",
  "endDate": "2025-03-22",
  "leaveType": "Sick Leave",
  "reason": "Medical appointment"
}
```

---

## 💰 Rate Cards

| Method | Endpoint | Description | Access | Role |
|--------|----------|-------------|--------|------|
| GET | `/rate-cards` | Get all rate cards | Private | Admin |
| GET | `/rate-cards/baseline` | Get baseline rates | Private | All |
| POST | `/rate-cards/baseline` | Set baseline rates | Private | Admin |
| GET | `/rate-cards/client/:clientId` | Get client rate card | Private | All |
| POST | `/rate-cards/client/:clientId` | Create/Update client rate card | Private | Admin |
| GET | `/rate-cards/price-history/:courseId` | Get price history | Private | Admin |

**Create Client Rate Card:**
```json
{
  "client": "clientId",
  "courses": [
    {
      "course": "Fire Warden",
      "basePrice": 50.00,
      "discount": 10,
      "effectiveDate": "2025-03-01"
    }
  ],
  "validFrom": "2025-03-01",
  "validUntil": "2025-12-31"
}
```

---

## 🧾 Invoices

| Method | Endpoint | Description | Access | Role |
|--------|----------|-------------|--------|------|
| GET | `/invoices` | Get all invoices | Private | Admin, Accountant |
| GET | `/invoices/:id` | Get invoice by ID | Private | Admin, Accountant |
| POST | `/invoices` | Create invoice | Private | Admin |
| PUT | `/invoices/:id` | Update invoice | Private | Admin |
| DELETE | `/invoices/:id` | Delete invoice | Private | Admin |
| POST | `/invoices/:id/generate-pdf` | Generate invoice PDF | Private | Admin, Accountant |
| POST | `/invoices/:id/send-email` | Send invoice by email | Private | Admin, Accountant |
| PATCH | `/invoices/:id/mark-paid` | Mark invoice as paid | Private | Admin, Accountant |
| GET | `/invoices/client/:clientId` | Get client invoices | Private | All |

**Create Invoice Request:**
```json
{
  "client": "clientId",
  "items": [
    {
      "enquiry": "enquiryId",
      "course": "Fire Warden",
      "quantity": 15,
      "unitPrice": 50.00,
      "discount": 10
    }
  ],
  "tax": {
    "rate": 0
  },
  "issueDate": "2025-03-15",
  "dueDate": "2025-04-15",
  "notes": "Payment terms: Net 30"
}
```

---

## 🎖️ Certificates

| Method | Endpoint | Description | Access | Role |
|--------|----------|-------------|--------|------|
| GET | `/certificates` | Get all certificates | Private | All |
| GET | `/certificates/:id` | Get certificate by ID | Private | All |
| POST | `/certificates` | Create certificate | Private | Admin |
| PUT | `/certificates/:id` | Update certificate | Private | Admin |
| DELETE | `/certificates/:id` | Delete certificate | Private | Admin |
| POST | `/certificates/:id/generate-pdf` | Generate certificate PDF | Private | Admin |
| POST | `/certificates/bulk-generate` | Bulk generate certificates | Private | Admin |
| GET | `/certificates/verify/:code` | Verify certificate | Public | - |

---

## 📈 Reports

| Method | Endpoint | Description | Access | Role |
|--------|----------|-------------|--------|------|
| GET | `/reports/revenue` | Get revenue report | Private | Admin, Accountant |
| GET | `/reports/enrollment` | Get enrollment statistics | Private | Admin |
| GET | `/reports/trainer-utilization` | Get trainer utilization | Private | Admin |
| GET | `/reports/course-popularity` | Get course popularity | Private | Admin |
| GET | `/reports/client-activity` | Get client activity | Private | Admin |

**Query Parameters (Revenue Report):**
```
?startDate=2025-01-01
&endDate=2025-12-31
&groupBy=month  // month, quarter, year
&client=clientId
&course=courseId
```

---

## 🔍 Global Search

| Method | Endpoint | Description | Access | Role |
|--------|----------|-------------|--------|------|
| GET | `/search` | Global search across all entities | Private | All |

**Query Parameters:**
```
?q=search%20term
&entity=enquiries,clients,students  // Comma-separated
&limit=20
```

---

## 📄 Error Responses

All API endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error (only in development)"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## 🔧 Rate Limiting

All API endpoints are rate-limited:

```
Window: 15 minutes
Max Requests: 100 per IP
```

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1678900000
```

---

## 📦 Pagination

Endpoints that return lists support pagination:

**Query Parameters:**
```
?page=1          // Page number (default: 1)
&limit=50        // Items per page (default: 50, max: 100)
&sort=-createdAt // Sort field (- for desc)
```

**Response Format:**
```json
{
  "success": true,
  "count": 150,
  "pagination": {
    "page": 1,
    "limit": 50,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "data": [...]
}
```

---

## 🧪 Testing Endpoints

**Recommended Tools:**
- Postman
- Thunder Client (VS Code)
- Insomnia
- cURL

**Example cURL Request:**
```bash
curl -X GET http://localhost:5000/api/v1/enquiries \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

---

## ✅ Next Steps

1. Import API collection into Postman
2. Test all endpoints
3. Set up environment variables
4. Create frontend service files matching these endpoints
5. Implement error handling in services

For frontend integration, see [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md).
