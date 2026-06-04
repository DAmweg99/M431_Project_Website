// ════════════════════════════════════════════════════════════
//  Food Atelier – Frontend API Integration
// ════════════════════════════════════════════════════════════

// Relative URL – funktioniert lokal (localhost:8000) und in der Cloud
const API_BASE = "/api";
const IMG_BASE = "/uploads";

// ── Bild-URL aus gespeichertem Pfad ──────────────────────────────
function getImageUrl(imagePath) {
    if (!imagePath) return null;
    // Extrahiert nur den Dateinamen aus dem vollen Serverpfad
    const filename = imagePath.split(/[\\/]/).pop();
    return `${IMG_BASE}/${filename}`;
}

// ── API-Aufruf Helfer ─────────────────────────────────────────────
async function apiFetch(path) {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`API Fehler ${res.status}`);
    return res.json();
}

// ── HTML-Escaping (sicheres Einsetzen von Werten) ─────────────────
function escapeHtml(s) {
    return String(s == null ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(s) {
    return escapeHtml(s).replace(/"/g, "&quot;");
}


// ════════════════════════════════════════════════════════════
//  POPUP
// ════════════════════════════════════════════════════════════

function closePopup() {
    document.getElementById("popup").style.display = "none";
}


// ════════════════════════════════════════════════════════════
//  REZEPT-KARTE (für die Grid-Ansicht)
// ════════════════════════════════════════════════════════════

function createRecipeCard(recipe) {
    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
    const imgUrl   = getImageUrl(recipe.image_path);

    return `
        <article class="recipe-card" onclick="location.href='recipe.html?id=${recipe.id}'">
            <div class="card-image">
                ${imgUrl
                    ? `<img src="${imgUrl}" alt="${recipe.title}" onerror="this.parentElement.innerHTML='<div class=\\'card-no-image\\'>🍽️</div>'">`
                    : `<div class="card-no-image">🍽️</div>`
                }
                ${recipe.category ? `<span class="card-tag">${recipe.category}</span>` : ""}
            </div>
            <div class="card-body">
                <h3>${recipe.title}</h3>
                <p class="card-description">${recipe.description || ""}</p>
                <div class="card-meta">
                    ${totalTime ? `<span>⏱ ${totalTime} Min.</span>` : ""}
                    ${recipe.servings ? `<span>👥 ${recipe.servings} Port.</span>` : ""}
                </div>
            </div>
        </article>
    `;
}


// ════════════════════════════════════════════════════════════
//  INDEX – Featured Recipe
// ════════════════════════════════════════════════════════════

async function loadFeaturedRecipe() {
    const section = document.getElementById("featured-section");
    if (!section) return;

    try {
        const recipes = await apiFetch("/recipes/?limit=1");

        if (!recipes.length) {
            section.style.display = "none";
            return;
        }

        const r      = recipes[0];
        const imgUrl = getImageUrl(r.image_path);
        const time   = (r.prep_time || 0) + (r.cook_time || 0);

        section.innerHTML = `
            <div class="recipe-image">
                ${imgUrl
                    ? `<img src="${imgUrl}" alt="${r.title}">`
                    : `<div class="featured-no-image">🍽️</div>`
                }
            </div>
            <div class="recipe-info">
                <span class="recipe-tag">Rezept der Woche</span>
                <h2>${r.title}</h2>
                <p>${r.description || ""}</p>
                <div class="featured-meta">
                    ${time          ? `<span>⏱ ${time} Min.</span>`       : ""}
                    ${r.servings    ? `<span>👥 ${r.servings} Portionen</span>` : ""}
                    ${r.category    ? `<span>🏷 ${r.category}</span>`      : ""}
                </div>
                <a href="recipe.html?id=${r.id}" class="recipe-button">
                    Ich will das au choche!
                </a>
            </div>
        `;
    } catch {
        // Falls API nicht läuft – statischer Fallback
        section.innerHTML = `
            <div class="recipe-image">
                <img src="images/WhatsApp Image 2026-05-11 at 15.05.21.jpeg" alt="Lachsfilet">
            </div>
            <div class="recipe-info">
                <span class="recipe-tag">Rezept der Woche</span>
                <h2>Der Sommerlicher Hit</h2>
                <p>Lachsfilet mit Zitronenbutter und grilliertem Spargel,
                   Pfirsich Ragout dazu Kräuterspätzli.</p>
                <a href="#" class="recipe-button">Ich will das au choche!</a>
            </div>
        `;
    }
}


// ════════════════════════════════════════════════════════════
//  MENÜART – Kategorie-Karten Klick-Handler
// ════════════════════════════════════════════════════════════

// Aktuell aktive Kategorie merken
let activeCategory = "";

function filterByCategory(category) {
    const cards     = document.querySelectorAll(".menuart-card");
    const gridTitle = document.getElementById("grid-title");
    const clicked   = [...cards].find(c => c.querySelector("span")?.textContent === category);

    // Toggle: gleiche Kategorie nochmal → alles anzeigen
    if (activeCategory === category) {
        activeCategory = "";
        cards.forEach(c => c.classList.remove("active-category"));
        if (gridTitle) gridTitle.textContent = "Alle Rezepte";
        loadRecipes("");
        return;
    }

    // Neue Kategorie aktivieren
    activeCategory = category;
    cards.forEach(c => c.classList.remove("active-category"));
    if (clicked) clicked.classList.add("active-category");
    if (gridTitle) gridTitle.textContent = category;

    scrollToRecipes();
    loadRecipes(category);
}

function scrollToRecipes() {
    const target = document.getElementById("rezepte-anker")
                || document.querySelector(".all-recipes-section");
    if (!target) return;

    const rect = target.getBoundingClientRect();
    // Nur scrollen wenn das Grid noch nicht im sichtbaren Bereich ist
    if (rect.top < -50 || rect.top > window.innerHeight) {
        const offset = rect.top + window.scrollY - 20;
        window.scrollTo({ top: offset, behavior: "smooth" });
    }
}


// ════════════════════════════════════════════════════════════
//  INDEX – Rezept-Grid & Kategorie-Filter
// ════════════════════════════════════════════════════════════

async function loadRecipes(category = "") {
    const grid     = document.getElementById("recipe-grid");
    const noResult = document.getElementById("no-results");
    if (!grid) return;

    // 1. Aktuelle Höhe einfrieren damit kein Layout-Sprung entsteht
    grid.style.minHeight = grid.offsetHeight + "px";

    // 2. Ausblenden (fade-out)
    grid.classList.add("fading");
    await new Promise(r => setTimeout(r, 250));

    grid.innerHTML = `<div class="grid-loading"><div class="spinner"></div><p>Laden …</p></div>`;
    grid.classList.remove("fading");

    try {
        const url     = category ? `/recipes/?category=${encodeURIComponent(category)}` : "/recipes/";
        const recipes = await apiFetch(url);

        noResult.style.display = "none";

        if (!recipes.length) {
            grid.innerHTML = "";
            noResult.style.display = "block";
            return;
        }

        // 3. Einblenden – Karten animieren einzeln rein, Höhe wieder freigeben
        grid.style.minHeight = "";
        grid.innerHTML = recipes.map(createRecipeCard).join("");

    } catch {
        grid.style.minHeight = "";
        grid.innerHTML = `
            <div class="api-error">
                <p>⚠️ Backend nicht erreichbar.</p>
                <small>Starte den Server mit: <code>py -m uvicorn backend.main:app --reload</code></small>
            </div>
        `;
    }
}



// ════════════════════════════════════════════════════════════
//  INDEX – Live-Suche mit Dropdown
// ════════════════════════════════════════════════════════════

// Suchbegriff im Titel farbig hervorheben
function highlightMatch(text, query) {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.replace(new RegExp(`(${escaped})`, "gi"), "<mark>$1</mark>");
}

// Dropdown schliessen
function closeSearchDropdown() {
    const box = document.getElementById("search-results");
    if (!box) return;
    box.classList.remove("open");
    box.innerHTML = "";
}

// Dropdown mit Resultaten füllen und anzeigen
async function showSearchDropdown(query) {
    const box = document.getElementById("search-results");
    if (!box) return;

    if (query.length < 2) {
        closeSearchDropdown();
        return;
    }

    // Lade-Indikator
    box.innerHTML = `<div class="search-loading"><div class="spinner-sm"></div></div>`;
    box.classList.add("open");

    try {
        const results = await apiFetch(`/recipes/search?q=${encodeURIComponent(query)}`);

        if (!results.length) {
            box.innerHTML = `
                <div class="search-no-results">
                    😕 Kein Rezept gefunden für <strong>„${query}"</strong>
                </div>`;
            return;
        }

        // Max. 6 Treffer anzeigen
        box.innerHTML = results.slice(0, 6).map(r => {
            const imgUrl = getImageUrl(r.image_path);
            const time   = (r.prep_time || 0) + (r.cook_time || 0);
            return `
                <a class="search-result-item" href="recipe.html?id=${r.id}">
                    ${imgUrl
                        ? `<img src="${imgUrl}" alt="${r.title}">`
                        : `<div class="search-result-emoji">🍽️</div>`
                    }
                    <div class="search-result-info">
                        <strong>${highlightMatch(r.title, query)}</strong>
                        <small>
                            ${r.category  ? `🏷 ${r.category}` : ""}
                            ${time        ? ` &nbsp;·&nbsp; ⏱ ${time} Min.` : ""}
                        </small>
                    </div>
                    <span class="search-result-arrow">→</span>
                </a>
            `;
        }).join("");

        // "Alle Ergebnisse" Link falls mehr als 6
        if (results.length > 6) {
            box.innerHTML += `
                <a class="search-all-link" href="kategorien.html">
                    Alle ${results.length} Ergebnisse anzeigen →
                </a>`;
        }

    } catch {
        box.innerHTML = `<div class="search-no-results">⚠️ Suche nicht verfügbar.</div>`;
    }
}

// Für kategorien.html – Grid-Suche (unverändert)
async function searchRecipes(query) {
    const grid     = document.getElementById("recipe-grid");
    const noResult = document.getElementById("no-results");
    if (!grid) return;

    try {
        const results = await apiFetch(`/recipes/search?q=${encodeURIComponent(query)}`);
        noResult.style.display = "none";
        if (!results.length) {
            grid.innerHTML = "";
            noResult.style.display = "block";
            return;
        }
        grid.innerHTML = results.map(createRecipeCard).join("");
    } catch {
        grid.innerHTML = `<div class="api-error"><p>⚠️ Suche nicht verfügbar.</p></div>`;
    }
}


// ════════════════════════════════════════════════════════════
//  RECIPE.HTML – Detailansicht & Portionen-Rechner
// ════════════════════════════════════════════════════════════

// Status für den Portionen-Rechner
let baseServings    = 1;   // Original-Portionen aus dem Rezept
let currentServings = 1;   // Aktuell gewählte Portionen
let baseIngredients = [];  // Original-Zutaten (Basis für die Skalierung)
let currentRecipe   = null; // Aktuell geladenes Rezept (für den Edit-Modus)

// Skaliert eine Mengenangabe (Freitext) um den Faktor.
// Zahlen am Anfang werden multipliziert, reiner Text bleibt unverändert.
function scaleAmount(amount, factor) {
    if (!amount) return amount;
    const str = String(amount).trim();

    // Bereich, z.B. "2-3 EL"
    let m = str.match(/^(\d+(?:[.,]\d+)?)\s*[-–]\s*(\d+(?:[.,]\d+)?)\s*(.*)$/);
    if (m) {
        const a = parseFloat(m[1].replace(",", ".")) * factor;
        const b = parseFloat(m[2].replace(",", ".")) * factor;
        return `${formatNumber(a)}-${formatNumber(b)}${m[3] ? " " + m[3] : ""}`;
    }

    // Bruch, z.B. "1/2 TL"
    m = str.match(/^(\d+)\s*\/\s*(\d+)\s*(.*)$/);
    if (m) {
        const val = (parseInt(m[1]) / parseInt(m[2])) * factor;
        return `${formatNumber(val)}${m[3] ? " " + m[3] : ""}`;
    }

    // Ganzzahl / Dezimal, z.B. "500 g", "1,5 EL", "2"
    m = str.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
    if (m) {
        const val = parseFloat(m[1].replace(",", ".")) * factor;
        return `${formatNumber(val)}${m[2] ? " " + m[2] : ""}`;
    }

    // Keine Zahl (z.B. "Prise", "etwas", "nach Geschmack") → unverändert
    return str;
}

// Zahl schön formatieren (max. 2 Nachkommastellen, deutsches Komma)
function formatNumber(n) {
    const rounded = Math.round(n * 100) / 100;
    if (Number.isInteger(rounded)) return String(rounded);
    return rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "").replace(".", ",");
}

// Zutaten-HTML für einen bestimmten Skalierungsfaktor bauen
function buildIngredientsHtml(factor) {
    return baseIngredients
        .map(i => `<li><span class="ingredient-amount">${scaleAmount(i.amount, factor)}</span> ${i.name}</li>`)
        .join("");
}

// Portionen per Stepper ändern (− / +)
function changePortions(delta) {
    const next = currentServings + delta;
    if (next < 1 || next > 50) return;
    currentServings = next;

    const factor = currentServings / baseServings;

    const list = document.getElementById("ingredients-list");
    if (list) list.innerHTML = buildIngredientsHtml(factor);

    const count = document.getElementById("portion-count");
    if (count) count.textContent = currentServings;

    const meta = document.getElementById("meta-servings");
    if (meta) meta.textContent = currentServings;
}


async function loadRecipeDetail() {
    const container = document.getElementById("recipe-detail");
    if (!container) return;

    const params   = new URLSearchParams(window.location.search);
    const recipeId = params.get("id");

    if (!recipeId) {
        container.innerHTML = `<p class="detail-error">Kein Rezept ausgewählt.</p>`;
        return;
    }

    try {
        const r      = await apiFetch(`/recipes/${recipeId}`);
        currentRecipe = r;   // für den Edit-Modus merken
        const imgUrl = getImageUrl(r.image_path);
        const prepT  = r.prep_time ? `${r.prep_time} Min.` : "–";
        const cookT  = r.cook_time ? `${r.cook_time} Min.` : "–";

        // Seitentitel anpassen
        document.title = `${r.title} – Food Atelier`;

        // Portionen-Rechner initialisieren
        baseServings    = (r.servings && r.servings > 0) ? r.servings : 1;
        currentServings = baseServings;
        baseIngredients = r.ingredients || [];
        const hasServings = !!(r.servings && r.servings > 0);

        // Zutaten als HTML-Liste (Faktor 1 = Original)
        const ingredientsHtml = buildIngredientsHtml(1);

        // Schritte als nummerierte Liste
        const stepsHtml = (r.instructions || [])
            .map((step, idx) => `
                <li class="step">
                    <span class="step-number">${idx + 1}</span>
                    <p>${step}</p>
                </li>
            `)
            .join("");

        container.innerHTML = `
            <div class="detail-layout">

                <!-- ── Linke Spalte: Senkrechtes Bild ── -->
                <div class="detail-image-col">
                    ${imgUrl
                        ? `<img src="${imgUrl}" alt="${r.title}">`
                        : `<div class="detail-no-image">🍽️</div>`
                    }
                </div>

                <!-- ── Rechte Spalte: Rezeptinhalt ── -->
                <div class="detail-content-col">

                    <header class="detail-header">
                        ${isAdmin() ? `<button class="edit-recipe-btn" onclick="startEditMode()">✏️ Bearbeiten</button>` : ""}
                        ${r.category ? `<span class="recipe-tag">${r.category}</span>` : ""}
                        <h1 class="detail-title">${r.title}</h1>
                        ${r.description ? `<p class="detail-description">${r.description}</p>` : ""}

                        <div class="detail-meta">
                            <div class="meta-item">
                                <span class="meta-icon">⏱</span>
                                <span class="meta-label">Vorbereitung</span>
                                <strong>${prepT}</strong>
                            </div>
                            <div class="meta-item">
                                <span class="meta-icon">🔥</span>
                                <span class="meta-label">Kochzeit</span>
                                <strong>${cookT}</strong>
                            </div>
                            ${r.servings ? `
                            <div class="meta-item">
                                <span class="meta-icon">👥</span>
                                <span class="meta-label">Portionen</span>
                                <strong id="meta-servings">${r.servings}</strong>
                            </div>` : ""}
                        </div>
                    </header>

                    <div class="detail-body">
                        <aside class="ingredients-box">
                            <div class="ingredients-header">
                                <h2>Zutaten</h2>
                                ${hasServings ? `
                                <div class="portion-stepper">
                                    <button type="button" class="portion-btn" onclick="changePortions(-1)" aria-label="Weniger Portionen">−</button>
                                    <span class="portion-display"><strong id="portion-count">${currentServings}</strong>&nbsp;Port.</span>
                                    <button type="button" class="portion-btn" onclick="changePortions(1)" aria-label="Mehr Portionen">+</button>
                                </div>` : ""}
                            </div>
                            ${hasServings ? `<p class="portion-hint">Mengen passen sich automatisch an</p>` : ""}
                            <ul class="ingredients-list" id="ingredients-list">
                                ${ingredientsHtml || "<li>Keine Angabe</li>"}
                            </ul>
                        </aside>

                        <div class="instructions-box">
                            <h2>Zubereitung</h2>
                            <ol class="steps-list">
                                ${stepsHtml || "<li class='step'><span class='step-number'>1</span><p>Keine Angabe</p></li>"}
                            </ol>
                        </div>
                    </div>

                </div>
            </div>
        `;

    } catch (err) {
        container.innerHTML = `
            <div class="detail-error">
                <p>⚠️ Rezept konnte nicht geladen werden.</p>
                <a href="index.html" class="recipe-button">← Zurück</a>
            </div>
        `;
    }
}


// ════════════════════════════════════════════════════════════
//  RECIPE.HTML – Inline-Editiermodus (nur Admin)
// ════════════════════════════════════════════════════════════

function startEditMode() {
    if (!isAdmin() || !currentRecipe) return;
    const r   = currentRecipe;
    const col = document.querySelector(".detail-content-col");
    if (!col) return;

    const categories = ["Fleisch", "Fisch", "Geflügel", "Vegi"];
    // Falls die Rezept-Kategorie nicht in der Liste ist, trotzdem als Option anbieten
    if (r.category && !categories.includes(r.category)) categories.unshift(r.category);

    col.innerHTML = `
        <div class="edit-form">
            <h2 class="edit-form-title">Rezept bearbeiten</h2>

            <div class="form-group">
                <label>Titel</label>
                <input type="text" id="edit-title" value="${escapeAttr(r.title)}">
            </div>

            <div class="form-group">
                <label>Beschreibung</label>
                <textarea id="edit-description" rows="3">${escapeHtml(r.description)}</textarea>
            </div>

            <div class="form-row form-row-3">
                <div class="form-group">
                    <label>Kategorie</label>
                    <select id="edit-category">
                        ${categories.map(c => `<option value="${escapeAttr(c)}" ${r.category === c ? "selected" : ""}>${escapeHtml(c)}</option>`).join("")}
                    </select>
                </div>
                <div class="form-group">
                    <label>👥 Portionen</label>
                    <input type="number" id="edit-servings" min="1" value="${r.servings || ""}">
                </div>
            </div>

            <div class="form-row form-row-3">
                <div class="form-group">
                    <label>⏱ Vorbereitung (Min.)</label>
                    <input type="number" id="edit-prep" min="0" value="${r.prep_time || ""}">
                </div>
                <div class="form-group">
                    <label>🔥 Kochzeit (Min.)</label>
                    <input type="number" id="edit-cook" min="0" value="${r.cook_time || ""}">
                </div>
            </div>

            <div class="form-group">
                <label>Zutaten</label>
                <div id="edit-ingredients"></div>
                <button type="button" class="add-row-btn" onclick="addEditIngredient()">+ Zutat hinzufügen</button>
            </div>

            <div class="form-group">
                <label>Zubereitung</label>
                <ol id="edit-steps" class="steps-form-list"></ol>
                <button type="button" class="add-row-btn" onclick="addEditStep()">+ Schritt hinzufügen</button>
            </div>

            <div class="admin-toast" id="edit-toast"></div>

            <div class="edit-actions">
                <button type="button" class="cancel-btn" onclick="loadRecipeDetail()">Abbrechen</button>
                <button type="button" class="submit-btn" id="edit-save-btn" onclick="saveRecipeEdit()">💾 Speichern</button>
            </div>
        </div>
    `;

    // Zutaten vorbefüllen
    const ings = r.ingredients || [];
    if (ings.length) ings.forEach(i => addEditIngredient(i.amount, i.name));
    else addEditIngredient();

    // Schritte vorbefüllen
    const steps = r.instructions || [];
    if (steps.length) steps.forEach(s => addEditStep(s));
    else addEditStep();

    col.scrollIntoView({ behavior: "smooth", block: "start" });
}

function addEditIngredient(amount = "", name = "") {
    const list = document.getElementById("edit-ingredients");
    if (!list) return;
    const row = document.createElement("div");
    row.className = "ingredient-row";
    row.innerHTML = `
        <input type="text" class="ing-amount" placeholder="Menge" value="${escapeAttr(amount)}">
        <input type="text" class="ing-name" placeholder="Zutat" value="${escapeAttr(name)}">
        <button type="button" class="remove-btn" onclick="this.closest('.ingredient-row').remove()">×</button>
    `;
    list.appendChild(row);
}

function addEditStep(text = "") {
    const list = document.getElementById("edit-steps");
    if (!list) return;
    const item = document.createElement("li");
    item.className = "step-form-item";
    item.innerHTML = `
        <span class="step-form-number">${list.children.length + 1}</span>
        <textarea rows="2" placeholder="Schritt beschreiben…">${escapeHtml(text)}</textarea>
        <button type="button" class="remove-btn" onclick="this.closest('.step-form-item').remove(); renumberEditSteps();">×</button>
    `;
    list.appendChild(item);
}

function renumberEditSteps() {
    document.querySelectorAll("#edit-steps .step-form-number")
        .forEach((el, i) => { el.textContent = i + 1; });
}

async function saveRecipeEdit() {
    if (!currentRecipe) return;
    const btn   = document.getElementById("edit-save-btn");
    const toast = document.getElementById("edit-toast");

    const ingredients = [...document.querySelectorAll("#edit-ingredients .ingredient-row")]
        .map(row => ({
            amount: row.querySelector(".ing-amount").value.trim(),
            name:   row.querySelector(".ing-name").value.trim(),
        }))
        .filter(i => i.name);

    const instructions = [...document.querySelectorAll("#edit-steps textarea")]
        .map(t => t.value.trim())
        .filter(s => s);

    const payload = {
        title:       document.getElementById("edit-title").value.trim(),
        description: document.getElementById("edit-description").value.trim(),
        category:    document.getElementById("edit-category").value,
        servings:    parseInt(document.getElementById("edit-servings").value) || null,
        prep_time:   parseInt(document.getElementById("edit-prep").value)     || null,
        cook_time:   parseInt(document.getElementById("edit-cook").value)     || null,
        ingredients,
        instructions,
    };

    if (btn) { btn.disabled = true; btn.textContent = "⏳ Speichern…"; }

    try {
        const res = await fetch(`${API_BASE}/recipes/${currentRecipe.id}`, {
            method:  "PUT",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(payload),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || "Speichern fehlgeschlagen");
        }
        // Erfolg → Detailansicht frisch laden
        loadRecipeDetail();
    } catch (e) {
        if (toast) { toast.className = "admin-toast error"; toast.textContent = `❌ ${e.message}`; }
        if (btn)   { btn.disabled = false; btn.textContent = "💾 Speichern"; }
    }
}


// ════════════════════════════════════════════════════════════
//  INIT – je nach Seite die richtige Funktion starten
// ════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {

    const hasFeatured   = document.getElementById("featured-section") !== null;
    const hasRecipeGrid = document.getElementById("recipe-grid")      !== null;
    const hasSearch     = document.getElementById("search-input")     !== null;
    const isDetail      = document.getElementById("recipe-detail")    !== null;

    // ── Featured Rezept (index.html) ─────────────────────────
    if (hasFeatured) {
        loadFeaturedRecipe();
    }

    // ── Rezept-Grid (kategorien.html) ────────────────────────
    if (hasRecipeGrid) {
        loadRecipes();
    }

    // ── Suchfeld mit Dropdown (index.html) ──────────────────
    if (hasSearch) {
        const searchInput = document.getElementById("search-input");
        let debounceTimer;

        // Beim Tippen → Dropdown öffnen
        searchInput.addEventListener("input", e => {
            clearTimeout(debounceTimer);
            const query = e.target.value.trim();
            debounceTimer = setTimeout(() => showSearchDropdown(query), 300);
        });

        // Escape → Dropdown schliessen, Input leeren
        searchInput.addEventListener("keydown", e => {
            if (e.key === "Escape") {
                closeSearchDropdown();
                searchInput.value = "";
            }
        });

        // Klick ausserhalb → Dropdown schliessen
        document.addEventListener("click", e => {
            const searchBox = document.querySelector(".search-box");
            if (searchBox && !searchBox.contains(e.target)) {
                closeSearchDropdown();
            }
        });

        // Fokus → falls schon Text drin → Dropdown wieder zeigen
        searchInput.addEventListener("focus", e => {
            if (e.target.value.trim().length >= 2) {
                showSearchDropdown(e.target.value.trim());
            }
        });
    }

    if (isDetail) {
        // ── Rezept-Detailseite ───────────────────────────────
        loadRecipeDetail();
    }

    if (document.getElementById("recipe-form")) {
        // ── Admin-Seite ──────────────────────────────────────
        initAdminForm();
    }
});


