// ==UserScript==
// @name         TTOS_highlight
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Optimized version with better performance
// @author       Phạm Dũng
// @include      https://ttos.tcis.co/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// ==/UserScript==

'use strict';

// ============================================
// 1. CONSTANTS & CONFIG
// ============================================
const CONFIG = {
    GOOGLE_API_KEY: 'AIzaSyCTp0GCp6TyvlU0VGfXbjaiLV-N6LECK2Y',
    SPREADSHEET_IDS: {
        TON_BAI: '17JfxIWPJsNIisQFXu_lJvn_Vjb4b2oG3EeJ_3dZMk3Q',
        XUAT_TAU: '1yzxWwqqOsPINsbWLCMOZYt2cGNddXnfaqgqZqk4TgkE'
    },
    INTERVALS: {
        INITIAL: 1000,
        BOOKED_DATA: 900000, // 15 phút
        CUSTOM_COLOR: 15000,  // 15 giây
        UI_UPDATE: 3000,
        CHECK_CLEAN: 3000
    },
    API_ENDPOINT: 'https://tc128hp.hopto.org/api/container/GetInFor',
    MAX_CACHE_SIZE: 100
};

// ============================================
// 2. STATE MANAGEMENT
// ============================================
const state = {
    containerData: {
        booked: new Set(),
        store: [],
        location: [],
        pod: [],
        vessel: []
    },
    customColors: {
        containers: [],
        colors: []
    },
    cleanedCache: new Set()
};

// ============================================
// 3. UTILITY FUNCTIONS
// ============================================
const utils = {
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    insertAfter: (refNode, newNode) => {
        refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
    },

    createTimer: function() {
        return {
            running: false,
            interval: 5000,
            timeout: null,
            callback: () => {},

            start(cb, iv, immediate) {
                clearTimeout(this.timeout);
                this.running = true;
                if (cb) this.callback = cb;
                if (iv) this.interval = iv;
                if (immediate) this.execute();
                this.scheduleNext();
            },

            scheduleNext() {
                if (!this.running) return;
                this.timeout = setTimeout(() => this.execute(), this.interval);
            },

            execute() {
                if (!this.running) return;
                this.callback();
                this.scheduleNext();
            },

            stop() {
                this.running = false;
                clearTimeout(this.timeout);
            },

            setInterval(iv) {
                this.interval = iv;
            }
        };
    }
};

