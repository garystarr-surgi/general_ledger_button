# Fix for "Surgi General Ledger" KeyError: 'from_date'

## The Problem
The Query Report is throwing `KeyError: 'from_date'` because the SQL query parameters aren't being passed correctly. This can happen when:
- The report type is set incorrectly
- Filters aren't properly configured
- There's a caching issue
- The JavaScript override isn't preventing execution

## Solution Options

### Option 1: Use the Python Report (RECOMMENDED for Frappe Cloud)

I've created a Python-based report file that will handle filters correctly:
- Location: `general_ledger_button/report/surgi_general_ledger/surgi_general_ledger.py`

**Steps for Frappe Cloud:**
1. **Commit and push the changes to your repository:**
   ```bash
   cd general_ledger_button
   git add .
   git commit -m "Add Python report for Surgi General Ledger to fix KeyError"
   git push origin main
   ```

2. **Frappe Cloud will automatically deploy:**
   - Go to your Frappe Cloud dashboard
   - The app will be updated automatically
   - Or trigger a manual deploy if needed

3. **If you have an existing Custom Report:**
   - Go to your Frappe Cloud site
   - Navigate to: Custom → Report → "Surgi General Ledger"
   - Delete it (or rename it to something else like "Surgi General Ledger Old")
   
4. **The Python report should auto-discover:**
   - Go to: Reports → "Surgi General Ledger"
   - It should now use the Python file which handles filters properly
   - Clear browser cache if needed (Ctrl+Shift+R)

### Option 2: Fix the Existing Query Report

If you want to keep it as a Query Report:

1. **Go to:** Custom → Report → "Surgi General Ledger"
2. **Verify Report Type:** Must be "Query Report" (NOT "Script Report")
3. **Update the Query to:**
   ```sql
   SELECT
       gle.posting_date AS posting_date,
       CONCAT(gle.voucher_type, " ", gle.voucher_no) AS description,
       gle.debit AS debit,
       gle.credit AS credit,
       (gle.debit - gle.credit) AS amount
   FROM `tabGL Entry` gle
   WHERE
       gle.is_cancelled = 0
       AND gle.party_type = 'Customer'
       AND gle.posting_date BETWEEN %(from_date)s AND %(to_date)s
       AND IFNULL(%(customer)s, '') = '' OR gle.party = %(customer)s
   ORDER BY gle.posting_date ASC, gle.creation ASC
   ```

4. **Verify Filters (must match exactly):**
   - Fieldname: `from_date` (Date, Mandatory)
   - Fieldname: `to_date` (Date, Mandatory)  
   - Fieldname: `customer` (Link, Optional)

5. **Clear cache in Frappe Cloud:**
   - Go to your Frappe Cloud site
   - Navigate to: Settings → Clear Cache (or use the command in Frappe Cloud console if available)
   - Or wait a few minutes for cache to clear automatically

### Option 3: Debug Why It Stopped Working

Check these common causes:

1. **Report Type Changed:**
   - Check if report type was changed from "Query Report" to "Script Report"
   - Script Reports need Python files, Query Reports use SQL directly

2. **Filter Fieldnames Changed:**
   - Verify filter fieldnames are exactly: `from_date`, `to_date`, `customer` (lowercase, underscore)
   - Check for typos or case differences

3. **Frappe Version Update:**
   - If Frappe was updated, Query Report behavior might have changed
   - Check Frappe release notes

4. **Cache Issues (Frappe Cloud):**
   - Use the "Clear Cache" option in your Frappe Cloud dashboard
   - Or wait for automatic cache clearing
   - Clear browser cache (Ctrl+Shift+R)

5. **JavaScript Not Loading:**
   - Check browser console for errors
   - Verify the JS file is being loaded: `/assets/general_ledger_button/js/surgi_general_ledger.js`
   - Try hard refresh (Ctrl+Shift+R)

## Testing

After applying a fix:
1. Open the report
2. Set From Date and To Date filters
3. Optionally select a Customer
4. Click "Update" or "Run"
5. Should work without KeyError

## If Still Not Working

1. Check browser console (F12) for JavaScript errors
2. Check Frappe Cloud logs in your dashboard
3. Try the Python report option (most reliable)
4. Verify the report name is exactly "Surgi General Ledger" (case-sensitive)
5. In Frappe Cloud, you can also try:
   - Going to your site's console and running: `frappe.clear_cache()`
   - Or use the "Reboot Site" option in Frappe Cloud dashboard

