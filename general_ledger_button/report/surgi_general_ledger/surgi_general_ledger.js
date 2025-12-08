frappe.query_reports["Surgi General Ledger"] = {
	"filters": [
		{
			"fieldname": "from_date",
			"label": __("From Date"),
			"fieldtype": "Date",
			"default": frappe.datetime.add_months(frappe.datetime.nowdate(), -1),
			"reqd": 1
		},
		{
			"fieldname": "to_date",
			"label": __("To Date"),
			"fieldtype": "Date",
			"default": frappe.datetime.nowdate(),
			"reqd": 1
		},
		{
			"fieldname": "customer",
			"label": __("Customer"),
			"fieldtype": "Link",
			"options": "Customer"
		}
	],
	
	"onload": function(report) {
		// Add print button after report is loaded
		setTimeout(function() {
			if (report && report.page && report.page.add_inner_button) {
				report.page.add_inner_button(__("Print Statement"), function() {
					let filters = report.get_filter_values() || {};
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
			}
		}, 1500);
	}
};

