const cfRanges = [
    "173.245.48.0/20",
    "103.21.244.0/22",
    "103.22.200.0/22",
    "103.31.4.0/22",
    "141.101.64.0/18",
    "108.162.192.0/18",
    "190.93.240.0/20",
    "188.114.96.0/20",
    "197.234.240.0/22",
    "198.41.128.0/17",
    "162.158.0.0/15",
    "104.16.0.0/13",
    "104.24.0.0/14",
    "172.64.0.0/13",
    "131.0.72.0/22"
];

document.getElementById("generateBtn").addEventListener("click", generateIPs);
document.getElementById("copyAllBtn").addEventListener("click", copyAll);
document.getElementById("themeBtn").addEventListener("click", toggleTheme);

function cidrToRandomIP(cidr) {
    const [base, bits] = cidr.split("/");
    const baseParts = base.split(".").map(Number);
    const mask = ~((1 << (32 - bits)) - 1);
    const baseInt = baseParts.reduce((acc, part) => (acc << 8) + part, 0) & mask;
    const randInt = baseInt + Math.floor(Math.random() * (1 << (32 - bits)));
    return [
        (randInt >>> 24) & 255,
        (randInt >>> 16) & 255,
        (randInt >>> 8) & 255,
        randInt & 255
    ].join(".");
}

async function pingIP(ip) {
    const start = performance.now();
    try {
        await fetch(`https://${ip}`, {mode: "no-cors"});
    } catch (e) {}
    return Math.round(performance.now() - start);
}

async function generateIPs() {
    const count = parseInt(document.getElementById("ipCount").value);
    const maxPing = parseInt(document.getElementById("maxPing").value);
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    for (let i = 0; i < count; i++) {
        const ip = cidrToRandomIP(cfRanges[Math.floor(Math.random() * cfRanges.length)]);
        const ping = await pingIP(ip);
        if (ping <= maxPing) {
            const div = document.createElement("div");
            div.className = "result-item";
            div.innerHTML = `<span>${ip} - ${ping}ms</span> <button class="copyBtn">کپی</button>`;
            div.querySelector(".copyBtn").addEventListener("click", () => copyText(ip));
            resultsDiv.appendChild(div);
        }
    }
}

function copyText(text) {
    navigator.clipboard.writeText(text);
    alert("کپی شد: " + text);
}

function copyAll() {
    const allIPs = Array.from(document.querySelectorAll(".result-item span")).map(e => e.textContent).join("\n");
    navigator.clipboard.writeText(allIPs);
    alert("همه آی‌پی‌ها کپی شدند");
}

function toggleTheme() {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
}
