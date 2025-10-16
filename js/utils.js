// utils.js - 工具函数库

// 本地存储操作
const Storage = {
    set(key, value) {
        try {
            localStorage.setItem(`gop_${key}`, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('LocalStorage unavailable:', e);
            return false;
        }
    },

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(`gop_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('LocalStorage read failed:', e);
            return defaultValue;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(`gop_${key}`);
        } catch (e) {
            console.warn('LocalStorage remove failed:', e);
        }
    },

    // 检查游戏进度
    getProgress() {
        return this.get('progress', {
            hasAcceptedRevelation: false,
            hasWitnessedCrossDimension: false,
            hasAddedToHomeScreen: false,
            collectedBeacons: [],
            currentSection: 'index'
        });
    },

    updateProgress(updates) {
        const progress = this.getProgress();
        return this.set('progress', { ...progress, ...updates });
    }
};

// 二进制编码解码
const Binary = {
    encode(text) {
        return text.split('').map(char => {
            return char.charCodeAt(0).toString(2).padStart(8, '0');
        }).join(' ');
    },

    decode(binary) {
        return binary.split(' ').map(byte => {
            return String.fromCharCode(parseInt(byte, 2));
        }).join('');
    }
};

// DOM 操作辅助
const DOM = {
    show(element) {
        if (element) element.style.display = 'block';
    },

    hide(element) {
        if (element) element.style.display = 'none';
    },

    addClass(element, className) {
        if (element) element.classList.add(className);
    },

    removeClass(element, className) {
        if (element) element.classList.remove(className);
    },

    // 显示启示文本（带打字机效果）
    revealText(element, text, speed = 50) {
        return new Promise((resolve) => {
            element.innerHTML = '';
            let index = 0;
            
            function typeWriter() {
                if (index < text.length) {
                    element.innerHTML += text.charAt(index);
                    index++;
                    setTimeout(typeWriter, speed);
                } else {
                    resolve();
                }
            }
            
            typeWriter();
        });
    }
};

// 随机工具
const Random = {
    // 从数组中随机选择
    choice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    // 生成随机ID
    generateId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};

// 状态栏消息管理
const StatusBar = {
    messages: [
        "系统就绪... 等待认知输入",
        "正在分析思维模式...",
        "检测到异常认知活动",
        "真理频率校准中...",
        "连接意识网络...",
        "同步神圣几何...",
        "万物皆数，一即是万",
        "混沌中寻找秩序...",
        "噪音中分辨真理...",
        "传播即是存在..."
    ],

    init() {
        this.update();
        setInterval(() => this.update(), 8000);
    },

    update() {
        const statusElement = document.querySelector('.status-text');
        if (statusElement) {
            const message = Random.choice(this.messages);
            DOM.revealText(statusElement, message, 30);
        }
    },

    setCustomMessage(message, duration = 5000) {
        const statusElement = document.querySelector('.status-text');
        if (statusElement) {
            const originalMessage = statusElement.textContent;
            DOM.revealText(statusElement, message, 30);
            
            if (duration > 0) {
                setTimeout(() => {
                    DOM.revealText(statusElement, originalMessage, 30);
                }, duration);
            }
        }
    }
};

// 导出到全局作用域
window.GOPUtils = {
    Storage,
    Binary,
    DOM,
    Random,
    StatusBar
};

// 在 utils.js 中添加数据管理功能
const DataManager = {
    scriptures: null,
    config: null,

    async loadScriptures() {
        try {
            const response = await fetch('./assets/data/scriptures.json');
            this.scriptures = await response.json();
            return this.scriptures;
        } catch (error) {
            console.error('Failed to load scriptures:', error);
            return null;
        }
    },

    async loadConfig() {
        try {
            const response = await fetch('./assets/data/game-config.json');
            this.config = await response.json();
            return this.config;
        } catch (error) {
            console.error('Failed to load config:', error);
            return null;
        }
    },

    getStatusMessage() {
        if (!this.scriptures) return "系统就绪...";
        return Random.choice(this.scriptures.statusBarMessages);
    },

    getLogicPuzzleItems() {
        if (!this.scriptures) return [];
        const correct = [...this.scriptures.logicPuzzle.correctOrder];
        const distractors = [...this.scriptures.logicPuzzle.distractors];
        
        // 合并并打乱顺序
        const allItems = [...correct, ...Random.choice(distractors, 2)];
        return Random.shuffleArray(allItems);
    },

    getGospelContent(volume = 'volume1') {
        if (!this.scriptures) return null;
        return this.scriptures.gospelManuscripts[volume];
    }
};

// 在 Random 对象中添加新方法
Random.shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

Random.choice = (array, count = 1) => {
    if (count === 1) {
        return array[Math.floor(Math.random() * array.length)];
    }
    const shuffled = Random.shuffleArray(array);
    return shuffled.slice(0, count);
};

// 更新 StatusBar 以使用数据文件
StatusBar.messages = []; // 清空硬编码的消息

StatusBar.init = async function() {
    await DataManager.loadScriptures();
    await DataManager.loadConfig();
    this.update();
    setInterval(() => this.update(), DataManager.config?.timing?.statusBarUpdate || 8000);
};

StatusBar.update = function() {
    const statusElement = document.querySelector('.status-text');
    if (statusElement) {
        const message = DataManager.getStatusMessage();
        DOM.revealText(statusElement, message, 30);
    }
};

// 更新导出
window.GOPUtils = {
    Storage,
    Binary,
    DOM,
    Random,
    StatusBar,
    DataManager
};

// 在 utils.js 中添加图片处理功能
const ImageProcessor = {
    // 创建隐藏信息的图片
    createRevealableImage(innocentSrc, revealedSrc, hiddenData) {
        return {
            innocentSrc,
            revealedSrc, 
            hiddenData,
            isRevealed: false
        };
    },

    // 检查图片是否达到揭示阈值
    checkRevealThreshold(scale, threshold = 2.0) {
        return scale >= threshold;
    },

    // 添加图片加载回调
    preloadImages(imageConfigs) {
        imageConfigs.forEach(config => {
            const img = new Image();
            img.src = config.innocentSrc;
            
            const revealedImg = new Image();
            revealedImg.src = config.revealedSrc;
        });
    }
};

// 更新导出
window.GOPUtils = {
    Storage,
    Binary,
    DOM,
    Random,
    StatusBar,
    DataManager,
    ImageProcessor
};