frappe.query_report.page.add_inner_button(__("Print Statement"), function() {
    // Get current filter values from the report
    let filters = frappe.query_report.get_filter_values() || {};
    
    // Build the API call to your custom Python method
    let url = '/api/method/general_ledger_button.print_utils.print_surgi_customer_statement';
    let params = new URLSearchParams();
    params.append('filters', JSON.stringify(filters));
    
    // Open the rendered PDF in a new tab
    window.open(url + '?' + params.toString(), '_blank');
});
