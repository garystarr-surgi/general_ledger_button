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
		// Function to add print button
		function addPrintButton() {
			if (!report) return false;
			
			// Try multiple ways to access the page
			let page = report.page || (report.$page && report.$page[0]) || null;
			
			if (page && typeof page.add_inner_button === 'function') {
				// Check if button already exists
				if (report._print_button_added) return true;
				
				try {
					page.add_inner_button(__("Print Statement"), function() {
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
					report._print_button_added = true;
					return true;
				} catch (e) {
					console.error("Error adding print button:", e);
					return false;
				}
			}
			return false;
		}
		
		// Try immediately
		if (addPrintButton()) return;
		
		// Try after short delay
		setTimeout(function() {
			if (addPrintButton()) return;
			
			// Try after longer delay
			setTimeout(function() {
				if (addPrintButton()) return;
				
				// Last attempt after page is fully loaded
				setTimeout(addPrintButton, 2000);
			}, 1000);
		}, 500);
		
		// Also listen for report refresh events
		if (report && report.on_refresh) {
			let originalRefresh = report.on_refresh;
			report.on_refresh = function() {
				if (originalRefresh) originalRefresh.apply(this, arguments);
				setTimeout(addPrintButton, 300);
			};
		}
	}
};
