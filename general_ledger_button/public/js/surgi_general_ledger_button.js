// This file adds the print button as a fallback
// Filters are handled by the report folder JS
(function() {
    'use strict';
    
    function addPrintButtonToReport() {
        // Check if we're on the correct report page
        if (!window.location.pathname.includes('query-report/Surgi General Ledger')) {
            return false;
        }
        
        // Check if report is available
        if (!frappe.query_report || frappe.query_report.report_name !== "Surgi General Ledger") {
            return false;
        }
        
        // Check if button already added
        if (frappe.query_report._print_button_added) {
            return true;
        }
        
        let report = frappe.query_report;
        let page = report.page || (report.$page && report.$page[0]) || null;
        
        if (!page || typeof page.add_inner_button !== 'function') {
            return false;
        }
        
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
            
            frappe.query_report._print_button_added = true;
            return true;
        } catch (e) {
            console.error("Error adding print button (global):", e);
            return false;
        }
    }
    
    // Try to add button when page loads - use multiple methods for compatibility
    function initPrintButton() {
        // Try multiple times with increasing delays
        let attempts = [500, 1000, 2000, 3000];
        attempts.forEach(function(delay) {
            setTimeout(function() {
                if (!frappe.query_report || !frappe.query_report._print_button_added) {
                    addPrintButtonToReport();
                }
            }, delay);
        });
    }
    
    // Use jQuery ready (more compatible)
    $(document).ready(function() {
        initPrintButton();
    });
    
    // Also use frappe.after_ajax if available (for AJAX-loaded pages)
    if (typeof frappe !== 'undefined' && frappe.after_ajax) {
        frappe.after_ajax(function() {
            setTimeout(function() {
                if (window.location.pathname.includes('query-report/Surgi General Ledger')) {
                    addPrintButtonToReport();
                }
            }, 500);
        });
    }
    
    // Listen for route changes if available
    if (typeof frappe !== 'undefined' && frappe.route && frappe.route.on) {
        frappe.route.on('change', function() {
            setTimeout(addPrintButtonToReport, 1000);
        });
    }
    
    // Listen for report refresh events
    $(document).on('refresh', function() {
        setTimeout(addPrintButtonToReport, 500);
    });
})();
