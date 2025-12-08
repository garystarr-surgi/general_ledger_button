import frappe

def execute(filters=None):
    """
    Execute function for Surgi General Ledger Report
    This ensures filters are properly handled
    """
    # Ensure filters is a dictionary
    if not filters:
        filters = {}
    
    # Get filter values - these come from the report filters UI
    from_date = filters.get('from_date')
    to_date = filters.get('to_date')
    customer = filters.get('customer')
    
    # Validate required filters
    if not from_date or not to_date:
        frappe.throw("Please select From Date and To Date")
    
    # Build WHERE conditions
    conditions = [
        "gle.is_cancelled = 0",
        "gle.party_type = 'Customer'",
        "gle.posting_date >= %(from_date)s",
        "gle.posting_date <= %(to_date)s"
    ]
    
    # Add customer filter if specified
    if customer:
        conditions.append("gle.party = %(customer)s")
    
    where_clause = " AND ".join(conditions)
    
    # Build the query
    query = """
        SELECT
            gle.posting_date AS posting_date,
            CONCAT(gle.voucher_type, " ", gle.voucher_no) AS description,
            gle.debit AS debit,
            gle.credit AS credit,
            (gle.debit - gle.credit) AS amount
        FROM `tabGL Entry` gle
        WHERE {where_clause}
        ORDER BY gle.posting_date ASC, gle.creation ASC
    """.format(where_clause=where_clause)
    
    # Prepare parameters for SQL query
    params = {
        'from_date': from_date,
        'to_date': to_date
    }
    
    if customer:
        params['customer'] = customer
    
    # Execute query - return as list of lists (rows)
    # Columns are defined in the Report doctype, so we only return data
    data = frappe.db.sql(query, params, as_dict=0)
    
    return data

