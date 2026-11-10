
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

const translations = {
  english: {
    siteTitle: "Community Digital Resource Library",
    headerNote: "Free community resources",
    eyebrow: "Learn • Connect • Stay Safe",
    mainHeading: "Digital Resource Library",
    intro: "Explore practical guides, handouts, and information to help you use technology, stay safe online, and access digital services.",
    chooseLanguage: "Choose your language",
    languageInstructions: "Select a language to browse available resources.",
    englishBrowse: "Browse English resources",
    spanishBrowse: "Ver recursos en español",
    collection: "Resource collection",
    resources: "Resources",
    changeLanguage: "Change language",
    searchLabel: "Search resources",
    searchPlaceholder: "Search by title or keyword...",
    topic: "Topic",
    allTopics: "All topics",
    resourceType: "Resource type",
    allTypes: "All types",
    clearFilters: "Clear filters",
    noResults: "No resources match your search. Try changing your filters.",
    resourceOne: "resource found",
    resourceMany: "resources found",
    openDownload: "Open / download",
    download: "Download",
    error: "The resource list could not be loaded. Please try again later.",
    categories: {
      "online-safety": "Online Safety",
      "scams-and-fraud": "Scams and Fraud",
      "digital-literacy": "Digital Literacy",
      "internet-access": "Internet Access"
    },
    footer: "Community Digital Resource Library"
  },

  spanish: {
    siteTitle: "Biblioteca Comunitaria de Recursos Digitales",
    headerNote: "Recursos comunitarios gratuitos",
    eyebrow: "Aprende • Conéctate • Mantente seguro",
    mainHeading: "Biblioteca de Recursos Digitales",
    intro: "Explora guías prácticas, materiales informativos e información para ayudarte a utilizar la tecnología, mantenerte seguro en línea y acceder a servicios digitales.",
    chooseLanguage: "Elige tu idioma",
    languageInstructions: "Selecciona un idioma para explorar los recursos disponibles.",
    englishBrowse: "Browse English resources",
    spanishBrowse: "Ver recursos en español",
    collection: "Colección de recursos",
    resources: "Recursos",
    changeLanguage: "Cambiar idioma",
    searchLabel: "Buscar recursos",
    searchPlaceholder: "Buscar por título o palabra clave...",
    topic: "Tema",
    allTopics: "Todos los temas",
    resourceType: "Tipo de recurso",
    allTypes: "Todos los tipos",
    clearFilters: "Borrar filtros",
    noResults: "No hay recursos que coincidan con tu búsqueda. Intenta cambiar los filtros.",
    resourceOne: "recurso encontrado",
    resourceMany: "recursos encontrados",
    openDownload: "Abrir / descargar",
    download: "Descargar",
    error: "No se pudo cargar la lista de recursos. Inténtalo de nuevo más tarde.",
    categories: {
      "online-safety": "Seguridad en línea",
      "scams-and-fraud": "Estafas y fraudes",
      "digital-literacy": "Alfabetización digital",
      "internet-access": "Acceso a Internet"
    },
    footer: "Biblioteca Comunitaria de Recursos Digitales"
  }
};

const resourceTypes = {
  english: {
    "Guide": "Guía",
    "Flyer": "Volante",
    "Handout": "Material informativo",
    "Article": "Artículo",
    "Bookmark": "Marcador",
    "Infographic": "Infografía",
    "Resource": "Recurso"
  },
  spanish: {
    "Guide": "Guía",
    "Flyer": "Volante",
    "Handout": "Material informativo",
    "Article": "Artículo",
    "Bookmark": "Marcador",
    "Infographic": "Infografía",
    "Resource": "Recurso"
  }
};

