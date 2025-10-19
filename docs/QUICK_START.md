# Quick Start Guide

Get started implementing the Training Management System in 30 minutes.

---

## ⚡ Today's Action Plan (30 minutes)

### Step 1: Install Backend Dependencies (5 min)

```bash
cd backend
npm install pdfkit exceljs nodemailer multer
```

### Step 2: Create First Missing Model (10 min)

Create `backend/models/Trainer.js`:

```javascript
const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  specializations: [String],
  languages: [String],
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Trainer', TrainerSchema);
```

### Step 3: Install Frontend Dependencies (5 min)

```bash
cd frontend
npm uninstall tailwindcss postcss autoprefixer
npm install bootstrap@5.3.2 react-bootstrap @popperjs/core chart.js react-chartjs-2 date-fns react-datepicker
```

### Step 4: Update Frontend Entry Point (5 min)

Edit `frontend/src/main.jsx`:

```jsx
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
// Remove Tailwind CSS import
```

### Step 5: Test What Exists (5 min)

```bash
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm run dev
```

**✅ Checkpoint:** Backend runs on port 5000, Frontend on port 5173

---

## 📅 Week 1 Plan (Backend Focus)

### Monday: Models (4 hours)
- [ ] Create Trainer.js (template in BACKEND_GUIDE.md)
- [ ] Create Room.js
- [ ] Create Schedule.js
- [ ] Test with Postman

### Tuesday: Models Continued (4 hours)
- [ ] Create Leave.js
- [ ] Create Invoice.js
- [ ] Create Certificate.js
- [ ] Create RateCard.js

### Wednesday: Controllers (4 hours)
- [ ] Create trainerController.js (CRUD operations)
- [ ] Create roomController.js
- [ ] Create scheduleController.js
- [ ] Add routes in server.js

### Thursday: Controllers Continued (4 hours)
- [ ] Create leaveController.js
- [ ] Create invoiceController.js
- [ ] Create certificateController.js
- [ ] Create rateCardController.js

### Friday: Utilities & Testing (4 hours)
- [ ] Create pdfGenerator.js (invoice template)
- [ ] Create roleAuth.js middleware
- [ ] Create upload.js middleware
- [ ] Test all endpoints with Postman

**✅ Week 1 Goal:** All backend models, controllers, and routes complete

---

## 📅 Week 2 Plan (Frontend Setup)

### Monday: Layout (4 hours)
- [ ] Copy style.css to src/styles/custom.css
- [ ] Create Sidebar component
- [ ] Create TopBar component
- [ ] Create SearchBar component

### Tuesday: Common Components (4 hours)
- [ ] Create Modal component
- [ ] Create DataTable component
- [ ] Create StatusBadge component
- [ ] Create ActionIcons component

### Wednesday: Services & State (4 hours)
- [ ] Create all service files
- [ ] Create Zustand stores
- [ ] Create custom hooks
- [ ] Test API connections

### Thursday: Dashboard (4 hours)
- [ ] Create StatCard component
- [ ] Implement Dashboard page
- [ ] Connect to dashboard API
- [ ] Test with real data

### Friday: Enquiries Start (4 hours)
- [ ] Create EnquiryTable component
- [ ] Create EnquiriesPage
- [ ] Implement filtering
- [ ] Implement sorting

**✅ Week 2 Goal:** Complete layout, common components, Dashboard, and start Enquiries

---

## 🎯 Priority Features to Implement

### Must Have (P0)
1. **Dashboard** - Shows key metrics
2. **Enquiries** - Full workflow (Draft → Completed)
3. **Nomination** - With batch management
4. **Schedule** - Calendar views
5. **Invoicing** - PDF generation

### Should Have (P1)
6. **Trainers** - CRUD with availability
7. **Rate Cards** - Baseline + client-specific
8. **Results** - Enter and manage
9. **Roster** - View and export

### Nice to Have (P2)
10. **Certificates** - Generation and verification
11. **Leave Management** - Request and approval
12. **Reports** - Analytics and charts
13. **Revenue** - Financial overview

---

## 🔥 Critical Files to Create First

### Backend (Priority Order)

1. **Models:**
```
backend/models/Trainer.js
backend/models/Room.js
backend/models/Schedule.js
backend/models/Invoice.js
```

2. **Controllers:**
```
backend/controllers/dashboardController.js
backend/controllers/trainerController.js
backend/controllers/scheduleController.js
backend/controllers/invoiceController.js
```

3. **Routes:**
```
backend/routes/trainerRoutes.js
backend/routes/scheduleRoutes.js
backend/routes/invoiceRoutes.js
backend/routes/dashboardRoutes.js
```

4. **Utilities:**
```
backend/utils/pdfGenerator.js
backend/middleware/roleAuth.js
backend/middleware/upload.js
```

### Frontend (Priority Order)

1. **Layout:**
```
src/components/Layout/Sidebar.jsx
src/components/Layout/TopBar.jsx
src/components/Layout/SearchBar.jsx
```

