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

// ✨ Show a random quote and save to Session Storage
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `"${quote.text}" - [${quote.category}]`;

  // Save to sessionStorage (optional)
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// ➕ Add quote via form
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes(); // Persist change
    showRandomQuote(); // Optionally show new one
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

// 📂 Import quotes from uploaded JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
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

// 📤📥 Create Import/Export buttons
function createImportExportButtons() {
  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Export Quotes to JSON";
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

// 🚀 On Page Load
window.onload = function () {
  loadQuotes();               // Load saved quotes from localStorage
  showRandomQuote();          // Display one on load
  createAddQuoteForm();       // Build quote input form
  createImportExportButtons();// Build import/export buttons

  const newQuoteButton = document.getElementById("newQuote");
  newQuoteButton.addEventListener("click", showRandomQuote);
};
