// Resources Page JavaScript - Firebase Integration

let resourcesData = {};
let allResources = [];
let filteredResources = [];
let currentPage = 1;
const resourcesPerPage = 10;
let searchQuery = '';

// Check if Firebase is configured
function checkFirebaseConfig() {
    if (typeof firebase === 'undefined' || typeof resourcesRef === 'undefined') {
        console.error('Firebase not configured. Please set up firebase-config.js');
        const resourcesGrid = document.getElementById('resourcesGrid');
        resourcesGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-exclamation-triangle text-6xl text-orange-400 mb-4"></i>
                <p class="text-xl text-gray-600 font-semibold mb-2">Firebase Configuration Required</p>
                <p class="text-gray-500 mb-4">Please configure Firebase to load resources.</p>
                <a href="FIREBASE_SETUP.md" target="_blank" class="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                    View Setup Guide
                </a>
            </div>
        `;
        return false;
    }
    return true;
}

// Load resources from Firebase
function loadResources() {
    if (!checkFirebaseConfig()) return;
    
    resourcesRef.on('value', (snapshot) => {
        const resources = snapshot.val();
        resourcesData = resources || {};

        if (!resources) {
            document.getElementById('resourcesGrid').innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
                    <p class="text-xl text-gray-600 font-semibold">No resources available yet</p>
                    <p class="text-gray-500 mt-2">Check back soon for learning materials!</p>
                </div>
            `;
            return;
        }

        // Convert to array and sort by creation date (newest first)
        allResources = Object.keys(resources).map(key => ({
            id: key,
            ...resources[key]
        })).sort((a, b) => b.createdAt - a.createdAt);

        filteredResources = [...allResources];
        
        // Initialize search functionality
        initializeSearch();
        
        // Display first page
        displayPage(1);
    }, (error) => {
        console.error('Error loading resources:', error);
        document.getElementById('resourcesGrid').innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
                <p class="text-xl text-gray-600 font-semibold">Error loading resources</p>
                <p class="text-gray-500 mt-2">${error.message}</p>
                <button onclick="location.reload()" class="mt-4 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                    Retry
                </button>
            </div>
        `;
    });
}

// Display specific page of resources
function displayPage(page) {
    currentPage = page;
    const resourcesGrid = document.getElementById('resourcesGrid');
    resourcesGrid.innerHTML = '';
    
    const startIndex = (page - 1) * resourcesPerPage;
    const endIndex = startIndex + resourcesPerPage;
    const pageResources = filteredResources.slice(startIndex, endIndex);
    
    if (pageResources.length === 0) {
        resourcesGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                <p class="text-xl text-gray-600 font-semibold">No resources found</p>
                <p class="text-gray-500 mt-2">Try adjusting your search terms</p>
            </div>
        `;
        document.getElementById('pagination').style.display = 'none';
        return;
    }
    
    // Create resource cards
    pageResources.forEach((resource, index) => {
        const hasMedia = resource.mediaLink && resource.mediaLink.trim() !== '';
        
        const card = document.createElement('div');
        card.className = 'resource-card glass-card p-8 rounded-2xl';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="resource-icon-wrapper mb-6">
                <div class="resource-icon">
                    <i class="fas fa-file-pdf"></i>
                </div>
            </div>
            <h3 class="text-xl font-bold text-primary mb-3">${escapeHtml(resource.title)}</h3>
            <p class="text-secondary text-sm mb-6 line-clamp-3">
                ${escapeHtml(resource.description)}
            </p>
            <div class="resource-actions ${!hasMedia ? 'single-action' : ''}">
                <button onclick="openNotes('${resource.id}')" class="resource-btn read-btn">
                    <i class="fas fa-book-open"></i>
                    <span>Read Notes</span>
                </button>
                ${hasMedia ? `
                    <a href="${escapeHtml(resource.mediaLink)}" target="_blank" rel="noopener noreferrer" class="resource-btn download-btn">
                        <i class="fas fa-download"></i>
                        <span>Download</span>
                    </a>
                ` : ''}
            </div>
        `;
        
        resourcesGrid.appendChild(card);
    });
    
    // Update pagination
    updatePagination();
    
    // Update search results info
    updateSearchResults();
    
    // Scroll to top of resources section
    if (page > 1) {
        document.getElementById('resources').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);
    
    if (totalPages <= 1) {
        document.getElementById('pagination').style.display = 'none';
        return;
    }
    
    document.getElementById('pagination').style.display = 'flex';
    const paginationContainer = document.getElementById('paginationButtons');
    paginationContainer.innerHTML = '';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = `pagination-btn ${currentPage === 1 ? 'disabled' : ''}`;
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => currentPage > 1 && displayPage(currentPage - 1);
    paginationContainer.appendChild(prevBtn);
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page
    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.className = 'pagination-btn';
        firstBtn.textContent = '1';
        firstBtn.onclick = () => displayPage(1);
        paginationContainer.appendChild(firstBtn);
        
        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.className = 'pagination-dots';
            dots.textContent = '...';
            paginationContainer.appendChild(dots);
        }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => displayPage(i);
        paginationContainer.appendChild(pageBtn);
    }
    
    // Last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.className = 'pagination-dots';
            dots.textContent = '...';
            paginationContainer.appendChild(dots);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.className = 'pagination-btn';
        lastBtn.textContent = totalPages;
        lastBtn.onclick = () => displayPage(totalPages);
        paginationContainer.appendChild(lastBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = `pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`;
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => currentPage < totalPages && displayPage(currentPage + 1);
    paginationContainer.appendChild(nextBtn);
}

// Open notes modal
function openNotes(resourceId) {
    const modal = document.getElementById('notesModal');
    const title = document.getElementById('notesTitle');
    const content = document.getElementById('notesContent');
    
    const resource = resourcesData[resourceId];
    if (resource) {
        title.textContent = resource.title;
        // Convert markdown to HTML
        content.innerHTML = marked.parse(resource.notes);
        
        // Store current scroll position
        const scrollY = window.scrollY;
        
        // Add modal classes
        modal.classList.add('active');
        document.documentElement.classList.add('modal-open');
        document.body.classList.add('modal-open');
        
        // Set body top to maintain scroll position
        document.body.style.top = `-${scrollY}px`;
    }
}

// Close notes modal
function closeNotes() {
    const modal = document.getElementById('notesModal');
    
    // Get the scroll position before removing classes
    const scrollY = document.body.style.top;
    
    // Remove modal classes
    modal.classList.remove('active');
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
    
    // Restore scroll position
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
}

// Get scrollbar width to prevent layout shift
function getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    
    const inner = document.createElement('div');
    outer.appendChild(inner);
    
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    
    return scrollbarWidth;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeNotes();
    }
});

// Load resources when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadResources();
});

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    
    // Search on input
    searchInput.addEventListener('input', function(e) {
        searchQuery = e.target.value.toLowerCase().trim();
        
        // Show/hide clear button
        clearBtn.style.display = searchQuery ? 'flex' : 'none';
        
        // Filter resources
        filterResources();
    });
    
    // Clear search
    clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        searchQuery = '';
        clearBtn.style.display = 'none';
        filterResources();
        searchInput.focus();
    });
    
    // Clear on Escape key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchQuery = '';
            clearBtn.style.display = 'none';
            filterResources();
        }
    });
}

// Filter resources based on search query
function filterResources() {
    if (!searchQuery) {
        filteredResources = [...allResources];
    } else {
        filteredResources = allResources.filter(resource => {
            const titleMatch = resource.title.toLowerCase().includes(searchQuery);
            return titleMatch;
        });
    }
    
    // Reset to first page and display
    displayPage(1);
}

// Update search results info
function updateSearchResults() {
    const resultsInfo = document.getElementById('searchResults');
    
    if (searchQuery) {
        const count = filteredResources.length;
        resultsInfo.textContent = `Found ${count} resource${count !== 1 ? 's' : ''} matching "${searchQuery}"`;
        resultsInfo.style.display = 'block';
    } else {
        resultsInfo.style.display = 'none';
    }
}
