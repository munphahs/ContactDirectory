// Handle category selection and filter results
function handleCategorySelection() {
    const category = document.getElementById("categoryFilter").value;
    filterResultsByCategory(category);
}

// Get selected category
function getSelectedCategory() {
    return document.getElementById('categoryFilter').value;
}

// Filter results by category only
function filterResultsByCategory(category) {
    const searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();

    if (!formListData || !Array.isArray(formListData)) {
        console.error("formListData is not defined or invalid.");
        return;
    }

    const filteredResults = formListData.filter(entry => {
        const matchesCategory = category ? entry.category.toLowerCase() === category.toLowerCase() : true;
        const matchesSearchQuery =
            entry.formName.toLowerCase().includes(searchQuery) || 
            entry.category.toLowerCase().includes(searchQuery) || 
            entry.link.toLowerCase().includes(searchQuery);

        return matchesCategory && matchesSearchQuery;
    });

    displayResults(filteredResults);
}

// Function to display the filtered form data
function displayResults(results) {
    const resultsTableBody = document.getElementById('resultsTableBody');
    resultsTableBody.innerHTML = ''; // Clear previous results

    if (!results || results.length === 0) {
        resultsTableBody.innerHTML = `<tr><td colspan="3">No forms found.</td></tr>`;
    } else {
        results.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.formName}</td>
                <td>${entry.category}</td>
                <td><a href="${entry.link}" target="_blank">View Form</a></td>
            `;
            resultsTableBody.appendChild(row);
        });
    }
}

// Search function triggered when the user types in the search box
function searchForms() {
    const category = getSelectedCategory();
    filterResultsByCategory(category);
}


// Sample form data (replace with actual data or load dynamically from a database)
const formListData = [
  {formName: "Travel Request", category: "Travel", link: "https://www.mun.ca/finance/media/production/memorial/administrative/financial-and-administrative-services/media-library/forms/TRAVEL_REQUEST.pdf"},
  {formName: "Travel Advance Request", category: "Travel", link: "https://www.mun.ca/medicine/media/production/medicine/documents/Travel-Advance-Form-August-2019.pdf"},
  {formName: "Travel Claim", category: "Travel", link: "https://www.mun.ca/finance/media/production/memorial/administrative/financial-and-administrative-services/media-library/forms/Travel_Expense_Claim.xlsx"},
  {formName: "Meals Per Diem plus incidental allowances", category: "Travel", link: "https://www.mun.ca/finance/our-services/travel/schedule-of-reimbursable-expenses/#PerDiem"},
  {formName: "Daily Car Kilometer Report", category: "Travel", link: "https://www.google.com/url?client=internal-element-cse&cx=013295038259436780783:winyxwvcb3o&q=https://www.mun.ca/medicine/media/production/medicine/documents/Daily-Car-Kilo-Report-Form-(2).docx&sa=U&ved=2ahUKEwj7pP31pbWOAxWMFFkFHXwyK5cQFnoECAEQAQ&usg=AOvVaw3Ayg9y6vGs3h-RmXKd-_Bn&fexp=72986053,72986052"},
  {formName: "Print & Mail Requisition", category: "Purchase", link: "https://www.mun.ca/printandmail/media/production/memorial/administrative/print-and-mail-services/media-library/pdfs/PrintAndMailReqForWeb.pdf"},
  {formName: "Internal Requisition", category: "Purchase", link: "https://www.mun.ca/medicine/media/production/medicine/documents/FINANCE%20-%20Internal%20Requisition%20Form.pdf"},
  {formName: "Visitor Approval", category: "Events & Hosting", link: "https://www.mun.ca/finance/media/production/memorial/administrative/financial-and-administrative-services/media-library/forms/VisitorApproval.pdf"},
  {formName: "Vendor Direct Deposit", category: "Purchase", link: "https://www.mun.ca/finance/media/production/memorial/administrative/financial-and-administrative-services/media-library/forms/Vendor_Direct_Deposit_Information.pdf"},
  {formName: "Eligibility of Membership", category: "Other", link: "https://www.mun.ca/finance/media/production/memorial/administrative/financial-and-administrative-services/media-library/forms/Eligibility_of_Membership.pdf"},
  {formName: "Affidavit (Declaration of Lost or Unavailable original receipts)", category: "Travel", link: "https://www.mun.ca/finance/media/production/memorial/administrative/financial-and-administrative-services/media-library/forms/Declaration%20Form%20for%20Lost%20Receipts.pdf"},
  {formName: "Catering Pre-Approval", category: "Events & Hosting", link: "https://www.mun.ca/medicine/media/production/medicine/documents/Catering-Hosting-Pre-Approval.pdf"},
  {formName: "Schedule of Reimbursable Expenses.", category: "Events & Hosting", link: "https://www.mun.ca/finance/financial-services/travel/schedule-of-reimbursable-expenses/"},
  {formName: "Deposit Control", category: "Deposit", link: "https://www.mun.ca/finance/media/production/memorial/administrative/financial-and-administrative-services/media-library/forms/DEPOSIT_CONTROL_FORM2.pdf"},
  {formName: "Deposit Control - Online Banking", category: "Deposit", link: "https://www.mun.ca/finance/media/production/memorial/administrative/financial-and-administrative-services/media-library/forms/DEP_CTRL_FRM_Online.pdf"}
];

// // Initialize and display results on page load
// window.onload = function() {
//     handleCategorySelection(); // Automatically display all forms on load
//     filterResultsByCategoryAndSubCategory("", ""); // Show all forms initially
// };

window.onload = function() {
    handleCategorySelection(); // Automatically display all forms on load

};
