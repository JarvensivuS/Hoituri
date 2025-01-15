# SeniiliSaver Setup Guide

## Required Software
1. Node.js (LTS version 20.17.0 or newer)
2. Visual Studio Code
3. Android SDK Command Line Tools

## Environment Setup Steps

### 1. Install Node.js
- Download and install from: https://nodejs.org
- Verify installation in terminal:
```bash
node --version  # v20.17.0 or newer
npm --version # 10.8.2 or newer
```

### 2. Install Visual Studio Code
- Download from: https://code.visualstudio.com/
- Install these VSCode extensions:
  - React Native Tools
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter

### 3. Android SDK Setup
1. Create directory structure:
```bash
mkdir C:\Android\sdk\cmdline-tools
mkdir C:\Android\sdk\cmdline-tools\latest
```
Important: After extracting, make sure your folder structure looks exactly like this:

```bash
C:\Android\sdk\cmdline-tools\latest\
    ├── bin\
    ├── lib\
    └── source.properties
```

2. Download Android Command Line Tools:
- Go to https://developer.android.com/studio#command-tools
- Download "Command line tools only" for Windows
- Extract contents into `C:\Android\sdk\cmdline-tools\latest`

3. Set Environment Variables:
- Open "Edit system environment variables"
- Add new System Variable:
  - Name: ANDROID_HOME
  - Value: C:\Android\sdk
- Edit Path variable, add:
  - C:\Android\sdk\cmdline-tools\latest\bin
  - C:\Android\sdk\platform-tools

4. Install SDK packages (run in new terminal):
```bash
sdkmanager --sdk_root=C:\Android\sdk "platform-tools" "platforms;android-33" "build-tools;33.0.0"
```

### 4. Project Setup
1. Clone the repository:
```bash
git clone https://github.com/Ryhma-17-Opinnaytetyo/SeniiliSaver.git
cd seniilisaver
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Troubleshooting

If you encounter MODULE_NOT_FOUND errors:
```bash
npm cache clean --force
npm install
```

For sdkmanager command not found:
- Verify environment variables are set correctly
- Open a new terminal window
- Use full path: `C:\Android\sdk\cmdline-tools\latest\bin\sdkmanager`

## Verification

To verify everything is working:
1. Open the project in VSCode
2. Start the development server with `npm start`
3. You should see the React welcome screen at http://localhost:8081
