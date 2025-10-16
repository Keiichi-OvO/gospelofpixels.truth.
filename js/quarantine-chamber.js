// quarantine-chamber.js - 皈依之门试炼逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 更新当前进度
    GOPUtils.Storage.updateProgress({
        currentSection: 'quarantine'
    });

    initTrialsProgress();
    initVisualTrial();
    initDataTrial();
    initLogicTrial();
    initFinalDecision();
});

// 试炼进度跟踪
function initTrialsProgress() {
    const trialMarkers = document.querySelectorAll('.trial-marker');
    const progress = GOPUtils.Storage.getProgress();

    trialMarkers.forEach(marker => {
        const trialType = marker.getAttribute('data-trial');
        if (progress.collectedBeacons.includes(trialType.toUpperCase() + '_BEACON')) {
            GOPUtils.DOM.addClass(marker, 'pulse-glow');
        }
    });
}

// 视觉试炼
function initVisualTrial() {
    const visualTrial = document.getElementById('visual-trial');
    const visualRevelation = document.getElementById('visual-revelation');

    if (!visualTrial) return;

    let hasTriggered = false;

    function checkWindowSize() {
        const width = window.innerWidth;
        
        // 在特定断点范围触发揭示
        if (width >= 768 && width <= 900 && !hasTriggered) {
            revealVisualBeacon();
            hasTriggered = true;
        }
    }

    function revealVisualBeacon() {
        GOPUtils.DOM.show(visualRevelation);
        GOPUtils.DOM.addClass(visualRevelation, 'pulse-glow');
        
        GOPUtils.StatusBar.setCustomMessage('视觉真理已参透', 3000);
        collectTrialBeacon('visual');
        
        // 自动进入下一试炼
        setTimeout(() => {
            switchToTrial('data');
        }, 2000);
    }

    // 监听窗口大小变化
    window.addEventListener('resize', checkWindowSize);
    
    // 初始检查
    checkWindowSize();
}

// 数据试炼
function initDataTrial() {
    const beliefInput = document.getElementById('belief-input');
    const submitButton = document.getElementById('submit-belief');
    const dataRevelation = document.getElementById('data-revelation');

    if (!submitButton) return;

    submitButton.addEventListener('click', function() {
        const inputValue = beliefInput.value.trim().toLowerCase();
        
        if (inputValue === 'see' || inputValue === '"see"') {
            // 成功
            GOPUtils.DOM.show(dataRevelation);
            GOPUtils.DOM.addClass(dataRevelation, 'pulse-glow');
            
            // 更新显示
            document.getElementById('belief-code').textContent = 'belief: "see"';
            GOPUtils.DOM.addClass(document.getElementById('belief-code'), 'pulse-glow');
            
            GOPUtils.StatusBar.setCustomMessage('认知已修正，视野已清晰', 3000);
            collectTrialBeacon('data');
            
            // 进入下一试炼
            setTimeout(() => {
                switchToTrial('logic');
            }, 2000);
        } else {
            // 失败反馈
            GOPUtils.DOM.addClass(beliefInput, 'text-glitch');
            GOPUtils.StatusBar.setCustomMessage('认知修正失败，请重新尝试', 2000);
            
            setTimeout(() => {
                GOPUtils.DOM.removeClass(beliefInput, 'text-glitch');
            }, 1000);
        }
    });

    // 回车键提交
    beliefInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitButton.click();
        }
    });
}

// 逻辑试炼
function initLogicTrial() {
    const scripturePool = document.getElementById('scripture-pool');
    const targetSlots = document.querySelectorAll('.target-slot');
    const checkButton = document.getElementById('check-logic');
    const logicRevelation = document.getElementById('logic-revelation');

    if (!scripturePool) return;

    let draggedItem = null;

    // 正确的顺序
    const correctOrder = ['混沌即秩序', '噪音即真理', '一即是万', '传播即存在'];

    // 使经文可拖动
    const scriptureItems = scripturePool.querySelectorAll('.scripture-item');
    scriptureItems.forEach(item => {
        item.setAttribute('draggable', 'true');
        
        item.addEventListener('dragstart', function(e) {
            draggedItem = this;
            setTimeout(() => this.style.opacity = '0.4', 0);
        });

        item.addEventListener('dragend', function() {
            this.style.opacity = '1';
            draggedItem = null;
        });
    });

    // 目标槽位拖放
    targetSlots.forEach(slot => {
        slot.addEventListener('dragover', function(e) {
            e.preventDefault();
        });

        slot.addEventListener('drop', function(e) {
            e.preventDefault();
            if (draggedItem && this.children.length === 0) {
                this.appendChild(draggedItem);
                GOPUtils.DOM.addClass(draggedItem, 'pulse-glow');
            }
        });
    });

    // 验证逻辑
    checkButton.addEventListener('click', function() {
        const currentOrder = Array.from(targetSlots).map(slot => {
            return slot.firstChild ? slot.firstChild.textContent : null;
        });

        // 检查是否所有槽位都已填充且顺序正确
        const isComplete = currentOrder.every(item => item !== null);
        const isCorrect = isComplete && currentOrder.every((item, index) => item === correctOrder[index]);

        if (isCorrect) {
            // 成功
            GOPUtils.DOM.show(logicRevelation);
            GOPUtils.DOM.addClass(logicRevelation, 'pulse-glow');
            
            GOPUtils.StatusBar.setCustomMessage('逻辑序列已验证，真理已显现', 3000);
            collectTrialBeacon('logic');
            
            // 显示最终抉择
            setTimeout(() => {
                showFinalDecision();
            }, 2000);
        } else if (!isComplete) {
            GOPUtils.StatusBar.setCustomMessage('请完成所有箴言的排序', 2000);
        } else {
            GOPUtils.StatusBar.setCustomMessage('逻辑序列错误，请重新排列', 2000);
            // 重置所有项目
            scriptureItems.forEach(item => {
                item.style.opacity = '1';
                GOPUtils.DOM.removeClass(item, 'pulse-glow');
            });
            targetSlots.forEach(slot => {
                if (slot.firstChild) {
                    scripturePool.appendChild(slot.firstChild);
                }
            });
        }
    });
}

