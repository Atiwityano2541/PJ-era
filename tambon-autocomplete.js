class TambonAutocomplete {
    constructor(searchInputId, suggestionsListId, onSelect) {
        this.searchInput = document.getElementById(searchInputId);
        this.suggestionsList = document.getElementById(suggestionsListId);
        this.onSelect = onSelect;
        this.tambonFeatures = [];
        this.setupEventListeners();
    }

    setFeatures(features) {
        this.tambonFeatures = features.map(feature => ({
            ...feature,
            properties: {
                ...feature.properties,
                displayName: this.removeDuplicateWords(feature.properties.AMP_NAME_T)
            }
        }));
    }

    removeDuplicateWords(text) {
        const words = text.split(' ');
        return [...new Set(words)].join(' ');
    }

    calculateCentroid(coordinates) {
        if (!coordinates || coordinates.length === 0) return null;
        
        let sumX = 0;
        let sumY = 0;
        let pointCount = 0;

        coordinates[0].forEach(coord => {
            sumX += coord[0];
            sumY += coord[1];
            pointCount++;
        });

        return [sumX / pointCount, sumY / pointCount];
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', (e) => {
            this.handleInput(e.target.value);
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.autocomplete-container')) {
                this.clearSuggestions();
            }
        });

        this.searchInput.addEventListener('keydown', (e) => {
            const items = this.suggestionsList.querySelectorAll('li');
            const activeItem = this.suggestionsList.querySelector('li.active');
            let index = Array.from(items).indexOf(activeItem);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (index < items.length - 1) {
                    if (activeItem) activeItem.classList.remove('active');
                    items[index + 1].classList.add('active');
                    items[index + 1].scrollIntoView({ block: 'nearest' });
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (index > 0) {
                    if (activeItem) activeItem.classList.remove('active');
                    items[index - 1].classList.add('active');
                    items[index - 1].scrollIntoView({ block: 'nearest' });
                }
            } else if (e.key === 'Enter' && activeItem) {
                e.preventDefault();
                this.handleSelection(activeItem.dataset.originalName, activeItem.textContent);
            }
        });
    }

    handleInput(searchText) {
        searchText = searchText.toLowerCase();
        this.clearSuggestions();
        
        if (searchText.length < 2) return;

        const matches = this.tambonFeatures
            .filter(feature => 
                feature.properties.displayName.toLowerCase().includes(searchText) ||
                feature.properties.AMP_NAME_T.toLowerCase().includes(searchText)
            )
            .slice(0, 5);

        this.displaySuggestions(matches);
    }

    displaySuggestions(matches) {
        matches.forEach((feature, index) => {
            const li = document.createElement('li');
            li.textContent = feature.properties.displayName;
            li.dataset.originalName = feature.properties.AMP_NAME_T;
            if (index === 0) li.classList.add('active');
            li.addEventListener('click', () => {
                this.handleSelection(feature.properties.AMP_NAME_T, feature.properties.displayName);
            });
            this.suggestionsList.appendChild(li);
        });
    }

    handleSelection(originalName, displayName) {
        this.searchInput.value = displayName;
        this.clearSuggestions();
        
        const selectedFeature = this.tambonFeatures.find(
            feature => feature.properties.AMP_NAME_T === originalName
        );

        if (selectedFeature && selectedFeature.geometry) {
            const centroid = this.calculateCentroid(selectedFeature.geometry.coordinates);
            if (this.onSelect) {
                this.onSelect(originalName, centroid);
            }
        }
    }

    clearSuggestions() {
        this.suggestionsList.innerHTML = '';
    }
}

export default TambonAutocomplete;