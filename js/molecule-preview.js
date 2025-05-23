// molecule-preview.js - 为 PDB 项目添加悬停预览效果
// 在 ligtraj.html 中引入此文件: <script src="js/molecule-preview.js"></script>

class MoleculePreview {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.particles = [];
    this.bonds = [];
    this.rotation = { x: 0, y: 0 };
    this.currentPDB = null;
    
    this.init();
  }
  
  init() {
    // 创建预览画布
    this.createCanvas();
    
    // 添加事件监听
    this.attachEventListeners();
  }
  
  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'molecule-preview';
    this.canvas.width = 200;
    this.canvas.height = 200;
    this.canvas.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      display: none;
    `;
    
    // 添加深色模式支持
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
      this.canvas.style.background = 'rgba(30, 30, 30, 0.95)';
    }
    
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
  }
  
  attachEventListeners() {
    // 监听所有 PDB 项目的悬停事件
    document.addEventListener('mouseover', (e) => {
      const pdbItem = e.target.closest('.pdb-item');
      if (pdbItem) {
        const pdbCode = pdbItem.textContent.trim();
        this.showPreview(pdbCode, e.pageX, e.pageY);
      }
    });
    
    document.addEventListener('mouseout', (e) => {
      const pdbItem = e.target.closest('.pdb-item');
      if (pdbItem) {
        this.hidePreview();
      }
    });
    
    // 跟随鼠标移动
    document.addEventListener('mousemove', (e) => {
      if (this.canvas.style.display === 'block') {
        this.updatePosition(e.pageX, e.pageY);
      }
    });
    
    // 主题切换时更新背景
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        setTimeout(() => {
          const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
          this.canvas.style.background = isDark ? 
            'rgba(30, 30, 30, 0.95)' : 
            'rgba(255, 255, 255, 0.95)';
        }, 100);
      });
    }
  }
  
  generateMoleculeStructure(pdbCode) {
    // 根据 PDB 代码生成简化的分子结构
    // 这里使用随机生成来模拟不同的分子结构
    this.particles = [];
    this.bonds = [];
    
    const seed = pdbCode.charCodeAt(0) + pdbCode.charCodeAt(1);
    const particleCount = 5 + (seed % 10);
    
    // 生成原子
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 30 + (seed * i % 30);
      const z = (Math.random() - 0.5) * 40;
      
      const types = ['C', 'N', 'O', 'S'];
      const type = types[(seed + i) % types.length];
      
      this.particles.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: z,
        type: type,
        radius: type === 'C' ? 8 : type === 'N' ? 7 : type === 'O' ? 6 : 5,
        color: this.getAtomColor(type)
      });
    }
    
    // 生成化学键
    for (let i = 0; i < particleCount; i++) {
      const connections = 1 + (seed * i % 3);
      for (let j = 0; j < connections; j++) {
        const target = (i + j + 1) % particleCount;
        if (!this.bonds.find(b => 
          (b.from === i && b.to === target) || 
          (b.from === target && b.to === i)
        )) {
          this.bonds.push({ from: i, to: target });
        }
      }
    }
  }
  
  getAtomColor(type) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const colors = {
      light: {
        C: '#555555',
        N: '#3970b9',
        O: '#d43d2f',
        S: '#b8a31b'
      },
      dark: {
        C: '#dddddd',
        N: '#64b5f6',
        O: '#ef5350',
        S: '#ffeb3b'
      }
    };
    
    return colors[isDark ? 'dark' : 'light'][type] || '#999999';
  }
  
  showPreview(pdbCode, x, y) {
    if (this.currentPDB === pdbCode) return;
    
    this.currentPDB = pdbCode;
    this.canvas.style.display = 'block';
    this.updatePosition(x, y);
    
    // 生成分子结构
    this.generateMoleculeStructure(pdbCode);
    
    // 淡入动画
    setTimeout(() => {
      this.canvas.style.opacity = '1';
    }, 10);
    
    // 开始动画
    this.animate();
  }
  
  hidePreview() {
    this.canvas.style.opacity = '0';
    setTimeout(() => {
      this.canvas.style.display = 'none';
      this.currentPDB = null;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }, 300);
  }
  
  updatePosition(x, y) {
    const offset = 20;
    let left = x + offset;
    let top = y - this.canvas.height / 2;
    
    // 防止超出视窗
    if (left + this.canvas.width > window.innerWidth) {
      left = x - this.canvas.width - offset;
    }
    
    if (top < 0) {
      top = offset;
    } else if (top + this.canvas.height > window.innerHeight) {
      top = window.innerHeight - this.canvas.height - offset;
    }
    
    this.canvas.style.left = left + 'px';
    this.canvas.style.top = top + 'px';
  }
  
  animate() {
    if (!this.currentPDB) return;
    
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 更新旋转
    this.rotation.y += 0.01;
    this.rotation.x = Math.sin(Date.now() * 0.0001) * 0.3;
    
    // 投影中心
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    // 计算投影坐标
    const projectedParticles = this.particles.map(p => {
      // 3D 旋转
      const x = p.x * Math.cos(this.rotation.y) - p.z * Math.sin(this.rotation.y);
      const z = p.x * Math.sin(this.rotation.y) + p.z * Math.cos(this.rotation.y);
      const y = p.y * Math.cos(this.rotation.x) - z * Math.sin(this.rotation.x);
      const finalZ = y * Math.sin(this.rotation.x) + z * Math.cos(this.rotation.x);
      
      // 透视投影
      const scale = 200 / (200 + finalZ);
      const projX = centerX + x * scale;
      const projY = centerY + y * scale;
      
      return {
        x: projX,
        y: projY,
        z: finalZ,
        scale: scale,
        ...p
      };
    });
    
    // 按 Z 轴排序（远的先画）
    projectedParticles.sort((a, b) => a.z - b.z);
    
    // 绘制化学键
    this.ctx.strokeStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? 
      'rgba(200, 200, 200, 0.3)' : 
      'rgba(100, 100, 100, 0.3)';
    this.ctx.lineWidth = 2;
    
    this.bonds.forEach(bond => {
      const p1 = projectedParticles.find((_, i) => i === bond.from);
      const p2 = projectedParticles.find((_, i) => i === bond.to);
      
      if (p1 && p2) {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
      }
    });
    
    // 绘制原子
    projectedParticles.forEach(p => {
      // 原子阴影
      this.ctx.beginPath();
      this.ctx.arc(p.x + 2, p.y + 2, p.radius * p.scale, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      this.ctx.fill();
      
      // 原子主体
      const gradient = this.ctx.createRadialGradient(
        p.x - p.radius * p.scale * 0.3,
        p.y - p.radius * p.scale * 0.3,
        0,
        p.x,
        p.y,
        p.radius * p.scale
      );
      
      gradient.addColorStop(0, this.lightenColor(p.color, 30));
      gradient.addColorStop(1, p.color);
      
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius * p.scale, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      
      // 原子边框
      this.ctx.strokeStyle = this.darkenColor(p.color, 20);
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
      
      // 原子类型标签
      if (p.scale > 0.8) {
        this.ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? 
          '#ffffff' : 
          '#000000';
        this.ctx.font = `${10 * p.scale}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(p.type, p.x, p.y);
      }
    });
    
    // 继续动画
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  }
  
  darkenColor(color, percent) {
    return this.lightenColor(color, -percent);
  }
}

// 初始化分子预览
document.addEventListener('DOMContentLoaded', () => {
  window.moleculePreview = new MoleculePreview();
});

// 导出给其他脚本使用
window.MoleculePreview = MoleculePreview;