function translatePage() {
  const t = translations[selectedLanguage];

  document.documentElement.lang = selectedLanguage === "spanish" ? "es" : "en";

  document.getElementById("site-title").textContent = t.siteTitle;
  document.getElementById("header-note").textContent = t.headerNote;
  document.querySelector(".intro .eyebrow").textContent = t.eyebrow;
  document.getElementById("main-heading").textContent = t.mainHeading;
  document.getElementById("intro-text").textContent = t.intro;
  document.getElementById("choose-language").textContent = t.chooseLanguage;
  document.getElementById("language-instructions").textContent = t.languageInstructions;
  document.querySelector('[data-language="english"] small').textContent = t.englishBrowse;
  document.querySelector('[data-language="spanish"] small').textContent = t.spanishBrowse;
  document.getElementById("collection-label").textContent = t.collection;
  document.getElementById("change-language").textContent = t.changeLanguage;
  document.getElementById("search-label").textContent = t.searchLabel;
  searchInput.placeholder = t.searchPlaceholder;
  document.getElementById("topic-label").textContent = t.topic;
  document.getElementById("type-label").textContent = t.resourceType;
  document.getElementById("clear-filters").textContent = t.clearFilters;
  emptyMessage.textContent = t.noResults;
  errorMessage.textContent = t.error;
  document.getElementById("footer-title").textContent = t.footer;

  languageHeading.textContent = selectedLanguage === "spanish"
    ? "Recursos en Español"
    : "English Resources";
}

async function loadResources() {
  try {
    const response = await fetch("./data/resources.json");

    if (!response.ok) {
      throw new Error("Could not load resource data.");
    }

    resources = await response.json();
  } catch (error) {
    console.error("Resource loading error:", error);
    errorMessage.hidden = false;
  }
}

function chooseLanguage(language) {
  selectedLanguage = language;

  languageSection.hidden = true;
  librarySection.hidden = false;

  translatePage();

  searchInput.value = "";
  categoryFilter.value = "";
  typeFilter.value = "";

  populateFilters();
  displayResources();
}

function populateFilters() {
  const t = translations[selectedLanguage];

  const languageResources = resources.filter(
    item => item.language === selectedLanguage
  );

  const availableCategories = [...new Set(
    languageResources.map(item => item.category)
  )];

  const availableTypes = [...new Set(
    languageResources.map(item => item.type)
  )];

  categoryFilter.replaceChildren();
  typeFilter.replaceChildren();

  const allTopics = document.createElement("option");
  allTopics.value = "";
  allTopics.textContent = t.allTopics;
  categoryFilter.appendChild(allTopics);

  const allTypes = document.createElement("option");
  allTypes.value = "";
  allTypes.textContent = t.allTypes;
  typeFilter.appendChild(allTypes);

  availableCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = t.categories[category] || category;
    categoryFilter.appendChild(option);
  });

  availableTypes.forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent =
      resourceTypes[selectedLanguage][type] || type;
    typeFilter.appendChild(option);
  });
}

function displayResources() {
  const t = translations[selectedLanguage];

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
      categoriesText(item.category, selectedLanguage)
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
    type.textContent =
      resourceTypes[selectedLanguage][item.type] || item.type;

    const title = document.createElement("h3");
    title.textContent = item.title;

    const description = document.createElement("p");
    description.textContent = item.description || "";

    const meta = document.createElement("div");
    meta.className = "resource-meta";
    meta.textContent = categoriesText(item.category, selectedLanguage);

    const actions = document.createElement("div");
    actions.className = "resource-actions";

    const viewLink = document.createElement("a");
    viewLink.href = item.file;
    viewLink.target = "_blank";
    viewLink.rel = "noopener noreferrer";
    viewLink.textContent = t.openDownload;

    const downloadLink = document.createElement("a");
    downloadLink.href = item.file;
    downloadLink.download = "";
    downloadLink.textContent = t.download;

    actions.append(viewLink, downloadLink);
    card.append(type, title, description, meta, actions);
    resourceList.appendChild(card);
  });

  resultCount.textContent =
    filtered.length + " " +
    (filtered.length === 1 ? t.resourceOne : t.resourceMany);

  emptyMessage.hidden = filtered.length !== 0;
}

function categoriesText(category, language) {
  return translations[language].categories[category] || category;
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
  document.documentElement.lang = "en";
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
