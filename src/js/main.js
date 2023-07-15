// Function to create form
function createForm() {
  // Get the form container
  const formContainer = document.getElementById("form-container");

  // Create the form
  const form = document.createElement("form");
  form.id = "budget-form";

  // Create form fields for income, payment frequency, and monthly bills
  const incomeField = createField(
    "number",
    "income",
    "Enter your monthly income"
  );
  const paymentFrequencyField = createField(
    "text",
    "paymentFrequency",
    "Enter your payment frequency (weekly/bi-weekly/monthly)"
  );
  const monthlyBillsField = createField(
    "number",
    "monthlyBills",
    "Enter your total monthly bills"
  );

  // Add the fields to the form
  form.appendChild(incomeField);
  //form.appendChild(paymentFrequencyField);
  form.appendChild(monthlyBillsField);

  // Create fields for spending categories
  const categories = [
    "Hygiene",
    "Food",
    "Gas/Transportation",
    "Car Maintenance",
    "Event/Donations",
    "Emergency Saving",
    "Savings Growth",
    "Pocket/Miscellaneous",
  ];
  categories.forEach((category) => {
    const field = createField(
      "number",
      category,
      `Enter amount for ${category}`
    );
    form.appendChild(field);
  });

  // Create a button to add more categories
  const addCategoryButton = document.createElement("button");
  addCategoryButton.type = "button"; // Make sure the button doesn't submit the form
  addCategoryButton.textContent = "Add Category";
  addCategoryButton.addEventListener("click", function () {
    // Prompt the user for the category name
    const category = prompt("Enter the category name:");
    if (category) {
      // Create a field for the new category
      const field = createField(
        "number",
        category,
        `Enter amount for ${category}`
      );
      // Insert the field before the add category button
      form.insertBefore(field, addCategoryButton);
    }
  });
  form.appendChild(addCategoryButton);

  // Create a print button
  const printButton = document.createElement("button");
  printButton.type = "button"; // Make sure the button doesn't submit the form
  printButton.textContent = "Print";
  printButton.addEventListener("click", function () {
    window.print();
  });
  form.appendChild(printButton);

  // Add the form to the form container
  formContainer.appendChild(form);
}

// Helper function to create a form field
function createField(type, name, placeholder) {
  // Create a div to hold the label and input
  const div = document.createElement("div");

  // Create a label
  const label = document.createElement("label");
  label.for = name;
  label.textContent = placeholder;
  div.appendChild(label);

  // Create the input
  const field = document.createElement("input");
  field.type = type;
  field.name = name;
  field.id = name; // The label's 'for' attribute should match the input's id
  div.appendChild(field);

  // Add an input event listener to the field
  field.addEventListener("input", calculateRemainingIncome);

  return div;
}

// Function to calculate remaining income
function calculateRemainingIncome() {
    // Get the income and monthly bills from the form
    const income = parseFloat(document.querySelector('input[name="income"]').value) || 0;
    const monthlyBills = parseFloat(document.querySelector('input[name="monthlyBills"]').value) || 0;

    // Calculate the total amount for all number input fields (excluding income and monthly bills)
    let totalCategories = 0;
    let categoryDetails = '';
    document.querySelectorAll('input[type="number"]').forEach(input => {
        if (input.name !== 'income' && input.name !== 'monthlyBills') {
            const value = parseFloat(input.value) || 0;
            totalCategories += value;
            categoryDetails += `${input.name}: $${value.toFixed(2)}\n`;
        }
    });

    // Calculate remaining income after expenses and category spending
    const remainingIncome = income - monthlyBills - totalCategories;

    // Display the remaining income to the user
    const results = document.getElementById('results');
    results.textContent = `Remaining income after expenses: $${remainingIncome.toFixed(2)}`;

    // Update the print output
    const printOutput = document.getElementById('print-output');
    printOutput.textContent = `Income: $${income.toFixed(2)}\nMonthly Bills: $${monthlyBills.toFixed(2)}\n${categoryDetails}Remaining Income: $${remainingIncome.toFixed(2)}`;
}


// Call the functions
createForm();
