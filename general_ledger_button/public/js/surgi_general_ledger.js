frappe.query_reports["Surgi General Ledger"] = frappe.query_reports["Surgi General Ledger"] || {};

// Override the report's get_report_result to prevent execution without filters
frappe.query_reports["Surgi General Ledger"].onload = function(report) {
    // Store original methods
    var original_refresh = report.refresh;
    var original_get_filter_values = report.get_filter_values;
    
    // Override get_filter_values to ensure filters are always returned
    report.get_filter_values = function() {
        var filters = original_get_filter_values ? original_get_filter_values.call(this) : {};
        
        // Ensure required filters have defaults if not set
        if (!filters.from_date) {
            filters.from_date = frappe.datetime.add_months(frappe.datetime.nowdate(), -1);
        }
        if (!filters.to_date) {
            filters.to_date = frappe.datetime.nowdate();
        }
        
        return filters;
    };
    
    // Override refresh to prevent running without required filters
    report.refresh = function() {
        var filters = report.get_filter_values();
        
        // Check if required filters are present
        if (!filters || !filters.from_date || !filters.to_date) {
            console.log("Waiting for filters to be set...");
            if (report.data) {
                report.data = [];
                report.render();
            }
            return;
        }
        
        // Ensure filters are properly formatted
        if (filters.from_date && typeof filters.from_date === 'string') {
            filters.from_date = filters.from_date.split(' ')[0]; // Remove time if present
        }
        if (filters.to_date && typeof filters.to_date === 'string') {
            filters.to_date = filters.to_date.split(' ')[0]; // Remove time if present
        }
        
        // Call original refresh if it exists and filters are present
        if (typeof original_refresh === 'function') {
            return original_refresh.call(this);
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
