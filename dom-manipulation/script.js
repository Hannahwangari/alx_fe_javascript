// Initial quote list
let quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Stay curious, keep learning.", category: "Education" },
  { text: "Every moment is a fresh beginning.", category: "Inspiration" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load quotes from localStorage
function loadQuotes() {
  const saved = localStorage.getItem("quotes");
  if (saved) {
    quotes = JSON.parse(saved);
  }
}

// Show a random quote based on filter
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  let filtered = quotes;
  if (selectedCategory !== "all") {
    filtered = quotes.filter(q => q.category === selectedCategory);
  }

  const quoteDisplay = document.getElementById("quoteDisplay");
  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "<em>No quotes found in this category.</em>";
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `"${random.text}" - [${random.category}]`;
  sessionStorage.setItem("lastQuote", JSON.stringify(random));
}

// Add a new quote from the form
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Create the input form for adding new quotes
function createAddQuoteForm() {
  const form = document.createElement("div");

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  form.appendChild(inputText);
  form.appendChild(inputCategory);
  form.appendChild(addButton);
  document.body.appendChild(form);
}

// Create dropdown filter from categories
function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  dropdown.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    dropdown.value = savedFilter;
    filterQuotes();
  }
}

// Export quotes as downloadable JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Invalid JSON format.");
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };
  reader.readAsText(event.target.files[0]);
}

// Show notification for sync conflicts/resolution
function showConflictNotification(message) {
  const note = document.createElement("div");
  note.textContent = message;
  note.style.cssText =
    "background:#fef3c7;border:1px solid #facc15;padding:10px;margin:10px 0;font-weight:bold";
  document.body.prepend(note);
  setTimeout(() => note.remove(), 5000);
}

// Fetch new quotes from mock server (JSONPlaceholder)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const serverQuotes = await response.json();

    const formatted = serverQuotes.map(post => ({
      text: post.title,
      category: post.body.slice(0, 20) || "General"
    }));

    let updated = false;

    formatted.forEach(serverQuote => {
      const exists = quotes.some(q =>
        q.text === serverQuote.text && q.category === serverQuote.category
      );
      if (!exists) {
        quotes.push(serverQuote);
        updated = true;
      }
    });

    if (updated) {
      saveQuotes();
      populateCategories();
      filterQuotes();
      showConflictNotification("New quotes synced from server.");
    }
  } catch (err) {
    console.error("Server sync failed:", err);
  }
}

// Add JSON import/export UI
function createImportExportButtons() {
  const div = document.createElement("div");

  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Export Quotes";
  exportBtn.onclick = exportToJsonFile;

  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = ".json";
  importInput.onchange = importFromJsonFile;

  div.appendChild(exportBtn);
  div.appendChild(importInput);
  document.body.appendChild(div);
}

// Initialize app
window.onload = function () {
  loadQuotes();
  createAddQuoteForm();
  createImportExportButtons();
  populateCategories();

  document.getElementById("newQuote").addEventListener("click", filterQuotes);

  fetchQuotesFromServer();
  setInterval(fetchQuotesFromServer, 15000);
};
