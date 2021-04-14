
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event' : 'login',
  'userId' : {auth.firebaseUser?.uid}
});