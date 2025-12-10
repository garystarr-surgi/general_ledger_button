# Customer Statement Report - Project Documentation

## Project Overview
Created a custom Customer Statement report in ERPNext v15 (Frappe Cloud) with a print button that generates PDF statements using a custom print format.

---

## Components Created

### 1. Query Report: "Surgi General Ledger"
- **Location**: `general_ledger_button/report/surgi_general_ledger/`
- **Type**: Query Report
- **Module**: Accounts
- **Purpose**: Displays GL Entry transactions for customers with filters

**Files:**
- `surgi_general_ledger.json` - Report configuration
- `surgi_general_ledger.js` - Filter definitions (in report folder, provides filters even though MIME issues prevent full JS execution on Frappe Cloud)

**SQL Query:**
```sql
SELECT
    gle.posting_date AS posting_date,
    CONCAT(gle.voucher_type, ' ', gle.voucher_no) AS description,
    gle.debit AS debit,
    gle.credit AS credit,
    (gle.debit - gle.credit) AS amount
FROM `tabGL Entry` gle
WHERE
    gle.is_cancelled = 0
    AND gle.party_type = 'Customer'
    AND gle.posting_date BETWEEN %(from_date)s AND %(to_date)s
    AND (%(customer)s IS NULL OR gle.party = %(customer)s)
ORDER BY gle.posting_date ASC, gle.creation ASC
```

**Filters:**
- Customer (Link to Customer, optional)
- From Date (Date, required)
- To Date (Date, required)

---

### 2. DocType: "Customer Statement"
- **Module**: Accounts
- **Purpose**: Holds filter values for print format (acts as a document wrapper)
- **Naming**: `STMT-{customer}-{####}`

**Fields:**
- `customer` (Link to Customer, required)
- `from_date` (Date, required)
- `to_date` (Date, required)
- `posting_date` (Date, default: Today)
- `company` (Link to Company, optional)

**Permissions:**
- Accounts User (all permissions)
- Accounts Manager (all permissions)

---

### 3. Custom Print Format: "Surgi Customer Statement"
- **Print Format For**: Customer Statement (DocType)
- **Module**: Accounts
- **Print Format Type**: Jinja
- **PDF Generator**: chrome (Note: chrome works better than wkhtmltopdf for complex layouts)
- **Custom Format**: Yes

**Template Features:**
- Company header with logo, address, and contact info
- Statement title
- Customer TO address (pulled from Customer DocType)
- Date and Total Due
- Ledger table with:
  - Balance Forward
  - All GL Entries in date range
  - Running balance calculation
  - Grey headers with bold black text
  - Column headers repeat on multi-page prints
- Aging breakdown table (Current, 1-30, 31-60, 61-90, 90+ days)
- Footer with payment instructions
- Footer repeats on every page

**Key Jinja Features Used:**
- `{% set ns = namespace(balance=0) %}` - For maintaining running balance
- `frappe.db.sql()` - For Balance Forward calculation
- `frappe.get_all()` - For fetching GL Entries and Sales Invoices
- `frappe.get_doc()` - For customer and address details
- Base64 embedded logo (due to Frappe Cloud PDF generator limitations with external images)

---

### 4. Print Button JavaScript
- **Location**: `general_ledger_button/public/js/surgi_gl_print.js`
- **Purpose**: Adds "Print Statement" button to the Surgi General Ledger report

**Functionality:**
- Checks if on correct report page
- Gets filter values from report
- Creates a Customer Statement document with filter values
- Opens print view with custom print format

**Code Structure:**
```javascript
frappe.query_reports["Surgi General Ledger"] = {
    "onload": function(report) {
        report.page.add_inner_button(__("Print Statement"), function() {
            // Get filters
            // Create Customer Statement doc
            // Open print view
        });
    }
}
```

---

### 5. App Structure: "general_ledger_button"

**File Structure:**
```
general_ledger_button/
├── hooks.py (includes JS file)
├── modules.txt (empty - no custom module needed)
├── public/
│   └── js/
│       └── surgi_gl_print.js (print button functionality)
└── report/
    └── surgi_general_ledger/
        ├── __init__.py
        ├── surgi_general_ledger.js (filter definitions)
        └── surgi_general_ledger.json (report config)
```

**hooks.py:**
```python
app_version = "0.0.1"
app_name = "general_ledger_button"
app_title = "General Ledger Button"
app_publisher = "SurgiShop"
app_description = "Add a print button to general ledger"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "gary.starr@surgishop.com"
app_license = "MIT"

app_include_js = [
    "/assets/general_ledger_button/js/surgi_gl_print.js"
]
```

---

## Key Challenges & Solutions

### Challenge 1: Script Reports Don't Work with Custom Modules
**Problem**: Attempted to use Script Report with custom module, but Frappe couldn't find Python files.
**Solution**: Switched to Query Report with SQL, which works reliably in custom apps.

