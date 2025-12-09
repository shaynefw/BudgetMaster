// Default categories with emojis
const DEFAULT_CATEGORIES = [
  { name: "Hygiene", emoji: "💅" },
  { name: "Food", emoji: "🍔" },
  { name: "Gas/Transportation", emoji: "⛽" },
  { name: "Car Maintenance", emoji: "🚗" },
  { name: "Event/Donations", emoji: "🎉" },
  { name: "Emergency Saving", emoji: "🏦" },
  { name: "Savings Growth", emoji: "📈" },
  { name: "Pocket/Miscellaneous", emoji: "💸" },
];

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  initializeForm();
  setupEventListeners();
});

/**
 * Initialize the budget form with default categories
 */
function initializeForm() {
  const categoriesList = document.getElementById("categories-list");

  DEFAULT_CATEGORIES.forEach((category) => {
    const field = createCategoryField(category.name, false);
    categoriesList.appendChild(field);
  });

  calculateRemaining();
}

/**
 * Create a category input field with label and remove button for custom categories
 * @param {string} name - Category name
 * @param {boolean} isCustom - Whether this is a custom category (default: true)
 * @returns {HTMLElement} Form group element
 */
function createCategoryField(name, isCustom = true) {
  const div = document.createElement("div");
  div.className = "form-group";
  div.dataset.category = name;
  div.dataset.custom = isCustom;

  // Create label with emoji
  const label = document.createElement("label");
  const emoji = getEmojiForCategory(name);
  label.htmlFor = `category-${name.replace(/\s+/g, "-").toLowerCase()}`;
  label.textContent = `${emoji} ${name}`;
  div.appendChild(label);

  // Create input container with flex layout
  const inputContainer = document.createElement("div");
  inputContainer.style.display = "flex";
  inputContainer.style.gap = "var(--spacing-md)";
  inputContainer.style.alignItems = "center";

  // Create number input
  const input = document.createElement("input");
  input.type = "number";
  input.name = name;
  input.id = `category-${name.replace(/\s+/g, "-").toLowerCase()}`;
  input.placeholder = "0.00";
  input.step = "0.01";
  input.min = "0";
  input.setAttribute("aria-label", `${name} budget amount`);
  input.addEventListener("input", calculateRemaining);
  inputContainer.appendChild(input);

  // Add remove button for custom categories
  if (isCustom) {
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn--secondary";
    removeBtn.textContent = "✕ Remove";
    removeBtn.style.minWidth = "80px";
    removeBtn.setAttribute("aria-label", `Remove ${name} category`);
    removeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      div.remove();
      calculateRemaining();
    });
    inputContainer.appendChild(removeBtn);
  }

  div.appendChild(inputContainer);
  return div;
}

/**
 * Get emoji for a given category name
 * @param {string} category - Category name
 * @returns {string} Emoji character
 */
function getEmojiForCategory(category) {
  const emojiMap = {
    Hygiene: "💅",
    Food: "🍔",
    "Gas/Transportation": "⛽",
    "Car Maintenance": "🚗",
    "Event/Donations": "🎉",
    "Emergency Saving": "🏦",
    "Savings Growth": "📈",
    "Pocket/Miscellaneous": "💸",
  };
  return emojiMap[category] || "💰";
}

/**
 * Setup event listeners for buttons and inputs
 */
function setupEventListeners() {
  // Help/Info modal listeners
  const helpBtn = document.querySelector('a[href="#help"]');
  const modal = document.getElementById("help-modal");
  const closeBtn = document.querySelector(".close-button");

  if (helpBtn && modal) {
    helpBtn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "block";
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (modal) modal.style.display = "none";
    });
  }

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Add category button
  const addCategoryBtn = document.getElementById("add-category-btn");
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const categoryName = prompt("Enter the category name:");
      if (categoryName && categoryName.trim()) {
        const field = createCategoryField(categoryName.trim(), true);
        const categoriesList = document.getElementById("categories-list");
        categoriesList.appendChild(field);
        calculateRemaining();
      }
    });
  }

  // Download button
  const downloadBtn = document.getElementById("download-btn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", (e) => {
      e.preventDefault();
      downloadBudget();
    });
  }

  // Print button
  const printBtn = document.getElementById("print-btn");
  if (printBtn) {
    printBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.print();
    });
  }

  // Income and bills input listeners
  const incomeInput = document.getElementById("monthly-income");
  const billsInput = document.getElementById("monthly-bills");

  if (incomeInput) {
    incomeInput.addEventListener("input", calculateRemaining);
  }
  if (billsInput) {
    billsInput.addEventListener("input", calculateRemaining);
  }
}

/**
 * Calculate and display remaining budget after expenses
 * Updates the results display and expense breakdown
 */
