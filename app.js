/* ================================================
   DesignForge AI — Main Application Logic
   State management, UI interactions, event handlers
   ================================================ */

// ---- Application State ----
const AppState = {
    htmlSource: '',
    htmlFileName: '',
    imageFiles: [],       // File objects
    imagePreviews: [],    // base64 thumbnails
    textContext: '',
    selectedTheme: null,
    selectedTheme: null,
    provider: 'gemini',
    apiKey: '',
    openRouterKey: '',
    model: 'gemini-2.5-flash',
    orModel: 'meta-llama/llama-3.3-70b-instruct:free',
    isTransforming: false,
    generatedHtml: '',    // full combined HTML
    splitCode: { html: '', css: '', js: '' },
    activeCodeTab: 'html'
};

// ---- Initialization ----
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    renderThemeGrid();
    setupNavbarScroll();
    setupTextCounter();
    setupResizeHandle();
    updateTransformButton();

    // Show API key notice if no key is saved
    if (!AppState.apiKey) {
        setTimeout(() => {
            showToast('Set your free Gemini API key to start transforming!', 'info');
        }, 2000);
    }
});


// ================================================
// SETTINGS (LocalStorage)
// ================================================
function loadSettings() {
    const savedProvider = localStorage.getItem('designforge_provider');
    const savedGeminiKey = localStorage.getItem('designforge_api_key');
    const savedOrKey = localStorage.getItem('designforge_or_key');
    const savedGeminiModel = localStorage.getItem('designforge_model');
    const savedOrModel = localStorage.getItem('designforge_or_model');
    
    if (savedProvider) AppState.provider = savedProvider;
    if (savedGeminiKey) AppState.apiKey = savedGeminiKey;
    if (savedOrKey) AppState.openRouterKey = savedOrKey;
    if (savedGeminiModel) AppState.model = savedGeminiModel;
    if (savedOrModel) AppState.orModel = savedOrModel;

    if ((AppState.provider === 'gemini' && AppState.apiKey) || 
        (AppState.provider === 'openrouter' && AppState.openRouterKey)) {
        document.getElementById('api-key-btn').querySelector('span').textContent = 'API Key ✓';
    }
}

function openApiKeyModal() {
    const modal = document.getElementById('api-key-modal');
    modal.classList.remove('hidden');
    const input = document.getElementById('api-key-input');
    document.getElementById('provider-select').value = AppState.provider;
    
    toggleProviderSettings();

    if (AppState.provider === 'openrouter') {
        document.getElementById('api-key-input').value = AppState.openRouterKey;
        document.getElementById('or-model-select').value = AppState.orModel;
    } else {
        document.getElementById('api-key-input').value = AppState.apiKey;
        document.getElementById('model-select').value = AppState.model;
    }
    
    input.focus();
}

function closeApiKeyModal(event) {
    if (event && event.target && event.target !== event.currentTarget) return;
    document.getElementById('api-key-modal').classList.add('hidden');
}

function toggleProviderSettings() {
    const provider = document.getElementById('provider-select').value;
    const input = document.getElementById('api-key-input');
    const keyLabel = document.getElementById('api-key-label');

    if (provider === 'openrouter') {
        document.getElementById('modal-desc-gemini').classList.add('hidden');
        document.getElementById('modal-desc-openrouter').classList.remove('hidden');
        document.getElementById('link-gemini').classList.add('hidden');
        document.getElementById('link-openrouter').classList.remove('hidden');
        document.getElementById('gemini-models').classList.add('hidden');
        document.getElementById('openrouter-models').classList.remove('hidden');
        keyLabel.textContent = 'OpenRouter API Key';
        input.value = AppState.openRouterKey; // Swap to current OR key
        input.placeholder = 'sk-or-v1-...';
    } else {
        document.getElementById('modal-desc-gemini').classList.remove('hidden');
        document.getElementById('modal-desc-openrouter').classList.add('hidden');
        document.getElementById('link-gemini').classList.remove('hidden');
        document.getElementById('link-openrouter').classList.add('hidden');
        document.getElementById('gemini-models').classList.remove('hidden');
        document.getElementById('openrouter-models').classList.add('hidden');
        keyLabel.textContent = 'Google AI Studio Key';
        input.value = AppState.apiKey; // Swap to current Gemini key
        input.placeholder = 'AIza...';
    }
}

