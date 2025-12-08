import frappe
from frappe import _

def execute(filters=None):
    """
    Execute function for Surgi General Ledger Report
    """
    if not filters:
        filters = {}
    
    from_date = filters.get('from_date')
    to_date = filters.get('to_date')
    
    if not from_date or not to_date:
        frappe.throw(_("Please select From Date and To Date"))
    
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
    # TEST: Return hardcoded data first to verify the function is being called
    test_data = [
        {
            "posting_date": "2024-01-01",
            "description": "Test Entry 1",
            "debit": 1000.00,
            "credit": 0.00,
            "amount": 1000.00
        },
        {
            "posting_date": "2024-01-02",
            "description": "Test Entry 2",
            "debit": 0.00,
            "credit": 500.00,
            "amount": -500.00
        }
    ]
    
    return test_data
    
    # Original query code (commented out for testing)
    """
    params = {
        'from_date': filters.get('from_date'),
        'to_date': filters.get('to_date')
    }
    
    query = '''
        SELECT
            gle.posting_date,
            CONCAT(gle.voucher_type, ' ', gle.voucher_no) AS description,
            gle.debit,
            gle.credit,
            (gle.debit - gle.credit) AS amount
        FROM `tabGL Entry` gle
        WHERE
            gle.is_cancelled = 0
            AND gle.party_type = 'Customer'
            AND gle.posting_date >= %(from_date)s
            AND gle.posting_date <= %(to_date)s
    '''
    
    if filters.get('customer'):
        query += " AND gle.party = %(customer)s"
        params['customer'] = filters.get('customer')
    
    query += " ORDER BY gle.posting_date ASC"
    
    data = frappe.db.sql(query, params, as_dict=1)
    
    return data
    """
