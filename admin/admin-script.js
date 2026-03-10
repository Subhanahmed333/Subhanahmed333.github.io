// Admin Panel JavaScript

let currentEditId = null;

// Check authentication state
auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('adminDashboard').classList.remove('hidden');
        loadResources();
    } else {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('adminDashboard').classList.add('hidden');
    }
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    try {
        await auth.signInWithEmailAndPassword(email, password);
        errorDiv.classList.add('hidden');
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
    }
});

// Logout
function logout() {
    auth.signOut();
}

// Load Resources
function loadResources() {
    const resourcesList = document.getElementById('resourcesList');
    resourcesList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin text-3xl"></i><p class="mt-2">Loading resources...</p></div>';

    resourcesRef.on('value', (snapshot) => {
        resourcesList.innerHTML = '';
        const resources = snapshot.val();

        if (!resources) {
            resourcesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p class="text-lg font-semibold">No resources yet</p>
                    <p class="text-sm">Click "Add New Resource" to get started</p>
                </div>
            `;
            return;
        }

        Object.keys(resources).forEach((key) => {
            const resource = resources[key];
            const hasMedia = resource.mediaLink && resource.mediaLink.trim() !== '';
            
            const resourceItem = document.createElement('div');
            resourceItem.className = 'resource-item';
            resourceItem.innerHTML = `
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg flex items-center justify-center">
                                <i class="fas fa-file-pdf text-white"></i>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-800">${resource.title}</h3>
                                <p class="text-sm text-gray-600">${resource.description}</p>
                            </div>
                        </div>
                        <div class="ml-15 flex items-center gap-4 text-sm text-gray-500">
                            <span><i class="fas fa-calendar mr-1"></i>${new Date(resource.createdAt).toLocaleDateString()}</span>
                            ${hasMedia ? '<span class="text-green-600"><i class="fas fa-download mr-1"></i>Has Download</span>' : '<span class="text-gray-400"><i class="fas fa-times mr-1"></i>No Download</span>'}
                        </div>
                    </div>
                    <div class="resource-actions">
                        <button onclick="editResource('${key}')" class="btn-edit">
                            <i class="fas fa-edit mr-1"></i>Edit
                        </button>
                        <button onclick="deleteResource('${key}')" class="btn-delete">
                            <i class="fas fa-trash mr-1"></i>Delete
                        </button>
                    </div>
                </div>
            `;
            resourcesList.appendChild(resourceItem);
        });
    });
}

// Open Add Modal
function openAddModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Add New Resource';
    document.getElementById('resourceForm').reset();
    document.getElementById('resourceId').value = '';
    document.getElementById('descCharCount').textContent = '0';
    document.getElementById('notesPreview').innerHTML = '<p class="text-gray-400 text-sm">Preview will appear here...</p>';
    document.getElementById('resourceModal').classList.add('active');
}

// Close Modal
function closeModal() {
    document.getElementById('resourceModal').classList.remove('active');
}

// Edit Resource
function editResource(id) {
    currentEditId = id;
    resourcesRef.child(id).once('value', (snapshot) => {
        const resource = snapshot.val();
        document.getElementById('modalTitle').textContent = 'Edit Resource';
        document.getElementById('resourceId').value = id;
        document.getElementById('resourceTitle').value = resource.title;
        document.getElementById('resourceDescription').value = resource.description;
        document.getElementById('resourceNotes').value = resource.notes;
        document.getElementById('resourceMediaLink').value = resource.mediaLink || '';
        
        updateCharCount();
        updateNotesPreview();
        
        document.getElementById('resourceModal').classList.add('active');
    });
}

// Delete Resource
function deleteResource(id) {
    if (confirm('Are you sure you want to delete this resource?')) {
        resourcesRef.child(id).remove()
            .then(() => {
                alert('Resource deleted successfully!');
            })
            .catch((error) => {
                alert('Error deleting resource: ' + error.message);
            });
    }
}

// Save Resource
document.getElementById('resourceForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('resourceTitle').value.trim();
    const description = document.getElementById('resourceDescription').value.trim();
    const notes = document.getElementById('resourceNotes').value.trim();
    const mediaLink = document.getElementById('resourceMediaLink').value.trim();

    const resourceData = {
        title,
        description,
        notes,
        mediaLink: mediaLink || null,
        updatedAt: Date.now()
    };

    if (currentEditId) {
        // Update existing resource
        resourcesRef.child(currentEditId).update(resourceData)
            .then(() => {
                alert('Resource updated successfully!');
                closeModal();
            })
            .catch((error) => {
                alert('Error updating resource: ' + error.message);
            });
    } else {
        // Add new resource
        resourceData.createdAt = Date.now();
        resourcesRef.push(resourceData)
            .then(() => {
                alert('Resource added successfully!');
                closeModal();
            })
            .catch((error) => {
                alert('Error adding resource: ' + error.message);
            });
    }
});

// Character count for description
document.getElementById('resourceDescription').addEventListener('input', updateCharCount);

function updateCharCount() {
    const description = document.getElementById('resourceDescription').value;
    document.getElementById('descCharCount').textContent = description.length;
}

// Markdown preview
document.getElementById('resourceNotes').addEventListener('input', updateNotesPreview);

function updateNotesPreview() {
    const notes = document.getElementById('resourceNotes').value;
    const preview = document.getElementById('notesPreview');
    
    if (notes.trim() === '') {
        preview.innerHTML = '<p class="text-gray-400 text-sm">Preview will appear here...</p>';
    } else {
        preview.innerHTML = marked.parse(notes);
    }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
