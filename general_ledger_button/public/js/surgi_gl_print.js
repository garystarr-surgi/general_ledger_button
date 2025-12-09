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
                let report_name = 'Surgi General Ledger';
                let print_format = 'Surgi Customer Statement';
                
                // For Query Reports with custom print formats, we need to use a server method
                // or pass the data differently. Try using Frappe's print dialog approach.
                // First, let's try using the report's print method if available
                if (frappe.query_report.print_format) {
                    // Use the report's built-in print method
                    frappe.query_report.print_format = print_format;
                }
                
                // Build the print URL - for Query Reports, we need to execute the query first
                // Try using the standard printview but with proper parameters
                let params = new URLSearchParams();
                
                // For Query Reports, we might need to use a different approach
                // Try passing report_name as a special parameter
                params.append('doctype', 'Report');
                params.append('name', report_name);
                params.append('print_format', print_format);
                params.append('report_name', report_name); // Also include as separate param
                
                // Add filter parameters - encode them properly
                Object.keys(filters).forEach(function(key) {
                    if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
                        // Format dates properly if needed
                        let value = filters[key];
                        if (value instanceof Date) {
                            value = frappe.datetime.obj_to_str(value);
                        }
                        params.append('filters[' + key + ']', value);
                    }
                });
                
                let print_url = '/printview?' + params.toString();
                
                console.log("Print URL:", print_url);
                console.log("Filters:", filters);
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
