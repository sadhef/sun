# Styling Guide - Bootstrap Migration

## 📚 Migration Strategy

This guide shows how to convert the exact styling from `style.css` to Bootstrap 5 + custom CSS.

---

## 🎨 Color Variables (Keep Exact Same)

**From style.css:** Already defined in `:root`

Keep these exactly as-is in `frontend/src/styles/custom.css`:

```css
:root {
    --primary-color: #4a90e2;
    --secondary-color: #f5f7fa;
    --light-gray-bg: #f0f0f0;
    --font-color: #333;
    --border-color: #e0e0e0;
    --shadow-color: rgba(0, 0, 0, 0.1);
    --danger-color: #d7685b;
    --success-color: #27ae60;
    --warning-color: #f39c12;
    --logo-color: #e49732;
    --action-icon-color: #6d6d6d;
}
```

---

## 📝 Bootstrap to CSS Class Mapping

### Layout Classes

| Original CSS | Bootstrap Equivalent | Notes |
|--------------|---------------------|-------|
| `.app-container` | Keep as custom | Flexbox layout |
| `.top-bar` | `.navbar` + custom | Fixed positioning needed |
| `.side-menu` | `.sidebar` + custom | Custom collapsible behavior |
| `.main-content` | `.container-fluid` | Full width content area |

### Grid & Forms

| Original CSS | Bootstrap Equivalent | Notes |
|--------------|---------------------|-------|
| `.form-grid` | `.row` + `.col` | Use Bootstrap grid |
| `.form-group` | `.mb-3` | Bootstrap form group |
| `input` styling | `.form-control` | Bootstrap inputs |
| `select` styling | `.form-select` | Bootstrap selects |
| `button` styling | `.btn .btn-*` | Bootstrap buttons |

### Table Classes

| Original CSS | Bootstrap Equivalent | Notes |
|--------------|---------------------|-------|
| `.data-table` | `.table .table-hover` | Add custom styles on top |
| `th, td` padding | Keep custom | 8-15px padding |
| `.text-center` | `.text-center` | ✅ Same |

### Components

| Original CSS | Bootstrap Equivalent | Notes |
|--------------|---------------------|-------|
| `.modal` | `.modal` + custom | Use Bootstrap Modal component |
| `.btn-primary` | `.btn .btn-primary` | Override colors |
| `.status-badge` | `.badge` + custom | Keep custom colors |

---

## 🔄 Component-by-Component Migration

### 1. Sidebar

**Keep:** All custom CSS (lines 60-95 in style.css)

```css
/* Copy exactly from style.css */
.side-menu {
  width: 220px;
  background-color: #fff;
  /* ... rest of styles ... */
}
.side-menu.collapsed { width: 70px; }
/* ... etc ... */
```

**No Bootstrap equivalent needed** - this is fully custom.

### 2. TopBar

**Mix:** Bootstrap `.navbar` + custom styles

```jsx
// In React component
<nav className="navbar navbar-light bg-white top-bar">
  {/* Content */}
</nav>
```

```css
/* Additional custom CSS */
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
  padding: 0 20px;
}
```

### 3. Buttons

**Use Bootstrap classes + override colors:**

```jsx
// React components
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Delete</Button>
<Button variant="success">Save</Button>
```

```css
/* Override Bootstrap button colors */
.btn-primary {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

.btn-danger {
  background-color: var(--danger-color) !important;
  border-color: var(--danger-color) !important;
}

.btn-success {
  background-color: var(--success-color) !important;
  border-color: var(--success-color) !important;
}
```

### 4. Status Badges

**Keep all custom status badge styles** (lines 136-169 in style.css)

```css
/* Copy exactly - these are perfect */
.status-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    /* ... */
}
.status-draft { background-color: #778899; }
.status-quotation-sent { background-color: var(--warning-color); }
/* ... all other status classes ... */
```

### 5. Data Tables

**Use Bootstrap `.table` + custom styles:**

