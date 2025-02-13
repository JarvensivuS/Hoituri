## Required Tools Installation & Version Checks

### 1. Install
```bash
npm install expo-cli --save-dev
npm install typescript --save-dev
npm run install:all

cd mobile-app
npm install @react-navigation/native @react-navigation/stack react-native-screens react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-vector-icons

cd mobile-app
npx expo install @react-native-async-storage/async-storage@1.23.1 expo@52.0.33 expo-location@18.0.6 react-native@0.76.7 react-native-maps@1.18.0

cd mobile-app
npm install expo-router
```
### 2. Verify
```bash
node -v    
npm -v  
npx tsc --version
npx expo --version
```

### 3. Test 
```bash
cd backend
npm start

cd web-app
npm start

cd mobile-app
npm start
```

### 3. Workflow
```bash
hoituri/
├── backend/          # Express.js + TypeScript server (Samuli)
├── mobile-app/       # React Native/Expo app with TypeScript (Tuomas)
└── web-app/          # React + TypeScript web interface (Sampo I. & Sampo S.)
```

1. Pull first:
```bash
git pull origin main
```

2. Push your changes:
```bash
git add .
git commit -m "Descriptive commit message"
git push -u origin your_branch
```

## Technology Stack
- **Backend:**
  - Node.js with Express
  - TypeScript
  - AzureSQL

- **Web Frontend:**
  - React 18
  - TypeScript
  - React Router
  - Material UI or Tailwind (if need)
  - Leaflet?

- **Mobile App:**
  - React Native with Expo
  - TypeScript
  - react-native-maps?