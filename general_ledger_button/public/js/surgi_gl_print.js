// Add print button to Surgi General Ledger report
(function() {
    'use strict';
    
    function addPrintButton() {
        // Only run on the Surgi General Ledger report page
        if (!window.location.pathname.includes('query-report/Surgi%20General%20Ledger') && 
            !window.location.pathname.includes('query-report/Surgi General Ledger')) {
            return;
        }
        
        // Check if frappe.query_report exists
        if (!frappe.query_report || frappe.query_report.report_name !== "Surgi General Ledger") {
            return;
        }
        
        // Check if button already added
        if (frappe.query_report._print_button_added) {
            return;
        }
        
        // Add the button
        if (frappe.query_report.page && frappe.query_report.page.add_inner_button) {
            frappe.query_report.page.add_inner_button(__("Print Statement"), function() {
                let filters = frappe.query_report.get_filter_values() || {};
                
                if (!filters.customer) {
                    frappe.msgprint(__("Please select a customer"));
                    return;
                }
                
                // Create a Customer Statement doc and print it
                frappe.call({
                    method: 'frappe.client.insert',
                    args: {
                        doc: {
                            doctype: 'Customer Statement',
                            customer: filters.customer,
                            from_date: filters.from_date,
                            to_date: filters.to_date,
                            posting_date: frappe.datetime.nowdate()
                        }
                    },
                    callback: function(r) {
                        if (r.message) {
                            // Open print view for the newly created doc
                            let print_url = `/printview?doctype=Customer Statement&name=${r.message.name}&format=Surgi Customer Statement`;
                            window.open(print_url, '_blank');
                        }
                    }
                });
            });
            
            frappe.query_report._print_button_added = true;
            console.log("Print button added successfully");
        }
    }
    
    // Try to add button on page load
    $(document).ready(function() {
        setTimeout(addPrintButton, 1500);
        setTimeout(addPrintButton, 3000);
    });
    
    // Also try after AJAX calls (for single-page navigation)
    frappe.after_ajax(function() {
        setTimeout(addPrintButton, 1000);
    });
    
})();
