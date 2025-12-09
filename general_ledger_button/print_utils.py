import frappe
from frappe import _
from frappe.desk.query_report import run

@frappe.whitelist()
def print_surgi_general_ledger(filters=None):
    """
    Generate PDF for Surgi General Ledger using custom print format
    """
    import json
    
    if isinstance(filters, str):
        filters = json.loads(filters)
    
    # Get the report data
    report_name = "Surgi General Ledger"
    result = run(report_name, filters=filters)
    
    # Create a temporary document-like structure for the print format
    # Your print format can access this data
    doc_data = {
        "doctype": "Report",
        "name": report_name,
        "report_name": report_name,
        "filters": filters,
        "data": result.get("result", []),
        "columns": result.get("columns", [])
    }
    
    # Generate HTML using the print format
    html = frappe.get_print(
        doctype="Report",
        name=report_name,
        print_format="Surgi Customer Statement",
        doc=frappe._dict(doc_data),
        no_letterhead=0
    )
    
    # Convert to PDF
    pdf = frappe.utils.pdf.get_pdf(html)
    
    # Return as downloadable file
    frappe.local.response.filename = f"{report_name}.pdf"
    frappe.local.response.filecontent = pdf
    frappe.local.response.type = "pdf"
