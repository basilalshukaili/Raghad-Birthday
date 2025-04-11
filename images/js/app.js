// Main application JavaScript for Cybersecurity Skills Galaxy

// Global variables
let skillsData;
let galaxyCanvas;
let galaxyContext;
let skillNodes = [];
let selectedSkill = null;
let zoomLevel = 1;
let panOffset = { x: 0, y: 0 };
let isDragging = false;
let lastMousePos = { x: 0, y: 0 };
let animationFrameId;

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load the skills data
    skillsData = JSON.parse(localStorage.getItem('cyberskills_data'));
    
    // If no data in localStorage, use the default data and save it
    if (!skillsData) {
        skillsData = window.skillsData || {};
        saveData();
    }
    
    // Check if the user has completed the specified skill
    checkPreCybersecurityNetworkingOsiPhysicalLayer();
    
    // Initialize the UI
    initUI();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize the galaxy visualization
    initGalaxy();
    
    // Update all progress indicators
    updateAllProgress();
    
    // Set the journey start date
    document.getElementById('journey-start-date').textContent = formatDate(skillsData.user.startDate);
});

// Check if the user has completed the Pre-Cybersecurity -> Networking -> OSI Model -> Physical Layer skill
function checkPreCybersecurityNetworkingOsiPhysicalLayer() {
    // If data is not yet loaded, return
    if (!skillsData || !skillsData.categories) return;
    
    // Find the skill and mark it as completed if not already
    const networkingCategory = skillsData.categories[0].subcategories.find(sub => sub.id === "1.1");
    if (networkingCategory) {
        const osiModel = networkingCategory.skills.find(skill => skill.id === "1.1.1");
        if (osiModel && osiModel.subskills) {
            const physicalLayer = osiModel.subskills.find(subskill => subskill.id === "1.1.1.1");
            if (physicalLayer && !physicalLayer.completed) {
                physicalLayer.completed = true;
                physicalLayer.completedOn = new Date().toISOString();
                
                // Add to user's completed skills
                if (!skillsData.user.completedSkills.some(s => s.id === physicalLayer.id)) {
                    skillsData.user.completedSkills.push({
                        id: physicalLayer.id,
                        name: physicalLayer.name,
                        category: "Pre-Cybersecurity Fundamentals > Networking > OSI Model",
                        completedOn: physicalLayer.completedOn
                    });
                }
                
                // Save the updated data
                saveData();
            }
        }
    }
}

// Initialize the UI components
function initUI() {
    // Set user name
    document.querySelectorAll('.user-name').forEach(el => {
        el.textContent = skillsData.user.name;
    });
    
    // Initialize navigation
    document.getElementById('dashboard-link').addEventListener('click', function(e) {
        e.preventDefault();
        showView('dashboard');
    });
    
    document.getElementById('galaxy-link').addEventListener('click', function(e) {
        e.preventDefault();
        showView('galaxy');
    });
    
    document.getElementById('progress-link').addEventListener('click', function(e) {
        e.preventDefault();
        showView('progress-tracker');
    });
    
    // Initialize category cards
    initCategoryCards();
    
    // Initialize charts if on progress tracker view
    if (document.getElementById('progress-tracker').classList.contains('active')) {
        initCharts();
    }
}

