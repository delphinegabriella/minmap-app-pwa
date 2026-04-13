export async function subscribePushNotification() {
console.log('Masuk Function');

    const token = localStorage.getItem('token');
    console.log('TOKEN', token);

    if(!token) {
      alert('Harus login dulu!');
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();
    if(permission !== 'granted') {
        alert('Izin Ditolak');
        return;
    }

    const vapidPublicKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk' 

     const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedKey,
  });

  const subJSON = subscription.toJSON();

   try {
    await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint: subJSON.endpoint,
        keys: {
          p256dh: subJSON.keys.p256dh,
          auth: subJSON.keys.auth,
        },
      }),
    });

 alert('Berhasil subscribe!');
  } catch (error) {
    console.error('Gagal subscribe:', error);
  }


  console.log('Subscription:', subscription);
}

function urlBase64ToUint8Array(base64string) {
  const padding = '=' .repeat((4 - base64string.length % 4) % 4);
  const base64 = (base64string + padding)
  .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

