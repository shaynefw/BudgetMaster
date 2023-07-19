// Function to create form
function createForm() {
  // Get the form container
  const formContainer = document.getElementById("form-container");

  // Create the form
  const form = document.createElement("form");
  form.id = "budget-form";

  // Create an information button
  const infoButton = document.createElement("button");
  infoButton.type = "button"; // Make sure the button doesn't submit the form
  infoButton.textContent = "Information";
  infoButton.addEventListener("click", function () {
    document.getElementById("info-modal").style.display = "block";
  });
  form.appendChild(infoButton);

  // Create income field
  let incomeLabel = document.createElement("label");
  incomeLabel.textContent = "Enter your monthly income:";
  form.appendChild(incomeLabel);

  let incomeInput = document.createElement("input");
  incomeInput.type = "number";
  incomeInput.id = "income";
  incomeInput.name = "income";
  incomeInput.required = true; // Make the field required
  form.appendChild(incomeInput);

  // Add event listener for validation styling
  incomeInput.addEventListener("input", function () {
    if (!this.value) {
      this.style.borderColor = "red";
    } else {
      this.style.borderColor = "#08f7fe"; // Reset to neon blue border if value is entered
      calculateRemainingIncome(); // Call the function that calculates the remaining income
    }
  });

  // Create bills field
  let billsLabel = document.createElement("label");
  billsLabel.textContent = "Monthly bills:";
  form.appendChild(billsLabel);

  let billsInput = document.createElement("input");
  billsInput.type = "number";
  billsInput.id = "bills";
  billsInput.name = "monthlyBills";
  billsInput.required = true; // Make the field required
  form.appendChild(billsInput);

  // Add event listener for validation styling
  billsInput.addEventListener("input", function () {
    if (!this.value) {
      this.style.borderColor = "red";
    } else {
      this.style.borderColor = "#08f7fe"; // Reset to neon blue border if value is entered
      calculateRemainingIncome(); // Call the function that calculates the remaining income
    }
  });

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

  // Calculate the remaining income
  calculateRemainingIncome();
}

// Get the modal
let modal = document.getElementById("info-modal");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close-button")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

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
  const income =
    parseFloat(document.querySelector('input[name="income"]').value) || 0;
  const monthlyBills =
    parseFloat(document.querySelector('input[name="monthlyBills"]').value) || 0;

  // Calculate the total amount for all number input fields (excluding income and monthly bills)
  let totalCategories = 0;
  let categoryDetails = "";
  document.querySelectorAll('input[type="number"]').forEach((input) => {
    if (input.name !== "income" && input.name !== "monthlyBills") {
      const value = parseFloat(input.value) || 0;
      totalCategories += value;
      categoryDetails += `${input.name}: $${value.toFixed(2)}\n`;
    }
  });

  // Calculate remaining income after expenses and category spending
  const remainingIncome = income - monthlyBills - totalCategories;

  // Display the remaining income to the user
  const results = document.getElementById("results");
  results.textContent = `Remaining income after expenses: $${remainingIncome.toFixed(
    2
  )}`;

  // Update the print output
  const printOutput = document.getElementById("print-output");
  printOutput.textContent = `Income: $${income.toFixed(
    2
  )}\nMonthly Bills: $${monthlyBills.toFixed(
    2
  )}\n${categoryDetails}Remaining Income: $${remainingIncome.toFixed(2)}`;
}

// Call the functions
createForm();
