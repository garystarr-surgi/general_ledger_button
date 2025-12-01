frappe.query_reports["Surgi General Ledger"] = frappe.query_reports["Surgi General Ledger"] || {};

// Override refresh to prevent running without required filters
var original_refresh = frappe.query_reports["Surgi General Ledger"].refresh;

frappe.query_reports["Surgi General Ledger"].refresh = function(filters) {
    // Check if required filters are present
    if (!filters || !filters.from_date || !filters.to_date) {
        // Don't run the query if required filters are missing
        // The report will wait for user to set filters
        console.log("Waiting for filters to be set...");
        return;
    }
    
    // Call original refresh if it exists and filters are present
    if (typeof original_refresh === 'function') {
        return original_refresh.call(this, filters);
    }
};

// Add print button
var original_onload = frappe.query_reports["Surgi General Ledger"].onload;

frappe.query_reports["Surgi General Ledger"].onload = function(report) {
    // Call original onload if it exists
    if (typeof original_onload === 'function') {
        original_onload.call(this, report);
    }
    
    // Add print button after report is loaded
    setTimeout(function() {
        if (report && report.page && report.page.add_inner_button) {
            report.page.add_inner_button(__("Print Statement"), function() {
                let filters = report.get_filter_values() || {};
                let print_url = `/printview?doctype=Query Report&name=Surgi General Ledger&print_format=Surgi Customer Statement`;
                
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
        }
    }, 1500);
};