function calculateRemaining() {
  // Get income and bills values
  const incomeInput = document.getElementById("monthly-income");
  const billsInput = document.getElementById("monthly-bills");

  const income = parseFloat(incomeInput?.value) || 0;
  const bills = parseFloat(billsInput?.value) || 0;

  let totalCategories = 0;
  const categoryDetails = [];

  // Sum all category expenses
  const categoryItems = document.querySelectorAll(
    "#categories-list .form-group"
  );
  categoryItems.forEach((group) => {
    const input = group.querySelector('input[type="number"]');
    if (input) {
      const value = parseFloat(input.value) || 0;
      totalCategories += value;
      if (value > 0) {
        const categoryName = input.name || input.id;
        categoryDetails.push({
          name: categoryName,
          amount: value,
        });
      }
    }
  });

  const remaining = income - bills - totalCategories;

  // Update results display
  let resultsContainer =
    document.querySelector(".results-card") || document.querySelector("main");

  // Find or create results container
  let container = document.getElementById("results-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "results-container";
    if (resultsContainer) {
      resultsContainer.appendChild(container);
    }
  }

  container.innerHTML = "";

  // Create results card
  const resultsCard = document.createElement("div");
  resultsCard.className = "results-card";

  const label = document.createElement("div");
  label.className = "results-label";
  label.textContent = "Remaining Income After Expenses";
  resultsCard.appendChild(label);

  const value = document.createElement("div");
  value.className = `results-value ${remaining >= 0 ? "positive" : "negative"}`;
  value.textContent = `$${remaining.toFixed(2)}`;
  resultsCard.appendChild(value);

  container.appendChild(resultsCard);

  // Create expense breakdown
  if (categoryDetails.length > 0 || bills > 0) {
    const breakdown = document.createElement("div");
    breakdown.className = "breakdown";

    const breakdownTitle = document.createElement("h3");
    breakdownTitle.textContent = "Expense Breakdown";
    breakdownTitle.style.marginTop = "0";
    breakdown.appendChild(breakdownTitle);

    // Income row
    if (income > 0) {
      const incomeItem = document.createElement("div");
      incomeItem.className = "breakdown-item";
      const incomeLabel = document.createElement("div");
      incomeLabel.className = "breakdown-label";
      incomeLabel.textContent = "💵 Total Income";
      const incomeValue = document.createElement("div");
      incomeValue.className = "breakdown-value";
      incomeValue.textContent = `$${income.toFixed(2)}`;
      incomeItem.appendChild(incomeLabel);
      incomeItem.appendChild(incomeValue);
      breakdown.appendChild(incomeItem);
    }

    // Bills row
    if (bills > 0) {
      const billsItem = document.createElement("div");
      billsItem.className = "breakdown-item";
      const billsLabel = document.createElement("div");
      billsLabel.className = "breakdown-label";
      billsLabel.textContent = "📋 Fixed Expenses";
      const billsValue = document.createElement("div");
      billsValue.className = "breakdown-value";
      billsValue.textContent = `$${bills.toFixed(2)}`;
      billsItem.appendChild(billsLabel);
      billsItem.appendChild(billsValue);
      breakdown.appendChild(billsItem);
    }

    // Category rows
    categoryDetails.forEach((detail) => {
      const item = document.createElement("div");
      item.className = "breakdown-item";
      const emoji = getEmojiForCategory(detail.name);

      const label = document.createElement("div");
      label.className = "breakdown-label";
      label.textContent = `${emoji} ${detail.name}`;

      const amount = document.createElement("div");
      amount.className = "breakdown-value";
      amount.textContent = `$${detail.amount.toFixed(2)}`;

      item.appendChild(label);
      item.appendChild(amount);
      breakdown.appendChild(item);
    });

    container.appendChild(breakdown);
  }

  // Update hidden print output
  updatePrintOutput(income, bills, remaining, categoryDetails);
}

/**
 * Update hidden print output for download functionality
 * @param {number} income - Total monthly income
 * @param {number} bills - Fixed monthly expenses
 * @param {number} remaining - Remaining budget
 * @param {Array} categoryDetails - Array of category spending objects
 */
function updatePrintOutput(income, bills, remaining, categoryDetails) {
  let printText = "BUDGETMASTER - BUDGET SUMMARY\n";
  printText += "=".repeat(40) + "\n\n";

  printText += "FINANCIAL OVERVIEW\n";
  printText += "-".repeat(40) + "\n";
  printText += `Total Monthly Income:    $${income.toFixed(2)}\n`;
  printText += `Fixed Expenses:          $${bills.toFixed(2)}\n`;

  if (categoryDetails.length > 0) {
    const totalSpending = categoryDetails.reduce(
      (sum, detail) => sum + detail.amount,
      0
    );
    printText += `Spending Categories:     $${totalSpending.toFixed(2)}\n`;
  }

  printText += "-".repeat(40) + "\n";
  printText += `Remaining Budget:        $${remaining.toFixed(2)}\n\n`;

  // Category breakdown
  if (categoryDetails.length > 0) {
    printText += "EXPENSE BREAKDOWN\n";
    printText += "-".repeat(40) + "\n";
    categoryDetails.forEach((detail) => {
      const emoji = getEmojiForCategory(detail.name);
      printText += `${emoji} ${detail.name.padEnd(25)} $${detail.amount.toFixed(
        2
      )}\n`;
    });
  }

  printText += "\n" + "=".repeat(40) + "\n";
  printText += "Generated by BudgetMaster\n";
  printText += "https://yourusername.github.io/budgetmaster/\n";

  // Store in data attribute for access if needed
  const main = document.querySelector("main");
  if (main) {
    main.dataset.printContent = printText;
  }
}

/**
 * Download budget summary as a text file
 */
function downloadBudget() {
  const main = document.querySelector("main");
  const printText =
    main?.dataset.printContent || "Unable to generate budget summary.";

  // Create blob and download
  const blob = new Blob([printText], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const element = document.createElement("a");
  element.href = url;
  element.download = `budget-summary-${
    new Date().toISOString().split("T")[0]
  }.txt`;
  element.style.display = "none";

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

  window.URL.revokeObjectURL(url);
}
