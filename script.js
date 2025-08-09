const ranges = [
  "103.21.244.0/22","103.22.200.0/22","103.31.4.0/22","104.16.0.0/13",
  "104.24.0.0/14","108.162.192.0/18","131.0.72.0/22","141.101.64.0/18",
  "162.158.0.0/15","172.64.0.0/13","173.245.48.0/20","188.114.96.0/20",
  "190.93.240.0/20","197.234.240.0/22","198.41.128.0/17"
];

function randomIPFromCIDR(cidr) {
  const [base, mask] = cidr.split("/");
  const baseParts = base.split(".").map(Number);
  const maskBits = parseInt(mask);
  const hostBits = 32 - maskBits;
  const maxHosts = Math.pow(2, hostBits) - 2;
  const randHost = Math.floor(Math.random() * maxHosts) + 1;

  const baseNum = (baseParts[0] << 24) | (baseParts[1] << 16) | (baseParts[2] << 8) | baseParts[3];
  const ipNum = baseNum + randHost;
  return [(ipNum >> 24) & 255, (ipNum >> 16) & 255, (ipNum >> 8) & 255, ipNum & 255].join(".");
}

async function pingIP(ip, maxPing) {
  const start = performance.now();
  try {
    await fetch(`https://${ip}`, { mode: 'no-cors', cache: 'no-store' });
    const ms = Math.round(performance.now() - start);
    return ms <= maxPing ? ms : null;
  } catch {
    return null;
  }
}

async function generateIPs() {
  const count = parseInt(document.getElementById("count").value);
  const maxPing = parseInt(document.getElementById("maxPing").value);
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "⏳ در حال تست IP ها...\n";

  let foundIPs = [];

  while (foundIPs.length < count) {
    const cidr = ranges[Math.floor(Math.random() * ranges.length)];
    const ip = randomIPFromCIDR(cidr);
    const ping = await pingIP(ip, maxPing);
    if (ping !== null) {
      foundIPs.push({ ip, ping });
      resultsDiv.innerHTML += `<div class="ip-item"><span>${ip} - ${ping}ms</span><button onclick="copyIP('${ip}')">📋</button></div>`;
    }
  }
}

function copyIP(ip) {
  navigator.clipboard.writeText(ip);
}

function copyAll() {
  const allIPs = [...document.querySelectorAll(".ip-item span")].map(e => e.textContent).join("\n");
  navigator.clipboard.writeText(allIPs);
}

function switchTheme() {
  document.body.classList.toggle("dark");
}
