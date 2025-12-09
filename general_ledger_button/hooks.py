app_version = "0.0.1"
app_name = "general_ledger_button"
app_title = "General Ledger Button"
app_publisher = "SurgiShop"
app_description = "Add a print button to general ledger"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "gary.starr@surgishop.com"
app_license = "MIT"

# Only load the print button JS globally
app_include_js = [
    "/assets/general_ledger_button/js/surgi_general_ledger_button.js"
]

# Include JS for report functionality
app_include_js = [
    "/assets/general_ledger_button/js/surgi_general_ledger_report.js"
]
