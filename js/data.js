// Enhanced js/data.js with additional utility functions
const pdbData = {
    "CDK Family": [
        "3qts", "3qtu", "3qtw", "3qtz", "3r8u", "3r8z", "1unl", "3qqk", "3qtq", "3qtr", "3qu0", "3r9d", "3r9h", "3r9o", "3rah", "3rak", "3rmf", "3rpr", "3rpv", "3rzb", "3s00", "3s1h", "3ral", "3rjc", "3rk7", "3rk9", "3rkb", "3rni", "3rpy", "3s2p", "3sqq", "3ti1", "3tiy", "3uli", "3wbl", "4bcg", "4bch", "4bcj", "4bcn", "4bcq", "3tiz", "4acm", "4au8", "4aua", "4bcf", "4bci", "4bck", "4bcm", "4bco", "4bcp", "4cfw", "4eoi", "4eok", "4eop", "4eos", "4erw", "4ez3", "4ez5", "4lyn", "4bgh", "4cfm", "4cfv", "4cfx", "4eol", "4eon", "4eor", "4rj3", "5i5z", "5icp", "5idn", "5idp", "5jq5", "5jq8", "5k4j", "5l2i", "5l2s", "5lmk", "5nev", "5bnj", "5d1j", "5hvy", "5l2t", "5l2w", "5lqf", "5mhq", "5xs2", "6b3e", "6ckx", "6gzh", "6q4e", "5xqx"
    ],
    "Tyrosine Kinase": [
        "1b55", "1nlp", "2i0v", "2vwu", "3aox", "3fzs", "3l8v", "3t9t", "4cki", "4fny", "4foc", "4h1m", "4v01", "4yhf", "4zlz", "5eyc", "5h2u", "5iui",
        "1bwn", "1t46", "2i0y", "2vwv", "3et7", "3fzt", "3oct", "3ue4", "4ckj", "4fnz", "4fod", "4joa", "4v04", "4z3v", "5amn", "5eyd", "5iug", "5j87",
        "1nlo", "2fgi", "2i1m", "2vww", "3fzr", "3h3c", "3qup", "4cd0", "4dce", "4fob", "4h1j", "4otf", "4v05", "4zly", "5e1s", "5fdp", "5iuh"
    ],
    "JAK":[
        "2b7a", "2w1i", "3jy9", "3lxk", "3q32", "3tjd", "3ugc", "3zc6", "3zmm", "4bbf", "4c61", "4d0w", "4d1s", "4e5w", "4e6d", "4e6q", "4f09", "4fk6", "4gmy", "4hge", "4hvd", "4hvh", "4i6q", "4ivb", "4ivd", "4k6z", "4ytc", "4yti", "4zim", "5cf5", "5cf8", "5l3a", "5lwn", "2xa4", "3fup", "3io7", "3iok", "3krr", "3lpb", "3lxl", "3pjc", "3rvg", "3tjc", "3zep", "4aqc", "4bbe", "4d0x", "4e4l", "4e4n", "4ehz", "4ei4", "4f08", "4gfm", "4hvg", "4hvi", "4i5c", "4iva", "4ivc", "4k77", "4qps", "4qt1", "4rio", "4ytf", "4yth", "5aep", "5cf4", "5cf6", "5e1e", "5hx8", "5khx", "5lwm"
    ],
    "RTKs":[
        "3qup", "4cd0", "5amn", "5eyd", "5fdp", "5eyc"
    ],
    "PI3K":[
        "3prz", "3qaq", "3qk0", "3zvv", "4anv", "4anx", "4aof", "4bfr", "4jps", "4ps7", "4wwo", "4wwp", "5dxh", "5dxu", "5eds", "5g2n", "6gvg", "6gvi", "6mum", "6oac", "6oco", "6pys", "6pyu", "6q74", "3dbs", "3l08", "3l54", "3lj3", "3nzs", "3nzu", "3oaw", "3ps6", "3qar", "3s2a", "3zw3", "4ajw", "4anu", "4anw", "4gb9", "4l23", "4ps3", "4ps8", "4v0i", "4waf", "4wwn", "4xe0", "5dxt", "5itd", "6ftn", "6g6w", "6gvf", "6gvh", "6gy0", "6mul", "6ocu", "6pyr", "6q6y", "6q73"
    ],
    "MAPK":[
        "1ouk", "1pmu", "1w7h", "1w83", "1wbo", "1wbt", "1wbv", "1yw2", "1ywr", "1zz2", "2bak", "2g01", "2o0u", "1kv1", "1m7q", "1ouy", "1ove", "1pmn", "1pmv", "1w82", "1w84", "1wbn", "1wbs", "1wbw", "1wzy", "1zyj", "1zzl", "2baj", "2bal", "2ewa", "2gfs", "2gmx", "2h96", "2i0h", "2no3", "2ojg", "2oji", "2qd9", "2rg5", "2yis", "2yix", "3da6", "3dtc", "3e7o", "3e8n", "3eqb", "3fv8", "3g9n", "3gfe", "3hrb", "3i5z", "3iph", "3k3j", "3kvx", "3lhj", "2o2u", "2ojj", "2ok1", "2rg6", "2waj", "2yiw", "3ctq", "3ds6", "3dt1", "3fc1", "3g90", "3g9l", "3i60", "3itz", "3k3i"
    ]
};

