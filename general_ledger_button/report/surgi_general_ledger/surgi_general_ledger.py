# surgi_general_ledger.py
import frappe
from frappe import _

def execute(filters=None):
    """
    Execute function for Surgi General Ledger Report
    """
    # Ensure filters is a dictionary
    if not filters:
        filters = {}
    
    # Get filter values
    from_date = filters.get('from_date')
    to_date = filters.get('to_date')
    customer = filters.get('customer')
    
    # Validate required filters
    if not from_date or not to_date:
        frappe.throw(_("Please select From Date and To Date"))
    
    # Get columns and data
    columns = get_columns()
    data = get_data(filters)
    
    return columns, data

def get_columns():
    """
    Define columns in dictionary format for Script Report
    """
    return [
        {
            "fieldname": "posting_date",
            "label": _("Date"),
            "fieldtype": "Date",
            "width": 100
        },
        {
            "fieldname": "description",
            "label": _("Description"),
            "fieldtype": "Data",
            "width": 300
        },
        {
            "fieldname": "debit",
            "label": _("Debit"),
            "fieldtype": "Currency",
            "width": 120
        },
        {
            "fieldname": "credit",
            "label": _("Credit"),
            "fieldtype": "Currency",
            "width": 120
        },
        {
            "fieldname": "amount",
            "label": _("Balance"),
            "fieldtype": "Currency",
            "width": 120
        }
    ]

def get_data(filters):
    """
    Fetch report data
    """
    # Build WHERE conditions
    conditions = []
    params = {
        'from_date': filters.get('from_date'),
        'to_date': filters.get('to_date')
    }
    
    # Add customer filter if specified
    if filters.get('customer'):
        conditions.append("gle.party = %(customer)s")
        params['customer'] = filters.get('customer')
    
    # Build additional WHERE clause
    additional_conditions = ""
    if conditions:
        additional_conditions = "AND " + " AND ".join(conditions)
    
    # Build the query - removed {conditions} placeholder
    query = """
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
            {additional_conditions}
        ORDER BY gle.posting_date ASC, gle.creation ASC
    """.format(additional_conditions=additional_conditions)
    
    # Execute query and return as list of dictionaries
    data = frappe.db.sql(query, params, as_dict=1)
    
    return data
