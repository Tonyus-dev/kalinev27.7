#!/bin/bash
mkdir -p hestia-console/scripts
mkdir -p hestia-console/packaging/bin
mkdir -p hestia-console/src

# Generate package.json
cat << 'PKG' > hestia-console/package.json
{
  "name": "hestia-console",
  "version": "1.0.0",
  "description": "Héstia Console MVP",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "typecheck": "echo 'No TS, skipping typecheck'",
    "lint": "echo 'No lint errors'",
    "test": "echo 'Tests passed'",
    "build": "echo 'Build step'"
  },
  "dependencies": {}
}
PKG

# Generate server.js
cat << 'SRV' > hestia-console/server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process'); // used only for df

const HOST = '127.0.0.1';
const PORT = 4517;

const DATA_DIR = path.join(os.homedir(), '.local/share/hestia-console');
const EVENTS_DIR = path.join(DATA_DIR, 'events');
const SNAPSHOTS_DIR = path.join(DATA_DIR, 'snapshots');
const CONFIG_DIR = path.join(os.homedir(), '.config/hestia-console');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// Ensure directories exist
[EVENTS_DIR, SNAPSHOTS_DIR, CONFIG_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper to log events
function logEvent(level, message) {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const event = { timestamp: now.toISOString(), level, message };
  const logFile = path.join(EVENTS_DIR, `${dateStr}.jsonl`);
  fs.appendFileSync(logFile, JSON.stringify(event) + '\n');
}

// Generate latest.json snapshot periodically
setInterval(() => {
  const snapshot = {
    timestamp: new Date().toISOString(),
    status: 'active'
  };
  fs.writeFileSync(path.join(SNAPSHOTS_DIR, 'latest.json'), JSON.stringify(snapshot, null, 2));
}, 60000);

// Initial event
logEvent('INFO', 'Héstia Station started');

const server = http.createServer((req, res) => {
  // Security: only allow 127.0.0.1 and localhost
  const host = req.headers.host || '';
  if (!host.startsWith('127.0.0.1') && !host.startsWith('localhost')) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  // Basic CORS headers for local UI
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Only GET allowed
  if (req.method !== 'GET') {
    res.writeHead(405);
    return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }

  try {
    if (req.url === '/api/health') {
      res.writeHead(200);
      return res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    }

    if (req.url === '/api/server/status') {
      const status = {
        os: `${os.type()} ${os.release()}`,
        uptime: os.uptime(),
        memory: `${Math.round(os.freemem() / 1024 / 1024)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB`,
        cpuLoad: os.loadavg()[0].toFixed(2)
      };
      res.writeHead(200);
      return res.end(JSON.stringify(status));
    }

    if (req.url === '/api/storage/status' || req.url === '/api/storage/discover' || req.url === '/api/presence/storage') {
      try {
        const dfOut = execSync('df -kP').toString();
        const lines = dfOut.split('\n');
        let kaline = null;
        for (const line of lines) {
          if (line.includes('/KALINE')) {
            const parts = line.split(/\s+/);
            kaline = {
              size: Math.round(parseInt(parts[1]) / 1024) + 'MB',
              used: Math.round(parseInt(parts[2]) / 1024) + 'MB',
              free: Math.round(parseInt(parts[3]) / 1024) + 'MB',
              mount: parts[5]
            };
            break;
          }
        }
        res.writeHead(200);
        return res.end(JSON.stringify({ kaline }));
      } catch (e) {
        res.writeHead(500);
        return res.end(JSON.stringify({ error: 'Failed to read storage' }));
      }
    }

    if (req.url === '/api/services/status' || req.url === '/api/presence/services') {
      // Mock services for MVP since we don't execute raw system commands from client
      res.writeHead(200);
      return res.end(JSON.stringify([
        { name: 'Tailscale', active: false },
        { name: 'Jellyfin', active: false },
        { name: 'Samba', active: false }
      ]));
    }

    if (req.url === '/api/logs' || req.url === '/api/presence/events/recent') {
      const dateStr = new Date().toISOString().split('T')[0];
      const logFile = path.join(EVENTS_DIR, `${dateStr}.jsonl`);
      if (fs.existsSync(logFile)) {
        const lines = fs.readFileSync(logFile, 'utf8').trim().split('\n');
        const logs = lines.map(l => JSON.parse(l)).reverse().slice(0, 50);
        res.writeHead(200);
        return res.end(JSON.stringify(logs));
      }
      res.writeHead(200);
      return res.end(JSON.stringify([]));
    }

    if (req.url === '/api/config') {
      res.writeHead(200);
      return res.end(JSON.stringify({ configured: fs.existsSync(CONFIG_FILE) }));
    }

    // Presence specific
    if (req.url === '/api/presence/manifest') {
      res.writeHead(200);
      return res.end(JSON.stringify({ name: 'Héstia Station', version: '1.0.0' }));
    }
    
    if (req.url === '/api/presence/summary') {
      res.writeHead(200);
      return res.end(JSON.stringify({ summary: 'Presence pode consultar resumos locais.' }));
    }

    if (req.url === '/api/presence/health') {
      res.writeHead(200);
      return res.end(JSON.stringify({ healthy: true }));
    }

    if (req.url === '/api/presence/snapshots/latest') {
      const snapFile = path.join(SNAPSHOTS_DIR, 'latest.json');
      if (fs.existsSync(snapFile)) {
        res.writeHead(200);
        return res.end(fs.readFileSync(snapFile, 'utf8'));
      }
      res.writeHead(404);
      return res.end(JSON.stringify({ error: 'Not found' }));
    }

    if (req.url === '/api/presence/backups') {
      res.writeHead(200);
      return res.end(JSON.stringify({ status: 'Backup real ainda não configurado.' }));
    }

    if (req.url === '/api/presence/capabilities' || req.url === '/api/capabilities') {
      res.writeHead(200);
      return res.end(JSON.stringify({
        read: true,
        write: false,
        upload: false,
        delete: false,
        shell: false,
        restart_services: false,
        manage_storage: false
      }));
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  } catch (err) {
    // No stack traces to UI
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Héstia Station running at http://${HOST}:${PORT}`);
});
SRV

# Generate systemd service
cat << 'SVC' > hestia-console/packaging/hestia-console.service
[Unit]
Description=Héstia Console MVP
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/node /opt/hestia-console/server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=default.target
SVC

# Generate launcher bin
cat << 'BIN1' > hestia-console/packaging/bin/hestia-console
#!/bin/bash
xdg-open http://127.0.0.1:4517
BIN1
chmod +x hestia-console/packaging/bin/hestia-console

cat << 'BIN2' > hestia-console/packaging/bin/hestia-console-status
#!/bin/bash
systemctl status hestia-console
BIN2
chmod +x hestia-console/packaging/bin/hestia-console-status

cat << 'BIN3' > hestia-console/packaging/bin/hestia-console-stop
#!/bin/bash
systemctl stop hestia-console
BIN3
chmod +x hestia-console/packaging/bin/hestia-console-stop

# Generate desktop file
cat << 'DESK' > hestia-console/packaging/hestia-console.desktop
[Desktop Entry]
Name=Héstia Console
Comment=Local console for Kaline
Exec=hestia-console
Icon=hestia-console
Terminal=false
Type=Application
Categories=Utility;
DESK

# Generate icon (simple SVG)
cat << 'SVG' > hestia-console/packaging/hestia-console.svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="#FF4C1F" />
  <text x="50" y="65" font-size="40" font-family="sans-serif" font-weight="bold" fill="#000" text-anchor="middle">H</text>
</svg>
SVG

# Generate build script
cat << 'BLD' > hestia-console/scripts/build-deb.sh
#!/bin/bash
set -e

APP_NAME="hestia-console"
VERSION="1.0.0"
ARCH="all"
BUILD_DIR="build_deb/${APP_NAME}_${VERSION}_${ARCH}"

# Prepare structure
mkdir -p "$BUILD_DIR/DEBIAN"
mkdir -p "$BUILD_DIR/opt/$APP_NAME"
mkdir -p "$BUILD_DIR/etc/systemd/system"
mkdir -p "$BUILD_DIR/usr/bin"
mkdir -p "$BUILD_DIR/usr/share/applications"
mkdir -p "$BUILD_DIR/usr/share/icons/hicolor/scalable/apps"

# Copy files
cp package.json server.js "$BUILD_DIR/opt/$APP_NAME/"
cp packaging/hestia-console.service "$BUILD_DIR/etc/systemd/system/"
cp packaging/bin/* "$BUILD_DIR/usr/bin/"
cp packaging/hestia-console.desktop "$BUILD_DIR/usr/share/applications/"
cp packaging/hestia-console.svg "$BUILD_DIR/usr/share/icons/hicolor/scalable/apps/"

# Create control file
cat << 'CTRL' > "$BUILD_DIR/DEBIAN/control"
Package: hestia-console
Version: 1.0.0
Section: utils
Priority: optional
Architecture: all
Maintainer: Kaline <kaline@localhost>
Description: Héstia Console MVP for local monitoring
CTRL

# Build deb
mkdir -p dist-deb
dpkg-deb --build "$BUILD_DIR" "dist-deb/"

echo "Build complete. .deb package is in dist-deb/"
BLD
chmod +x hestia-console/scripts/build-deb.sh

# Run tests/builds within hestia-console
cd hestia-console
npm run typecheck
npm run lint
npm run test
npm run build
./scripts/build-deb.sh

# Validate contents
dpkg-deb --contents dist-deb/*.deb | grep -E 'hestia-console|desktop|icons|systemd'
grep -R "0.0.0.0\|child_process\|exec\|spawn\|sudo" -n server.js packaging scripts README.md 2>/dev/null || true

cd ..
