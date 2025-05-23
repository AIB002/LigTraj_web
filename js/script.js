// ========= Utility Functions ========= //
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Add smooth scroll behavior
const smoothScroll = (target) => {
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ========= Toggle Functions ========= //
function toggleMenu() {
  const menu = document.getElementById('dropdownMenu');
  const menuIcon = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  
  if (menu.style.display === "block") {
    menu.style.display = "none";
    menuIcon.classList.remove('menu-open');
  } else {
    menu.style.display = "block";
    menuIcon.classList.add('menu-open');
  }
  
  // On mobile, also toggle sidebar
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle('open');
    // Add backdrop when sidebar is open
    toggleBackdrop(sidebar.classList.contains('open'));
  }
}

// Backdrop for mobile sidebar
function toggleBackdrop(show) {
  let backdrop = document.getElementById('sidebar-backdrop');
  
  if (show) {
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'sidebar-backdrop';
      backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 899;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      backdrop.onclick = toggleMenu;
      document.body.appendChild(backdrop);
      
      // Force reflow
      backdrop.offsetHeight;
      backdrop.style.opacity = '1';
    }
  } else if (backdrop) {
    backdrop.style.opacity = '0';
    setTimeout(() => backdrop.remove(), 300);
  }
}

// ========= Enhanced Search Function ========= //
function searchPDB() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const listItems = document.querySelectorAll('#pdbList li:not(.category-header)');
  
  if (input.trim() === '') {
    listItems.forEach(item => {
      item.style.display = "block";
      item.innerHTML = item.textContent; // Remove highlights
    });
    updateCategoryVisibility();
    return;
  }
  
  let hasResults = false;
  
  listItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes(input)) {
      item.style.display = "block";
      hasResults = true;
      
      // Highlight matching text
      const regex = new RegExp(`(${input})`, 'gi');
      item.innerHTML = item.textContent.replace(regex, '<span class="highlight">$1</span>');
    } else {
      item.style.display = "none";
    }
  });
  
  // Show/hide categories based on visible items
  updateCategoryVisibility();
  
  // Show no results message
  showNoResultsMessage(!hasResults);
}

function updateCategoryVisibility() {
  const categories = document.querySelectorAll('.category-header');
  
  categories.forEach(category => {
    let hasVisibleItems = false;
    let nextSibling = category.nextElementSibling;
    
    while (nextSibling && !nextSibling.classList.contains('category-header')) {
      if (nextSibling.style.display !== 'none') {
        hasVisibleItems = true;
        break;
      }
      nextSibling = nextSibling.nextElementSibling;
    }
    
    category.style.display = hasVisibleItems ? 'flex' : 'none';
  });
}

function showNoResultsMessage(show) {
  const existingMsg = document.getElementById('no-results-msg');
  
  if (show && !existingMsg) {
    const msg = document.createElement('div');
    msg.id = 'no-results-msg';
    msg.style.cssText = `
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);
      font-style: italic;
    `;
    msg.textContent = 'No matching entries found';
    document.getElementById('pdbList').appendChild(msg);
  } else if (!show && existingMsg) {
    existingMsg.remove();
  }
}