function saveApiKey() {
    const provider = document.getElementById('provider-select').value;
    const key = document.getElementById('api-key-input').value.trim();

    if (!key) {
        showToast('Please enter an API key', 'error');
        return;
    }

    AppState.provider = provider;
    localStorage.setItem('designforge_provider', provider);

    if (provider === 'openrouter') {
        const model = document.getElementById('or-model-select').value;
        AppState.openRouterKey = key;
        AppState.orModel = model;
        localStorage.setItem('designforge_or_key', key);
        localStorage.setItem('designforge_or_model', model);
        showToast(`OpenRouter configured! Model: ${model}`, 'success');
    } else {
        const model = document.getElementById('model-select').value;
        AppState.apiKey = key;
        AppState.model = model;
        localStorage.setItem('designforge_api_key', key);
        localStorage.setItem('designforge_model', model);
        showToast(`Gemini configured! Model: ${model}`, 'success');
    }

    console.log('[DesignForge] Saved provider:', provider);

    document.getElementById('api-key-btn').querySelector('span').textContent = 'API Key ✓';
    closeApiKeyModal();
    showToast(`API key saved! Using model: ${model}`, 'success');
    updateTransformButton();
}

function toggleKeyVisibility() {
    const input = document.getElementById('api-key-input');
    input.type = input.type === 'password' ? 'text' : 'password';
}

async function testApiKeyFromModal() {
    const provider = document.getElementById('provider-select').value;
    const key = document.getElementById('api-key-input').value.trim();
    const resultDiv = document.getElementById('test-result');
    const testBtn = document.getElementById('test-key-btn');

    if (!key) {
        showToast('Enter an API key first', 'error');
        return;
    }

    resultDiv.classList.remove('hidden');
    resultDiv.style.background = 'rgba(96, 165, 250, 0.1)';
    resultDiv.style.border = '1px solid rgba(96, 165, 250, 0.3)';
    resultDiv.style.color = '#60a5fa';
    resultDiv.textContent = 'Testing API key...';
    testBtn.disabled = true;

    let result;
    if (provider === 'openrouter') {
        result = await testOpenRouterKey(key);
    } else {
        result = await testApiKey(key);
    }

    testBtn.disabled = false;

    if (result.success) {
        if (provider === 'gemini') {
            const targetModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-pro'];
            const available = targetModels.filter(m => result.models.includes(m));
            const allAvailable = result.models.filter(m => m.includes('gemini')).slice(0, 10);

            resultDiv.style.background = 'rgba(52, 211, 153, 0.1)';
            resultDiv.style.border = '1px solid rgba(52, 211, 153, 0.3)';
            resultDiv.style.color = '#34d399';
            resultDiv.innerHTML = `
                <strong>✅ API key is valid!</strong><br>
                <span style="color:#9b9bb0">Available models for transforms:</span><br>
                ${available.length > 0 
                    ? available.map(m => `• ${m}`).join('<br>') 
                    : `<span style="color:#fbbf24">None of our target models found. Available: ${allAvailable.join(', ')}</span>`
                }
            `;

            // Auto-select the best available model
            if (available.includes('gemini-2.5-flash')) {
                document.getElementById('model-select').value = 'gemini-2.5-flash';
            } else if (available.includes('gemini-2.0-flash')) {
                document.getElementById('model-select').value = 'gemini-2.0-flash';
            } else if (available.includes('gemini-2.5-pro')) {
                document.getElementById('model-select').value = 'gemini-2.5-pro';
            }
        } else {
            // OpenRouter success
            resultDiv.style.background = 'rgba(52, 211, 153, 0.1)';
            resultDiv.style.border = '1px solid rgba(52, 211, 153, 0.3)';
            resultDiv.style.color = '#34d399';
            resultDiv.innerHTML = `<strong>✅ OpenRouter API key is valid!</strong><br><span style="color:#9b9bb0">You can use any of the free models in the dropdown.</span>`;
        }
    } else {
        resultDiv.style.background = 'rgba(248, 113, 113, 0.1)';
        resultDiv.style.border = '1px solid rgba(248, 113, 113, 0.3)';
        resultDiv.style.color = '#f87171';
        resultDiv.innerHTML = `<strong>❌ API key failed:</strong> ${result.error}`;
    }
}


