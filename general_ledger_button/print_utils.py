import frappe
from frappe.utils.pdf import get_pdf
from frappe.utils.jinja import render_template

@frappe.whitelist()
def print_surgi_customer_statement(filters=None):
    """
    Render the Surgi Customer Statement print format using report filters.
    """
    if isinstance(filters, str):
        filters = frappe.parse_json(filters)

    # Build a fake doc context with the fields your HTML expects
    doc = frappe._dict({
        "customer": filters.get("customer"),
        "from_date": filters.get("from_date"),
        "to_date": filters.get("to_date"),
    })

    # Load your print format template
    pf = frappe.get_doc("Print Format", "Surgi Customer Statement")
    html = render_template(pf.html, {"doc": doc})

    # Return PDF
    pdf = get_pdf(html)
    frappe.local.response.filename = f"Surgi_Customer_Statement_{doc.customer}.pdf"
    frappe.local.response.filecontent = pdf
    frappe.local.response.type = "download"
