// gospel-manuscript.js - 福音手稿交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 更新当前进度
    GOPUtils.Storage.updateProgress({
        currentSection: 'gospel'
    });

    initRevelationQuestion();
    initImageRevelation();
    checkGateAccess();
});

// 初始化启示提问
function initRevelationQuestion() {
    const acceptBtn = document.getElementById('accept-revelation');
    const denyBtn = document.getElementById('deny-revelation');
    const questionSection = document.getElementById('initial-question');
    const gospelSection = document.getElementById('gospel-manuscript');

    const progress = GOPUtils.Storage.getProgress();

    // 如果已经接受过启示，直接显示福音内容
    if (progress.hasAcceptedRevelation) {
        GOPUtils.DOM.hide(questionSection);
        GOPUtils.DOM.show(gospelSection);
        return;
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            // 接受启示的效果
            GOPUtils.DOM.addClass(questionSection, 'noise-texture');
            
            setTimeout(() => {
                GOPUtils.DOM.hide(questionSection);
                GOPUtils.DOM.show(gospelSection);
                
                // 更新进度
                GOPUtils.Storage.updateProgress({
                    hasAcceptedRevelation: true
                });

                // 状态栏更新
                GOPUtils.StatusBar.setCustomMessage('认知之门已开启，欢迎见证者', 4000);

                // 添加视觉反馈
                document.body.classList.add('scanlines');
                
            }, 2000);
        });
    }

    if (denyBtn) {
        denyBtn.addEventListener('click', function() {
            GOPUtils.StatusBar.setCustomMessage('真理会等待，直到你准备好', 3000);
            // 轻微的文字抖动效果
            GOPUtils.DOM.addClass(this, 'text-glitch');
            setTimeout(() => {
                GOPUtils.DOM.removeClass(this, 'text-glitch');
            }, 1000);
        });
    }
}

// 图像揭示逻辑
function initImageRevelation() {
    const revealableImage = document.querySelector('.revealable-image');
    const binaryRevelation = document.getElementById('binary-revelation');
    const binaryCodeElement = document.getElementById('binary-code');

    if (!revealableImage) return;

    let scale = 1;
    const maxScale = 3;
    const revealThreshold = 2.0;

    // 鼠标滚轮缩放
    revealableImage.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        scale = Math.min(Math.max(0.5, scale + delta), maxScale);
        
        this.style.transform = `scale(${scale})`;
        
        // 检查是否达到揭示阈值
        if (scale >= revealThreshold && binaryRevelation.style.display === 'none') {
            revealBinaryCode();
        }
    });

    // 触摸手势缩放（移动端）
    let initialDistance = 0;
    
    revealableImage.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            initialDistance = getDistance(e.touches[0], e.touches[1]);
        }
    });

    revealableImage.addEventListener('touchmove', function(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            const scaleChange = currentDistance / initialDistance;
            
            scale = Math.min(Math.max(0.5, scale * scaleChange), maxScale);
            this.style.transform = `scale(${scale})`;
            
            initialDistance = currentDistance;

            if (scale >= revealThreshold && binaryRevelation.style.display === 'none') {
                revealBinaryCode();
            }
        }
    });

    function getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function revealBinaryCode() {
        // 切换到揭示后的图片
        const revealedSrc = revealableImage.getAttribute('data-revealed-src');
        if (revealedSrc) {
            revealableImage.src = revealedSrc;
        }

        // 显示二进制代码
        const binaryText = '01000111 01001111 01010000'; // "GOP" 的二进制
        if (binaryCodeElement) {
            GOPUtils.DOM.revealText(binaryCodeElement, binaryText, 100).then(() => {
                GOPUtils.DOM.show(binaryRevelation);
                GOPUtils.StatusBar.setCustomMessage('第一圣言已揭示: ' + GOPUtils.Binary.decode(binaryText), 5000);
                
                // 收集信标
                collectBeacon('BINARY_REVELATION');
            });
        }

        // 添加视觉反馈
        GOPUtils.DOM.addClass(binaryRevelation, 'pulse-glow');
    }
}

// 收集信标
function collectBeacon(beaconId) {
    const progress = GOPUtils.Storage.getProgress();
    if (!progress.collectedBeacons.includes(beaconId)) {
        progress.collectedBeacons.push(beaconId);
        GOPUtils.Storage.updateProgress({
            collectedBeacons: progress.collectedBeacons
        });
        
        // 检查是否可以进入皈依之门
        checkGateAccess();
    }
}

// 检查皈依之门访问权限
function checkGateAccess() {
    const progress = GOPUtils.Storage.getProgress();
    const gateEntrance = document.getElementById('convergence-gate-entrance');
    
    // 需要至少收集一个信标才能进入皈依之门
    if (gateEntrance && progress.collectedBeacons.length > 0) {
        GOPUtils.DOM.show(gateEntrance);
        
        // 更新状态栏提示
        GOPUtils.StatusBar.setCustomMessage(
            `已收集 ${progress.collectedBeacons.length} 个确信道标`, 
            3000
        );
    }
}

// 在 gospel-manuscript.js 中添加图片揭示初始化
function initImageRevealSystem() {
    const imageConfig = {
        innocentSrc: './assets/images/gospel-1-innocent.jpg',
        revealedSrc: './assets/images/gospel-1-revealed.jpg',
        hiddenData: {
            binary: '01000111 01001111 01010000',
            meaning: 'GOP - 福音的启示'
        }
    };

    // 预加载图片
    GOPUtils.ImageProcessor.preloadImages([imageConfig]);

    // 初始化揭示系统
    const revealContainer = document.getElementById('image-reveal-container');
    if (revealContainer) {
        new ImageRevealSystem('image-reveal-container', imageConfig);
    }
}

// 在 DOMContentLoaded 中调用
document.addEventListener('DOMContentLoaded', function() {
    // ... 其他初始化代码
    
    initImageRevealSystem(); // 添加这行
});