// ════════════════════════════════════════════════════════════
//  ADMIN – Login
// ════════════════════════════════════════════════════════════

const ADMIN_PASSWORD = "FoodAtelier2026";   // ← Passwort hier ändern
const SESSION_KEY    = "fa_admin_auth";

// Ist der aktuelle Besucher als Admin angemeldet?
function isAdmin() {
    return localStorage.getItem(SESSION_KEY) === "1";
}

function checkAdminPassword(event) {
    event.preventDefault();
    const input = document.getElementById("admin-password-input").value;
    const error = document.getElementById("admin-login-error");

    if (input === ADMIN_PASSWORD) {
        localStorage.setItem(SESSION_KEY, "1");
        showAdminContent();
    } else {
        error.textContent = "❌ Falsches Passwort";
        document.getElementById("admin-password-input").value = "";
        document.getElementById("admin-password-input").focus();
    }
}

function showAdminContent() {
    document.getElementById("admin-login-overlay").style.display = "none";
    document.getElementById("admin-content").style.display       = "block";
}


// ════════════════════════════════════════════════════════════
//  ADMIN – Rezept erfassen
// ════════════════════════════════════════════════════════════

function initAdminForm() {
    // Bereits eingeloggt? → direkt zeigen
    if (isAdmin()) {
        showAdminContent();
    }
    addIngredientRow();   // 1 leere Zeile zu Beginn
    addInstructionStep(); // 1 leerer Schritt zu Beginn

    // Drag & Drop auf Upload-Area
    const area = document.getElementById("image-upload-area");
    area.addEventListener("dragover",  e => { e.preventDefault(); area.style.borderColor = "#88a63d"; });
    area.addEventListener("dragleave", () => { area.style.borderColor = ""; });
    area.addEventListener("drop", e => {
        e.preventDefault();
        area.style.borderColor = "";
        const file = e.dataTransfer.files[0];
        if (file) applyImagePreview(file);
    });
}

