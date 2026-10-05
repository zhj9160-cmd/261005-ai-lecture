/* Firebase Realtime Database 청중 동기화 · 관리자 UID는 /admins/{uid}=true */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getDatabase, ref, get, set, update, onValue, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';

const DEFAULT_STATE = { slide: 0, locked: true, pdf: true };

export function isConfigured(cfg) {
  return !!(cfg && ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'appId'].every((key) =>
    typeof cfg[key] === 'string' && cfg[key].trim() && !cfg[key].includes('[')));
}

export function createSync(cfg, deckId) {
  const app = initializeApp(cfg);
  const db = getDatabase(app);
  const auth = getAuth(app);
  const stateRef = ref(db, 'decks/' + deckId + '/state');
  const adminListeners = [];
  let isAdmin = false;
  let currentUser = null;

  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    isAdmin = false;
    if (user) {
      try {
        isAdmin = (await get(ref(db, 'admins/' + user.uid))).val() === true;
        if (isAdmin && !(await get(stateRef)).exists()) {
          await set(stateRef, { ...DEFAULT_STATE, updatedAt: serverTimestamp() });
        }
      } catch (_) {
        isAdmin = false;
      }
    }
    adminListeners.forEach((listener) => listener(isAdmin, currentUser));
  });

  function patch(values) {
    if (!isAdmin) return Promise.reject(new Error('not-admin'));
    return update(stateRef, { ...values, updatedAt: serverTimestamp() });
  }

  return {
    onState(callback) {
      return onValue(stateRef,
        (snapshot) => callback({ ...DEFAULT_STATE, ...(snapshot.val() || {}) }),
        () => callback(null));
    },
    onConnection(callback) {
      return onValue(ref(db, '.info/connected'), (snapshot) => callback(snapshot.val() === true));
    },
    onAdmin(callback) {
      adminListeners.push(callback);
      callback(isAdmin, currentUser);
    },
    login(email, password) { return signInWithEmailAndPassword(auth, email, password); },
    logout() { return signOut(auth); },
    setSlide(index) { return patch({ slide: Math.max(0, Math.trunc(index)) }); },
    setLock(value) { return patch({ locked: !!value }); },
    setPdf(value) { return patch({ pdf: !!value }); }
  };
}
