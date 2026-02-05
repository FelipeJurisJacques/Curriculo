import Yaml from '../../engine/helpers/yaml'

// Define interfaces based on the YAML structure
interface Training {
    name: string;
}

interface Skill {
    name: string;
}

interface Experience {
    name: string;
    period: string;
    description: string;
}

interface Interest {
    name: string;
}

interface Curriculum {
    name: string
    profile?: string
    linkedin?: string
    role?: string // Optional as it wasn't in the sample YAML
    trainings?: Training[]
    skills?: Skill[]
    experiences?: Experience[]
    personal_interests?: Interest[]
}

interface Manifest {
    assets: {
        markups: string[];
    };
}

async function main() {
    try {
        // 1. Fetch manifest to get the list of markup files
        const manifestResponse = await fetch('/assets/manifest.json');
        if (!manifestResponse.ok) {
            throw new Error(`Failed to fetch manifest: ${manifestResponse.statusText}`);
        }
        const manifest: Manifest = await manifestResponse.json();

        // 2. Initialize the UI
        initUI(manifest.assets.markups);

        // Log profile image base64
        // debugProfileImageBase64()

    } catch (error) {
        console.error("Application initialization failed:", error);
        document.body.innerHTML = `<div style="color: red; padding: 20px;">Error initializing application: ${error}</div>`;
    }
}

function initUI(markupFiles: string[]) {
    // Clear existing body content
    document.body.innerHTML = '';

    // Create a container for the app
    const appContainer = document.createElement('div');
    appContainer.className = 'app-container';
    appContainer.style.display = 'flex';
    appContainer.style.height = '100vh';
    appContainer.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    document.body.appendChild(appContainer);

    // Sidebar for file selection
    const sidebar = document.createElement('div');
    sidebar.className = 'app-sidebar';
    sidebar.style.width = '300px';
    sidebar.style.backgroundColor = '#1e1e24';
    sidebar.style.color = '#fff';
    sidebar.style.padding = '20px';
    sidebar.style.display = 'flex';
    sidebar.style.flexDirection = 'column';
    sidebar.style.borderRight = '1px solid #333';
    sidebar.style.overflowY = 'auto';
    appContainer.appendChild(sidebar);

    const title = document.createElement('h2');
    title.textContent = 'Curriculums';
    title.style.marginBottom = '20px';
    title.style.fontSize = '1.2rem';
    title.style.color = '#4fd1c5'; // Teal accent
    sidebar.appendChild(title);

    const fileList = document.createElement('div');
    fileList.style.display = 'flex';
    fileList.style.flexDirection = 'column';
    fileList.style.gap = '10px';
    sidebar.appendChild(fileList);

    // Content area for the preview
    const contentArea = document.createElement('div');
    contentArea.className = 'app-content';
    contentArea.style.flex = '1';
    contentArea.style.backgroundColor = '#282a36'; // Match body bg from style.css
    contentArea.style.padding = '40px';
    contentArea.style.overflowY = 'auto';
    contentArea.style.display = 'flex';
    contentArea.style.justifyContent = 'center';
    appContainer.appendChild(contentArea);

    // Render list items
    markupFiles.forEach(file => {
        const item = document.createElement('button');
        // Extract filename for display
        const fileName = file.split('/').pop() || file;
        item.textContent = fileName.replace('.yaml', '');
        item.style.padding = '12px 16px';
        item.style.textAlign = 'left';
        item.style.backgroundColor = 'transparent';
        item.style.border = '1px solid #444';
        item.style.borderRadius = '8px';
        item.style.color = '#eee';
        item.style.cursor = 'pointer';
        item.style.transition = 'all 0.2s';

        item.onmouseover = () => {
            item.style.backgroundColor = '#333';
            item.style.borderColor = '#4fd1c5';
        };
        item.onmouseout = () => {
            item.style.backgroundColor = 'transparent';
            item.style.borderColor = '#444';
        };

        item.onclick = () => {
            loadAndRenderCurriculum(file, contentArea);
        };

        fileList.appendChild(item);
    });
}

async function loadAndRenderCurriculum(url: string, container: HTMLElement) {
    try {
        container.innerHTML = '<div style="color: white;">Loading...</div>';

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch YAML: ${response.statusText}`);
        }
        const yamlText = await response.text();

        // Decode YAML
        const data = Yaml.decode(yamlText) as Curriculum;

        // Insert HTML
        container.innerHTML = generateCurriculumHTML(data);

    } catch (error) {
        console.error("Error loading curriculum:", error);
        container.innerHTML = `<div style="color: #ff6b6b;">Error loading curriculum: ${error}</div>`;
    }
}

function generateCurriculumHTML(data: Curriculum): string {
    // Generate HTML string based on curriculos/curriculo.html structure
    // We use the existing CSS classes from curriculum.css and style.css

    // Helper to join array items with <br>
    const trainingHTML = data.trainings?.map(t => t.name).join('<br>') || '';
    const skillsHTML = data.skills?.map(s => s.name).join('<br>') || '';

    // Experiences
    const experiencesHTML = data.experiences?.map(exp => `
        <p class="justify">
            ${exp.period}: ${exp.name}
            <br>
            ${exp.description}
        </p>
    `).join('') || '';

    // Interests
    const interestsHTML = data.personal_interests?.map(inr => `
        <p class="justify">
            ${inr.name}
        </p>
    `).join('') || '';

    // If role is missing in YAML, use a default or empty
    const roleHTML = data.role ? `<h4 class="retreat pt-16">${data.role}</h4>` : ''

    const inHtml = data.linkedin ? `<b>Linkedin</b><p><a href="https://www.linkedin.com/in/${data.linkedin}">www.linkedin.com/in/${data.linkedin}</a></p><br>` : ''

    return `
        <div class="page" style="margin: 0; transform: scale(0.9); transform-origin: top center;">
            <div class="column_left color-white">
                ${inHtml}
                <b>Formação</b>
                <p>
                    ${trainingHTML}
                </p>
                <br>
                <b>Habilidades</b>
                <p>
                    ${skillsHTML}
                </p>
            </div>
            <div class="column_right">
                ${experiencesHTML}
                
                ${data.personal_interests && data.personal_interests.length > 0 ? `
                   <p class="justify">
                        <b>Interesses Pessoais</b><br>
                   </p>
                   ${interestsHTML}
                ` : ''}
            </div>
            <div class="top left color-white">
                <img class="float-left" src="${data.profile}" alt="perfil" width="162" height="162" style="object-fit:cover;">
                <h1 class="retreat pt-24">${data.name}</h1>
                ${roleHTML}
            </div>
        </div>
    `;
}

// Start the application
main();

// async function debugProfileImageBase64() {
//     try {
//         const response = await fetch('/assets/profile.jfif');
//         if (!response.ok) {
//             console.error('Failed to fetch profile image for debugging:', response.statusText);
//             return;
//         }
//         const blob = await response.blob();
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             console.log('Profile Image Base64:', reader.result);
//         };
//         reader.readAsDataURL(blob);
//     } catch (error) {
//         console.error('Error debugging profile image:', error);
//     }
// }