// Set up event listeners
function setupEventListeners() {
    // Galaxy view event listeners
    const galaxyCanvas = document.getElementById('galaxy-canvas');
    if (galaxyCanvas) {
        galaxyCanvas.addEventListener('mousedown', handleCanvasMouseDown);
        galaxyCanvas.addEventListener('mousemove', handleCanvasMouseMove);
        galaxyCanvas.addEventListener('mouseup', handleCanvasMouseUp);
        galaxyCanvas.addEventListener('wheel', handleCanvasWheel);
        galaxyCanvas.addEventListener('click', handleCanvasClick);
        
        // Zoom controls
        document.getElementById('zoom-in').addEventListener('click', function() {
            zoomGalaxy(0.1);
        });
        
        document.getElementById('zoom-out').addEventListener('click', function() {
            zoomGalaxy(-0.1);
        });
        
        document.getElementById('reset-view').addEventListener('click', resetGalaxyView);
    }
    
    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterGalaxyByCategory(this.value);
        });
    }
    
    // Search bar
    const searchBar = document.querySelector('.search-bar input');
    if (searchBar) {
        searchBar.addEventListener('input', function() {
            searchSkills(this.value);
        });
    }
    
    // Skill panel close button
    const closePanel = document.querySelector('.close-panel');
    if (closePanel) {
        closePanel.addEventListener('click', function() {
            document.querySelector('.skill-details-panel').classList.remove('active');
        });
    }
    
    // Mark complete/incomplete buttons
    document.getElementById('mark-complete').addEventListener('click', function() {
        if (selectedSkill) {
            markSkillComplete(selectedSkill.id);
        }
    });
    
    document.getElementById('mark-incomplete').addEventListener('click', function() {
        if (selectedSkill) {
            markSkillIncomplete(selectedSkill.id);
        }
    });
    
    // Modal close button
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            document.getElementById('skill-modal').classList.remove('active');
        });
    }
    
    // Modal mark complete/incomplete buttons
    document.getElementById('modal-mark-complete').addEventListener('click', function() {
        const skillId = document.getElementById('modal-skill-id').textContent;
        markSkillComplete(skillId);
        document.getElementById('skill-modal').classList.remove('active');
    });
    
    document.getElementById('modal-mark-incomplete').addEventListener('click', function() {
        const skillId = document.getElementById('modal-skill-id').textContent;
        markSkillIncomplete(skillId);
        document.getElementById('skill-modal').classList.remove('active');
    });
    
    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-category');
            showView('galaxy');
            filterGalaxyByCategory(categoryId);
        });
    });
    
    // Explore buttons
    document.querySelectorAll('.explore-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryId = this.getAttribute('data-category');
            showView('galaxy');
            filterGalaxyByCategory(categoryId);
        });
    });
}

// Initialize the galaxy visualization
function initGalaxy() {
    galaxyCanvas = document.getElementById('galaxy-canvas');
    if (!galaxyCanvas) return;
    
    galaxyContext = galaxyCanvas.getContext('2d');
    
    // Set canvas dimensions
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create skill nodes
    createSkillNodes();
    
    // Start animation loop
    animateGalaxy();
}

// Resize canvas to fit container
function resizeCanvas() {
    const container = galaxyCanvas.parentElement;
    galaxyCanvas.width = container.clientWidth;
    galaxyCanvas.height = container.clientHeight;
    
    // Redraw galaxy after resize
    drawGalaxy();
}

// Create skill nodes from data
function createSkillNodes() {
    skillNodes = [];
    
    if (!skillsData || !skillsData.categories) return;
    
    // Create nodes for each category
    skillsData.categories.forEach((category, categoryIndex) => {
        // Category node (planet)
        const categoryNode = {
            id: category.id.toString(),
            name: category.name,
            type: 'category',
            x: Math.cos(categoryIndex * (Math.PI * 2 / skillsData.categories.length)) * 300,
            y: Math.sin(categoryIndex * (Math.PI * 2 / skillsData.categories.length)) * 300,
            radius: 30,
            color: getCategoryColor(categoryIndex),
            progress: category.progress,
            orbitSpeed: 0.0001,
            orbitAngle: categoryIndex * (Math.PI * 2 / skillsData.categories.length)
        };
        skillNodes.push(categoryNode);
        
        // Subcategory nodes
        if (category.subcategories) {
            category.subcategories.forEach((subcategory, subIndex) => {
                const distance = 120;
                const angle = subIndex * (Math.PI * 2 / category.subcategories.length);
                
                const subcategoryNode = {
                    id: subcategory.id,
                    name: subcategory.name,
                    type: 'subcategory',
                    parentId: category.id.toString(),
                    x: categoryNode.x + Math.cos(angle) * distance,
                    y: categoryNode.y + Math.sin(angle) * distance,
                    radius: 15,
                    color: getCategoryColor(categoryIndex, 0.8),
                    progress: subcategory.progress,
                    orbitSpeed: 0.0005,
                    orbitAngle: angle,
                    orbitRadius: distance,
                    orbitCenter: { x: categoryNode.x, y: categoryNode.y }
                };
                skillNodes.push(subcategoryNode);
                
                // Skill nodes
                if (subcategory.skills) {
                    subcategory.skills.forEach((skill, skillIndex) => {
                        const skillDistance = 70;
                        const skillAngle = skillIndex * (Math.PI * 2 / subcategory.skills.length);
                        
                        const skillNode = {
                            id: skill.id,
                            name: skill.name,
                            type: 'skill',
                            parentId: subcategory.id,
                            description: skill.description,
                            x: subcategoryNode.x + Math.cos(skillAngle) * skillDistance,
                            y: subcategoryNode.y + Math.sin(skillAngle) * skillDistance,
                            radius: 8,
                            color: getSkillColor(skill),
                            completed: skill.completed,
                            progress: skill.progress,
                            orbitSpeed: 0.001,
                            orbitAngle: skillAngle,
                            orbitRadius: skillDistance,
                            orbitCenter: { x: subcategoryNode.x, y: subcategoryNode.y }
                        };
                        skillNodes.push(skillNode);
                        
                        // Subskill nodes
                        if (skill.subskills) {
                            skill.subskills.forEach((subskill, subskillIndex) => {
                                const subskillDistance = 40;
                                const subskillAngle = subskillIndex * (Math.PI * 2 / skill.subskills.length);
                                
                                const subskillNode = {
                                    id: subskill.id,
                                    name: subskill.name,
                                    type: 'subskill',
                                    parentId: skill.id,
                                    description: subskill.description,
                                    x: skillNode.x + Math.cos(subskillAngle) * subskillDistance,
                                    y: skillNode.y + Math.sin(subskillAngle) * subskillDistance,
                                    radius: 5,
                                    color: getSkillColor(subskill),
                                    completed: subskill.completed,
                                    orbitSpeed: 0.002,
                                    orbitAngle: subskillAngle,
                                    orbitRadius: subskillDistance,
                                    orbitCenter: { x: skillNode.x, y: skillNode.y }
                                };
                                skillNodes.push(subskillNode);
                            });
                        }
                    });
                }
            });
        }
    });
}

