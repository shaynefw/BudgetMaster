// Default categories
const DEFAULT_CATEGORIES = [
    "Hygiene",
    "Food",
    "Gas/Transportation",
    "Car Maintenance",
    "Event/Donations",
    "Emergency Saving",
    "Savings Growth",
    "Pocket/Miscellaneous"
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeForm();
    setupEventListeners();
});

function initializeForm() {
    const container = document.getElementById('categories-container');
    DEFAULT_CATEGORIES.forEach(category => {
        const field = createCategoryField(category, false);
        container.appendChild(field);
    });
    calculateRemaining();
}

function createCategoryField(name, isCustom = true) {
    const div = document.createElement('div');
    div.className = 'form-group';
    div.dataset.category = name;
    div.dataset.custom = isCustom;

    const label = document.createElement('label');
    label.textContent = `${getEmojiForCategory(name)} ${name}`;
    div.appendChild(label);

    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.gap = 'var(--spacing-md)';
    inputContainer.style.alignItems = 'center';

    const input = document.createElement('input');
    input.type = 'number';
    input.name = name;
    input.id = name;
    input.placeholder = '0.00';
    input.step = '0.01';
    input.addEventListener('input', calculateRemaining);
    inputContainer.appendChild(input);

    if (isCustom) {
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn btn-small btn-secondary';
        removeBtn.textContent = 'Remove';
        removeBtn.style.minWidth = '80px';
        removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            div.remove();
            calculateRemaining();
        });
        inputContainer.appendChild(removeBtn);
    }

    div.appendChild(inputContainer);
    return div;
}

function getEmojiForCategory(category) {
    const emojiMap = {
        'Hygiene': '💅',
        'Food': '🍔',
        'Gas/Transportation': '⛽',
        'Car Maintenance': '🚗',
        'Event/Donations': '🎉',
        'Emergency Saving': '🏦',
        'Savings Growth': '📈',
        'Pocket/Miscellaneous': '💸'
    };
    return emojiMap[category] || '💰';
}

function setupEventListeners() {
    document.getElementById('infoBtn').addEventListener('click', () => {
        document.getElementById('info-modal').style.display = 'block';
    });

    document.querySelector('.close-button').addEventListener('click', () => {
        document.getElementById('info-modal').style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        const modal = document.getElementById('info-modal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    document.getElementById('addCategoryBtn').addEventListener('click', (e) => {
        e.preventDefault();
        const categoryName = prompt('Enter the category name:');
        if (categoryName && categoryName.trim()) {
            const field = createCategoryField(categoryName.trim(), true);
            document.getElementById('custom-categories').appendChild(field);
            calculateRemaining();
        }
    });

    document.getElementById('calculateBtn').addEventListener('click', (e) => {
        e.preventDefault();
        calculateRemaining();
    });

    document.getElementById('printBtn').addEventListener('click', (e) => {
        e.preventDefault();
        window.print();
    });

    document.getElementById('income').addEventListener('input', calculateRemaining);
    document.getElementById('bills').addEventListener('input', calculateRemaining);
}

function calculateRemaining() {
    const income = parseFloat(document.getElementById('income').value) || 0;
    const bills = parseFloat(document.getElementById('bills').value) || 0;

    let totalCategories = 0;
    const categoryDetails = [];

    document.querySelectorAll('#categories-container .form-group, #custom-categories .form-group').forEach(group => {
        const input = group.querySelector('input[type="number"]');
        if (input) {
            const value = parseFloat(input.value) || 0;
            totalCategories += value;
            if (value > 0) {
                categoryDetails.push({
                    name: input.name,
                    amount: value
                });
            }
        }
    });

    const remaining = income - bills - totalCategories;

    // Update results display
    let resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    // Results Card
    const resultsCard = document.createElement('div');
    resultsCard.className = 'results-card';

    const label = document.createElement('div');
    label.className = 'results-label';
    label.textContent = 'Remaining Income After Expenses';
    resultsCard.appendChild(label);

    const value = document.createElement('div');
    value.className = `results-value ${remaining >= 0 ? 'positive' : 'negative'}`;
    value.textContent = `$${remaining.toFixed(2)}`;
    resultsCard.appendChild(value);

    resultsContainer.appendChild(resultsCard);

    // Breakdown
    if (categoryDetails.length > 0 || bills > 0) {
        const breakdown = document.createElement('div');
        breakdown.className = 'breakdown';

        const breakdownTitle = document.createElement('div');
        breakdownTitle.style.fontWeight = '600';
        breakdownTitle.style.marginBottom = 'var(--spacing-md)';
        breakdownTitle.textContent = 'Expense Breakdown';
        breakdown.appendChild(breakdownTitle);

        if (income > 0) {
            const incomeItem = document.createElement('div');
            incomeItem.className = 'breakdown-item';
            incomeItem.innerHTML = `
                <span class="breakdown-label">💵 Total Income</span>
                <span class="breakdown-value">$${income.toFixed(2)}</span>
            `;
            breakdown.appendChild(incomeItem);
        }

        if (bills > 0) {
            const billsItem = document.createElement('div');
            billsItem.className = 'breakdown-item';
            billsItem.innerHTML = `
                <span class="breakdown-label">📋 Fixed Expenses</span>
                <span class="breakdown-value">$${bills.toFixed(2)}</span>
            `;
            breakdown.appendChild(billsItem);
        }

        categoryDetails.forEach(detail => {
            const item = document.createElement('div');
            item.className = 'breakdown-item';
            item.innerHTML = `
                <span class="breakdown-label">${getEmojiForCategory(detail.name)} ${detail.name}</span>
                <span class="breakdown-value">$${detail.amount.toFixed(2)}</span>
            `;
            breakdown.appendChild(item);
        });

        resultsContainer.appendChild(breakdown);
    }

    // Update print output
    const printOutput = document.getElementById('print-output');
    let printText = `BUDGETMASTER - Budget Summary\n\n`;
    printText += `Income: $${income.toFixed(2)}\n`;
    printText += `Fixed Expenses: $${bills.toFixed(2)}\n\n`;
    printText += `Category Spending:\n`;
    categoryDetails.forEach(detail => {
        printText += `  ${detail.name}: $${detail.amount.toFixed(2)}\n`;
    });
    printText += `\nRemaining Income: $${remaining.toFixed(2)}\n`;
    printOutput.textContent = printText;
}
