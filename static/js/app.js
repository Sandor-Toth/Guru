let allDescription = []; // Az összes tutorial tárolására
let csvPath = ''; // Alapértelmezett CSV útvonal


// Exportáljuk az inicializáló függvényt
export function initApp(customCsvPath) {
    if (customCsvPath) {
        setCSVPath(customCsvPath);
    }
    document.addEventListener('DOMContentLoaded', loadTutorials);
}


// CSV útvonal beállítása
function setCSVPath(path) {
    csvPath = path;
}


// CSV fájl beolvasása és feldolgozása
async function loadTutorials() {
    try {
        const response = await fetch(csvPath);
        const data = await response.text();
        allDescription = parseCSV(data);
        displayTutorials(allDescription);
        setupSearch();
    } catch (error) {
        console.error('Hiba történt a CSV fájl betöltése során:', error);
    }
}


// CSV string feldolgozása objektumok tömbjévé
function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(';');
    return lines.slice(1).map(line => {
        const values = line.split(';');
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index].trim();
            return obj;
        }, {});
    });
}

// Tutorialok megjelenítése a DOM-ban
function displayTutorials(descriptions) {
    const container = document.getElementById('app-container');
    container.innerHTML = ''; // Töröljük a meglévő tartalmat
    descriptions.forEach(tutorial => {
        const card = createTutorialCard(tutorial);
        container.appendChild(card);
    });
}


// Tutorial kártya létrehozása
function createTutorialCard(tutorial) {
    const card = document.createElement('div');
    card.className = 'col-6 mb-4';
    const tagsArray = typeof tutorial.tags === 'string' ? tutorial.tags.split(',') : tutorial.tags;
    const tagBadges = tagsArray.map(tag => `
        <span class="fw-normal border border-dark rounded-3 p-1 small">${tag}</span>
    `).join(' ');
    
    card.innerHTML = `
        <div class="card">
            <h5 class="card-header">
                ${tutorial.col_title}
            </h5>
            <div class="card-body">
                <p class="card-text border rounded-3 p-3 text-truncate fs-6">${tutorial.short_description}</p>
                <div class="position-relative">
                    <pre class="bg-secondary border rounded-3 p-3 text-white"><code>${tutorial.command}</code></pre>
                    <button class="btn btn-sm primary position-absolute top-50 end-0 me-3 translate-middle-y copy-btn" data-code="${encodeURIComponent(tutorial.command)}">
                        Másolás
                    </button>
                </div>
            </div>
            <div class="card-footer text-body-secondary d-flex justify-content-between align-items-center">
                <p class="card-text m-0"><span class="text-muted">${tagBadges} </span></p>
                <a href="#" class="btn btn-sm primary h-100" data-bs-toggle="modal"
                    data-bs-target="#tutorial-${tutorial.col_id}">
                    Részletek
                </a>
            </div>
        </div>
    `;

    // Másolás gomb funkció hozzáadása
    const copyBtn = card.querySelector('.copy-btn');
    copyBtn.addEventListener('click', function() {
        const codeToCopy = decodeURIComponent(this.getAttribute('data-code'));
        navigator.clipboard.writeText(codeToCopy).then(() => {
            // Opcionális: visszajelzés a felhasználónak
            this.textContent = 'Másolva!';
            setTimeout(() => this.textContent = 'Másolás', 2000);
        }).catch(err => {
            console.error('Hiba a másolás során:', err);
        });
    });

    
    
    // Modal létrehozása a részletekhez
    const modal = createTutorialModal(tutorial);
    document.body.appendChild(modal);
    
    return card;
}

// Tutorial modal létrehozása
function createTutorialModal(tutorial) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = `tutorial-${tutorial.col_id}`;
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${tutorial.col_title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>${tutorial.long_description}</p>
                    <h6>Kód példa:</h6>
                    <pre><code>${tutorial.programming_code}</code></pre>

                    <div class="text-center">
                        <a href="${tutorial.image_path}" target="_blank" class="">
                        
                            <img src="${tutorial.image_path}" class="img-fluid mb-2" style="max-height: 300px;">
                        </a>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Bezárás</button>
                </div>
            </div>
        </div>
    `;
    return modal;
}

// Keresési funkció beállítása
function setupSearch() {
    const tagSearchInput = document.getElementById('tag-search');
    const contentSearchInput = document.getElementById('content-search');

    function performSearch() {
        const tagSearchTerm = tagSearchInput.value.toLowerCase();
        const contentSearchTerm = contentSearchInput.value.toLowerCase();

        const filteredTutorials = allDescription.filter(tutorial => 
            (tutorial.tags.toLowerCase().includes(tagSearchTerm) || tagSearchTerm === '') &&
            (tutorial.col_title.toLowerCase().includes(contentSearchTerm) ||
             tutorial.description.toLowerCase().includes(contentSearchTerm) ||
             contentSearchTerm === '')
        );

        displayTutorials(filteredTutorials);
    }

    tagSearchInput.addEventListener('input', performSearch);
    contentSearchInput.addEventListener('input', performSearch);
}

// CSV betöltése az oldal betöltődésekor
document.addEventListener('DOMContentLoaded', loadTutorials);