// Animate the galaxy
function animateGalaxy() {
    // Update node positions
    updateNodes();
    
    // Draw the galaxy
    drawGalaxy();
    
    // Continue animation loop
    animationFrameId = requestAnimationFrame(animateGalaxy);
}

// Update node positions
function updateNodes() {
    skillNodes.forEach(node => {
        if (node.type !== 'category' && node.orbitCenter) {
            // Update orbit angle
            node.orbitAngle += node.orbitSpeed;
            
            // Calculate new position
            node.x = node.orbitCenter.x + Math.cos(node.orbitAngle) * node.orbitRadius;
            node.y = node.orbitCenter.y + Math.sin(node.orbitAngle) * node.orbitRadius;
        }
    });
}

// Draw the galaxy
function drawGalaxy() {
    // Clear canvas
    galaxyContext.clearRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);
    
    // Set transform for zoom and pan
    galaxyContext.save();
    galaxyContext.translate(galaxyCanvas.width / 2 + panOffset.x, galaxyCanvas.height / 2 + panOffset.y);
    galaxyContext.scale(zoomLevel, zoomLevel);
    
    // Draw connections
    drawConnections();
    
    // Draw nodes
    drawNodes();
    
    // Restore transform
    galaxyContext.restore();
}

// Draw connections between nodes
function drawConnections() {
    // Draw orbits
    skillNodes.forEach(node => {
        if (node.type !== 'category' && node.orbitCenter) {
            galaxyContext.beginPath();
            galaxyContext.arc(node.orbitCenter.x, node.orbitCenter.y, node.orbitRadius, 0, Math.PI * 2);
            galaxyContext.strokeStyle = `rgba(255, 255, 255, 0.1)`;
            galaxyContext.stroke();
        }
    });
    
    // Draw connections between related nodes
    skillNodes.forEach(node => {
        if (node.parentId) {
            const parentNode = skillNodes.find(n => n.id === node.parentId);
            if (parentNode) {
                galaxyContext.beginPath();
                galaxyContext.moveTo(node.x, node.y);
                galaxyContext.lineTo(parentNode.x, parentNode.y);
                galaxyContext.strokeStyle = `rgba(255, 255, 255, 0.2)`;
                galaxyContext.stroke();
            }
        }
    });
}

// Draw all nodes
function drawNodes() {
    // Draw nodes in reverse order so larger nodes appear behind smaller ones
    for (let i = skillNodes.length - 1; i >= 0; i--) {
        const node = skillNodes[i];
        
        // Draw glow effect for completed nodes
        if (node.completed) {
            galaxyContext.beginPath();
            galaxyContext.arc(node.x, node.y, node.radius * 1.5, 0, Math.PI * 2);
            const gradient = galaxyContext.createRadialGradient(
                node.x, node.y, node.radius,
                node.x, node.y, node.radius * 1.5
            );
            gradient.addColorStop(0, `rgba(76, 175, 80, 0.8)`);
            gradient.addColorStop(1, `rgba(76, 175, 80, 0)`);
            galaxyContext.fillStyle = gradient;
            galaxyContext.fill();
        }
        
        // Draw node
        galaxyContext.beginPath();
        galaxyContext.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        galaxyContext.fillStyle = node.color;
        galaxyContext.fill();
        
        // Draw progress indicator for category and subcategory nodes
        if ((node.type === 'category' || node.type === 'subcategory') && node.progress > 0) {
            galaxyContext.beginPath();
            galaxyContext.moveTo(node.x, node.y);
            galaxyContext.arc(node.x, node.y, node.radius, -Math.PI / 2, -Math.PI / 2 + (node.progress / 100) * (Math.PI * 2));
            galaxyContext.lineTo(node.x, node.y);
            galaxyContext.fillStyle = 'rgba(255, 255, 255, 0.3)';
            galaxyContext.fill();
        }
        
        // Draw highlight for selected node
        if (selectedSkill && node.id === selectedSkill.id) {
            galaxyContext.beginPath();
            galaxyContext.arc(node.x, node.y, node.radius + 3, 0, Math.PI * 2);
            galaxyContext.strokeStyle = '#ffffff';
            galaxyContext.lineWidth = 2;
            galaxyContext.stroke();
            galaxyContext.lineWidth = 1;
        }
    }
}

