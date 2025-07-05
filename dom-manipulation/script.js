// ✅ Initial quotes array
let quotes = [
  { text: "Believe in yourself.", category: "Motivation", addedAt: new Date().toISOString() },
  { text: "Stay curious, keep learning.", category: "Education", addedAt: new Date().toISOString() },
  { text: "Every moment is a fresh beginning.", category: "Inspiration", addedAt: new Date().toISOString() }
];

// ✅ Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ✅ Load quotes from localStorage with error handling
function loadQuotes() {
  const saved = localStorage.getItem("quotes");
  if (saved) {
    try {
      quotes = JSON.parse(saved);
    } catch {
      console.error("Failed to parse saved quotes. Resetting to empty array.");
      quotes = [];
    }
  }
}

// ✅ Display a random quote based on selected category
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const selectedCategory = document.getElementById("categoryFilter")?.value || "all";

  // Filter by category if needed
  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);
// if no quotes, show message and return
  if (filtered.length === 0) {
    quoteDisplay.innerHTML = `<em>No quotes available for "${selectedCategory}".</em>`;
    return;
  }
// pick a random quote to show
  const random = filtered[Math.floor(Math.random() * filtered.length)];
//clear the cointainer
  quoteDisplay.innerHTML = `
    "${random.text}" - [${random.category}]<br>
    <small>Added on: ${new Date(random.addedAt).toLocaleString()}</small><br>
  
  `;
//create a delete button as a real element
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete"

  //disable the button if this is the last quote overall
  deleteBtn.disabled = filtered.length <= 1;

  //wire up click handler
  deleteBtn.addEventListener("click", () => {
    deleteQuote(random.text);
  });

  //Append it
  quoteDisplay.appendChild(document.createElement("br"));
  quoteDisplay.appendChild(deleteBtn);

  // Save the last shown quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(random));
}

// ✅ Remove a quote by its text
function deleteQuote(textToDelete) {
  quotes = quotes.filter(q => q.text !== textToDelete);
  saveQuotes();
  populateCategoryDropdown();
  showRandomQuote();
}

// ✅ Add a new quote from the form inputs
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category, addedAt: new Date().toISOString() });
  saveQuotes();
  populateCategoryDropdown();
  showRandomQuote();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}


// ✅ Populate the category dropdown from current quotes
function populateCategoryDropdown() {
  const dropdown = document.getElementById("categoryFilter");
  dropdown.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  dropdown.appendChild(allOption);

  const uniqueCats = [...new Set(quotes.map(q => q.category))];
  uniqueCats.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });
}

// ✅ Export quotes to a downloadable JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ✅ Import quotes from a JSON file
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Invalid format");
      quotes.push(...imported);
      saveQuotes();
      populateCategoryDropdown();
      showRandomQuote();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Import failed: " + err.message);
    }
  };
  reader.readAsText(event.target.files[0]);
}

// ✅ Initialize the application on page load
window.onload = () => {
  loadQuotes();
  populateCategoryDropdown();

  document.getElementById("newQuote")
    .addEventListener("click", showRandomQuote);

  document.getElementById("categoryFilter")
    .addEventListener("change", showRandomQuote);

  document.getElementById("exportQuotes")
    .addEventListener("click", exportToJsonFile);

  document.getElementById("importFile")
    .addEventListener("change", importFromJsonFile);
document.getElementById("quoteForm")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // prevent page reload
    addQuote();
  });

  // Display an initial quote
  showRandomQuote();
};
