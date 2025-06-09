
// Trillion Path Service Worker for 24/7 operation
const CACHE_NAME = 'trillion-path-v1';
const HEARTBEAT_INTERVAL = 5000; // 5 seconds

self.addEventListener('install', (event) => {
  console.log('🚀 Trillion Path Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('⚡ Trillion Path Worker activated');
  event.waitUntil(self.clients.claim());
  
  // Start background heartbeat
  startBackgroundHeartbeat();
});

self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'START_TRILLION_PATH':
      startTrillionPathMonitoring(data);
      break;
    case 'STOP_TRILLION_PATH':
      stopTrillionPathMonitoring();
      break;
    case 'HEARTBEAT':
      updateHeartbeat();
      break;
  }
});

let heartbeatInterval;
let isMonitoring = false;

function startBackgroundHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }
  
  heartbeatInterval = setInterval(() => {
    // Send heartbeat to all clients
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'BACKGROUND_HEARTBEAT',
          timestamp: Date.now()
        });
      });
    });
  }, HEARTBEAT_INTERVAL);
}

function startTrillionPathMonitoring(config) {
  isMonitoring = true;
  console.log('📊 Background monitoring started for Trillion Path');
  
  // Monitor system health and restart if needed
  const monitorInterval = setInterval(() => {
    if (!isMonitoring) {
      clearInterval(monitorInterval);
      return;
    }
    
    // Check if main thread is responsive
    self.clients.matchAll().then(clients => {
      if (clients.length === 0) {
        console.log('⚠️ No active clients, maintaining background operation');
        return;
      }
      
      clients.forEach(client => {
        client.postMessage({
          type: 'HEALTH_CHECK',
          timestamp: Date.now()
        });
      });
    });
  }, 10000); // Check every 10 seconds
}

function stopTrillionPathMonitoring() {
  isMonitoring = false;
  console.log('⏹️ Background monitoring stopped');
}

function updateHeartbeat() {
  // Store heartbeat in IndexedDB for persistence
  if ('indexedDB' in self) {
    const request = indexedDB.open('TrillionPathDB', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['heartbeat'], 'readwrite');
      const store = transaction.objectStore('heartbeat');
      
      store.put({
        id: 'system',
        timestamp: Date.now(),
        status: 'active'
      });
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('heartbeat')) {
        db.createObjectStore('heartbeat', { keyPath: 'id' });
      }
    };
  }
}

// Handle page visibility changes
self.addEventListener('visibilitychange', () => {
  if (document.hidden && isMonitoring) {
    console.log('🌙 Page hidden, maintaining background operation');
  } else if (!document.hidden && isMonitoring) {
    console.log('👁️ Page visible, continuing operation');
  }
});
