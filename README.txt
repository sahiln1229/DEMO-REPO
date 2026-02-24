Medical College Project - Setup & Start Guide

PREREQUISITES:
1. Node.js installed on your system.
2. Expo Go app installed on your phone (Android/iOS).

SETUP INSTRUCTIONS:
1. Open your terminal (Command Prompt, PowerShell, or Git Bash).
2. Navigate to the App directory:
   cd App
   (Or full path: cd "c:\Users\Sahil Narkar\Desktop\A1_Medical College Project\App")

3. Install dependencies:
   npm install

STARTING THE APPLICATION:

Option 1: Start with Tunneling (Recommended for connecting via Phone)
   This allows you to connect to the app even if your phone and computer are on different networks.
   Run the following command:
   npx expo start --tunnel

Option 2: Start on Web Browser
   Run the following command:
   npx expo start --web

Option 3: Start normally (LAN)
   Ensure your phone and computer are on the same Wi-Fi network.
   Run the following command:
    npx expo start --tunnel

TROUBLESHOOTING:
- If you see "Network response timed out", try using the --tunnel flag (Option 1).
- If dependencies are missing, run 'npm install' again.
- Clear cache if you face weird issues: npx expo start -c
