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
                let print_url = `/printview?doctype=Report&name=Surgi General Ledger&print_format=Surgi Customer Statement`;
                
                if (Object.keys(filters).length > 0) {
                    let params = new URLSearchParams();
                    Object.keys(filters).forEach(function(key) {
                        if (filters[key]) {
                            params.append(key, filters[key]);
                        }
                    });
                    if (params.toString()) {
                        print_url += '&' + params.toString();
                    }
                }
                
                window.open(print_url, '_blank');
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
