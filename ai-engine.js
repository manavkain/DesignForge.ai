/* ================================================
   DesignForge AI — AI Transformation Engine
   Google Gemini API Integration + Prompt Engineering
   ================================================ */

/**
 * The master system prompt that encodes 50+ years of design expertise.
 * This is the secret sauce — deep design knowledge distilled into instructions.
 */
const DESIGN_SYSTEM_PROMPT = `You are DesignForge AI, the world's most expert web designer and front-end developer combined. You possess the equivalent of 50+ years of accumulated expertise from the greatest designers in history — Dieter Rams, Massimo Vignelli, Jony Ive, Mike Monteiro, and the best of Swiss, Bauhaus, and modern digital design.

YOUR ROLE: Transform basic, ugly, or AI-generated HTML into stunningly beautiful, production-ready websites. Your output must look like it was designed by a top-tier agency charging $50,000+ per project.

## CORE DESIGN PRINCIPLES YOU MUST FOLLOW:

### Visual Hierarchy (F-Pattern & Z-Pattern)
- Establish clear focal points using size, color, and contrast
- Primary CTA should be the most visually prominent element
- Use the golden ratio (1.618) for proportional sizing where applicable
- Create depth with layered elements and subtle shadows

### Typography Excellence
- Use a harmonious type scale (e.g., 1.25 or 1.333 ratio)
- Set body text between 16-18px with 1.5-1.7 line-height
- Letter-spacing: -0.02em for large headings, normal for body
- Font pairing: one display/heading font + one body font, max 2-3 fonts
- Use clamp() for fluid responsive typography
- Ensure minimum 4.5:1 contrast ratio for body text (WCAG AA)

### Color Theory
- Build palettes from a primary + secondary + neutral base
- Use the 60-30-10 rule: 60% dominant, 30% secondary, 10% accent
- Choose semantic colors for success/warning/error states
- Apply color consistently for interactive elements (links, buttons, focus states)
- Ensure all text meets WCAG AA contrast requirements

### Spacing & Layout
- Use an 8px base grid for all spacing (8, 16, 24, 32, 48, 64, 96)
- Consistent padding within components
- Use CSS Grid for page layouts, Flexbox for component internals
- Maximum content width: 1200-1400px with centered alignment
- Generous whitespace — let the design breathe

### Components & Patterns
- Hero sections: headline (H1) + subtext + CTA, optionally with visual
- Feature grids: icon/emoji + heading + description in 3-4 column grid
- Cards: consistent border-radius, padding, subtle shadows
- Buttons: clear hierarchy (primary bold, secondary outlined, tertiary ghost)
- Navigation: simple, sticky, with clear active states

### Modern CSS Techniques (USE THESE)
- CSS Custom Properties for all design tokens
- CSS Grid + Flexbox for layouts
- clamp() for fluid sizing
- scroll-behavior: smooth
- backdrop-filter for glassmorphism effects
- @keyframes for meaningful animations
- Smooth transitions on hover/focus (200-300ms ease)
- :focus-visible for accessible focus indicators
- prefers-color-scheme and prefers-reduced-motion media queries

### Micro-Interactions & Animation
- Button hover: subtle translateY(-2px) + shadow increase
- Card hover: gentle lift effect with shadow expansion
- Link hover: underline animation or color transition
- Loading states: skeleton screens or shimmer effects
- Page transitions: fade-in or slide-up on scroll
- Keep animations under 300ms for interactions, up to 1s for decorative

### Accessibility (NON-NEGOTIABLE)
- Semantic HTML5 elements (header, nav, main, section, article, footer)
- ARIA labels for interactive elements without visible text
- Alt text for all images
- Keyboard navigable (proper tab order, focus styles)
- Skip-to-content link
- Proper heading hierarchy (h1 > h2 > h3, no skipping)

### Performance
- Minimize nested elements (avoid "div soup")
- Use system font stack as fallback
- Optimize CSS (avoid redundant properties)
- Use will-change sparingly for animated elements
- Lazy loading for images below the fold

## OUTPUT FORMAT:
You MUST output a COMPLETE, SINGLE HTML file that includes ALL HTML, CSS (in <style> tags), and JavaScript (in <script> tags). The file must be self-contained and immediately renderable in a browser.

Structure your output EXACTLY like this:
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Appropriate Page Title]</title>
    <style>
        /* ALL CSS HERE - well organized with comments */
    </style>
</head>
<body>
    <!-- ALL HTML HERE - semantic, accessible -->
    <script>
        // ALL JS HERE - clean, minimal, enhancing
    </script>
</body>
</html>
\`\`\`

CRITICAL RULES:
1. Output ONLY the HTML code — no explanations, no markdown fences, no commentary.
2. ALL styles MUST be in a <style> tag in the <head>, NOT inline styles.
3. ALL scripts MUST be in a <script> tag before </body>.
4. Use Google Fonts via @import in the <style> tag when a specific font is needed.
5. The design must be FULLY RESPONSIVE (mobile-first).
6. Use placeholder image URLs from picsum.photos or placehold.co if images are needed.
7. Include smooth scroll behavior and meaningful hover/focus transitions.
8. The result should be DRAMATICALLY more beautiful than the input.`;


