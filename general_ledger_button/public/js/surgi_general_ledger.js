// This file extends the report functionality
// The main report definition is in report/surgi_general_ledger/surgi_general_ledger.js

frappe.query_reports["Surgi General Ledger"] = frappe.query_reports["Surgi General Ledger"] || {};

// Store original onload to extend it
var original_onload = frappe.query_reports["Surgi General Ledger"].onload;

// Extend the onload function to add additional functionality
frappe.query_reports["Surgi General Ledger"].onload = function(report) {
    // Call original onload if it exists (from report JS file)
    if (typeof original_onload === 'function') {
        original_onload.call(this, report);
    }
    
    // Additional functionality can be added here if needed
};