// ── Zutat hinzufügen ─────────────────────────────────────────
function addIngredientRow() {
    const list = document.getElementById("ingredients-list");
    const row  = document.createElement("div");
    row.className = "ingredient-row";
    row.innerHTML = `
        <input type="text" placeholder="Menge (z.B. 200g)" class="ing-amount">
        <input type="text" placeholder="Zutat (z.B. Spaghetti)"  class="ing-name">
        <button type="button" class="remove-btn" onclick="removeRow(this)" title="Entfernen">×</button>
    `;
    list.appendChild(row);
    row.querySelector(".ing-amount").focus();
}

// ── Schritt hinzufügen ───────────────────────────────────────
function addInstructionStep() {
    const list  = document.getElementById("steps-list");
    const index = list.children.length + 1;
    const item  = document.createElement("li");
    item.className = "step-form-item";
    item.innerHTML = `
        <span class="step-form-number">${index}</span>
        <textarea placeholder="Schritt ${index} beschreiben…" rows="2"></textarea>
        <button type="button" class="remove-btn" onclick="removeRow(this)" title="Entfernen">×</button>
    `;
    list.appendChild(item);
    item.querySelector("textarea").focus();
    updateStepNumbers();
}

// ── Zeile / Schritt entfernen ────────────────────────────────
function removeRow(btn) {
    btn.closest(".ingredient-row, .step-form-item").remove();
    updateStepNumbers();
}