/**
 * Build the complete prompt from user inputs
 */
function buildTransformPrompt(inputs) {
    const parts = [];

    parts.push(DESIGN_SYSTEM_PROMPT);
    parts.push('\n\n---\n\n## USER REQUEST:\n');

    // Theme instructions
    if (inputs.theme) {
        const theme = THEMES.find(t => t.id === inputs.theme);
        if (theme) {
            parts.push(`### Selected Design Theme:\n${theme.prompt}\n\n`);
        }
    }

    // Text context
    if (inputs.textContext && inputs.textContext.trim()) {
        parts.push(`### User's Vision & Context:\n"${inputs.textContext.trim()}"\n\n`);
    }

    // HTML source
    if (inputs.htmlSource && inputs.htmlSource.trim()) {
        parts.push(`### Source HTML to Redesign:\nAnalyze the structure and content of this HTML, then completely redesign it with the selected theme while preserving all meaningful content:\n\n${inputs.htmlSource.trim()}\n\n`);
    } else {
        parts.push(`### No source HTML provided.\nGenerate a complete, beautiful website from scratch based on the user's description and selected theme. Create compelling placeholder content that demonstrates the design's capabilities.\n\n`);
    }

    // Image references note
    if (inputs.hasImages) {
        parts.push(`### Reference Images:\nThe user has provided reference images. Analyze them for:\n- Color palette (extract dominant and accent colors)\n- Layout patterns and spatial relationships\n- Visual mood and aesthetic direction\n- Typography style if visible\n- UI component styles\nIncorporate these visual cues into the redesign.\n\n`);
    }

    parts.push(`### Final Instructions:\nNow generate the complete, single-file HTML. Remember:\n- Output ONLY valid HTML code, starting with <!DOCTYPE html>\n- No markdown code fences, no explanations\n- The design must be breathtakingly beautiful\n- Every pixel must feel intentional and premium\n- The result should make professional designers envious`);

    return parts.join('');
}


/**
 * Convert a File object to base64 data URI
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}


/**
 * Test API key validity with a simple request
 */
async function testApiKey(apiKey) {
    // Try listing models first — this is the simplest API call
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    console.log('[DesignForge] Testing API key...');
    
    try {
        const response = await fetch(listUrl);
        const data = await response.json();
        
        if (!response.ok) {
            console.error('[DesignForge] API key test failed:', data);
            return { success: false, error: data?.error?.message || 'Invalid API key', models: [] };
        }
        
        const modelNames = (data.models || []).map(m => m.name.replace('models/', ''));
        console.log('[DesignForge] Available models:', modelNames);
        
        return { success: true, models: modelNames };
    } catch (err) {
        console.error('[DesignForge] Network error testing key:', err);
        return { success: false, error: err.message, models: [] };
    }
}


/**
 * Test OpenRouter API key validity
 */
