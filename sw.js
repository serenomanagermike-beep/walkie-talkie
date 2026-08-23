// sw.js - Background Service Worker for Lock Screen Alerts
self.addEventListener('push', function(event) {
  let payload = { title: '🚨 FRIEND RADIO', body: 'Incoming transmission!' };
  try {
    if (event.data) {
      payload = event.data.json();
    }
  } catch(e) {
    if (event.data) payload.body = event.data.text();
  }

  const options = {
    body: payload.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/945/945418.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/945/945418.png',
    vibrate: [200, 100, 200, 100, 400],
    tag: 'friend-radio-alert',
    renotify: true,
    data: {
      url: self.location.origin + self.location.pathname
    }
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || '🚨 FRIEND RADIO', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
