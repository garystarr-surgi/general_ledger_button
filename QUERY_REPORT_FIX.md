# Quick Fix for Query Report KeyError

## The Problem
The traceback shows that `frappe.db.sql(self.query, filters)` is being called, but the `filters` dictionary doesn't contain `from_date`. This happens when:
- The report loads before filters are set
- Filters aren't being passed from the UI
- The Query Report tries to execute on initial load

## Immediate Solution: Use Python Report

The Python report I created will handle this properly. Here's what to do:

### Step 1: Push the changes to GitHub
```bash
cd general_ledger_button
git add .
git commit -m "Add Python report to fix KeyError in Surgi General Ledger"
git push origin main
```

### Step 2: In Frappe Cloud
1. The app will auto-update (or trigger a deploy)
2. Go to: Custom → Report → "Surgi General Ledger"
3. **Delete the existing Custom Report** (or rename it)
4. The Python report will auto-discover
5. Go to: Reports → "Surgi General Ledger"
6. It should now work without KeyError

## Alternative: Fix Query Report SQL

If you must keep it as a Query Report, use this SQL that handles missing filters:

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
    AND gle.posting_date >= COALESCE(%(from_date)s, DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
    AND gle.posting_date <= COALESCE(%(to_date)s, CURDATE())
    AND (%(customer)s IS NULL OR %(customer)s = '' OR gle.party = %(customer)s)
ORDER BY gle.posting_date ASC, gle.creation ASC
```

**BUT** - This still might fail because Frappe's `frappe.db.sql()` will throw KeyError if the key doesn't exist in the filters dict, even with COALESCE.

## Why Python Report is Better

The Python report:
- ✅ Checks if filters exist before executing
- ✅ Provides default values if missing
- ✅ Throws a user-friendly error message
- ✅ Won't crash with KeyError

The Query Report:
- ❌ Executes SQL directly with filters dict
- ❌ Throws KeyError if key is missing
- ❌ No way to prevent execution without filters

## Recommended Action

**Use the Python report** - it's the only reliable solution for this issue.