// ========= Enhanced Display PDB Entry Details ========= //
function showDetails(element) {
  // Remove active class from all items with animation
  document.querySelectorAll('#pdbList li').forEach(item => {
    item.classList.remove('active');
  });
  
  // Add active class to clicked item
  element.classList.add('active');
  
  let pdbName = element.textContent;
  let parts = pdbName.split('_');
  let pdbCode = parts[parts.length - 1].toLowerCase();
  let family = parts.slice(0, parts.length - 1).join('_');
  
  let contentDiv = document.getElementById('mainContent');
  
  // Add loading state
  contentDiv.style.opacity = '0';
  contentDiv.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    let html = '';
    
    if (pdbInfo[pdbCode]) {
      html = `
        <div class="detail-header">
          <h1>${pdbInfo[pdbCode]['Protein Name']}</h1>
          <div class="action-buttons">
            <button class="btn btn-secondary" onclick="downloadExcel('${family}')">
              <i class='bx bx-spreadsheet'></i>
              Export Family Data
            </button>
            <button class="btn btn-outline" onclick="showBatchDownload('${family}')">
              <i class='bx bx-select-multiple'></i>
              Batch Download
            </button>
          </div>
        </div>
        
        <div class="pdb-detail">
          <div class="pdb-info">
            <h2><i class='bx bx-info-circle'></i> Structure Information</h2>
            
            <div class="info-row">
              <div class="info-label">
                <i class='bx bx-barcode'></i>
                PDB ID
              </div>
              <div class="info-value">
                <code>${pdbCode.toUpperCase()}</code>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-label">
                <i class='bx bx-category'></i>
                Family
              </div>
              <div class="info-value">${family.replace(/_/g, ' ')}</div>
            </div>
            
            <div class="info-row">
              <div class="info-label">
                <i class='bx bx-test-tube'></i>
                Affinity
              </div>
              <div class="info-value">
                <code>${pdbInfo[pdbCode]['Affinity Data']}</code>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-label">
                <i class='bx bx-chart'></i>
                pKd/pKi/pIC50
              </div>
              <div class="info-value">
                <span class="value-highlight">${pdbInfo[pdbCode]['pKd']}</span>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-label">
                <i class='bx bx-link-alt'></i>
                HB D/A
              </div>
              <div class="info-value">
                <div class="hb-info">
                  <i class='bx bx-donate-heart'></i>
                  <span class="hb-value">${pdbInfo[pdbCode]['HB donor/acceptor']}</span>
                </div>
              </div>
            </div>
            
            ${pdbInfo[pdbCode]['SMILES'] !== "N/A" ? `
              <div class="info-row">
                <div class="info-label">
                  <i class='bx bx-dna'></i>
                  SMILES
                </div>
                <div class="info-value">
                  <div class="smiles-display">
                    <code class="smiles-code">${pdbInfo[pdbCode]['SMILES']}</code>
                    <button class="copy-btn" onclick="copySmiles('${pdbInfo[pdbCode]['SMILES']}')">
                      <i class='bx bx-copy'></i>
                    </button>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
          
          <div class="visualization">
            ${pdbInfo[pdbCode]['SMILES'] !== "N/A" 
              ? `
                <h2><i class='bx bx-atom'></i> Structure Visualization</h2>
                <div class="molecule-viewer">
                  <canvas id="smiles-canvas" width="400" height="400"></canvas>
                  <div class="viewer-controls">
                    <button onclick="resetView()" title="Reset View">
                      <i class='bx bx-reset'></i>
                    </button>
                    <button onclick="downloadMolecule('${pdbCode}')" title="Download Image">
                      <i class='bx bx-image-download'></i>
                    </button>
                  </div>
                </div>
                
                <a href="redirect.html?pdb=${pdbCode}&family=${family}" target="_blank" class="btn btn-primary btn-block">
                  <i class='bx bx-download'></i>
                  Download Trajectory Package
                </a>
              ` 
              : '<div class="no-viz-message"><i class="bx bx-image-alt"></i><p>No structural visualization available for this entry.</p></div>'}
          </div>
        </div>
      `;
    } else {
      html = `
        <div class="pdb-info error-state">
          <h1>${pdbName}</h1>
          <p>No detailed information available for <code>${pdbCode}</code>.</p>
        </div>
      `;
    }
    
    contentDiv.innerHTML = html;
    
    // Animate content in
    requestAnimationFrame(() => {
      contentDiv.style.transition = 'all 0.3s ease';
      contentDiv.style.opacity = '1';
      contentDiv.style.transform = 'translateY(0)';
    });
    
    // Render SMILES structure if available
    if (pdbInfo[pdbCode] && pdbInfo[pdbCode]['SMILES'] !== "N/A") {
      setTimeout(() => {
        try {
          renderMoleculeVisualization(pdbCode);
        } catch (e) {
          console.error('Error rendering SMILES:', e);
        }
      }, 100);
    }
  }, 150);
}

// Enhanced molecule rendering with smooth transitions
function renderMoleculeVisualization(pdbCode) {
  if (!pdbInfo[pdbCode] || pdbInfo[pdbCode]['SMILES'] === "N/A") return;
  
  const smiles = pdbInfo[pdbCode]['SMILES'];
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  
  const colors = {
    light: {
      bond: '#333',
      C: '#555',
      N: '#3970b9',
      O: '#d43d2f',
      S: '#b8a31b',
      P: '#9e5e26',
      F: '#4cb74c',
      Cl: '#58a845',
      Br: '#984f2d',
      I: '#7b4f8e',
      background: '#ffffff'
    },
    dark: {
      bond: '#cccccc',
      C: '#dddddd',
      N: '#64b5f6',
      O: '#ef5350',
      S: '#ffeb3b',
      P: '#ffb74d',
      F: '#81c784',
      Cl: '#7cb342',
      Br: '#d7815a',
      I: '#ba68c8',
      background: '#333333'
    }
  };
  
  const themeColors = colors[theme];
  
  const options = {
    width: 400,
    height: 400,
    bondThickness: theme === 'dark' ? 2.5 : 2,
    atomVisualization: 'balls',
    scale: 1.4,
    bondColor: themeColors.bond,
    backgroundColor: 'transparent',
    atomColors: {
      'C': themeColors.C,
      'N': themeColors.N,
      'O': themeColors.O,
      'S': themeColors.S,
      'P': themeColors.P,
      'F': themeColors.F,
      'Cl': themeColors.Cl,
      'Br': themeColors.Br,
      'I': themeColors.I
    }
  };
  
  const drawer = new SmilesDrawer.Drawer(options);
  SmilesDrawer.parse(smiles, function (tree) {
    drawer.draw(tree, 'smiles-canvas', theme === 'dark' ? 'dark' : 'light');
    
    // Add fade-in animation
    const canvas = document.getElementById('smiles-canvas');
    if (canvas) {
      canvas.style.opacity = '0';
      canvas.style.transform = 'scale(0.9)';
      requestAnimationFrame(() => {
        canvas.style.transition = 'all 0.5s ease';
        canvas.style.opacity = '1';
        canvas.style.transform = 'scale(1)';
      });
    }
  }, function (err) {
    console.error('SMILES parsing error:', err);
    if (document.getElementById('smiles-canvas')) {
      document.getElementById('smiles-canvas').insertAdjacentHTML('afterend', 
        '<p class="error">Unable to render molecular structure.</p>');
    }
  });
  
  const canvas = document.getElementById('smiles-canvas');
  if (canvas) {
    canvas.style.backgroundColor = theme === 'dark' ? '#333333' : '#ffffff';
  }
}

// ========= Enhanced Content Loading Functions ========= //
function loadIntro() {
  animatePageTransition(() => {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
      <h1>LigTraj V1.1</h1>
      <p><strong>LigTraj</strong> is a Python package for ligand trajectory analysis including RMSD, contact analysis, and covariance analysis. The Graph module in LigTraj generates features of MD trajectories with support for MaSIF, distance-contact graphs, and conformational ensembles.</p>

      <img src="img/framework.png" alt="LigTraj Overview" style="max-width:100%; margin: 1.5rem 0;">

      <p>The <strong>GAFFMaker</strong> tool streamlines the process of setting up simulation files for ligand-protein system molecular dynamics (MD) simulations.</p>

      <h2>🧰 Installation</h2>
      <pre><code>git clone https://github.com/aib001/LigTraj.git
cd LigTraj
pip install -e .</code></pre>

      <h2>🚀 Usage Example</h2>
      <pre><code>from LigTraj import TrajAnalysis as ta
from LigTraj import Graph
import os

base_dir = os.path.dirname(os.path.abspath(__file__))

topol = os.path.join(base_dir, "GMX_PROLIG_MD", "solv_ions.gro")
traj = os.path.join(base_dir, "GMX_PROLIG_MD", "prod", "md_aligned.xtc")
sdf = os.path.join(base_dir, "GMX_PROLIG_MD", "ligand.sdf")

# Trajectory Analysis
ta.tsne(topol, traj, resname="LIG", feature_type="coordinates", se3_invariant=True)
ta.rmsd(topol, traj, resname="LIG")
ta.contact(topol, traj, sdf, resname="LIG", distance_cutoff=0.4, n_frames=50)

# Graph Generation
Graph.build(topol, traj, sdf, resname="LIG", n_frames=10)

# Feature Embedding
Graph.feature(topol, traj, sdf, resname="LIG", n_frames=10)

# MaSIF Embedding
Graph.masif_embedding(
    topol, traj, sdf,
    resname="LIG",
    cutoff=0.4,
    n_frames=10,
    distance_mode="geodesic"
)</code></pre>

      <h2>📦 Requirements</h2>
      <div class="requirements-grid">
        <div><i class='bx bx-check'></i> mdtraj</div>
        <div><i class='bx bx-check'></i> numpy</div>
        <div><i class='bx bx-check'></i> pandas</div>
        <div><i class='bx bx-check'></i> matplotlib</div>
        <div><i class='bx bx-check'></i> networkx</div>
        <div><i class='bx bx-check'></i> rdkit</div>
        <div><i class='bx bx-check'></i> tqdm</div>
        <div><i class='bx bx-check'></i> scipy</div>
        <div><i class='bx bx-check'></i> sklearn</div>
        <div><i class='bx bx-check'></i> GROMACS ≥ 2024.2 with CUDA</div>
        <div><i class='bx bx-check'></i> AmberTools ≥ V20</div>
      </div>
    `;
    
    // Add copy functionality to code blocks
    addCopyButtons();
  });
}

