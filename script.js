
const languageSection = document.getElementById("language-section");
const librarySection = document.getElementById("library-section");
const languageHeading = document.getElementById("language-heading");
const resourceList = document.getElementById("resource-list");
const resultCount = document.getElementById("result-count");
const emptyMessage = document.getElementById("empty-message");
const errorMessage = document.getElementById("error-message");

const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const typeFilter = document.getElementById("type-filter");

let resources = [];
let selectedLanguage = "";

const categories = {
  "online-safety": "Online Safety",
  "scams-and-fraud": "Scams and Fraud",
  "digital-literacy": "Digital Literacy",
  "internet-access": "Internet Access",
};

const languageNames = {
  english: "English",
  spanish: "Español"
};

async function loadResources() {
  try {
    const response = await fetch("./data/resources.json");

    if (!response.ok) {
      throw new Error("Could not load resource data.");
    }

    resources = await response.json();
  } catch (error) {
    console.error(error);
    errorMessage.hidden = false;
  }
}

function chooseLanguage(language) {
  selectedLanguage = language;

  languageSection.hidden = true;
  librarySection.hidden = false;

  languageHeading.textContent =
    languageNames[language] + " Resources";

  searchInput.value = "";
  categoryFilter.value = "";
  typeFilter.value = "";

  populateFilters();
  displayResources();
}

function populateFilters() {
  const languageResources = resources.filter(
    item => item.language === selectedLanguage
  );

  const availableCategories = [...new Set(
    languageResources.map(item => item.category)
  )];

  const availableTypes = [...new Set(
    languageResources.map(item => item.type)
  )];

  categoryFilter.innerHTML = '<option value="">All topics</option>';
  typeFilter.innerHTML = '<option value="">All types</option>';

  availableCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = categories[category] || category;
    categoryFilter.appendChild(option);
  });

  availableTypes.forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeFilter.appendChild(option);
  });
}

function displayResources() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedType = typeFilter.value;

  const filtered = resources.filter(item => {
    const matchesLanguage = item.language === selectedLanguage;
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    const matchesType = !selectedType || item.type === selectedType;

    const searchableText = [
      item.title,
      item.description,
      item.type,
      categories[item.category] || item.category
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm);

    return matchesLanguage && matchesCategory &&
      matchesType && matchesSearch;
  });

  resourceList.replaceChildren();

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "resource-card";

    const type = document.createElement("span");
    type.className = "type-label";
    type.textContent = item.type;

    const title = document.createElement("h3");
    title.textContent = item.title;

    const description = document.createElement("p");
    description.textContent = item.description || "";

    const meta = document.createElement("div");
    meta.className = "resource-meta";
    meta.textContent = categories[item.category] || item.category;

    const actions = document.createElement("div");
    actions.className = "resource-actions";

    const viewLink = document.createElement("a");
    viewLink.href = item.file;
    viewLink.target = "_blank";
    viewLink.rel = "noopener noreferrer";
    viewLink.textContent = "View PDF";

    const downloadLink = document.createElement("a");
    downloadLink.href = item.file;
    downloadLink.download = "";
    downloadLink.textContent = "Download";

    actions.append(viewLink, downloadLink);
    card.append(type, title, description, meta, actions);
    resourceList.appendChild(card);
  });

  resultCount.textContent =
    filtered.length + (filtered.length === 1 ? " resource found" : " resources found");

  emptyMessage.hidden = filtered.length !== 0;
}

document.querySelectorAll(".language-button").forEach(button => {
  button.addEventListener("click", () => {
    chooseLanguage(button.dataset.language);
  });
});

document.getElementById("change-language").addEventListener("click", () => {
  selectedLanguage = "";
  librarySection.hidden = true;
  languageSection.hidden = false;
});

document.getElementById("clear-filters").addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "";
  typeFilter.value = "";
  displayResources();
});

searchInput.addEventListener("input", displayResources);
categoryFilter.addEventListener("change", displayResources);
typeFilter.addEventListener("change", displayResources);

loadResources();

