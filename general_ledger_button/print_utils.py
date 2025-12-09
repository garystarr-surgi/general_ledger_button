import frappe
from frappe import _
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
    
    if not filters.get('customer'):
        frappe.throw(_("Please select a customer"))
    
    # Create a document-like object for the template
    doc = frappe._dict({
        "doctype": "Report",
        "name": "Surgi General Ledger",
        "customer": filters.get("customer"),
        "from_date": filters.get("from_date"),
        "to_date": filters.get("to_date")
    })
    
    # Get the print format
    print_format = frappe.get_doc("Print Format", "Surgi Customer Statement")
    
    # Render the Jinja template with the doc context
    from frappe.utils.jinja import render_template
    html = render_template(print_format.html, {"doc": doc, "frappe": frappe})
    
    # Add letterhead if specified
    letterhead = None
    if print_format.letter_head:
        letterhead = frappe.get_doc("Letter Head", print_format.letter_head)
    
    # Wrap in standard print template
    from frappe.www.printview import get_print_style
    final_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>{get_print_style()}</style>
    </head>
    <body>
        {letterhead.content if letterhead else ''}
        {html}
    </body>
    </html>
    """
    
    # Convert to PDF
    pdf = frappe.utils.pdf.get_pdf(final_html)
    
    # Return as downloadable file
    frappe.local.response.filename = f"Customer_Statement_{filters.get('customer')}.pdf"
    frappe.local.response.filecontent = pdf
    frappe.local.response.type = "pdf"
