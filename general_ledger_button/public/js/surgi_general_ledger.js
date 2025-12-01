frappe.query_reports["Surgi General Ledger"] = frappe.query_reports["Surgi General Ledger"] || {};

frappe.query_reports["Surgi General Ledger"].onload = function(report) {
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
    }, 1000);
};
