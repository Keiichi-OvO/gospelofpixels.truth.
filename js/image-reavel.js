// image-reveal.js - 图片缩放揭示系统
class ImageRevealSystem {
    constructor(containerId, imageConfig) {
        this.container = document.getElementById(containerId);
        this.imageConfig = imageConfig;
        this.scale = 1.0;
        this.isRevealed = false;
        this.isInteracting = false;
        
        this.init();
    }

    init() {
        if (!this.container) return;

        this.createImageElement();
        this.setupEventListeners();
        this.setupHintSystem();
    }

    createImageElement() {
        this.imageElement = document.createElement('img');
        this.imageElement.src = this.imageConfig.innocentSrc;
        this.imageElement.alt = '福音插图';
        this.imageElement.className = 'revealable-image';
        this.imageElement.style.transformOrigin = 'center center';
        this.imageElement.style.transition = 'transform 0.1s ease-out';

        // 创建揭示区域覆盖层
        this.revealOverlay = document.createElement('div');
        this.revealOverlay.className = 'reveal-overlay';
        this.revealOverlay.style.display = 'none';

        // 创建二进制代码显示元素
        this.binaryDisplay = document.createElement('div');
        this.binaryDisplay.className = 'binary-revelation';
        this.binaryDisplay.innerHTML = `
            <div class="revelation-content">
                <p>隐藏的圣言已揭示：</p>
                <code class="binary-code">${this.imageConfig.hiddenData.binary}</code>
                <p class="translation">"${this.imageConfig.hiddenData.meaning}"</p>
            </div>
        `;
        this.binaryDisplay.style.display = 'none';

        // 组装容器
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'image-reveal-wrapper';
        imageWrapper.appendChild(this.imageElement);
        imageWrapper.appendChild(this.revealOverlay);
        
        this.container.appendChild(imageWrapper);
        this.container.appendChild(this.binaryDisplay);
    }

    setupEventListeners() {
        // 桌面端：鼠标滚轮
        this.imageElement.addEventListener('wheel', this.handleWheel.bind(this));
        
        // 移动端：双指手势
        this.setupTouchEvents();
        
        // 键盘控制（辅助功能）
        this.setupKeyboardControls();
    }

    handleWheel(event) {
        event.preventDefault();
        
        const delta = event.deltaY > 0 ? -0.1 : 0.1;
        this.updateScale(this.scale + delta);
    }