function loadDataset() {
  animatePageTransition(() => {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
      <h1>Available Protein Families</h1>
      <p>The LigTraj database contains molecular dynamics trajectories for the following protein families. Click on a family to explore available PDB entries.</p>
      
      <div class="family-cards">
        ${Object.keys(pdbData).map(family => `
          <div class="family-card" onclick="showFamily('${family}')">
            <div class="family-icon"><i class='bx bx-atom'></i></div>
            <h3>${family}</h3>
            <p>${pdbData[family].length} structures</p>
          </div>
        `).join('')}
      </div>
    `;
    
    // Add entrance animation to cards
    animateCards();
  });
}

function showFamily(category) {
  animatePageTransition(() => {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
      <h1>${category}</h1>
      <p>The database contains ${pdbData[category].length} structures for this protein family. Click a PDB ID to view details.</p>
      
      <div class="pdb-grid">
        ${pdbData[category].map(pdb => `
          <div class="pdb-item" onclick="showSelectedPDB('${category}', '${pdb}')">
            <span>${pdb}</span>
          </div>
        `).join('')}
      </div>
    `;
    
    // Add entrance animation to PDB items
    animatePDBItems();
  });
}

function showSelectedPDB(category, pdb) {
  // Find and click the corresponding sidebar element
  const listItems = document.querySelectorAll('#pdbList li:not(.category-header)');
  const targetItem = Array.from(listItems).find(item => 
    item.textContent === `${category}_${pdb}`
  );
  
  if (targetItem) {
    showDetails(targetItem);
    
    // Scroll sidebar to show selected item
    targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function loadContact() {
  animatePageTransition(() => {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
      <h1>Contact Information</h1>
      
      <div class="contact-card">
        <div class="contact-header">
          <i class='bx bx-building-house'></i>
          <h2>Research Groups</h2>
        </div>
        
        <div class="contact-info">
          <p><strong>Institute of Quantitative Biology, Zhejiang University</strong></p>
          <p><strong>Theoretical Chemistry Institute, University of Wisconsin-Madison</strong></p>
        </div>
      </div>
      
      <div class="contact-card">
        <div class="contact-header">
          <i class='bx bx-code-alt'></i>
          <h2>Development Team</h2>
        </div>
        
        <div class="contact-info">
          <p><strong>Lead Developer:</strong> A.I.B. Institute of Quantitative Biology, Zhejiang University & TCI, UW-Madison</p>
          <p><strong>Collaborator:</strong> Xufan Gao, Institute of Quantitative Biology, Zhejiang University</p>
        </div>
      </div>
      
      <div class="contact-visualization">
        <img src="img/contact_background.png" alt="Molecular Visualization" class="contact-image">
      </div>
    `;
  });
}

// ========= Animation Functions ========= //
function animatePageTransition(callback) {
  const mainContent = document.getElementById('mainContent');
  mainContent.style.opacity = '0';
  mainContent.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    callback();
    mainContent.style.transition = 'all 0.5s ease';
    mainContent.style.opacity = '1';
    mainContent.style.transform = 'translateY(0)';
  }, 200);
}

function animateCards() {
  const cards = document.querySelectorAll('.family-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

function animatePDBItems() {
  const items = document.querySelectorAll('.pdb-item');
  items.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
      item.style.transition = 'all 0.3s ease';
      item.style.opacity = '1';
      item.style.transform = 'scale(1)';
    }, index * 30);
  });
}

// ========= Copy Code Functionality ========= //
function addCopyButtons() {
  const codeBlocks = document.querySelectorAll('pre');
  
  codeBlocks.forEach(block => {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);
    
    const button = document.createElement('button');
    button.innerHTML = '<i class="bx bx-copy"></i>';
    button.style.cssText = `
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      padding: 0.5rem;
      cursor: pointer;
      color: #f8f9fa;
      transition: all 0.3s ease;
      font-size: 1.25rem;
      line-height: 1;
    `;
    
    button.onmouseover = () => {
      button.style.background = 'rgba(255, 255, 255, 0.2)';
    };
    
    button.onmouseout = () => {
      button.style.background = 'rgba(255, 255, 255, 0.1)';
    };
    
    button.onclick = () => {
      const code = block.textContent;
      navigator.clipboard.writeText(code).then(() => {
        button.innerHTML = '<i class="bx bx-check"></i>';
        button.style.color = '#4caf50';
        
        setTimeout(() => {
          button.innerHTML = '<i class="bx bx-copy"></i>';
          button.style.color = '#f8f9fa';
        }, 2000);
      });
    };
    
    wrapper.appendChild(button);
  });
}

// ========= Enhanced Theme Toggle ========= //
function initializeTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check for saved theme preference or use OS preference
  const currentTheme = localStorage.getItem('theme') || 
                      (prefersDarkScheme.matches ? 'dark' : 'light');
  
  // Set initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // Add click handler to toggle with smooth transition
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Add transition class
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // If using SmilesDrawer, refresh any molecular visualizations
    if (typeof SmilesDrawer !== 'undefined' && document.getElementById('smiles-canvas')) {
      const activeItem = document.querySelector('.active');
      if (activeItem) {
        const pdbCode = activeItem.textContent.split('_').pop().toLowerCase();
        if (pdbCode && pdbInfo[pdbCode] && pdbInfo[pdbCode]['SMILES'] !== "N/A") {
          setTimeout(() => renderMoleculeVisualization(pdbCode), 300);
        }
      }
    }
  });
}

// ========= Keyboard Shortcuts ========= //
function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('searchInput');
      searchInput.focus();
      searchInput.select();
    }
    
    // Escape to close mobile menu
    if (e.key === 'Escape') {
      const menu = document.getElementById('dropdownMenu');
      const sidebar = document.getElementById('sidebar');
      
      if (menu.style.display === 'block') {
        toggleMenu();
      } else if (sidebar.classList.contains('open')) {
        toggleMenu();
      }
    }
  });
}

// ========= Enhanced Sidebar Population ========= //
function populateSidebar() {
  const pdbList = document.getElementById('pdbList');
  pdbList.innerHTML = ''; // Clear old list

  for (let category in pdbData) {
    // Category header with icon
    const header = document.createElement('li');
    header.innerHTML = `<i class='bx bx-folder'></i> ${category}`;
    header.classList.add('category-header');
    pdbList.appendChild(header);

    // PDB entries with animation
    pdbData[category].forEach((pdb, index) => {
      const item = document.createElement('li');
      item.textContent = `${category}_${pdb}`;
      item.onclick = () => showDetails(item);
      
      // Add staggered animation
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      
      setTimeout(() => {
        item.style.transition = 'all 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, index * 20);
      
      pdbList.appendChild(item);
    });
  }
}

// ========= Responsive Handlers ========= //
function handleResize() {
  const menu = document.getElementById('dropdownMenu');
  const menuIcon = document.getElementById('menuToggle');
  
  if (window.innerWidth > 768) {
    menu.style.display = "none";
    menuIcon.classList.remove('menu-open');
    toggleBackdrop(false);
  }
}

// ========= Loading State ========= //
function showLoadingState() {
  const loader = document.createElement('div');
  loader.id = 'page-loader';
  loader.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--background);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;
  
  loader.innerHTML = `
    <div style="text-align: center;">
      <div style="width: 60px; height: 60px; border: 3px solid var(--border-color); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <p style="margin-top: 1rem; color: var(--text-secondary);">Loading molecular data...</p>
    </div>
    
    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;
  
  document.body.appendChild(loader);
}

function hideLoadingState() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 300);
  }
}

// ========= Debounced search ========= //
const debouncedSearch = debounce(searchPDB, 300);

// ========= Run when page loads ========= //
window.onload = function() {
  showLoadingState();
  
  // Initialize all features
  setTimeout(() => {
    populateSidebar();
    initializeTheme();
    initializeKeyboardShortcuts();
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    
    // Enhanced search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debouncedSearch);
    
    // Initial resize handler call
    handleResize();
    
    // Hide loading state
    hideLoadingState();
    
    // Add initial page animation
    const mainContent = document.getElementById('mainContent');
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(20px)';
    
    requestAnimationFrame(() => {
      mainContent.style.transition = 'all 0.5s ease';
      mainContent.style.opacity = '1';
      mainContent.style.transform = 'translateY(0)';
    });
  }, 500);
};

// ========= Excel Export Functions ========= //
function downloadExcel(family) {
  // Collect data for the family
  const familyData = [];
  const pdbCodes = pdbData[family] || [];
  
  // Add headers
  const headers = ['PDB ID', 'Protein Name', 'Affinity Data', 'pKd/pKi/pIC50', 'HB donor/acceptor', 'SMILES'];
  
  pdbCodes.forEach(pdb => {
    const info = pdbInfo[pdb.toLowerCase()];
    if (info) {
      familyData.push({
        'PDB ID': pdb.toUpperCase(),
        'Protein Name': info['Protein Name'] || 'N/A',
        'Affinity Data': info['Affinity Data'] || 'N/A',
        'pKd/pKi/pIC50': info['pKd'] || 'N/A',
        'HB donor/acceptor': info['HB donor/acceptor'] || 'N/A',
        'SMILES': info['SMILES'] || 'N/A'
      });
    }
  });
  
  // Convert to CSV
  const csv = convertToCSV(familyData, headers);
  
  // Download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${family}_data_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Show success message
  showNotification('Excel file downloaded successfully!', 'success');
}

function convertToCSV(data, headers) {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => 
    headers.map(header => {
      let cell = row[header] || '';
      // Escape quotes and wrap in quotes if contains comma
      if (cell.toString().includes(',') || cell.toString().includes('"')) {
        cell = '"' + cell.toString().replace(/"/g, '""') + '"';
      }
      return cell;
    }).join(',')
  );
  
  return csvHeaders + '\n' + csvRows.join('\n');
}

// ========= Batch Download Functions ========= //
function showBatchDownload(family) {
  const modal = createBatchDownloadModal(family);
  document.body.appendChild(modal);
  
  // Animate in
  requestAnimationFrame(() => {
    modal.classList.add('active');
  });
}

function createBatchDownloadModal(family) {
  const pdbCodes = pdbData[family] || [];
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'batchDownloadModal';
  
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2><i class='bx bx-select-multiple'></i> Batch Download - ${family}</h2>
        <button class="modal-close" onclick="closeBatchModal()">
          <i class='bx bx-x'></i>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="select-controls">
          <span id="selectedCount">0 selected</span>
          <div>
            <button onclick="selectAllItems(true)">Select All</button>
            <button onclick="selectAllItems(false)">Deselect All</button>
          </div>
        </div>
        
        <div class="selection-list">
          ${pdbCodes.map(pdb => {
            const info = pdbInfo[pdb.toLowerCase()];
            const affinity = info ? info['Affinity Data'] : 'N/A';
            const pkd = info ? info['pKd'] : 'N/A';
            
            return `
              <div class="selection-item">
                <input type="checkbox" id="pdb_${pdb}" value="${pdb}" onchange="updateSelectedCount()">
                <label for="pdb_${pdb}">
                  <span><strong>${pdb.toUpperCase()}</strong></span>
                  <div class="item-info">
                    <span>Affinity: ${affinity}</span>
                    <span>pKd: ${pkd}</span>
                  </div>
                </label>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeBatchModal()">Cancel</button>
        <button class="btn btn-secondary" onclick="downloadBatchData('${family}')">
          <i class='bx bx-spreadsheet'></i>
          Export Selected Data
        </button>
        <button class="btn btn-primary" onclick="downloadBatchCommands('${family}')">
          <i class='bx bx-terminal'></i>
          Get Download Commands
        </button>
      </div>
    </div>
  `;
  
  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeBatchModal();
    }
  });
  
  return modal;
}

function closeBatchModal() {
  const modal = document.getElementById('batchDownloadModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  }
}

function selectAllItems(select) {
  const checkboxes = document.querySelectorAll('.selection-list input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = select);
  updateSelectedCount();
}

function updateSelectedCount() {
  const checkboxes = document.querySelectorAll('.selection-list input[type="checkbox"]:checked');
  const countElement = document.getElementById('selectedCount');
  if (countElement) {
    countElement.textContent = `${checkboxes.length} selected`;
  }
}

function downloadBatchData(family) {
  const selected = getSelectedPDBs();
  if (selected.length === 0) {
    showNotification('Please select at least one PDB entry', 'warning');
    return;
  }
  
  // Collect data for selected PDBs
  const selectedData = [];
  const headers = ['PDB ID', 'Family', 'Protein Name', 'Affinity Data', 'pKd/pKi/pIC50', 'HB donor/acceptor', 'SMILES'];
  
  selected.forEach(pdb => {
    const info = pdbInfo[pdb.toLowerCase()];
    if (info) {
      selectedData.push({
        'PDB ID': pdb.toUpperCase(),
        'Family': family,
        'Protein Name': info['Protein Name'] || 'N/A',
        'Affinity Data': info['Affinity Data'] || 'N/A',
        'pKd/pKi/pIC50': info['pKd'] || 'N/A',
        'HB donor/acceptor': info['HB donor/acceptor'] || 'N/A',
        'SMILES': info['SMILES'] || 'N/A'
      });
    }
  });
  
  // Convert to CSV and download
  const csv = convertToCSV(selectedData, headers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${family}_selected_data_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification(`Exported ${selected.length} entries to Excel`, 'success');
  closeBatchModal();
}

function downloadBatchCommands(family) {
  const selected = getSelectedPDBs();
  if (selected.length === 0) {
    showNotification('Please select at least one PDB entry', 'warning');
    return;
  }
  
  const fixedFamily = family.replace(/ /g, '_');
  const commands = selected.map(pdb => 
    `scp -r -P 43276 shizq@10.77.14.128:/public/home/shizq/GROMACS_MD/GAFF_PROLIG/${fixedFamily}/${pdb} ./`
  ).join('\n');
  
  // Create batch script
  const script = `#!/bin/bash
# Batch download script for ${family}
# Generated on ${new Date().toISOString()}
# Total files: ${selected.length}

${commands}

echo "Download completed!"
`;
  
  // Download script
  const blob = new Blob([script], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${family}_batch_download.sh`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification(`Generated download script for ${selected.length} files`, 'success');
  closeBatchModal();
}

function getSelectedPDBs() {
  const checkboxes = document.querySelectorAll('.selection-list input[type="checkbox"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

// ========= Utility Functions ========= //
function copySmiles(smiles) {
  navigator.clipboard.writeText(smiles).then(() => {
    showNotification('SMILES copied to clipboard!', 'success');
  }).catch(() => {
    showNotification('Failed to copy SMILES', 'error');
  });
}

function resetView() {
  const canvas = document.getElementById('smiles-canvas');
  if (canvas) {
    const activeItem = document.querySelector('.active');
    if (activeItem) {
      const pdbCode = activeItem.textContent.split('_').pop().toLowerCase();
      if (pdbCode && pdbInfo[pdbCode] && pdbInfo[pdbCode]['SMILES'] !== "N/A") {
        renderMoleculeVisualization(pdbCode);
      }
    }
  }
}

function downloadMolecule(pdbCode) {
  const canvas = document.getElementById('smiles-canvas');
  if (canvas) {
    const link = document.createElement('a');
    link.download = `${pdbCode}_structure.png`;
    link.href = canvas.toDataURL();
    link.click();
    showNotification('Molecule image downloaded!', 'success');
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class='bx ${type === 'success' ? 'bx-check-circle' : type === 'error' ? 'bx-x-circle' : type === 'warning' ? 'bx-error' : 'bx-info-circle'}'></i>
    <span>${message}</span>
  `;
  
  notification.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196f3'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 500;
    z-index: 3000;
    animation: slideInRight 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);