// ================================================
// NAVBAR
// ================================================
function setupNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}


// ================================================
// HTML INPUT
// ================================================
function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}

function handleHtmlDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processHtmlFile(files[0]);
    }
}

function handleHtmlFile(event) {
    const file = event.target.files[0];
    if (file) processHtmlFile(file);
}

function processHtmlFile(file) {
    if (!file.name.match(/\.(html|htm)$/i)) {
        showToast('Please upload an HTML file (.html or .htm)', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showToast('File too large. Max 5MB.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        AppState.htmlSource = e.target.result;
        AppState.htmlFileName = file.name;

        // Show file info
        document.getElementById('html-file-info').classList.remove('hidden');
        document.getElementById('html-file-name').textContent = file.name;
        document.getElementById('html-file-size').textContent = formatFileSize(file.size);
        document.getElementById('html-drop-zone').classList.add('hidden');

        updateTransformButton();
        showToast(`Loaded ${file.name}`, 'success');
    };
    reader.readAsText(file);
}

function clearHtmlInput() {
    AppState.htmlSource = '';
    AppState.htmlFileName = '';
    document.getElementById('html-file-info').classList.add('hidden');
    document.getElementById('html-drop-zone').classList.remove('hidden');
    document.getElementById('html-file-input').value = '';
    document.getElementById('html-paste-area').value = '';
    updateTransformButton();
}

function toggleHtmlPaste() {
    const textarea = document.getElementById('html-paste-area');
    const dropZone = document.getElementById('html-drop-zone');
    const btn = document.getElementById('toggle-paste-btn');

    if (textarea.classList.contains('hidden')) {
        textarea.classList.remove('hidden');
        dropZone.classList.add('hidden');
        btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload file instead
        `;
        textarea.focus();
    } else {
        textarea.classList.add('hidden');
        dropZone.classList.remove('hidden');
        btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Paste HTML instead
        `;
    }
}

// Listen for paste changes
document.addEventListener('DOMContentLoaded', () => {
    const pasteArea = document.getElementById('html-paste-area');
    if (pasteArea) {
        pasteArea.addEventListener('input', () => {
            AppState.htmlSource = pasteArea.value;
            updateTransformButton();
        });
    }
});


// ================================================
// IMAGE UPLOAD
// ================================================
function handleImageDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    const files = Array.from(event.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    addImages(files);
}

function handleImageFiles(event) {
    const files = Array.from(event.target.files);
    addImages(files);
    event.target.value = '';
}

function addImages(files) {
    const remaining = 5 - AppState.imageFiles.length;
    if (remaining <= 0) {
        showToast('Maximum 5 reference images', 'error');
        return;
    }

    const toAdd = files.slice(0, remaining);

    toAdd.forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
            showToast(`${file.name} is too large (max 10MB)`, 'error');
            return;
        }

        AppState.imageFiles.push(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            AppState.imagePreviews.push(e.target.result);
            renderImagePreviews();
        };
        reader.readAsDataURL(file);
    });

    if (toAdd.length > 0) {
        showToast(`Added ${toAdd.length} image(s)`, 'success');
        updateTransformButton();
    }
}

function removeImage(index) {
    AppState.imageFiles.splice(index, 1);
    AppState.imagePreviews.splice(index, 1);
    renderImagePreviews();
    updateTransformButton();
}