// Handle mouse down on canvas
function handleCanvasMouseDown(e) {
    isDragging = true;
    lastMousePos = {
        x: e.clientX,
        y: e.clientY
    };
}

// Handle mouse move on canvas
function handleCanvasMouseMove(e) {
    // Show tooltip on hover
    const rect = galaxyCanvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - galaxyCanvas.width / 2 - panOffset.x) / zoomLevel;
    const mouseY = (e.clientY - rect.top - galaxyCanvas.height / 2 - panOffset.y) / zoomLevel;
    
    let hoveredNode = null;
    
    // Check if mouse is over a node
    for (let i = 0; i < skillNodes.length; i++) {
        const node = skillNodes[i];
        const distance = Math.sqrt(Math.pow(mouseX - node.x, 2) + Math.pow(mouseY - node.y, 2));
        
        if (distance <= node.radius) {
            hoveredNode = node;
            break;
        }
    }
    
    // Update tooltip
    const tooltip = document.getElementById('skill-tooltip');
    if (hoveredNode) {
        tooltip.querySelector('.tooltip-title').textContent = hoveredNode.name;
        tooltip.querySelector('.tooltip-category').textContent = getCategoryPath(hoveredNode);
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY + 10}px`;
        tooltip.classList.remove('hidden');
    } else {
        tooltip.classList.add('hidden');
    }
    
    // Handle dragging
    if (isDragging) {
        panOffset.x += e.clientX - lastMousePos.x;
        panOffset.y += e.clientY - lastMousePos.y;
        
        lastMousePos = {
            x: e.clientX,
            y: e.clientY
        };
        
        // Redraw galaxy
        drawGalaxy();
    }
}

// Handle mouse up on canvas
function handleCanvasMouseUp() {
    isDragging = false;
}

// Handle mouse wheel on canvas
function handleCanvasWheel(e) {
    e.preventDefault();
    
    // Determine zoom direction
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    
    // Apply zoom
    zoomGalaxy(delta);
}

// Zoom the galaxy view
function zoomGalaxy(delta) {
    // Calculate new zoom level
    const newZoomLevel = zoomLevel + delta;
    
    // Limit zoom level
    if (newZoomLevel >= 0.2 && newZoomLevel <= 3) {
        zoomLevel = newZoomLevel;
        
        // Redraw galaxy
        drawGalaxy();
    }
}

// Reset galaxy view
function resetGalaxyView() {
    zoomLevel = 1;
    panOffset = { x: 0, y: 0 };
    
    // Redraw galaxy
    drawGalaxy();
}

// Handle click on canvas
function handleCanvasClick(e) {
    // Get mouse position relative to canvas center and accounting for zoom and pan
    const rect = galaxyCanvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - galaxyCanvas.width / 2 - panOffset.x) / zoomLevel;
    const mouseY = (e.clientY - rect.top - galaxyCanvas.height / 2 - panOffset.y) / zoomLevel;
    
    // Check if a node was clicked
    for (let i = 0; i < skillNodes.length; i++) {
        const node = skillNodes[i];
        const distance = Math.sqrt(Math.pow(mouseX - node.x, 2) + Math.pow(mouseY - node.y, 2));
        
        if (distance <= node.radius) {
            // Handle node click
            handleNodeClick(node);
            break;
        }
    }
}

// Handle node click
function handleNodeClick(node) {
    // Set selected skill
    selectedSkill = node;
    
    // Update skill details panel
    updateSkillDetailsPanel(node);
    
    // Show skill details panel
    document.querySelector('.skill-details-panel').classList.add('active');
    
    // Redraw galaxy to show selection highlight
    drawGalaxy();
}

// Update skill details panel
function updateSkillDetailsPanel(node) {
    document.getElementById('skill-name').textContent = node.name;
    document.getElementById('skill-id').textContent = node.id;
    
    if (node.description) {
        document.getElementById('skill-description').textContent = node.description;
    } else {
        document.getElementById('skill-description').textContent = `${node.name} is a ${node.type} in the cybersecurity skills hierarchy.`;
    }
    
    // Update status
    const statusElement = document.getElementById('skill-status');
    statusElement.textContent = node.completed ? 'Completed' : 'Not Started';
    statusElement.className = 'status-value ' + (node.completed ? 'completed' : '');
    
    // Update prerequisites list
    const prerequisitesList = document.getElementById('prerequisites-list');
    prerequisitesList.innerHTML = '';
    
    // Find prerequisites for this node
    const prerequisites = findPrerequisites(node.id);
    
    if (prerequisites.length > 0) {
        prerequisites.forEach(prereq => {
            const li = document.createElement('li');
            li.className = prereq.completed ? 'completed' : 'not-completed';
            li.innerHTML = `<i class="fas ${prereq.completed ? 'fa-check-circle' : 'fa-circle'}"></i> ${prereq.name}`;
            prerequisitesList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.className = 'empty-state';
        li.textContent = 'No prerequisites';
        prerequisitesList.appendChild(li);
    }
    
    // Show/hide action buttons based on node type and completion status
    if (node.type === 'skill' || node.type === 'subskill') {
        document.getElementById('mark-complete').style.display = node.completed ? 'none' : 'block';
        document.getElementById('mark-incomplete').style.display = node.completed ? 'block' : 'none';
    } else {
        document.getElementById('mark-complete').style.display = 'none';
        document.getElementById('mark-incomplete').style.display = 'none';
    }
}

// Find prerequisites for a skill
function findPrerequisites(skillId) {
    const prerequisites = [];
    
    // Search through all categories
    for (const category of skillsData.categories) {
        for (const subcategory of category.subcategories || []) {
            for (const skill of subcategory.skills || []) {
                // Check if this skill has the target as a prerequisite
                if (skill.id === skillId && skill.prerequisites) {
                    // Find the prerequisite skills
                    for (const prereqId of skill.prerequisites) {
                        const prereq = findSkillById(prereqId);
                        if (prereq) {
                            prerequisites.push(prereq);
                        }
                    }
                }
                
                // Check subskills
                if (skill.subskills) {
                    for (const subskill of skill.subskills) {
                        if (subskill.id === skillId && subskill.prerequisites) {
                            for (const prereqId of subskill.prerequisites) {
                                const prereq = findSkillById(prereqId);
                                if (prereq) {
                                    prerequisites.push(prereq);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    return prerequisites;
}

// Find a skill by ID
function findSkillById(skillId) {
    // Search through all categories
    for (const category of skillsData.categories) {
        for (const subcategory of category.subcategories || []) {
            for (const skill of subcategory.skills || []) {
                if (skill.id === skillId) {
                    return skill;
                }
                
                // Check subskills
                if (skill.subskills) {
                    for (const subskill of skill.subskills) {
                        if (subskill.id === skillId) {
                            return subskill;
                        }
                    }
                }
            }
        }
    }
    
    return null;
}

// Get category path for a node
function getCategoryPath(node) {
    if (node.type === 'category') {
        return node.name;
    }
    
    if (node.type === 'subcategory') {
        const category = skillNodes.find(n => n.id === node.parentId);
        return category ? `${category.name} > ${node.name}` : node.name;
    }
    
    if (node.type === 'skill') {
        const subcategory = skillNodes.find(n => n.id === node.parentId);
        if (subcategory) {
            const category = skillNodes.find(n => n.id === subcategory.parentId);
            return category ? `${category.name} > ${subcategory.name} > ${node.name}` : `${subcategory.name} > ${node.name}`;
        }
        return node.name;
    }
    
    if (node.type === 'subskill') {
        const skill = skillNodes.find(n => n.id === node.parentId);
        if (skill) {
            const subcategory = skillNodes.find(n => n.id === skill.parentId);
            if (subcategory) {
                const category = skillNodes.find(n => n.id === subcategory.parentId);
                return category ? `${category.name} > ${subcategory.name} > ${skill.name} > ${node.name}` : `${subcategory.name} > ${skill.name} > ${node.name}`;
            }
            return `${skill.name} > ${node.name}`;
        }
        return node.name;
    }
    
    return '';
}

// Filter galaxy by category
function filterGalaxyByCategory(categoryId) {
    // If 'all', show all nodes
    if (categoryId === 'all') {
        skillNodes.forEach(node => {
            node.visible = true;
        });
    } else {
        // Show only nodes in the selected category
        skillNodes.forEach(node => {
            if (node.type === 'category') {
                node.visible = node.id === categoryId;
            } else if (node.type === 'subcategory') {
                node.visible = node.parentId === categoryId;
            } else if (node.type === 'skill') {
                const subcategory = skillNodes.find(n => n.id === node.parentId);
                node.visible = subcategory && subcategory.parentId === categoryId;
            } else if (node.type === 'subskill') {
                const skill = skillNodes.find(n => n.id === node.parentId);
                if (skill) {
                    const subcategory = skillNodes.find(n => n.id === skill.parentId);
                    node.visible = subcategory && subcategory.parentId === categoryId;
                } else {
                    node.visible = false;
                }
            }
        });
    }
    
    // Redraw galaxy
    drawGalaxy();
}

// Search skills
function searchSkills(query) {
    if (!query) {
        // If no query, show all nodes
        skillNodes.forEach(node => {
            node.visible = true;
        });
    } else {
        // Show only nodes that match the query
        const lowerQuery = query.toLowerCase();
        skillNodes.forEach(node => {
            node.visible = node.name.toLowerCase().includes(lowerQuery) || 
                          (node.description && node.description.toLowerCase().includes(lowerQuery));
        });
    }
    
    // Redraw galaxy
    drawGalaxy();
}

// Mark a skill as complete
function markSkillComplete(skillId) {
    // Find the skill in the data
    const skill = findSkillById(skillId);
    
    if (skill) {
        // Check if prerequisites are met
        const prerequisites = findPrerequisites(skillId);
        const allPrerequisitesMet = prerequisites.every(prereq => prereq.completed);
        
        if (!allPrerequisitesMet && prerequisites.length > 0) {
            alert('You must complete all prerequisites before marking this skill as complete.');
            return;
        }
        
        // Mark as complete
        skill.completed = true;
        skill.completedOn = new Date().toISOString();
        
        // Add to user's completed skills
        if (!skillsData.user.completedSkills.some(s => s.id === skillId)) {
            skillsData.user.completedSkills.push({
                id: skillId,
                name: skill.name,
                category: getCategoryPathForSkill(skillId),
                completedOn: skill.completedOn
            });
        }
        
        // Update node in galaxy
        const node = skillNodes.find(n => n.id === skillId);
        if (node) {
            node.completed = true;
            node.color = getSkillColor(skill);
        }
        
        // Update skill details panel
        if (selectedSkill && selectedSkill.id === skillId) {
            updateSkillDetailsPanel(selectedSkill);
        }
        
        // Update progress
        updateAllProgress();
        
        // Save data
        saveData();
        
        // Redraw galaxy
        drawGalaxy();
    }
}

// Mark a skill as incomplete
function markSkillIncomplete(skillId) {
    // Find the skill in the data
    const skill = findSkillById(skillId);
    
    if (skill) {
        // Check if any other skills depend on this one
        const dependentSkills = findDependentSkills(skillId);
        
        if (dependentSkills.length > 0) {
            const dependentNames = dependentSkills.map(s => s.name).join(', ');
            alert(`Cannot mark as incomplete because the following skills depend on it: ${dependentNames}`);
            return;
        }
        
        // Mark as incomplete
        skill.completed = false;
        skill.completedOn = null;
        
        // Remove from user's completed skills
        skillsData.user.completedSkills = skillsData.user.completedSkills.filter(s => s.id !== skillId);
        
        // Update node in galaxy
        const node = skillNodes.find(n => n.id === skillId);
        if (node) {
            node.completed = false;
            node.color = getSkillColor(skill);
        }
        
        // Update skill details panel
        if (selectedSkill && selectedSkill.id === skillId) {
            updateSkillDetailsPanel(selectedSkill);
        }
        
        // Update progress
        updateAllProgress();
        
        // Save data
        saveData();
        
        // Redraw galaxy
        drawGalaxy();
    }
}

// Find skills that depend on a given skill
function findDependentSkills(skillId) {
    const dependentSkills = [];
    
    // Search through all categories
    for (const category of skillsData.categories) {
        for (const subcategory of category.subcategories || []) {
            for (const skill of subcategory.skills || []) {
                // Check if this skill has the target as a prerequisite
                if (skill.prerequisites && skill.prerequisites.includes(skillId) && skill.completed) {
                    dependentSkills.push(skill);
                }
                
                // Check subskills
                if (skill.subskills) {
                    for (const subskill of skill.subskills) {
                        if (subskill.prerequisites && subskill.prerequisites.includes(skillId) && subskill.completed) {
                            dependentSkills.push(subskill);
                        }
                    }
                }
            }
        }
    }
    
    return dependentSkills;
}

// Get category path for a skill ID
function getCategoryPathForSkill(skillId) {
    // Find the skill node
    const node = skillNodes.find(n => n.id === skillId);
    
    if (node) {
        return getCategoryPath(node);
    }
    
    return '';
}

// Update all progress indicators
function updateAllProgress() {
    // Calculate overall progress
    calculateOverallProgress();
    
    // Update progress indicators in UI
    updateProgressIndicators();
    
    // Update category cards
    updateCategoryCards();
    
    // Update completed skills table
    updateCompletedSkillsTable();
    
    // Update charts if on progress tracker view
    if (document.getElementById('progress-tracker').classList.contains('active')) {
        initCharts();
    }
}

// Calculate overall progress
function calculateOverallProgress() {
    // Count total skills and completed skills
    let totalSkills = 0;
    let completedSkills = 0;
    
    // Calculate progress for each category
    skillsData.categories.forEach(category => {
        let categoryTotal = 0;
        let categoryCompleted = 0;
        
        category.subcategories.forEach(subcategory => {
            let subcategoryTotal = 0;
            let subcategoryCompleted = 0;
            
            subcategory.skills.forEach(skill => {
                // Count skill
                subcategoryTotal++;
                totalSkills++;
                
                if (skill.completed) {
                    subcategoryCompleted++;
                    categoryCompleted++;
                    completedSkills++;
                }
                
                // Count subskills if any
                if (skill.subskills) {
                    skill.subskills.forEach(subskill => {
                        subcategoryTotal++;
                        totalSkills++;
                        
                        if (subskill.completed) {
                            subcategoryCompleted++;
                            categoryCompleted++;
                            completedSkills++;
                        }
                    });
                }
                
                // Calculate skill progress
                skill.progress = skill.subskills ? 
                    Math.round((skill.subskills.filter(s => s.completed).length / skill.subskills.length) * 100) : 
                    (skill.completed ? 100 : 0);
            });
            
            // Calculate subcategory progress
            subcategory.progress = subcategoryTotal > 0 ? 
                Math.round((subcategoryCompleted / subcategoryTotal) * 100) : 0;
        });
        
        // Calculate category progress
        category.progress = categoryTotal > 0 ? 
            Math.round((categoryCompleted / categoryTotal) * 100) : 0;
    });
    
    // Calculate overall progress
    skillsData.user.overallProgress = totalSkills > 0 ? 
        Math.round((completedSkills / totalSkills) * 100) : 0;
}

// Update progress indicators in UI
function updateProgressIndicators() {
    // Update overall progress circles
    document.querySelectorAll('.progress-circle').forEach(circle => {
        const progressText = circle.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `${skillsData.user.overallProgress}%`;
        }
        
        // Update circle background
        circle.style.background = `conic-gradient(var(--space-accent) ${skillsData.user.overallProgress}%, var(--space-dark-blue) 0%)`;
    });
    
    // Update skills completed count
    document.querySelectorAll('.stat-value').forEach(stat => {
        if (stat.parentElement.querySelector('h3').textContent === 'Skills Completed') {
            stat.textContent = skillsData.user.completedSkills.length;
        }
    });
    
    // Update categories mastered count
    const masteredCategories = skillsData.categories.filter(c => c.progress === 100).length;
    document.querySelectorAll('.stat-value').forEach(stat => {
        if (stat.parentElement.querySelector('h3').textContent === 'Categories Mastered') {
            stat.textContent = masteredCategories;
        }
    });
}

// Initialize category cards
function initCategoryCards() {
    document.querySelectorAll('.category-card').forEach(card => {
        const categoryId = parseInt(card.getAttribute('data-category'));
        const category = skillsData.categories.find(c => c.id === categoryId);
        
        if (category) {
            // Update progress bar
            const progressFill = card.querySelector('.progress-fill');
            const progressText = card.querySelector('.progress-text');
            
            if (progressFill && progressText) {
                progressFill.style.width = `${category.progress}%`;
                progressText.textContent = `${category.progress}%`;
            }
        }
    });
}

// Update category cards
function updateCategoryCards() {
    document.querySelectorAll('.category-card').forEach(card => {
        const categoryId = parseInt(card.getAttribute('data-category'));
        const category = skillsData.categories.find(c => c.id === categoryId);
        
        if (category) {
            // Update progress bar
            const progressFill = card.querySelector('.progress-fill');
            const progressText = card.querySelector('.progress-text');
            
            if (progressFill && progressText) {
                progressFill.style.width = `${category.progress}%`;
                progressText.textContent = `${category.progress}%`;
            }
        }
    });
}

// Update completed skills table
function updateCompletedSkillsTable() {
    const tableBody = document.getElementById('completed-skills-list');
    if (!tableBody) return;
    
    // Clear table
    tableBody.innerHTML = '';
    
    // If no completed skills, show empty state
    if (skillsData.user.completedSkills.length === 0) {
        const row = document.createElement('tr');
        row.className = 'empty-state';
        row.innerHTML = '<td colspan="5">No skills completed yet</td>';
        tableBody.appendChild(row);
        return;
    }
    
    // Sort completed skills by completion date (newest first)
    const sortedSkills = [...skillsData.user.completedSkills].sort((a, b) => {
        return new Date(b.completedOn) - new Date(a.completedOn);
    });
    
    // Add rows for each completed skill
    sortedSkills.forEach(skill => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${skill.id}</td>
            <td>${skill.name}</td>
            <td>${skill.category}</td>
            <td>${formatDate(skill.completedOn)}</td>
            <td>
                <button class="btn secondary small mark-incomplete-btn" data-id="${skill.id}">
                    <i class="fas fa-times"></i> Mark Incomplete
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to mark incomplete buttons
    document.querySelectorAll('.mark-incomplete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const skillId = this.getAttribute('data-id');
            markSkillIncomplete(skillId);
        });
    });
}

// Initialize charts
function initCharts() {
    // Category progress chart
    const categoryProgressCtx = document.getElementById('category-progress-chart');
    if (categoryProgressCtx) {
        // Destroy existing chart if any
        if (window.categoryProgressChart) {
            window.categoryProgressChart.destroy();
        }
        
        // Prepare data
        const labels = skillsData.categories.map(c => c.name);
        const data = skillsData.categories.map(c => c.progress);
        const backgroundColors = skillsData.categories.map((c, i) => getCategoryColor(i));
        
        // Create chart
        window.categoryProgressChart = new Chart(categoryProgressCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Progress (%)',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Timeline chart
    const timelineCtx = document.getElementById('timeline-chart');
    if (timelineCtx) {
        // Destroy existing chart if any
        if (window.timelineChart) {
            window.timelineChart.destroy();
        }
        
        // Prepare data
        const completedSkills = [...skillsData.user.completedSkills].sort((a, b) => {
            return new Date(a.completedOn) - new Date(b.completedOn);
        });
        
        const labels = completedSkills.map(s => formatDate(s.completedOn));
        const data = [];
        let count = 0;
        
        completedSkills.forEach(skill => {
            count++;
            data.push(count);
        });
        
        // Create chart
        window.timelineChart = new Chart(timelineCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Skills Completed',
                    data: data,
                    backgroundColor: 'rgba(82, 113, 255, 0.2)',
                    borderColor: 'rgba(82, 113, 255, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Show a specific view
function showView(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show selected view
    document.getElementById(viewId).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    document.getElementById(`${viewId}-link`).classList.add('active');
    
    // Initialize charts if showing progress tracker
    if (viewId === 'progress-tracker') {
        initCharts();
    }
    
    // Resize galaxy canvas if showing galaxy view
    if (viewId === 'galaxy') {
        resizeCanvas();
    }
}

// Get color for a category
function getCategoryColor(index, alpha = 1) {
    const colors = [
        `rgba(94, 159, 255, ${alpha})`,  // Blue
        `rgba(94, 255, 184, ${alpha})`,  // Green
        `rgba(255, 207, 94, ${alpha})`,  // Yellow
        `rgba(255, 94, 94, ${alpha})`,   // Red
        `rgba(196, 94, 255, ${alpha})`,  // Purple
        `rgba(255, 94, 213, ${alpha})`,  // Pink
        `rgba(94, 255, 255, ${alpha})`,  // Cyan
        `rgba(255, 145, 94, ${alpha})`,  // Orange
        `rgba(178, 255, 94, ${alpha})`   // Lime
    ];
    
    return colors[index % colors.length];
}

// Get color for a skill based on completion status
function getSkillColor(skill) {
    if (skill.completed) {
        return 'rgba(76, 175, 80, 0.9)'; // Green for completed
    } else {
        return 'rgba(255, 255, 255, 0.7)'; // White for not started
    }
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('cyberskills_data', JSON.stringify(skillsData));
}

// Initialize the application
window.skillsData = JSON.parse(document.querySelector('script[src="js/data.js"]').textContent);