// Family descriptions for better UX
const familyDescriptions = {
    "CDK Family": "Cyclin-dependent kinases involved in cell cycle regulation",
    "Tyrosine Kinase": "Enzymes that phosphorylate tyrosine residues on proteins",
    "JAK": "Janus kinases involved in cytokine signaling",
    "RTKs": "Receptor tyrosine kinases that regulate cellular processes",
    "PI3K": "Phosphoinositide 3-kinases involved in cellular signaling",
    "MAPK": "Mitogen-activated protein kinases in signal transduction"
};

// Family icons for visual identification
const familyIcons = {
    "CDK Family": "bx-dna",
    "Tyrosine Kinase": "bx-atom",
    "JAK": "bx-link",
    "RTKs": "bx-radar",
    "PI3K": "bx-network-chart",
    "MAPK": "bx-git-branch"
};

// Statistics helper functions
const pdbStats = {
    getTotalCount: () => {
        return Object.values(pdbData).reduce((total, family) => total + family.length, 0);
    },
    
    getFamilyCount: (family) => {
        return pdbData[family] ? pdbData[family].length : 0;
    },
    
    searchPDB: (query) => {
        const results = [];
        const searchTerm = query.toLowerCase();
        
        for (const [family, pdbs] of Object.entries(pdbData)) {
            pdbs.forEach(pdb => {
                if (pdb.toLowerCase().includes(searchTerm) || 
                    family.toLowerCase().includes(searchTerm)) {
                    results.push({ family, pdb });
                }
            });
        }
        
        return results;
    },
    
    getRandomPDB: () => {
        const families = Object.keys(pdbData);
        const randomFamily = families[Math.floor(Math.random() * families.length)];
        const pdbs = pdbData[randomFamily];
        const randomPDB = pdbs[Math.floor(Math.random() * pdbs.length)];
        
        return { family: randomFamily, pdb: randomPDB };
    }
};

// Export visualization data for charts
const getVisualizationData = () => {
    return Object.entries(pdbData).map(([family, pdbs]) => ({
        name: family,
        count: pdbs.length,
        percentage: ((pdbs.length / pdbStats.getTotalCount()) * 100).toFixed(1)
    }));
};

// Helper function to check if PDB exists
const pdbExists = (pdbCode) => {
    const code = pdbCode.toLowerCase();
    for (const family of Object.values(pdbData)) {
        if (family.includes(code)) {
            return true;
        }
    }
    return false;
};

// Get family for a specific PDB
const getFamilyForPDB = (pdbCode) => {
    const code = pdbCode.toLowerCase();
    for (const [family, pdbs] of Object.entries(pdbData)) {
        if (pdbs.includes(code)) {
            return family;
        }
    }
    return null;
};

// Batch download helper
const getBatchDownloadCommands = (pdbList) => {
    const commands = [];
    
    pdbList.forEach(({ family, pdb }) => {
        const fixedFamily = family.replace(/ /g, '_');
        const scpPath = `scp -r -P 43276 shizq@10.77.14.128:/public/home/shizq/GROMACS_MD/GAFF_PROLIG/${fixedFamily}/${pdb} ./`;
        commands.push(scpPath);
    });
    
    return commands.join('\n');
};

// Enhanced family display with statistics
function showFamilyWithStats(category) {
    const mainContent = document.getElementById('mainContent');
    const description = familyDescriptions[category] || "Protein family structures";
    const icon = familyIcons[category] || "bx-atom";
    const count = pdbData[category].length;
    const percentage = ((count / pdbStats.getTotalCount()) * 100).toFixed(1);
    
    mainContent.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <i class='bx ${icon}' style="font-size: 3rem; color: var(--primary);"></i>
            <div>
                <h1 style="margin: 0;">${category}</h1>
                <p style="margin: 0; color: var(--text-secondary);">${description}</p>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div style="background: var(--background); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
                <h3 style="color: var(--primary); margin: 0;">${count}</h3>
                <p style="margin: 0; font-size: 0.875rem; color: var(--text-secondary);">Total Structures</p>
            </div>
            <div style="background: var(--background); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
                <h3 style="color: var(--accent); margin: 0;">${percentage}%</h3>
                <p style="margin: 0; font-size: 0.875rem; color: var(--text-secondary);">of Database</p>
            </div>
        </div>
        
        <p>Click a PDB ID to view detailed structure information and download options.</p>
        
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
}

// Replace the original showFamily function if needed
window.showFamily = showFamilyWithStats;