function renderImagePreviews() {
    const grid = document.getElementById('image-preview-grid');
    if (AppState.imagePreviews.length === 0) {
        grid.innerHTML = '';
        return;
    }

    grid.innerHTML = AppState.imagePreviews.map((src, i) => `
        <div class="image-preview-item">
            <img src="${src}" alt="Reference ${i + 1}">
            <button class="remove-btn" onclick="removeImage(${i})" title="Remove">✕</button>
        </div>
    `).join('');
}


// ================================================
// TEXT CONTEXT
// ================================================
function setupTextCounter() {
    const textarea = document.getElementById('text-context');
    const counter = document.getElementById('char-count');

    textarea.addEventListener('input', () => {
        AppState.textContext = textarea.value;
        counter.textContent = `${textarea.value.length} / 2000`;
        updateTransformButton();
    });
}

function addTag(text) {
    const textarea = document.getElementById('text-context');
    if (textarea.value) {
        textarea.value += '. ' + text;
    } else {
        textarea.value = text;
    }
    textarea.dispatchEvent(new Event('input'));
    textarea.focus();
}


// ================================================
// THEME SELECTOR
// ================================================
function renderThemeGrid() {
    const grid = document.getElementById('theme-grid');
    grid.innerHTML = THEMES.map(theme => `
        <div class="theme-card" id="theme-${theme.id}" onclick="selectTheme('${theme.id}')" tabindex="0" role="button" aria-label="Select ${theme.name} theme">
            <div style="position:absolute;top:0;left:0;right:0;height:4px;border-radius:16px 16px 0 0;background:${theme.accentBar};"></div>
            <span class="theme-emoji">${theme.emoji}</span>
            <div class="theme-name">${theme.name}</div>
            <div class="theme-desc">${theme.description}</div>
        </div>
    `).join('');
}

function selectTheme(themeId) {
    // Deselect previous
    document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Select new
    AppState.selectedTheme = themeId;
    document.getElementById(`theme-${themeId}`).classList.add('selected');
    updateTransformButton();
}


// ================================================
// TRANSFORM
// ================================================
function updateTransformButton() {
    const btn = document.getElementById('transform-btn');
    const hint = document.getElementById('transform-hint');

    const hasContent = AppState.htmlSource.trim() || AppState.textContext.trim();
    const hasTheme = AppState.selectedTheme !== null;
    const isGeminiReady = AppState.provider === 'gemini' && AppState.apiKey.trim().length > 0;
    const isOpenRouterReady = AppState.provider === 'openrouter' && AppState.openRouterKey.trim().length > 0;
    const hasKey = isGeminiReady || isOpenRouterReady;

    const canTransform = hasContent && hasTheme && hasKey;
    btn.disabled = !canTransform;

    if (!hasKey) {
        hint.textContent = `Set your ${AppState.provider === 'openrouter' ? 'OpenRouter' : 'Gemini'} API key first`;
    } else if (!hasTheme) {
        hint.textContent = 'Select a design theme to continue';
    } else if (!hasContent) {
        hint.textContent = 'Provide text context or upload HTML to begin';
    } else {
        hint.textContent = 'Ready to transform! 🚀';
    }
}

