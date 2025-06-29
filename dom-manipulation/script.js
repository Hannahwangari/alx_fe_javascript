// Initial quotes array
let quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Stay curious, keep learning.", category: "Education" },
  { text: "Every moment is a fresh beginning.", category: "Inspiration" }
];

// 🔁 Save to Local Storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// 🔁 Load from Local Storage
function loadQuotes() {
  const saved = localStorage.getItem("quotes");
  if (saved) {
    quotes = JSON.parse(saved);
  }
}

// ✨ Show a quote based on filter or default
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  const quoteDisplay = document.getElementById("quoteDisplay");

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<em>No quotes found in this category.</em>";
  } else {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `"${quote.text}" - [${quote.category}]`;
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
  }
}

// ➕ Add quote via form
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    filterQuotes();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both quote text and category.");
  }
}

// 🧾 Create form for adding quotes
function createAddQuoteForm() {
  const formDiv = document.createElement("div");

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.setAttribute("onclick", "addQuote()");

  formDiv.appendChild(inputText);
  formDiv.appendChild(inputCategory);
  formDiv.appendChild(addButton);

  document.body.appendChild(formDiv);
}

// 📂 Populate dropdown with unique categories
function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  dropdown.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    dropdown.appendChild(option);
  });

  // Restore last filter
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    dropdown.value = savedFilter;
    filterQuotes();
  }
}

// 💾 Export quotes to a JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// 📥 Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch (err) {
      alert("Error reading file: " + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// 📤📥 Add import/export UI
function createImportExportButtons() {
  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Export Quotes";
  exportBtn.onclick = exportToJsonFile;

  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = ".json";
  importInput.id = "importFile";
  importInput.onchange = importFromJsonFile;

  const container = document.createElement("div");
  container.appendChild(exportBtn);
  container.appendChild(importInput);

  document.body.appendChild(container);
}

// 🚀 On Load
window.onload = function () {
  loadQuotes();
  createAddQuoteForm();
  createImportExportButtons();
  populateCategories();

  const newQuoteButton = document.getElementById("newQuote");
  newQuoteButton.addEventListener("click", filterQuotes);
};