    setupTouchEvents() {
        let initialDistance = 0;
        let currentScale = 1;

        this.imageElement.addEventListener('touchstart', (event) => {
            if (event.touches.length === 2) {
                event.preventDefault();
                initialDistance = this.getTouchDistance(event.touches);
                this.isInteracting = true;
            }
        });

        this.imageElement.addEventListener('touchmove', (event) => {
            if (event.touches.length === 2 && this.isInteracting) {
                event.preventDefault();
                
                const currentDistance = this.getTouchDistance(event.touches);
                const scaleChange = currentDistance / initialDistance;
                
                currentScale = Math.max(0.5, Math.min(3.0, this.scale * scaleChange));
                this.updateScale(currentScale);
                
                initialDistance = currentDistance;
            }
        });

        this.imageElement.addEventListener('touchend', () => {
            this.isInteracting = false;
            this.scale = currentScale;
        });
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (event) => {
            if (event.target === this.imageElement || this.container.contains(document.activeElement)) {
                switch(event.key) {
                    case '+':
                    case '=':
                        event.preventDefault();
                        this.updateScale(this.scale + 0.2);
                        break;
                    case '-':
                        event.preventDefault();
                        this.updateScale(this.scale - 0.2);
                        break;
                    case '0':
                        event.preventDefault();
                        this.resetScale();
                        break;
                }
            }
        });
    }

    getTouchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    updateScale(newScale) {
        // 限制缩放范围
        this.scale = Math.max(0.5, Math.min(3.0, newScale));
        
        // 应用缩放变换
        this.imageElement.style.transform = `scale(${this.scale})`;
        
        // 检查是否达到揭示阈值
        this.checkForRevelation();
        
        // 更新视觉反馈
        this.updateVisualFeedback();
    }

    checkForRevelation() {
        const shouldReveal = GOPUtils.ImageProcessor.checkRevealThreshold(this.scale, 2.0);
        
        if (shouldReveal && !this.isRevealed) {
            this.revealHiddenContent();
        } else if (!shouldReveal && this.isRevealed) {
            this.hideHiddenContent();
        }
    }

    revealHiddenContent() {
        this.isRevealed = true;
        
        // 切换到揭示后的图片
        this.imageElement.src = this.imageConfig.revealedSrc;
        
        // 显示二进制代码
        this.binaryDisplay.style.display = 'block';
        setTimeout(() => {
            this.binaryDisplay.classList.add('visible');
        }, 100);
        
        // 显示揭示覆盖层
        this.revealOverlay.style.display = 'block';
        
        // 触发启示效果
        this.triggerRevelationEffects();
        
        // 收集游戏进度
        this.collectBeacon();
    }

    hideHiddenContent() {
        this.isRevealed = false;
        
        // 切换回原始图片
        this.imageElement.src = this.imageConfig.innocentSrc;
        
        // 隐藏二进制代码
        this.binaryDisplay.classList.remove('visible');
        setTimeout(() => {
            this.binaryDisplay.style.display = 'none';
        }, 300);
        
        // 隐藏覆盖层
        this.revealOverlay.style.display = 'none';
    }

    triggerRevelationEffects() {
        // 添加视觉反馈
        this.imageElement.classList.add('revelation-glow');
        this.container.classList.add('revelation-active');
        
        // 状态栏消息
        GOPUtils.StatusBar.setCustomMessage('第一圣言已揭示！', 5000);
        
        // 声音反馈（可选）
        this.playRevelationSound();
        
        // 微震动（移动端）
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    }

    playRevelationSound() {
        // 创建简单的音频反馈（可以使用Web Audio API）
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('音频反馈不可用:', error);
        }
    }

    collectBeacon() {
        const progress = GOPUtils.Storage.getProgress();
        if (!progress.collectedBeacons.includes('BINARY_REVELATION')) {
            progress.collectedBeacons.push('BINARY_REVELATION');
            GOPUtils.Storage.updateProgress({
                collectedBeacons: progress.collectedBeacons
            });
            
            // 检查游戏进度
            this.checkGameProgress();
        }
    }

    checkGameProgress() {
        const progress = GOPUtils.Storage.getProgress();
        if (progress.collectedBeacons.length >= 1) {
            // 显示皈依之门入口
            setTimeout(() => {
                const gateEntrance = document.getElementById('convergence-gate-entrance');
                if (gateEntrance) {
                    gateEntrance.style.display = 'block';
                    gateEntrance.classList.add('fade-in');
                }
            }, 2000);
        }
    }

    updateVisualFeedback() {
        // 根据缩放级别更新提示
        const hintElement = this.container.querySelector('.zoom-hint');
        if (hintElement) {
            if (this.scale >= 1.5 && this.scale < 2.0) {
                hintElement.textContent = '接近了...继续缩放';
                hintElement.className = 'zoom-hint hint-close';
            } else if (this.scale >= 2.0) {
                hintElement.textContent = '真理已显现！';
                hintElement.className = 'zoom-hint hint-revealed';
            } else {
                hintElement.textContent = '尝试缩放图像探索细节';
                hintElement.className = 'zoom-hint hint-normal';
            }
        }
    }

    resetScale() {
        this.updateScale(1.0);
    }

    setupHintSystem() {
        const hintElement = document.createElement('div');
        hintElement.className = 'zoom-hint hint-normal';
        hintElement.textContent = '尝试缩放图像探索细节';
        
        this.container.appendChild(hintElement);
    }
}

// 导出到全局
window.ImageRevealSystem = ImageRevealSystem;