async function startTransform() {
    if (AppState.isTransforming) return;

    AppState.isTransforming = true;
    const btn = document.getElementById('transform-btn');
    const contentEl = btn.querySelector('.transform-btn-content');
    const loadingEl = btn.querySelector('.transform-btn-loading');

    contentEl.classList.add('hidden');
    loadingEl.classList.remove('hidden');
    btn.disabled = true;

    // Remove model fallback setup from here since it will be done inside the Gemini branch

    try {
        // Build the prompt
        const prompt = buildTransformPrompt({
            theme: AppState.selectedTheme,
            textContext: AppState.textContext,
            htmlSource: AppState.htmlSource,
            hasImages: AppState.imageFiles.length > 0
        });

        // Handle OpenRouter routing vs Gemini routing
        let rawResponse = null;
        let lastError = null;

        if (AppState.provider === 'openrouter') {
            const orModelChain = [AppState.orModel];
            const allOrModels = [
                'meta-llama/llama-3.3-70b-instruct:free',
                'google/gemma-3-27b-it:free',
                'qwen/qwen3-coder:free',
                'nvidia/nemotron-nano-12b-v2-vl:free',
                'openrouter/free'
            ];
            allOrModels.forEach(m => { if (!orModelChain.includes(m)) orModelChain.push(m); });

            for (const orm of orModelChain) {
                try {
                    showToast(`AI is designing with OpenRouter (${orm})...`, 'info');
                    rawResponse = await callOpenRouterAPI(
                        prompt,
                        AppState.imageFiles,
                        AppState.openRouterKey,
                        orm
                    );
                    console.log(`[DesignForge] Success with OpenRouter model: ${orm}`);
                    break;
                } catch (err) {
                    console.warn(`[DesignForge] OpenRouter Model ${orm} failed:`, err.message);
                    lastError = err;
                    
                    const isRateLimit = err.message.includes('429') || 
                                        err.message.includes('quota') || 
                                        err.message.includes('rate-limited') || 
                                        err.message.includes('Provider returned error');
                                        
                    if (isRateLimit) {
                        showToast(`${orm} unavailable, trying next...`, 'info');
                        continue;
                    }
                    throw err; // Non-retryable error
                }
            }
        } else {
            // Model fallback chain for Gemini
            const modelChain = [AppState.model];
            const allModels = [
                'gemini-2.5-flash',
                'gemini-2.0-flash',
                'gemini-2.5-pro'
            ];
            allModels.forEach(m => { if (!modelChain.includes(m)) modelChain.push(m); });

            for (const model of modelChain) {
                try {
                    console.log(`[DesignForge] Trying model: ${model}`);
                    showToast(`AI is designing with ${model}...`, 'info');

                    rawResponse = await callGeminiAPI(
                        prompt,
                        AppState.imageFiles,
                        AppState.apiKey,
                        model
                    );
                    console.log(`[DesignForge] Success with model: ${model}`);
                    break; // Success — exit the loop
                } catch (err) {
                    console.warn(`[DesignForge] Model ${model} failed:`, err.message);
                    lastError = err;
                    if (err.message.includes('429') || err.message.includes('quota') 
                        || err.message.includes('RESOURCE_EXHAUSTED')
                        || err.message.includes('high demand') || err.message.includes('overloaded')
                        || err.message.includes('503')) {
                        showToast(`${model} unavailable, trying next...`, 'info');
                        continue; // Try next model
                    }
                    throw err; // Non-retryable error — stop immediately
                }
            }
        }

        if (!rawResponse) {
            throw lastError || new Error('All models failed. Please try again later.');
        }

        // Parse the response
        AppState.generatedHtml = parseAIResponse(rawResponse);

        // Split into parts
        AppState.splitCode = splitHtmlContent(AppState.generatedHtml);

        // Show output
        showOutput();
        showToast('Design transformation complete! ✨', 'success');

    } catch (error) {
        console.error('Transform error:', error);

        let errorMsg = error.message;
        if (errorMsg.includes('API key') || errorMsg.includes('API_KEY_INVALID')) {
            errorMsg = 'Invalid API key. Please check your Gemini API key in settings.';
        } else if (errorMsg.includes('quota') || errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('rate-limited') || errorMsg.includes('Provider returned error')) {
            errorMsg = 'All available models are currently overloaded. Please wait 1-2 minutes and try again.';
        } else if (errorMsg.includes('high demand') || errorMsg.includes('overloaded') || errorMsg.includes('503')) {
            errorMsg = 'All models are overloaded right now. This is temporary — please try again in 30-60 seconds.';
        } else if (errorMsg.includes('fetch') || errorMsg.includes('network') || errorMsg.includes('Failed to fetch')) {
            errorMsg = 'Network error. Please check your internet connection.';
        }

        showToast(`Error: ${errorMsg}`, 'error');
    } finally {
        AppState.isTransforming = false;
        contentEl.classList.remove('hidden');
        loadingEl.classList.add('hidden');
        btn.disabled = false;
        updateTransformButton();
    }
}


