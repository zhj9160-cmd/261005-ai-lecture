/* Firebase 콘솔의 웹 앱 구성 값을 입력한 뒤 배포. 이 값은 공개 식별 정보이며 권한은 database.rules.json으로 제한. */
window.FIREBASE_CONFIG = {
  apiKey: '[apiKey]',
  authDomain: '[project-id].firebaseapp.com',
  databaseURL: '[Realtime Database URL]',
  projectId: '[project-id]',
  appId: '[appId]'
};

/* 강의별 고유 경로: decks/ai-lecture-261005/state */
window.DECK_ID = 'ai-lecture-261005';