// ============================================
// 4. API FUNCTIONS
// ============================================
const api = {
    async fetchGoogleSheet(spreadsheetId, sheetName) {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${CONFIG.GOOGLE_API_KEY}`;
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${sheetName}:`, error);
            return { values: [] };
        }
    },

    async checkContainerCleaning(containerNo) {
        const headers = new Headers();
        headers.append("Cookie", ".AspNetCore.Antiforgery.KK6xcoXdd8M=CfDJ8OsZ6q8EGv1Jg7DR69NjOiKedywNvHi1hVxTsz4P3_Uz7PTPgtKUSZJycxKFufe08AA9ZN70H4kmc9RcVzosFnVssGBZ8ukkvAuCqdQINtXYjymdJ-dHyWkmOV7RsgCKDUklQTbFts5vnYU_MkJ2OcI");

        try {
            const response = await fetch(
                `${CONFIG.API_ENDPOINT}?ContainerNo=${containerNo}`,
                { method: 'GET', headers, redirect: 'follow' }
            );

            if (!response.ok) throw new Error('API connection failed');
            if (response.status === 204) {
                return null; // hoặc return {}
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

// ============================================
// 5. DATA PROCESSORS
// ============================================
const dataProcessor = {
    async updateBookedData() {
        const data = await api.fetchGoogleSheet(CONFIG.SPREADSHEET_IDS.TON_BAI, 'TonBai');

        if (!data.values) return;

        // Reset state
        state.containerData.booked.clear();
        state.containerData.store = [];
        state.containerData.location = [];
        state.containerData.pod = [];
        state.containerData.vessel = [];

        data.values.forEach(row => {
            state.containerData.store.push(row[0] || '');
            state.containerData.location.push(row[2] || '');
            state.containerData.pod.push(row[34] || '');
            state.containerData.vessel.push(row[21] || '');

            if (row[18]) {
                state.containerData.booked.add(row[0]);
            }
        });
    },

    async updateCustomColors() {
        const data = await api.fetchGoogleSheet(CONFIG.SPREADSHEET_IDS.XUAT_TAU, 'XuatTau');

        if (!data.values) return;

        state.customColors.containers = [];
        state.customColors.colors = [];

        data.values.forEach(row => {
            state.customColors.containers.push(row[2] || '');
            state.customColors.colors.push(row[0] || '');
        });

        console.log(new Date(), 'Custom colors updated:', state.customColors.containers.length);
    }
};

// ============================================
// 6. CACHE MANAGEMENT
// ============================================
const cache = {
    add(item) {
        if (state.cleanedCache.has(item)) return;

        if (state.cleanedCache.size >= CONFIG.MAX_CACHE_SIZE) {
            const firstItem = state.cleanedCache.values().next().value;
            state.cleanedCache.delete(firstItem);
        }

        state.cleanedCache.add(item);
        console.log(`🟢 Cached: ${item} (${state.cleanedCache.size}/${CONFIG.MAX_CACHE_SIZE})`);
    },

    has(item) {
        return state.cleanedCache.has(item);
    }
};

// ============================================
// 7. UI FUNCTIONS
// ============================================
const ui = {
    initializeSearchInputs() {
        const searchCont = document.getElementById("txt-search-cont");
        const searchWI = document.getElementById("search-workinstruction");

        if (searchCont) searchCont.setAttribute("type", "number");
        if (searchWI) searchWI.setAttribute("type", "number");
    },

    createSearchButton() {
        const searchBtn = document.createElement("BUTTON");
        searchBtn.id = "searchCont";
        searchBtn.className = "btn btn-primary";
        searchBtn.textContent = "Tìm cont";

        const oldElement = document.getElementById("txt-search-cont");
        if (oldElement) {
            utils.insertAfter(oldElement, searchBtn);
            searchBtn.onclick = () => this.handleSearch(searchBtn);
        }
    },

    handleSearch(button) {
        const textInput = document.getElementById("txt-search-cont");
        if (!textInput) return;

        const searchText = textInput.value;
        const results = [];

        state.containerData.store.forEach((cont, idx) => {
            if (cont.endsWith(searchText)) {
                results.push(state.containerData.location[idx]);
            }
        });

        if (results.length === 0) {
            button.textContent = "Không tìm thấy";
            utils.sleep(2000).then(() => button.textContent = "Tìm cont");
        } else if (results.length > 1) {
            button.textContent = "Nhập chi tiết hơn";
            utils.sleep(2000).then(() => button.textContent = "Tìm cont");
        } else {
            button.textContent = results[0];
            utils.sleep(15000).then(() => button.textContent = "Tìm cont");
        }
    },

    formatContainerNumbers() {
        const elements = document.getElementsByClassName("container-no");

        Array.from(elements).forEach(el => {
            if (el.innerHTML.length === 11 && !el.innerHTML.includes('<br>')) {
                const text = el.innerHTML;
                el.innerHTML = `<div style='text-align: left'>${text.substring(0,4)}</div><br><div style='text-align: right'>${text.substring(4,11)}</div>`;
            }
        });
    },

    updateContainerColors() {
        const containers = document.getElementsByClassName("cell-yard cell-container");
        const workInstructions = document.getElementsByClassName("wi-item workinstruction");

        Array.from(containers).forEach((container, i) => {
            const containerNo = container.getAttribute("item-no");
            if (!containerNo) return;

            // Reset background
            container.style.backgroundColor = '';

            // Add POD and Vessel info
            const idx = state.containerData.store.indexOf(containerNo);
            if (idx !== -1) {
                this.addContainerInfo(container, idx);
            }

            // Apply booking color
            if (state.containerData.booked.has(containerNo)) {
                container.style.backgroundColor = "#ffcc99";
            }

            // Apply work instruction colors
            this.applyWorkInstructionColor(container, containerNo, workInstructions);

            // Apply custom colors (highest priority)
            this.applyCustomColor(container, containerNo);
        });
    },

    addContainerInfo(container, dataIndex) {
        const pod = state.containerData.pod[dataIndex];
        const vessel = state.containerData.vessel[dataIndex];
        const podShort = pod ? pod.substring(2, 5) : '';

        if (container.children[2] && podShort && !container.children[2].innerHTML.includes(podShort)) {
            container.children[2].style.fontSize = "10px";
            container.children[2].innerHTML += ` - ${podShort}`;
        }

        if (vessel && !container.innerHTML.includes(vessel)) {
            container.innerHTML += `<span style='font-size:10px;'>${vessel}</span>`;
        }
    },

    applyWorkInstructionColor(container, containerNo, workInstructions) {
        Array.from(workInstructions).forEach(wi => {
            if (wi.getAttribute("item-no") === containerNo) {
                const wqtype = wi.getAttribute("wqtype");
                const action = wi.getAttribute("action");

                const colorMap = {
                    'GATE': 'yellow',
                    'YARDCONSOL': 'green',
                    'VESSEL_PICKUP': '#ff00ea',
                    'VESSEL_OTHER': 'red'
                };

                if (wqtype === 'GATE') {
                    container.style.backgroundColor = colorMap.GATE;
                } else if (wqtype === 'YARDCONSOL') {
                    container.style.backgroundColor = colorMap.YARDCONSOL;
                } else if (wqtype === 'VESSEL') {
                    container.style.backgroundColor = action === 'PICKUP'
                        ? colorMap.VESSEL_PICKUP
                        : colorMap.VESSEL_OTHER;
                }
            }
        });
    },

    applyCustomColor(container, containerNo) {
        const idx = state.customColors.containers.indexOf(containerNo);
        if (idx !== -1) {
            const color = state.customColors.colors[idx];
            if (color && color !== "#ffffff") {
                container.style.backgroundColor = color;
            }
        }
    },

    createNotificationArea() {
        const notification = document.createElement("div");
        notification.id = "thongbao";

        Object.assign(notification.style, {
            position: "fixed",
            top: "10px",
            right: "10px",
            zIndex: "10000",
            fontSize: "1.6rem",
            color: "white",
            pointerEvents: "none"
        });

        // Chèn vào đầu body để không phá vỡ cấu trúc
        document.body.insertBefore(notification, document.body.firstChild);

        return notification;
    },

    displayNotification(element, containerNo, text, type = "info", grade = "") {
    if (!element) return;

    Object.assign(element.style, {
        position: "relative",
        zIndex: "9999",
        padding: "10px 18px",
        borderRadius: "12px",
        fontWeight: "600",
        color: "white",
        display: "inline-block",
        transition: "all 0.3s ease",
        boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
        fontSize: "15px",
        textAlign: "center",
        minWidth: "220px",
        marginTop: "6px",
        marginBottom: "20px",
        opacity: "0.97",
        border: "1px solid rgba(255,255,255,0.2)"
    });

    const gradePart = grade
        ? `<span style="background:rgba(255,255,255,0.15);padding:2px 6px;border-radius:8px;margin-left:6px;">${grade}</span>`
        : "";

    const isDanger = grade && /^D/i.test(grade);

    const styles = {
        success: {
            bg: "linear-gradient(90deg, #43a047, #2e7d32)",
            icon: "✅"
        },
        error: {
            bg: "linear-gradient(90deg, #e53935, #c62828)",
            icon: "❌"
        },
        info: {
            bg: "linear-gradient(90deg, #1e88e5, #1565c0)",
            icon: "ℹ️"
        },
        warning: {
            bg: "linear-gradient(90deg, #f9a825, #f57f17)",
            icon: "⚠️",
            anim: "blinkYellow 1.2s infinite alternate"
        },
        danger: {
            bg: "linear-gradient(90deg, #ff5252, #b71c1c)",
            icon: "⚠️",
            anim: "blinkRed 1s infinite alternate"
        }
    };

    // Nếu grade bắt đầu bằng D → ép thành danger
    const finalType = isDanger ? "danger" : type;
    const style = styles[finalType] || styles.info;

    element.style.background = style.bg;
    element.style.animation = style.anim || "none";

    element.innerHTML = `
        ${style.icon} ${containerNo} ${text} ${gradePart}
    `;

    this.injectAnimationStyles();
},

    injectAnimationStyles() {
        if (document.getElementById("blinkAnimations")) return;

        const style = document.createElement("style");
        style.id = "blinkAnimations";
        style.textContent = `
            @keyframes blinkRed {
                0% { box-shadow: 0 0 10px rgba(255,0,0,0.3); }
                100% { box-shadow: 0 0 25px rgba(255,0,0,0.8); }
            }
            @keyframes blinkYellow {
                0% { box-shadow: 0 0 8px rgba(255,193,7,0.4); }
                100% { box-shadow: 0 0 20px rgba(255,193,7,0.9); }
            }
        `;
        document.head.appendChild(style);
    }
};

// ============================================
// 8. CLEANING CHECK LOGIC
// ============================================
const cleaningChecker = {
    async check() {
        const containerNoEl = document.getElementById("item-no-selected");
        const isoEl = document.getElementById("item-iso-selected");
        const planEl = document.getElementById("planloc-selected");
        const notificationEl = document.getElementById("thongbao");

        if (!containerNoEl || !isoEl || !planEl || !notificationEl) return;

        const containerNo = containerNoEl.innerHTML.trim();
        const iso = isoEl.innerHTML.trim();
        const plan = planEl.innerHTML.trim();

        console.log("Checking container:", containerNo);

        if (!iso.includes("E") || !plan.includes("Y")) {
            notificationEl.innerHTML = "";
            notificationEl.style.backgroundColor = "white";
            return;
        }

        try {
            const data = await api.checkContainerCleaning(containerNo);
            console.log("Result:", data);

            if (!data) {
                ui.displayNotification(notificationEl, containerNo, "không có dữ liệu", "info");
                return;
            }

            if (data.isCleaned) {
                ui.displayNotification(notificationEl, containerNo, "đã VS", "success", data.grade);
                cache.add(`${containerNo} đã VS`);
            } else if (data.isDirty) {
                ui.displayNotification(notificationEl, containerNo, "chưa VS", "error", data.grade);
            } else {
                ui.displayNotification(notificationEl, containerNo, "không VS", "info", data.grade);
                cache.add(`${containerNo} không VS`);
            }
        } catch (error) {
            console.error("Error:", error);
            ui.displayNotification(notificationEl, containerNo, "Lỗi kết nối API", "warning");
        }
    }
};

// ============================================
// 9. INITIALIZATION
// ============================================
function initialize() {
    // Setup UI
    ui.initializeSearchInputs();
    ui.createSearchButton();
    ui.createNotificationArea();
    ui.injectAnimationStyles();

    // Setup data fetching timers
    const bookedTimer = utils.createTimer();
    bookedTimer.start(async () => {
        await dataProcessor.updateBookedData();
        bookedTimer.setInterval(
            state.containerData.store.length > 1
                ? CONFIG.INTERVALS.BOOKED_DATA
                : CONFIG.INTERVALS.INITIAL
        );
    }, CONFIG.INTERVALS.INITIAL, true);

    const colorTimer = utils.createTimer();
    colorTimer.start(async () => {
        await dataProcessor.updateCustomColors();
        colorTimer.setInterval(
            state.customColors.containers.length > 1
                ? CONFIG.INTERVALS.CUSTOM_COLOR
                : CONFIG.INTERVALS.INITIAL
        );
    }, CONFIG.INTERVALS.INITIAL, true);

    // Setup UI update interval
    setInterval(() => {
        ui.formatContainerNumbers();
        ui.updateContainerColors();
    }, CONFIG.INTERVALS.UI_UPDATE);

    // Setup cleaning check interval
    setInterval(() => cleaningChecker.check(), CONFIG.INTERVALS.CHECK_CLEAN);

    console.log("✅ TTOS Highlight initialized successfully");
}

// Start the script
initialize();
