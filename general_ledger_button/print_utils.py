import frappe
from frappe import _
from frappe.desk.query_report import run
import json

@frappe.whitelist()
def print_surgi_general_ledger(filters=None):
    """
    Generate PDF for Surgi General Ledger using custom print format
    """
    if isinstance(filters, str):
        filters = json.loads(filters)
    
    # Validate required filters
    if not filters.get('from_date') or not filters.get('to_date'):
        frappe.throw(_("From Date and To Date are required"))
    
    # Get the report data
    report_name = "Surgi General Ledger"
    result = run(report_name, filters=filters)
    
    # Create a document-like object that your print format can use
    # This makes filter values accessible as doc.customer, doc.from_date, etc.
    doc = frappe._dict({
        "doctype": "Report",
        "name": report_name,
        "report_name": report_name,
        "customer": filters.get("customer"),
        "from_date": filters.get("from_date"),
        "to_date": filters.get("to_date"),
        "data": result.get("result", []),
        "columns": result.get("columns", [])
    })
    
    # Generate HTML using the print format
    html = frappe.get_print(
        doctype="Report",
        name=report_name,
        print_format="Surgi Customer Statement",
        doc=doc,
        no_letterhead=0
    )
    
    # Convert to PDF
    pdf = frappe.utils.pdf.get_pdf(html)
    
    # Return as downloadable file
    frappe.local.response.filename = f"Customer_Statement_{filters.get('customer', 'All')}.pdf"
    frappe.local.response.filecontent = pdf
    frappe.local.response.type = "pdf"
