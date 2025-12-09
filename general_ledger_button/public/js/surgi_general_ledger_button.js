// This file ONLY adds the print button
// Filters are handled by the report folder JS
frappe.after_ajax(function() {
    if (window.location.pathname.includes('query-report/Surgi General Ledger')) {
        setTimeout(function() {
            if (frappe.query_report && 
                frappe.query_report.report_name === "Surgi General Ledger" && 
                !frappe.query_report._print_button_added) {
                
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
                }
            }
        }, 2000);
    }
});