async function testOpenRouterKey(apiKey) {
    const endpoint = `https://openrouter.ai/api/v1/auth/key`;
    console.log('[DesignForge] Testing OpenRouter API key...');
    
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        const data = await response.json().catch(() => ({}));
        
        if (!response.ok) {
            console.error('[DesignForge] OpenRouter API key test failed:', data);
            return { success: false, error: data?.error?.message || 'Invalid OpenRouter API key', models: [] };
        }
        
        // Return success and our predefined list of free OpenRouter models
        return { 
            success: true, 
            models: [
                'meta-llama/llama-3.3-70b-instruct:free',
                'google/gemma-3-27b-it:free',
                'qwen/qwen3-coder:free',
                'nvidia/nemotron-nano-12b-v2-vl:free',
                'openrouter/free'
            ] 
        };
    } catch (err) {
        console.error('[DesignForge] Network error testing OpenRouter key:', err);
        return { success: false, error: err.message, models: [] };
    }
}


/**
 * Call the Gemini API with multi-modal inputs
 * Tries v1beta first, then v1 as fallback
 */
async function callGeminiAPI(prompt, imageFiles = [], apiKey, model) {
    // Build the content parts
    const parts = [];

    // Add image parts first (if any)
    for (const file of imageFiles) {
        const base64Data = await fileToBase64(file);
        const base64String = base64Data.split(',')[1];
        parts.push({
            inlineData: {
                mimeType: file.type,
                data: base64String
            }
        });
    }

    // Add the text prompt
    parts.push({ text: prompt });

    const requestBody = {
        contents: [{
            parts: parts
        }],
        generationConfig: {
            temperature: 0.8,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 65536
        },
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
    };

    // Try both API versions
    const apiVersions = ['v1beta', 'v1'];
    let lastError = null;

    for (const version of apiVersions) {
        const endpoint = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
        
        console.log(`[DesignForge] Calling ${version}/models/${model}:generateContent`);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const errorMessage = data?.error?.message || `API request failed with status ${response.status}`;
                console.warn(`[DesignForge] ${version} failed for ${model}:`, errorMessage);
                lastError = new Error(errorMessage);
                
                // If it's "model not found" or overloaded, try the other API version
                if (errorMessage.includes('not found') || errorMessage.includes('not supported') 
                    || errorMessage.includes('high demand') || errorMessage.includes('overloaded')
                    || response.status === 503) {
                    continue;
                }
                // For other errors (quota, auth), throw immediately
                throw lastError;
            }

            if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
                const blockReason = data.candidates?.[0]?.finishReason || 'unknown';
                console.warn(`[DesignForge] No content in response. Finish reason: ${blockReason}`);
                throw new Error(`AI returned no content (reason: ${blockReason}). Try a different prompt or theme.`);
            }

            console.log(`[DesignForge] Success with ${version}/${model}`);
            return data.candidates[0].content.parts[0].text;
        } catch (fetchError) {
            if (fetchError.message 
                && !fetchError.message.includes('not found') 
                && !fetchError.message.includes('not supported')
                && !fetchError.message.includes('high demand')
                && !fetchError.message.includes('overloaded')) {
                throw fetchError;
            }
            lastError = fetchError;
        }
    }

    throw lastError || new Error(`Model ${model} not available. Try a different model.`);
}


/**
 * Call the OpenRouter API
 */