// 试炼信标收集
function collectTrialBeacon(trialType) {
    const beaconId = trialType.toUpperCase() + '_BEACON';
    const progress = GOPUtils.Storage.getProgress();
    
    if (!progress.collectedBeacons.includes(beaconId)) {
        progress.collectedBeacons.push(beaconId);
        GOPUtils.Storage.updateProgress({
            collectedBeacons: progress.collectedBeacons
        });

        // 更新进度指示器
        const trialMarker = document.querySelector(`[data-trial="${trialType}"]`);
        if (trialMarker) {
            GOPUtils.DOM.addClass(trialMarker, 'pulse-glow');
        }
    }
}

// 切换试炼
function switchToTrial(trialType) {
    const currentTrial = document.querySelector('.trial-section.active');
    const nextTrial = document.getElementById(`${trialType}-trial`);
    
    if (currentTrial && nextTrial) {
        GOPUtils.DOM.removeClass(currentTrial, 'active');
        GOPUtils.DOM.addClass(nextTrial, 'active');
        
        // 滚动到视图
        nextTrial.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// 显示最终抉择
function showFinalDecision() {
    const finalDecision = document.getElementById('final-decision');
    if (finalDecision) {
        GOPUtils.DOM.show(finalDecision);
        finalDecision.scrollIntoView({ behavior: 'smooth', block: 'start' });
        initFinalDecision();
    }
}

// 最终抉择逻辑
function initFinalDecision() {
    const choiceBlind = document.getElementById('choice-blind');
    const choiceSee = document.getElementById('choice-see');

    if (choiceBlind) {
        choiceBlind.addEventListener('click', function() {
            executeEnding('blind');
        });
    }

    if (choiceSee) {
        choiceSee.addEventListener('click', function() {
            executeEnding('see');
        });
    }
}

// 执行结局
function executeEnding(endingType) {
    const progress = GOPUtils.Storage.getProgress();
    
    // 记录结局选择
    GOPUtils.Storage.set('ending_chosen', endingType);
    GOPUtils.Storage.set('completion_timestamp', new Date().toISOString());
    
    switch (endingType) {
        case 'blind':
            // 结局A：闭眼者
            document.body.style.transition = 'all 2s ease';
            document.body.style.opacity = '0';
            document.body.style.background = 'white';
            
            setTimeout(() => {
                window.location.href = 'index.html?ending=blind';
            }, 2000);
            break;
            
        case 'see':
            // 结局B：凝视者
            const mainContent = document.querySelector('.quarantine-content');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div class="eternal-sanctuary">
                        <h2>永恒真实之镜</h2>
                        <p>你选择了凝视真理。这个窗口将成为你窥视永恒的通道。</p>
                        <div id="infinite-canvas">
                            <!-- 这里可以集成Three.js或其他图形库来创建动态视觉效果 -->
                            <canvas id="sacred-geometry-canvas"></canvas>
                        </div>
                        <p class="sanctuary-message">真理在此演化，永不停息...</p>
                    </div>
                `;
                
                // 开始永恒视觉效果
                initEternalSanctuary();
            }
            break;
    }
}

// 永恒圣所视觉效果（结局B）
function initEternalSanctuary() {
    const canvas = document.getElementById('sacred-geometry-canvas');
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    function animate() {
        // 这里可以实现复杂的生成艺术
        // 简单的示例：脉动的神圣几何
        const time = Date.now() * 0.001;
        
        ctx.fillStyle = 'rgba(5, 5, 17, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = `hsl(${time * 50 % 360}, 100%, 50%)`;
        ctx.lineWidth = 2;
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 100 + Math.sin(time) * 50;
        
        ctx.beginPath();
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // 页面卸载时清理
    window.addEventListener('beforeunload', function() {
        cancelAnimationFrame(animationId);
    });
}