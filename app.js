// Intercom Canvas Kit App
// This app fetches data from external APIs and displays it in the Intercom sidebar

// Initialize Canvas Kit
const canvas = window.CanvasKit;

// App state
let currentConversation = null;
let currentContact = null;

// Initialize the app when Canvas Kit is ready
canvas.ready(() => {
    console.log('Canvas Kit initialized');
    
    // Get current conversation and contact data
    canvas.data.get('conversation').then(conversation => {
        currentConversation = conversation;
        console.log('Conversation data:', conversation);
    });
    
    canvas.data.get('contact').then(contact => {
        currentContact = contact;
        console.log('Contact data:', contact);
    });
    
    // Set up event listeners
    setupEventListeners();
    
    // Load saved configuration
    loadSavedConfig();
});

// Set up event listeners
function setupEventListeners() {
    const fetchBtn = document.getElementById('fetch-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const apiUrlInput = document.getElementById('api-url');
    const apiMethodSelect = document.getElementById('api-method');
    const apiKeyInput = document.getElementById('api-key');
    
    fetchBtn.addEventListener('click', handleFetchData);
    refreshBtn.addEventListener('click', handleFetchData);
    
    // Save configuration on change
    apiUrlInput.addEventListener('change', saveConfig);
    apiMethodSelect.addEventListener('change', saveConfig);
    apiKeyInput.addEventListener('change', saveConfig);
    
    // Allow Enter key to trigger fetch
    apiUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleFetchData();
        }
    });
}

// Load saved configuration from localStorage
function loadSavedConfig() {
    const savedUrl = localStorage.getItem('api-url');
    const savedMethod = localStorage.getItem('api-method');
    const savedKey = localStorage.getItem('api-key');
    
    if (savedUrl) {
        document.getElementById('api-url').value = savedUrl;
    }
    if (savedMethod) {
        document.getElementById('api-method').value = savedMethod;
    }
    if (savedKey) {
        document.getElementById('api-key').value = savedKey;
    }
}

// Save configuration to localStorage
function saveConfig() {
    localStorage.setItem('api-url', document.getElementById('api-url').value);
    localStorage.setItem('api-method', document.getElementById('api-method').value);
    localStorage.setItem('api-key', document.getElementById('api-key').value);
}

// Handle fetch data button click
async function handleFetchData() {
    const apiUrl = document.getElementById('api-url').value.trim();
    const apiMethod = document.getElementById('api-method').value;
    const apiKey = document.getElementById('api-key').value.trim();
    
    // Validate URL
    if (!apiUrl) {
        showError('Please enter an API endpoint URL');
        return;
    }
    
    // Validate URL format
    try {
        new URL(apiUrl);
    } catch (e) {
        showError('Please enter a valid URL (e.g., https://api.example.com/data)');
        return;
    }
    
    // Show loading state
    showLoading();
    hideError();
    hideDataDisplay();
    
    // Prepare request options
    const requestOptions = {
        method: apiMethod,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    // Add API key to headers if provided
    if (apiKey) {
        requestOptions.headers['Authorization'] = `Bearer ${apiKey}`;
        // Alternative: requestOptions.headers['X-API-Key'] = apiKey;
    }
    
    // Determine the final URL to use
    let finalUrl = apiUrl;
    
    // Add conversation/contact data to request body for POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(apiMethod)) {
        requestOptions.body = JSON.stringify({
            conversation: currentConversation,
            contact: currentContact,
            timestamp: new Date().toISOString()
        });
    } else {
        // For GET requests, append conversation/contact data as query params
        const url = new URL(apiUrl);
        if (currentConversation) {
            url.searchParams.append('conversation_id', currentConversation.id || '');
        }
        if (currentContact) {
            url.searchParams.append('contact_id', currentContact.id || '');
        }
        finalUrl = url.toString();
    }
    
    try {
        // Make API call
        const response = await fetch(finalUrl, requestOptions);
        
        // Check if response is ok
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        
        // Parse response
        const data = await response.json();
        
        // Display data
        displayData(data);
        
        // Save successful configuration
        saveConfig();
        
    } catch (error) {
        console.error('API call error:', error);
        showError(`Failed to fetch data: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// Display fetched data
function displayData(data) {
    const dataDisplay = document.getElementById('data-display');
    const dataContent = document.getElementById('data-content');
    
    // Format and display the data
    if (typeof data === 'object') {
        dataContent.innerHTML = formatJSON(data);
    } else {
        dataContent.textContent = String(data);
    }
    
    dataDisplay.classList.remove('hidden');
}

// Format JSON data for display
function formatJSON(obj, indent = 0) {
    if (obj === null) return '<span class="json-null">null</span>';
    if (obj === undefined) return '<span class="json-undefined">undefined</span>';
    
    if (typeof obj === 'string') {
        return `<span class="json-string">"${escapeHtml(obj)}"</span>`;
    }
    
    if (typeof obj === 'number' || typeof obj === 'boolean') {
        return `<span class="json-number">${obj}</span>`;
    }
    
    if (Array.isArray(obj)) {
        if (obj.length === 0) return '<span class="json-array">[]</span>';
        
        let html = '<span class="json-bracket">[</span>\n';
        obj.forEach((item, index) => {
            html += '  '.repeat(indent + 1);
            html += formatJSON(item, indent + 1);
            if (index < obj.length - 1) html += '<span class="json-comma">,</span>';
            html += '\n';
        });
        html += '  '.repeat(indent) + '<span class="json-bracket">]</span>';
        return html;
    }
    
    if (typeof obj === 'object') {
        const keys = Object.keys(obj);
        if (keys.length === 0) return '<span class="json-object">{}</span>';
        
        let html = '<span class="json-bracket">{</span>\n';
        keys.forEach((key, index) => {
            html += '  '.repeat(indent + 1);
            html += `<span class="json-key">"${escapeHtml(key)}"</span>: `;
            html += formatJSON(obj[key], indent + 1);
            if (index < keys.length - 1) html += '<span class="json-comma">,</span>';
            html += '\n';
        });
        html += '  '.repeat(indent) + '<span class="json-bracket">}</span>';
        return html;
    }
    
    return String(obj);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show loading state
function showLoading() {
    document.getElementById('loading-state').classList.remove('hidden');
    document.getElementById('fetch-btn').disabled = true;
    document.getElementById('fetch-btn-text').textContent = 'Fetching...';
    document.getElementById('fetch-spinner').classList.remove('hidden');
}

// Hide loading state
function hideLoading() {
    document.getElementById('loading-state').classList.add('hidden');
    document.getElementById('fetch-btn').disabled = false;
    document.getElementById('fetch-btn-text').textContent = 'Fetch Data';
    document.getElementById('fetch-spinner').classList.add('hidden');
}

// Show error message
function showError(message) {
    const errorEl = document.getElementById('error-message');
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
}

// Hide error message
function hideError() {
    document.getElementById('error-message').classList.add('hidden');
}

// Hide data display
function hideDataDisplay() {
    document.getElementById('data-display').classList.add('hidden');
}
