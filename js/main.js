// main.js - 主逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 初始化工具
    if (window.GOPUtils) {
        GOPUtils.StatusBar.init();
    }

    // 更新当前进度
    GOPUtils.Storage.updateProgress({
        currentSection: 'index'
    });

    // 检查并显示跨维度提示
    checkCrossDimensionHint();
    
    // 检查并显示添加到主屏幕提示
    checkHomeScreenHint();

    // 导航链接交互
    initNavigation();
});

// 跨维度印证逻辑
function checkCrossDimensionHint() {
    const progress = GOPUtils.Storage.getProgress();
    const hintSection = document.getElementById('cross-dimension-hint');
    const confirmButton = document.getElementById('confirm-cross-dimension');

    if (hintSection && !progress.hasWitnessedCrossDimension) {
        // 延迟显示提示，给玩家探索时间
        setTimeout(() => {
            GOPUtils.DOM.show(hintSection);
        }, 30000); // 30秒后显示
    }

    if (confirmButton) {
        confirmButton.addEventListener('click', function() {
            GOPUtils.Storage.updateProgress({
                hasWitnessedCrossDimension: true
            });
            GOPUtils.DOM.hide(hintSection);
            GOPUtils.StatusBar.setCustomMessage('跨维度连接已验证', 3000);
        });
    }
}

// 添加到主屏幕引导
function checkHomeScreenHint() {
    const progress = GOPUtils.Storage.getProgress();
    const hintSection = document.getElementById('add-to-homescreen-hint');
    const dismissButton = document.getElementById('dismiss-homescreen-hint');

    // 检测是否可能是移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (hintSection && isMobile && !progress.hasAddedToHomeScreen) {
        setTimeout(() => {
            GOPUtils.DOM.show(hintSection);
        }, 60000); // 1分钟后显示
    }

    if (dismissButton) {
        dismissButton.addEventListener('click', function() {
            GOPUtils.Storage.updateProgress({
                hasAddedToHomeScreen: true
            });
            GOPUtils.DOM.hide(hintSection);
        });
    }
}

// 导航交互效果
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 为导航添加轻微的光晕反馈
            GOPUtils.DOM.addClass(this, 'pulse-glow');
            setTimeout(() => {
                GOPUtils.DOM.removeClass(this, 'pulse-glow');
            }, 1000);
        });

        link.addEventListener('mouseenter', function() {
            GOPUtils.StatusBar.setCustomMessage(`准备访问: ${this.textContent}`, 2000);
        });
    });
}

// 页面可见性变化处理（用于跨标签页检测）
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // 页面重新获得焦点，检查是否有跨维度活动
        const progress = GOPUtils.Storage.getProgress();
        if (progress.hasWitnessedCrossDimension) {
            GOPUtils.StatusBar.setCustomMessage('欢迎回到新视界档案馆', 2000);
        }
    }
});

// 防止右键菜单（增强沉浸感）
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    GOPUtils.StatusBar.setCustomMessage('此操作在此语境下无意义', 2000);
});

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Alt + D 显示调试信息
    if (e.altKey && e.key === 'd') {
        e.preventDefault();
        const progress = GOPUtils.Storage.getProgress();
        console.log('游戏进度:', progress);
        GOPUtils.StatusBar.setCustomMessage('调试信息已输出至控制台', 3000);
    }
    
    // ESC 键返回首页
    if (e.key === 'Escape') {
        if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
            window.location.href = 'index.html';
        }
    }
});