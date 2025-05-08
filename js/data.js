// js/data.js
const pdbData = {
    "CDK Family": [
        "1unl", "3qtq", "3qts", "3qtw", "3qu0", "3r8z", "3r9h", "3rah",
        "3qqk", "3qtr", "3qtu", "3qtz", "3r8u", "3r9d", "3r9o",
        "3rak", "3rjc", "3rk9", "3rmf", "3rpr", "3rpy", "3s00", "3s2p", "3ti1",
        "3ral", "3rk7", "3rkb", "3rni", "3rpv", "3rzb", "3s1h", "3sqq",
        "3tiy", "3uli", "4acm", "4aua", "4bcg", "4bci", "4bck", "4bcn", "4bcp",
        "3tiz", "3wbl", "4au8", "4bcf", "4bch", "4bcj", "4bcm", "4bco", "4bcq",
        "4bgh", "4cfv", "4cfx", "4eok", "4eon", "4eor", "4erw", "4ez5",
        "4cfm", "4cfw", "4eoi", "4eol", "4eop", "4eos", "4ez3", "4lyn",
        "4rj3", "5d1j", "5i5z", "5idn", "5jq5", "5k4j", "5l2s", "5l2w", "5lqf", "5nev",
        "5bnj", "5hvy", "5icp", "5idp", "5jq8", "5l2i", "5l2t", "5lmk", "5mhq",
        "5xqx", "5xs2", "6b3e", "6ckx", "6gzh", "6q4e"
    ],
    "Tyrosine Kinase": [
        "1b55", "1nlp", "2i0v", "2vwu", "3aox", "3fzs", "3l8v", "3t9t", "4cki", "4fny", "4foc", "4h1m", "4v01", "4yhf", "4zlz", "5eyc", "5h2u", "5iui",
        "1bwn", "1t46", "2i0y", "2vwv", "3et7", "3fzt", "3oct", "3ue4", "4ckj", "4fnz", "4fod", "4joa", "4v04", "4z3v", "5amn", "5eyd", "5iug", "5j87",
        "1nlo", "2fgi", "2i1m", "2vww", "3fzr", "3h3c", "3qup", "4cd0", "4dce", "4fob", "4h1j", "4otf", "4v05", "4zly", "5e1s", "5fdp", "5iuh"
    ]
};

// ========= Load Dataset Overview ========= //
function loadDataset() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <h1>Available Families</h1>
        <p>Click a family to view its PDB entries:</p>
    `;

    for (let category in pdbData) {
        const button = document.createElement('button');
        button.textContent = category;
        button.style.margin = '10px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#00cccc';
        button.style.border = 'none';
        button.style.color = 'white';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.onclick = () => showFamily(category);

        mainContent.appendChild(button);
    }
}

// ========= Show PDBs for a Family ========= //
function showFamily(category) {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <h1>${category}</h1>
        <p>Click a PDB ID to view details:</p>
    `;

    pdbData[category].forEach(pdb => {
        const link = document.createElement('a');
        link.textContent = pdb;
        link.href = '#';
        link.style.display = 'inline-block';
        link.style.margin = '5px';
        link.style.padding = '8px 12px';
        link.style.backgroundColor = '#0066cc';
        link.style.color = 'white';
        link.style.textDecoration = 'none';
        link.style.borderRadius = '4px';
        link.onclick = (e) => {
            e.preventDefault();
            // 复用 showDetails，和左侧点击效果一致
            const fakeItem = { textContent: `${category}_${pdb}` };
            showDetails(fakeItem);
        };

        mainContent.appendChild(link);
    });
}

// ========= Load Contact Info ========= //
function loadContact() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <h1>Contact</h1>
        <p><strong>Developer:</strong> A.I.B. Institute of Quantitative Biology, Zhejiang University & TCI, UW-Madison</p>
        <p><strong>Collaborating Developer:</strong> Xufan Gao, Institute of Quantitative Biology, Zhejiang University</p>
    `;
}