// ================================================
// OUTPUT / PREVIEW
// ================================================
function showOutput() {
    const outputZone = document.getElementById('output-zone');
    outputZone.classList.remove('hidden');

    // Scroll to output
    outputZone.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Render preview
    renderPreview();

    // Show code
    switchCodeTab('html');
}

function renderPreview() {
    const iframe = document.getElementById('preview-iframe');
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(AppState.generatedHtml);
    doc.close();
}

function switchDevice(device) {
    document.querySelectorAll('.device-btn[data-device]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.device === device);
    });

    const frame = document.getElementById('preview-frame');
    frame.className = 'preview-frame';
    if (device !== 'desktop') {
        frame.classList.add(device);
    }
}

function toggleFullscreen() {
    const container = document.getElementById('preview-container');
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        container.requestFullscreen().catch(() => {
            // Fallback — open in new window
            const win = window.open('', '_blank');
            win.document.write(AppState.generatedHtml);
            win.document.close();
        });
    }
}

function switchCodeTab(lang) {
    AppState.activeCodeTab = lang;

    document.querySelectorAll('.code-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.lang === lang);
    });

    const codeContent = document.getElementById('code-content');
    let code = '';

    switch (lang) {
        case 'html':
            code = AppState.generatedHtml || AppState.splitCode.html;
            break;
        case 'css':
            code = AppState.splitCode.css || '/* No separate CSS — styles are inline in the HTML */';
            break;
        case 'js':
            code = AppState.splitCode.js || '// No JavaScript in this design';
            break;
    }

    codeContent.textContent = code;
}


// ================================================
// EXPORT
// ================================================
function copyCode() {
    const code = document.getElementById('code-content').textContent;
    navigator.clipboard.writeText(code).then(() => {
        showToast('Code copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy. Try selecting and copying manually.', 'error');
    });
}

function copyFullCode() {
    navigator.clipboard.writeText(AppState.generatedHtml).then(() => {
        showToast('Full HTML copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy.', 'error');
    });
}

function downloadSingleHtml() {
    const blob = new Blob([AppState.generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `designforge-${AppState.selectedTheme || 'output'}-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('HTML file downloaded!', 'success');
}

function openInCodePen() {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://codepen.io/pen/define';
    form.target = '_blank';

    const data = {
        title: 'DesignForge AI Output',
        html: AppState.splitCode.html || AppState.generatedHtml,
        css: AppState.splitCode.css || '',
        js: AppState.splitCode.js || ''
    };

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'data';
    input.value = JSON.stringify(data);
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

function startOver() {
    document.getElementById('output-zone').classList.add('hidden');
    document.getElementById('input-zone').scrollIntoView({ behavior: 'smooth' });
}


// ================================================
// RESIZE HANDLE (split panels)
// ================================================
function setupResizeHandle() {
    const handle = document.getElementById('resize-handle');
    const split = document.querySelector('.output-split');
    let isResizing = false;

    if (!handle) return;

    handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing || !split) return;

        const rect = split.getBoundingClientRect();
        const offset = e.clientX - rect.left;
        const percentage = (offset / rect.width) * 100;

        if (percentage > 20 && percentage < 80) {
            const preview = document.getElementById('preview-container');
            const code = document.getElementById('code-container');
            preview.style.flex = `0 0 ${percentage}%`;
            code.style.flex = `0 0 ${100 - percentage - 1}%`;
            code.style.maxWidth = `${100 - percentage - 1}%`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });
}


// ================================================
// TOAST NOTIFICATIONS
// ================================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}


// ================================================
// UTILITIES
// ================================================
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Smooth scroll for anchor links
document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});

// Keyboard support for theme cards
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('theme-card')) {
        e.target.click();
    }
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('api-key-modal');
        if (!modal.classList.contains('hidden')) {
            closeApiKeyModal();
        }
    }
});
