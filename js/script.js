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
  }
}

// ========= Search and Filter Function ========= //
function searchPDB() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const listItems = document.querySelectorAll('#pdbList li:not(.category-header)');
  
  if (input.trim() === '') {
    listItems.forEach(item => {
      item.style.display = "block";
    });
    return;
  }
  
  listItems.forEach(item => {
    if (item.textContent.toLowerCase().includes(input)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

// ========= Display PDB Entry Details ========= //
function showDetails(element) {
  // Remove active class from all items
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
  let html = '';
  
  if (pdbInfo[pdbCode]) {
    html = `
      <h1>${pdbInfo[pdbCode]['Protein Name']}</h1>
      <div class="pdb-detail">
        <div class="pdb-info">
          <h2>Structure Information</h2>
          <p><strong>PDB ID:</strong> <span>${pdbCode.toUpperCase()}</span></p>
          <p><strong>Family:</strong> <span>${family.replace(/_/g, ' ')}</span></p>
          <p><strong>Affinity Data:</strong> <span>${pdbInfo[pdbCode]['Affinity Data']}</span></p>
          <p><strong>pKd/pKi/pIC50:</strong> <span>${pdbInfo[pdbCode]['pKd']}</span></p>
          <p><strong>HB donor/acceptor:</strong> <span>${pdbInfo[pdbCode]['HB donor/acceptor']}</span></p>
          ${pdbInfo[pdbCode]['SMILES'] !== "N/A" ? 
            `<p><strong>SMILES:</strong> <div class="smiles-container">${pdbInfo[pdbCode]['SMILES']}</div></p>` : ''}
        </div>
        
        <div class="visualization">
          ${pdbInfo[pdbCode]['SMILES'] !== "N/A" 
            ? `
              <h2>Structure Visualization</h2>
              <canvas id="smiles-canvas" width="300" height="300"></canvas>
              
              <a href="redirect.html?pdb=${pdbCode}&family=${family}" target="_blank" class="btn">
                <i class='bx bx-download'></i>
                Download Trajectory Package
              </a>
            ` 
            : '<p>No structural visualization available for this entry.</p>'}
        </div>
      </div>
    `;
  } else {
    html = `
      <div class="pdb-info">
        <h1>${pdbName}</h1>
        <p>No detailed information available for <code>${pdbCode}</code>.</p>
      </div>
    `;
  }
  
  contentDiv.innerHTML = html;
  
  // Render SMILES structure if available
  if (pdbInfo[pdbCode] && pdbInfo[pdbCode]['SMILES'] !== "N/A") {
    try {
      renderMoleculeVisualization(pdbCode);
    } catch (e) {
      console.error('Error rendering SMILES:', e);
    }
  }
}

// Function to render molecule with theme-appropriate colors
function renderMoleculeVisualization(pdbCode) {
  if (!pdbInfo[pdbCode] || pdbInfo[pdbCode]['SMILES'] === "N/A") return;
  
  const smiles = pdbInfo[pdbCode]['SMILES'];
  const theme = document.documentElement.getAttribute('data-theme');
  
  const options = {
    width: 300,
    height: 300,
    bondThickness: 2,
    atomVisualization: 'balls',
    bondColor: getComputedStyle(document.documentElement).getPropertyValue('--molecule-bond').trim(),
    atomColors: {
      'C': getComputedStyle(document.documentElement).getPropertyValue('--molecule-c').trim(),
      'N': getComputedStyle(document.documentElement).getPropertyValue('--molecule-n').trim(),
      'O': getComputedStyle(document.documentElement).getPropertyValue('--molecule-o').trim()
    }
  };
  
  const drawer = new SmilesDrawer.Drawer(options);
  SmilesDrawer.parse(smiles, function (tree) {
    drawer.draw(tree, 'smiles-canvas', theme === 'dark' ? 'dark' : 'light');
  }, function (err) {
    console.error('SMILES parsing error:', err);
    if (document.getElementById('smiles-canvas')) {
      document.getElementById('smiles-canvas').insertAdjacentHTML('afterend', 
        '<p class="error">Unable to render molecular structure.</p>');
    }
  });
}

// ========= Load Content Functions ========= //
function loadIntro() {
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
}

function loadDataset() {
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
}

function showFamily(category) {
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
}

function showSelectedPDB(category, pdb) {
  // Find and click the corresponding sidebar element
  const listItems = document.querySelectorAll('#pdbList li:not(.category-header)');
  const targetItem = Array.from(listItems).find(item => 
    item.textContent === `${category}_${pdb}`
  );
  
  if (targetItem) {
    showDetails(targetItem);
  }
}

function loadContact() {
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
        <p><strong>Translational Chemistry Institute, University of Wisconsin-Madison</strong></p>
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
}

// ========= Theme Toggle Functionality ========= //
function initializeTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check for saved theme preference or use OS preference
  const currentTheme = localStorage.getItem('theme') || 
                      (prefersDarkScheme.matches ? 'dark' : 'light');
  
  // Set initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // Add click handler to toggle
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // If using SmilesDrawer, refresh any molecular visualizations
    if (typeof SmilesDrawer !== 'undefined' && document.getElementById('smiles-canvas')) {
      const pdbCode = document.querySelector('.active')?.textContent.split('_').pop();
      if (pdbCode && pdbInfo[pdbCode] && pdbInfo[pdbCode]['SMILES'] !== "N/A") {
        renderMoleculeVisualization(pdbCode);
      }
    }
  });
}

// ========= Populate Sidebar ========= //
function populateSidebar() {
  const pdbList = document.getElementById('pdbList');
  pdbList.innerHTML = ''; // Clear old list

  for (let category in pdbData) {
    // Category header
    const header = document.createElement('li');
    header.textContent = category;
    header.classList.add('category-header');
    pdbList.appendChild(header);

    // PDB entries
    pdbData[category].forEach(pdb => {
      const item = document.createElement('li');
      item.textContent = `${category}_${pdb}`;
      item.onclick = () => showDetails(item);
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
  }
}

// ========= Run when page loads ========= //
window.onload = function() {
  populateSidebar();
  initializeTheme();
  
  // Event listeners
  window.addEventListener('resize', handleResize);
  
  // Initial resize handler call
  handleResize();
};