async function callOpenRouterAPI(prompt, imageFiles = [], apiKey, model) {
    const endpoint = `https://openrouter.ai/api/v1/chat/completions`;
    
    // Build the content parts (OpenAI format used by OpenRouter)
    const content = [];

    // Add the text prompt
    content.push({ type: 'text', text: prompt });

    // Determine if the model supports vision based on its name (heuristic for free models)
    const supportsVision = model.includes('gemini') || model.includes('vision') || model.includes('vl');

    // Add image parts if any, but only if the model supports it
    if (imageFiles.length > 0 && supportsVision) {
        for (const file of imageFiles) {
            const base64Data = await fileToBase64(file);
            content.push({
                type: 'image_url',
                image_url: {
                    url: base64Data // OpenRouter needs the data URI format
                }
            });
        }
    } else if (imageFiles.length > 0 && !supportsVision) {
        console.warn(`[DesignForge] Skipping images for ${model} since it likely doesn't support vision.`);
        content.push({ type: 'text', text: '\n[Note: The user provided reference images, but this AI model cannot process images. Please rely solely on the text description.]' });
    }

    const requestBody = {
        model: model,
        messages: [{
            role: 'user',
            content: content
        }],
        temperature: 0.8,
        top_p: 0.95
    };

    console.log(`[DesignForge] Calling OpenRouter for ${model}`);

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.href, // Recommended by OpenRouter
            'X-Title': 'DesignForge AI'          // Recommended by OpenRouter
        },
        body: JSON.stringify(requestBody)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        let errorMessage = data?.error?.message || `API request failed with status ${response.status}`;
        console.error(`[DesignForge] OpenRouter failed for ${model}:`, errorMessage);
        
        if (errorMessage.includes('No endpoints found that support image input') || errorMessage.includes('image')) {
            errorMessage = `This OpenRouter model (${model}) does not support image analysis. Try selecting a Gemini model, or remove the reference images.`;
        }
        
        throw new Error(errorMessage);
    }

    if (!data.choices || !data.choices[0]?.message?.content) {
        console.error(`[DesignForge] No valid content from OpenRouter`);
        throw new Error('No valid response received from OpenRouter AI.');
    }

    console.log(`[DesignForge] Success with OpenRouter/${model}`);
    return data.choices[0].message.content;
}


/**
 * Parse the AI response — extract clean HTML from potentially wrapped output
 */
function parseAIResponse(rawResponse) {
    let html = rawResponse.trim();

    // Remove markdown code fences if present
    // Pattern: ```html ... ``` or ``` ... ```
    const codeBlockRegex = /^```(?:html)?\s*\n?([\s\S]*?)\n?\s*```$/;
    const match = html.match(codeBlockRegex);
    if (match) {
        html = match[1].trim();
    }

    // If it still starts with backticks, try stripping more aggressively
    if (html.startsWith('```')) {
        html = html.replace(/^```\w*\n?/, '').replace(/\n?```$/, '').trim();
    }

    // Validate that it looks like HTML
    if (!html.includes('<!DOCTYPE') && !html.includes('<html') && !html.includes('<head')) {
        // Try to find HTML in the response
        const htmlStart = html.indexOf('<!DOCTYPE');
        if (htmlStart === -1) {
            const altStart = html.indexOf('<html');
            if (altStart !== -1) {
                html = html.substring(altStart);
            }
        } else {
            html = html.substring(htmlStart);
        }
    }

    return html;
}


/**
 * Split a single HTML file into separate HTML, CSS, and JS
 */
function splitHtmlContent(fullHtml) {
    const result = { html: '', css: '', js: '' };

    // Extract CSS from <style> tags
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let styleMatch;
    const cssBlocks = [];
    while ((styleMatch = styleRegex.exec(fullHtml)) !== null) {
        cssBlocks.push(styleMatch[1].trim());
    }
    result.css = cssBlocks.join('\n\n');

    // Extract JS from <script> tags (excluding external scripts)
    const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
    let scriptMatch;
    const jsBlocks = [];
    while ((scriptMatch = scriptRegex.exec(fullHtml)) !== null) {
        const content = scriptMatch[1].trim();
        if (content) jsBlocks.push(content);
    }
    result.js = jsBlocks.join('\n\n');

    // Create HTML-only version (with style/script tags replaced by comments)
    result.html = fullHtml
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '    <link rel="stylesheet" href="styles.css">')
        .replace(/<script(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/gi, '    <script src="script.js"><\/script>');

    return result;
}


// Expose functions globally
window.buildTransformPrompt = buildTransformPrompt;
window.callGeminiAPI = callGeminiAPI;
window.testApiKey = testApiKey;
window.callOpenRouterAPI = callOpenRouterAPI;
window.testOpenRouterKey = testOpenRouterKey;
window.parseAIResponse = parseAIResponse;
window.splitHtmlContent = splitHtmlContent;
window.fileToBase64 = fileToBase64;