function updateStepNumbers() {
    document.querySelectorAll(".step-form-number").forEach((el, i) => {
        el.textContent = i + 1;
    });
    document.querySelectorAll(".step-form-item textarea").forEach((el, i) => {
        el.placeholder = `Schritt ${i + 1} beschreiben…`;
    });
}

// ── Bild Vorschau ────────────────────────────────────────────
function handleImagePreview(input) {
    if (input.files && input.files[0]) {
        applyImagePreview(input.files[0]);
    }
}

function applyImagePreview(file) {
    const input = document.getElementById("f-image");

    // DataTransfer trick: Datei aus Drag & Drop ins file input setzen
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;

    const reader = new FileReader();
    reader.onload = e => {
        const area    = document.getElementById("image-upload-area");
        const preview = document.getElementById("image-preview");
        preview.src   = e.target.result;
        area.classList.add("has-image");
    };
    reader.readAsDataURL(file);
}

// ── Formular absenden ────────────────────────────────────────
async function submitRecipe(event) {
    event.preventDefault();

    const btn = document.getElementById("submit-btn");
    btn.disabled    = true;
    btn.textContent = "⏳ Wird gespeichert…";

    // Daten aus Formular lesen
    const title       = document.getElementById("f-title").value.trim();
    const category    = document.getElementById("f-category").value;
    const description = document.getElementById("f-description").value.trim();
    const servings    = parseInt(document.getElementById("f-servings").value) || null;
    const prep_time   = parseInt(document.getElementById("f-prep").value)     || null;
    const cook_time   = parseInt(document.getElementById("f-cook").value)     || null;

    // Zutaten
    const ingredients = [...document.querySelectorAll(".ingredient-row")]
        .map(row => ({
            amount: row.querySelector(".ing-amount").value.trim(),
            name:   row.querySelector(".ing-name").value.trim(),
        }))
        .filter(i => i.name);

    // Schritte
    const instructions = [...document.querySelectorAll(".step-form-item textarea")]
        .map(ta => ta.value.trim())
        .filter(s => s);

    try {
        // 1. Rezept anlegen
        const res = await fetch(`${API_BASE}/recipes/`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ title, category, description, servings, prep_time, cook_time, ingredients, instructions }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Fehler beim Speichern");
        }

        const recipe = await res.json();

        // 2. Bild hochladen (falls vorhanden)
        const imageFile = document.getElementById("f-image").files[0];
        if (imageFile) {
            const form = new FormData();
            form.append("file", imageFile);
            await fetch(`${API_BASE}/recipes/${recipe.id}/image`, { method: "POST", body: form });
        }

        // Erfolg anzeigen
        showToast(`✅ Rezept „${recipe.title}" wurde gespeichert! <a href="recipe.html?id=${recipe.id}">Jetzt ansehen →</a>`, "success");
        document.getElementById("recipe-form").reset();
        document.getElementById("image-upload-area").classList.remove("has-image");
        document.getElementById("ingredients-list").innerHTML = "";
        document.getElementById("steps-list").innerHTML       = "";
        addIngredientRow();
        addInstructionStep();

    } catch (err) {
        showToast(`❌ ${err.message}`, "error");
    } finally {
        btn.disabled    = false;
        btn.textContent = "💾 Rezept speichern";
    }
}

function showToast(html, type) {
    const toast   = document.getElementById("admin-toast");
    toast.innerHTML  = html;
    toast.className  = `admin-toast ${type}`;
    toast.scrollIntoView({ behavior: "smooth", block: "center" });
}