### Challenge 2: Filter KeyError in Query Reports
**Problem**: Query Report threw KeyError for filters when not properly defined.
**Solution**: 
- Used `AND (%(customer)s IS NULL OR gle.party = %(customer)s)` for optional filters
- Defined filters in JavaScript file with default values
- Kept filters definition in report folder even though JS doesn't fully execute (provides filter structure)

### Challenge 3: Print Button Not Loading
**Problem**: JS file in report folder had MIME type errors on Frappe Cloud.
**Solution**: Moved JS to `public/js/` folder and included via `app_include_js` in hooks.py

### Challenge 4: Can't Print Query Report Results Directly
**Problem**: Query Reports don't create documents, so `/printview` doesn't work.
**Solution**: Created Customer Statement DocType to hold filter values, create temp document, then print it.

### Challenge 5: Logo Not Displaying in PDF
**Problem**: PDF generator (both wkhtmltopdf and chrome) wouldn't load images from URLs.
**Attempted Solutions**:
- Relative paths (`/files/logo.png`)
- Full URLs (`https://beta.surgi.shop/files/logo.png`)
- Pulling from Letter Head DocType
- Changing PDF generators
- Changing Print Styles
**Final Solution**: Embedded logo as base64 data directly in HTML using online converter (https://www.base64-image.de/)

### Challenge 6: Multi-Page Print Layout
**Problem**: Needed headers to repeat, footer to appear on all pages, company header only on page 1.
**Solution**: 
- Used `display: table-header-group` for column headers to repeat
- Used `position: fixed; bottom: 0` for footer
- Kept company header in normal flow (only appears once)

---

## User Workflow

1. User navigates to "Surgi General Ledger" report
2. User selects filters:
   - Customer (optional)
   - From Date (required)
   - To Date (required)
3. Report displays GL Entry transactions with running balance
4. User clicks "Print Statement" button
5. System creates temporary Customer Statement document
6. Print view opens with custom format
7. User can print or download PDF

---

## Important Notes

### Frappe Cloud Limitations
- JS files in report folders have MIME type issues
- PDF generators don't reliably load external images
- Must use `public/js/` folder for custom JS with global hooks

### Filter Handling
- Query Reports: Filters defined in JS, values passed as SQL parameters
- Script Reports: Filters passed to Python `execute()` function
- For optional filters in SQL, use: `AND (%(filter)s IS NULL OR field = %(filter)s)`

### Print Format Best Practices
- Use tables instead of flexbox/grid for layouts (better PDF support)
- Embed images as base64 for guaranteed display
- Use `@media print` CSS for multi-page control
- Test with both wkhtmltopdf and chrome generators
- Always use Jinja template type for dynamic data

### DocType as Print Wrapper
- Simple DocType with just filter fields
- No validation or business logic needed
- Acts as document for Frappe's print system
- Can be deleted after printing or kept for audit trail

---

## Maintenance & Future Updates

### To Update Logo:
1. Convert new logo to base64 at https://www.base64-image.de/
2. Replace base64 string in print format HTML
3. Save print format

### To Modify Report Query:
1. Edit `surgi_general_ledger.json`
2. Update SQL query
3. Deploy to Frappe Cloud (auto-deployed via git)

### To Change Print Layout:
1. Edit "Surgi Customer Statement" print format
2. Modify Jinja/HTML template
3. Save (changes take effect immediately)

### To Add New Filters:
1. Add filter definition to `surgi_general_ledger.js`
2. Update SQL query to use new filter
3. Add field to Customer Statement DocType if needed for print
4. Deploy changes

---

## Testing Checklist

- [ ] Report loads with filters
- [ ] Query returns correct data
- [ ] Print button appears
- [ ] Print button creates Customer Statement doc
- [ ] Print view opens
- [ ] Logo displays
- [ ] Customer address displays correctly
- [ ] Ledger entries show with running balance
- [ ] Balance Forward calculates correctly
- [ ] Aging table shows correct amounts
- [ ] Multi-page statements work (headers repeat, footer on all pages)
- [ ] PDF generation works
- [ ] Chrome PDF generator selected

---

## Files to Backup

```
general_ledger_button/
├── hooks.py
├── public/js/surgi_gl_print.js
└── report/surgi_general_ledger/
    ├── surgi_general_ledger.js
    └── surgi_general_ledger.json
```

Plus from ERPNext:
- Customer Statement DocType definition
- Surgi Customer Statement Print Format HTML

---

## Contact & Support
- Project: Customer Statement Report
- ERPNext Version: v15
- Hosting: Frappe Cloud (beta.surgi.shop)
- Repository: https://github.com/garystarr-surgi/general_ledger_button.git

---

*Documentation created: December 2024*
*Last updated: December 2024*
