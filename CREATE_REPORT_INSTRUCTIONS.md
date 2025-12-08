# How to Create the Python Report in Frappe Cloud

Since Python reports need a Report doctype entry, you have two options:

## Option 1: Create via UI (Easiest)

1. **Go to your Frappe Cloud site**
2. **Navigate to:** Custom → Report → New
3. **Fill in the form:**
   - **Report Name:** `Surgi General Ledger`
   - **Report Type:** `Script Report`
   - **Module:** `general_ledger_button` (or your app name)
   
4. **Add Filters:**
   - Click "Add Row" for each filter:
   
   **Filter 1:**
   - Label: `From Date`
   - Fieldtype: `Date`
   - Fieldname: `from_date`
   - Mandatory: ✓
   - Default: `frappe.datetime.add_months(frappe.datetime.nowdate(), -1)`
   
   **Filter 2:**
   - Label: `To Date`
   - Fieldtype: `Date`
   - Fieldname: `to_date`
   - Mandatory: ✓
   - Default: `frappe.datetime.nowdate()`
   
   **Filter 3:**
   - Label: `Customer`
   - Fieldtype: `Link`
   - Fieldname: `customer`
   - Options: `Customer`
   - Mandatory: ✗ (leave unchecked)
   
5. **Save**

The Python file at `general_ledger_button/report/surgi_general_ledger/surgi_general_ledger.py` will automatically be used because:
- Report name matches: "Surgi General Ledger"
- Frappe looks for: `[app]/report/[report_name]/[report_name].py`

## Option 2: Import JSON (If you have access to import)

If you have import capabilities, you can import the `surgi_general_ledger.json` file I created.

## Verify It's Working

1. Go to: **Reports → Surgi General Ledger**
2. You should see the filters (From Date, To Date, Customer)
3. Set the dates and click "Update"
4. It should work without KeyError!

## If It Still Doesn't Appear

1. **Clear cache** in Frappe Cloud dashboard
2. **Restart the site** (if option available)
3. **Check the report name** - must be exactly "Surgi General Ledger" (case-sensitive)
4. **Verify the Python file path** is correct:
   - `general_ledger_button/report/surgi_general_ledger/surgi_general_ledger.py`

