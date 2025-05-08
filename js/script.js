// ========= Search and Filter Function ========= //
function searchPDB() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let listItems = document.querySelectorAll('#pdbList li');

    listItems.forEach(item => {
        // Skip category headers
        if (item.style.cursor === 'default') return;

        item.style.display = "block";
    });

    if (input.trim() === '') return;

    listItems.forEach(item => {
        if (item.style.cursor === 'default') return;
        if (!item.textContent.toLowerCase().includes(input)) {
            item.style.display = "none";
        }
    });
}

// ========= Display PDB Entry Details ========= //
// function showDetails(element) {
//     let pdbName = element.textContent;  // e.g., "CDK Family_3qtq"
//     let parts = pdbName.split('_');
//     let pdbCode = parts[1];  // 取出 "3qtq"

//     let contentDiv = document.getElementById('mainContent');

//     let html = `<h1>${pdbName}</h1>`;

//     // 检查是否有详细信息
//     if (pdbInfo[pdbCode]) {
//         html += `
//             <p><strong>Affinity Data:</strong> ${pdbInfo[pdbCode]['Affinity Data']}</p>
//             <p><strong>pKd/pKi/pIC50:</strong> ${pdbInfo[pdbCode]['pKd']}</p>
//             <p><strong>SMILES:</strong> ${pdbInfo[pdbCode]['SMILES']}</p>
//             <p><strong>HB donor/acceptor:</strong> ${pdbInfo[pdbCode]['HB donor/acceptor']}</p>
//         `;
//     } else {
//         html += `<p>No detailed information available.</p>`;
//     }

//     contentDiv.innerHTML = html;
// }

function showDetails(element) {
    let pdbName = element.textContent;  // e.g., "CDK Family_3qtq"
    let parts = pdbName.split('_');
    let pdbCode = parts[1];  // 取出 "3qtq"

    let contentDiv = document.getElementById('mainContent');

    let html = `<h1>${pdbName}</h1>`;

    if (pdbInfo[pdbCode]) {
        html += `
            <p><strong>Affinity Data:</strong> ${pdbInfo[pdbCode]['Affinity Data']}</p>
            <p><strong>pKd/pKi/pIC50:</strong> ${pdbInfo[pdbCode]['pKd']}</p>
            <p><strong>SMILES:</strong> ${pdbInfo[pdbCode]['SMILES']}</p>
            <p><strong>HB donor/acceptor:</strong> ${pdbInfo[pdbCode]['HB donor/acceptor']}</p>
        `;

        // 如果有SMILES，准备画图的容器
        if (pdbInfo[pdbCode]['SMILES'] !== "N/A") {
            html += `<canvas id="smiles-canvas" width="300" height="300"></canvas>`;
        }

    } else {
        html += `<p>No detailed information available.</p>`;
    }

    contentDiv.innerHTML = html;

    // 如果有SMILES，绘制结构
    if (pdbInfo[pdbCode] && pdbInfo[pdbCode]['SMILES'] !== "N/A") {
        let smiles = pdbInfo[pdbCode]['SMILES'];
        let drawer = new SmilesDrawer.Drawer({ width: 300, height: 300 });
        SmilesDrawer.parse(smiles, function (tree) {
            drawer.draw(tree, 'smiles-canvas', 'light');
        }, function (err) {
            console.error('SMILES 解析失败:', err);
        });
    }
}



// ========= Dropdown Menu Toggle ========= //
function toggleMenu() {
    let menu = document.getElementById('dropdownMenu');
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}

// ========= Load Intro Content ========= //
function loadIntro() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <h1>LigTraj V1.1 -- By A.I.B.</h1>
        <p><strong>LigTraj</strong> is a Python package for ligand trajectory analysis including RMSD, contact analysis, and covariance analysis etc. Graph module in LigTraj is designed to generate features of MD trajectories. Recent updated features used for embedding include MaSIF, distance-contact graphs, conformational ensembles etc.</p>

        <img src="img/framework.png" alt="LigTraj Overview" style="max-width:100%; margin-bottom:10px; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.4);">

        <p>The <strong>GAFFMaker</strong> tool is used to streamline the process of setting up simulation files for ligand-protein system molecular dynamics (MD) simulations.</p>

        <h2>🧰 Installation</h2>
        <pre><code>git clone https://github.com/aib001/LigTraj.git #you can use ssh for a quicker fetch
cd LigTraj
pip install -e .</code></pre>

        <h2>🚀 Usage</h2>
        <pre><code>from LigTraj import TrajAnalysis as ta
from LigTraj import Graph
import os

base_dir = os.path.dirname(os.path.abspath(__file__))

topol = os.path.join(base_dir, "GMX_PROLIG_MD", "solv_ions.gro")
traj = os.path.join(base_dir, "GMX_PROLIG_MD", "prod", "md_aligned.xtc")
sdf = os.path.join(base_dir, "GMX_PROLIG_MD", "v2020_3tiy_ligand_1746191494002.sdf")

##################################
# Part 1. Traj Analysis Example
##################################

ta.tsne(topol, traj, resname="LIG", feature_type="coordinates", se3_invariant=True)
ta.rmsd(topol, traj, resname="LIG")
ta.contact(topol, traj, sdf, resname="LIG", distance_cutoff=0.4, n_frames=50)
ta.covariance(topol, traj, resname="LIG")

##################################
# Part 2. Graph Generate Test
##################################

Graph.build(topol, traj, sdf, resname="LIG", n_frames=10)

##################################
# Part 3. Graph Feature Embedding Test 
##################################

Graph.feature(topol, traj, sdf, resname="LIG", n_frames=10)

##################################
# Part 4. MaSIF Embedding
##################################

Graph.masif_embedding(
    topol, traj, sdf,
    resname="LIG",
    cutoff=0.4,
    n_frames=10,
    distance_mode="euclidean"
)

Graph.masif_embedding(
    topol, traj, sdf,
    resname="LIG",
    cutoff=0.4,
    n_frames=10,
    distance_mode="geodesic"
)

print("All analyses completed.")</code></pre>

        <h2>📦 Requirements</h2>
        <ul>
            <li>mdtraj</li>
            <li>numpy</li>
            <li>pandas</li>
            <li>matplotlib</li>
            <li>networkx</li>
            <li>rdkit</li>
            <li>tqdm</li>
            <li>scipy</li>
            <li>sklearn</li>
            <li>GROMACS ≥ 2024.2 with CUDA</li>
            <li>AmberTools ≥ V20</li>
        </ul>
    `;
}

// ========= Populate Sidebar ========= //
function populateSidebar() {
    const pdbList = document.getElementById('pdbList');
    pdbList.innerHTML = ''; // Clear old list

    for (let category in pdbData) {
        // Category header
        const header = document.createElement('li');
        header.textContent = category;
        header.style.fontWeight = 'bold';
        header.style.marginTop = '10px';
        header.style.cursor = 'default';
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

// ========= Run when page loads ========= //
window.onload = function () {
    populateSidebar();
};