2. **Common:**
```
src/components/Common/Modal.jsx
src/components/Common/DataTable.jsx
src/components/Common/StatusBadge.jsx
src/components/Common/ActionIcons.jsx
```

3. **Pages:**
```
src/pages/Dashboard.jsx
src/pages/Enquiries/EnquiriesPage.jsx
src/pages/Nomination/NominationPage.jsx
src/pages/Schedule/SchedulePage.jsx
```

4. **Services:**
```
src/services/dashboardService.js
src/services/enquiryService.js
src/services/trainerService.js
src/services/scheduleService.js
```

---

## 🎨 Styling Quick Wins

### Do This Right Away

1. **Copy the custom CSS:**
```bash
cp style.css frontend/src/styles/custom.css
```

2. **Create Bootstrap overrides:**
```bash
touch frontend/src/styles/bootstrap-overrides.css
```

Add to `bootstrap-overrides.css`:
```css
:root {
  --primary-color: #4a90e2;
  --danger-color: #d7685b;
  --success-color: #27ae60;
}

.btn-primary {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

body {
  font-size: 0.8rem;
  font-family: 'Inter', system-ui, sans-serif;
}
```

3. **Import in correct order (main.jsx):**
```jsx
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/custom.css'
import './styles/bootstrap-overrides.css'
```

**✅ Result:** Your app now looks 80% like the original

---

## 📊 Testing Checklist

### Backend Tests
```bash
# Using Thunder Client or Postman

# 1. Auth
POST /api/v1/auth/login
Body: { "email": "admin@test.com", "password": "password" }

# 2. Trainers
GET /api/v1/trainers
POST /api/v1/trainers
Body: { "name": "John Doe", "email": "john@test.com", ... }

# 3. Dashboard
GET /api/v1/dashboard/stats
GET /api/v1/dashboard/today-schedule

# 4. Enquiries
GET /api/v1/enquiries
POST /api/v1/enquiries
```

### Frontend Tests
- [ ] Login page works
- [ ] Sidebar expands/collapses
- [ ] Search bar appears
- [ ] Dashboard loads stats
- [ ] Enquiries table shows data
- [ ] Can create new enquiry
- [ ] Modals open/close
- [ ] Status badges show correct colors

---

## 🐛 Common Issues & Fixes

### Issue: "Module not found: tailwindcss"
**Fix:**
```bash
npm uninstall tailwindcss postcss autoprefixer
rm tailwind.config.js postcss.config.js
```

### Issue: "Bootstrap styles not applying"
**Fix:** Check import order in main.jsx (Bootstrap first, then custom)

### Issue: "API calls return 401"
**Fix:** Check Authorization header has Bearer token

### Issue: "Modal not opening"
**Fix:** Check Bootstrap JS is loaded:
```jsx
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
```

### Issue: "Database connection failed"
**Fix:** Check `.env` file:
```
MONGO_URI=mongodb://localhost:27017/training-system
```

---

## 🎓 Learning Resources

### While Implementing

- **MongoDB Queries:** [docs.mongodb.com](https://docs.mongodb.com)
- **Mongoose:** [mongoosejs.com](https://mongoosejs.com)
- **React Bootstrap:** [react-bootstrap.github.io](https://react-bootstrap.github.io)
- **Zustand:** [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)
- **Chart.js:** [chartjs.org](https://www.chartjs.org)

---

## ✅ Daily Checklist

### Every Morning
- [ ] Pull latest changes (if team)
- [ ] Review yesterday's code
- [ ] Check today's plan in guides
- [ ] Set up Postman/Thunder Client

### While Coding
- [ ] Reference the guides (keep them open)
- [ ] Test after each component
- [ ] Commit after each feature
- [ ] Compare with original HTML

### End of Day
- [ ] Test everything you built
- [ ] Update TODO list
- [ ] Commit and push
- [ ] Plan tomorrow's tasks

---

## 🚀 Ready to Start?

1. **Right now:** Complete "Today's Action Plan" (30 min)
2. **This week:** Follow "Week 1 Plan" (20 hours)
3. **Reference:** Keep [docs/README.md](./docs/README.md) open

**Next Action:** Run `cd backend && npm install pdfkit exceljs nodemailer multer`

---

## 📞 Need More Detail?

- **Backend:** See [docs/BACKEND_GUIDE.md](./docs/BACKEND_GUIDE.md)
- **Frontend:** See [docs/FRONTEND_GUIDE.md](./docs/FRONTEND_GUIDE.md)
- **Styling:** See [docs/STYLING_GUIDE.md](./docs/STYLING_GUIDE.md)
- **API:** See [docs/API_REFERENCE.md](./docs/API_REFERENCE.md)
- **Workflows:** See [docs/WORKFLOW_GUIDE.md](./docs/WORKFLOW_GUIDE.md)

---

**Let's build this! 🎉**