```jsx
// React component
<Table hover responsive className="data-table">
  <thead>
    <tr>
      <th className="sortable">Column</th>
    </tr>
  </thead>
  <tbody>
    {/* rows */}
  </tbody>
</Table>
```

```css
/* Custom table styles on top of Bootstrap */
.data-table {
  background-color: #fff;
  box-shadow: 0 1px 3px var(--shadow-color);
}

.data-table th, .data-table td {
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.data-table td {
  padding: 8px 15px;
}

/* Sortable headers */
.data-table th.sortable {
  cursor: pointer;
  position: relative;
  padding-right: 25px !important;
}
/* ... rest of sorting styles from lines 426-454 ... */
```

### 6. Modals

**Use React-Bootstrap Modal + custom styling:**

```jsx
// React component
import { Modal } from 'react-bootstrap';

<Modal show={show} onHide={handleClose} size="lg" centered>
  <Modal.Header closeButton>
    <Modal.Title>Title</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {/* Content */}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>Close</Button>
    <Button variant="primary">Save</Button>
  </Modal.Footer>
</Modal>
```

```css
/* Override Bootstrap modal styles */
.modal-content {
  border-radius: 0px;
  padding: 25px;
  max-height: 85vh;
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
}

/* Size classes */
.modal-sm { max-width: 400px; }
.modal-md { max-width: 600px; }
.modal-lg { max-width: 950px; }
.modal-xl { max-width: 1200px; }
```

### 7. Forms

**Use Bootstrap form classes:**

```jsx
// React component
<Form.Group className="mb-3">
  <Form.Label>Label</Form.Label>
  <Form.Control type="text" placeholder="Enter value" />
</Form.Group>

<Form.Group className="mb-3">
  <Form.Label>Select</Form.Label>
  <Form.Select>
    <option>Option 1</option>
  </Form.Select>
</Form.Group>
```

```css
/* Custom form styles */
.form-group input,
.form-group select,
.form-group textarea {
  padding: 8px;
  border-radius: 0px;
  border: 1px solid var(--border-color);
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

.form-group input:disabled,
.form-group input[readonly] {
  background-color: #f0f0f0;
  cursor: not-allowed;
}
```

### 8. Calendar Views

**Keep all custom calendar styles** (lines 228-293 in style.css)

```css
/* Weekly Schedule Styles - Copy exactly (lines 258-273) */
#weekly-schedule-container { /* ... */ }
.weekly-schedule-table { /* ... */ }
.event-block { /* ... */ }

/* Monthly Calendar Styles - Copy exactly (lines 275-293) */
#monthly-calendar-container { /* ... */ }
.monthly-calendar-grid { /* ... */ }
.calendar-event-item { /* ... */ }
```

**No Bootstrap equivalent** - these are fully custom components.

### 9. Dashboard Cards

**Use Bootstrap Card + custom styles:**

```jsx
// React component
import { Card } from 'react-bootstrap';

<Card className="stat-card" onClick={handleClick}>
  <Card.Body className="d-flex align-items-center gap-3">
    <div className="icon" style={{ backgroundColor: color }}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div className="info">
      <div className="number">{number}</div>
      <div className="label">{label}</div>
    </div>
  </Card.Body>
</Card>
```

```css
/* Custom stat card styles (lines 367-400) */
.stat-card {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px var(--shadow-color);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.stat-card .icon {
  font-size: 1.5rem;
  padding: 12px;
  border-radius: 50%;
  color: #fff;
  width: 24px;
  height: 24px;
}
```

---

## 📱 Responsive Design

### Original Media Queries (Keep exact)

```css
@media (max-width: 767px) {
  .action-icons-container {
    flex-direction: column;
    gap: 5px;
    align-items: flex-start;
  }

  .action-icon {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .action-icon .icon-label {
    display: inline;
    font-size: 13px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
```

### Bootstrap Responsive Utilities

Use Bootstrap's responsive classes when appropriate:

```jsx
// Instead of custom media queries
<Row className="d-none d-md-flex"> // Hide on mobile, show on medium+
<Col xs={12} md={6} lg={4}> // Responsive grid
<Button className="d-block d-md-inline-block"> // Block on mobile, inline on desktop
```

---

## 🎯 Complete Style.css Migration Checklist

### Keep Exactly As-Is (Custom Styles)
- [ ] `:root` variables (lines 1-13)
- [ ] Global scrollbar (lines 15-34)
- [ ] Body styles (lines 36-43)
- [ ] App container & layout (lines 44-98)
- [ ] Sidebar & menu (lines 60-95)
- [ ] Search bar (lines 48-52)
- [ ] Top bar (lines 45-58)
- [ ] Status badges (lines 136-169)
- [ ] Action icons (lines 171-178)
- [ ] Pending badge (lines 121-134)
- [ ] Table sorting (lines 426-454)
- [ ] Accordion (lines 456-511)
- [ ] Status filter buttons (lines 513-538)
- [ ] Calendar components (lines 228-293)
- [ ] Dashboard cards (lines 367-424)
- [ ] Weekly/Monthly schedules (lines 258-293)
- [ ] Nomination styles (lines 540-593)
- [ ] Animations (lines 595-596)
- [ ] Responsive (lines 598-605)

### Replace with Bootstrap + Custom
- [ ] Forms → `.form-control`, `.form-select` + custom padding
- [ ] Buttons → `.btn .btn-*` + color overrides
- [ ] Tables → `.table .table-hover` + custom styling
- [ ] Modals → `<Modal>` component + size classes
- [ ] Grid → `.row` `.col-*` for form grids

### Override Bootstrap Defaults
- [ ] Primary color → `var(--primary-color)`
- [ ] Danger color → `var(--danger-color)`
- [ ] Success color → `var(--success-color)`
- [ ] Font size → `0.8rem`
- [ ] Border radius → `0px` (sharp corners)
- [ ] Modal border radius → `0px`

---

## 🔍 Testing Checklist

After migration, test these scenarios:

### Visual
- [ ] All pages look identical to HTML version
- [ ] Colors match exactly
- [ ] Fonts and sizes match
- [ ] Spacing and padding match
- [ ] Icons display correctly
- [ ] Status badges show correct colors

### Responsive
- [ ] Mobile view (< 768px) works correctly
- [ ] Tablet view (768-1024px) works correctly
- [ ] Desktop view (> 1024px) works correctly
- [ ] Sidebar collapses properly
- [ ] Tables scroll horizontally on mobile
- [ ] Modals display correctly on all sizes

### Interactive
- [ ] Buttons hover states work
- [ ] Table sorting works
- [ ] Modals open/close smoothly
- [ ] Forms validate correctly
- [ ] Status badges display properly
- [ ] Action icons respond to clicks

### Performance
- [ ] CSS file size is optimized
- [ ] No unused Bootstrap components
- [ ] Custom CSS is minified
- [ ] Font loading is efficient

---

## 💡 Pro Tips

1. **Don't Override Everything**: Use Bootstrap where it makes sense, keep custom where design is unique

2. **CSS Cascade**: Put custom CSS after Bootstrap imports to override properly

3. **Class Naming**: Keep original class names where possible for easier maintenance

4. **Variables**: Use CSS custom properties (variables) for consistency

5. **Components**: Create reusable React components with Bootstrap classes

6. **Testing**: Compare side-by-side with original HTML frequently

---

## ✅ Final Steps

1. Copy entire `style.css` to `frontend/src/styles/custom.css`
2. Create `bootstrap-overrides.css` with color/size overrides
3. Import in correct order in `main.jsx`
4. Test each page against original HTML
5. Fix any discrepancies
6. Optimize and remove unused styles

---

**Remember**: The goal is pixel-perfect replication. When in doubt, keep the original CSS and add Bootstrap classes only where they simplify the code.
