// js/data.js
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
        <img src="img/contact_background.png" alt="contact visualization" style="width: 100%; border-radius: 12px; margin-top: 20px;">

    `;
}
