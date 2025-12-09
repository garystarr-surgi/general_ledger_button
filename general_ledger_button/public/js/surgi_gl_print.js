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
                
                // Build URL to download PDF using custom print format
                let url = frappe.request.url + '/api/method/frappe.utils.print_format.download_pdf';
                let params = new URLSearchParams();
                params.append('report_name', "Surgi General Ledger");
                params.append('filters', JSON.stringify(filters));
                params.append('print_format', "Surgi Customer Statement");
                params.append('file_format_type', 'PDF');
                
                window.open(url + '?' + params.toString(), '_blank');
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
