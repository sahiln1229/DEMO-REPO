# Medical College Onboarding Screens

Modern React Native authentication UI with Login and Register screens featuring beautiful gradient backgrounds, smooth animations, and interactive inputs.

## Features

✅ **Two Beautiful Screens**
- Login Screen: Pink → Rose gradient background
- Register Screen: Teal → Aqua gradient background

✅ **Modern UI Components**
- Soft pastel gradient backgrounds
- White rounded card containers with neumorphism shadows
- Interactive rounded input fields with soft gray background
- Icon integration (user, email, lock, eye toggle)
- Large rounded gradient buttons with animations
- Clean, modern typography

✅ **Interactive Features**
- Smooth fade-in animations on screen load
- Touch animations with scale effect (0.96 on press)
- Input field focus highlighting with color change
- Password visibility toggle with eye icon
- Navigation between Login and Register screens

✅ **Responsive Design**
- Fully responsive for all mobile screen sizes
- Keyboard-aware view for proper input handling
- Safe area support for notched devices

## Project Structure

```
App/
├── App.js                    # Main app entry point
├── Navigation.js             # Navigation stack setup
├── app.json                  # Expo configuration
├── package.json              # Dependencies
├── components/
│   └── CustomInput.js        # Reusable input component
├── screens/
│   ├── LoginScreen.js        # Login screen
│   └── RegisterScreen.js     # Register screen
└── utils/                    # Utility files (extensible)
```

## Installation & Setup

### 1. Install Dependencies

The project uses Expo and React Native. All dependencies are pre-configured in `package.json`. Install them:

```bash
npm install
# or
yarn install
```

### 2. Run the App

**For iOS:**
```bash
npm run ios
# or
expo start --ios
```

**For Android:**
```bash
npm run android
# or
expo start --android
```

**For Web:**
```bash
npm run web
# or
expo start --web
```

**General (choose device):**
```bash
npm start
# or
expo start
```

## Dependencies Used

- **expo-linear-gradient**: Smooth gradient backgrounds
- **react-native-vector-icons/Ionicons**: Beautiful icon library
- **@react-navigation/native**: Navigation management
- **@react-navigation/stack**: Stack navigation
- **react-native-screens**: Optimized screen handling
- **react-native-safe-area-context**: Safe area support
- **react-native-gesture-handler**: Gesture support
- **react-native-reanimated**: Advanced animations

## Screens Overview

### Login Screen

**Design:**
- Pink → Rose gradient background (#FF6B9D → #E74C89)
- Star icon inside white circle
- Title: "Welcome Back!"
- Subtitle: "Login to continue learning"

**Features:**
- Email input with mail icon
- Password input with lock icon + eye toggle
- Pink gradient Login button with arrow icon
- Navigation link to Register screen

### Register Screen

**Design:**
- Teal → Aqua gradient background (#20B2AA → #48D1CC)
- User icon inside white circle
- Title: "Create Account"
- Subtitle: "Join us to start learning"

**Features:**
- Full Name input with person icon
- Email input with mail icon
- Password input with lock icon + eye toggle
- Confirm Password input with lock icon + eye toggle
- Teal-green gradient Register button with checkmark icon
- Navigation link to Login screen

## CustomInput Component

A reusable input component with built-in features:

```javascript
<CustomInput
  placeholder="Enter text"
  leftIcon="mail"           // Ionicons icon name
  isPassword={false}        // Toggle password mode
  value={value}
  onChangeText={setValue}
/>
```

**Features:**
- Left icon support
- Password visibility toggle (automatic for isPassword={true})
- Focus state styling
- Smooth border color transitions
- Right icon for eye toggle

## Animations

### Page Load Animation
- Fade-in effect (0 → 1 opacity over 600ms)
- Scale effect (0.9 → 1 scale over 600ms)
- Parallel timing for smooth entrance

### Button Press Animation
- Scale down to 0.96 (100ms)
- Scale back to 1 (100ms)
- Creates tactile feedback effect

### Input Focus Animation
- Border color changes from #F7F7F7 to respective brand color
- Icon colors update to match focus state
- Smooth color transitions

## Styling & Design System

### Colors
- **Login**: Pink (#FF6B9D) to Rose (#E74C89)
- **Register**: Teal (#20B2AA) to Dark Cyan (#008B8B)
- **Backgrounds**: Soft gray (#F7F7F7)
- **Text**: Dark gray (#333), Medium gray (#999)

### Typography
- **Title**: 28px, Bold (700)
- **Subtitle**: 16px, Medium (500)
- **Button**: 18px, Bold (700)
- **Input**: 16px, Medium (500)

### Spacing
- Card padding: 40px vertical, 24px horizontal
- Input margin: 10px vertical
- Icon margins: 12px
- Border radius: 30px (card), 14px (inputs/buttons)

### Shadows (Neumorphism)
- Card shadow: 0px 10px offset, 0.15 opacity, 20px radius
- Icon circle shadow: 0px 5px offset, 0.2 opacity, 10px radius
- Button shadow: 0px 8px offset, 0.3 opacity, 12px radius

## Extending the App

### Add More Screens
1. Create a new file in `screens/` folder
2. Import and add to navigation stack in `Navigation.js`
3. Add navigation.navigate() calls as needed

### Customize Inputs
Modify `components/CustomInput.js` to add features like:
- Validation indicators
- Character count
- Custom color schemes

### Modify Gradients
Update the gradient colors in each screen:
```javascript
<LinearGradient
  colors={['#YourColor1', '#YourColor2']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
```

## Keyboard Handling

Both screens implement `KeyboardAvoidingView` for proper keyboard management:
- iOS: Uses padding behavior
- Android: Uses height behavior
- Prevents input fields from being hidden by keyboard

## Safe Area Support

The app includes safe area context for:
- Notched devices (iPhone X and newer)
- Devices with screen cutouts
- Status bar management

## Performance Optimization

- Uses `React.memo` for input components
- Optimized animations with React Native's native driver
- ScrollView with optimized scrolling
- Gesture handler for smooth interactions

## Troubleshooting

### Dependencies not installing?
```bash
npm install --legacy-peer-deps
```

### Icons not showing?
Make sure `react-native-vector-icons` is linked:
```bash
expo install react-native-vector-icons
```

### Animations not smooth?
Check that you're using a physical device or modern emulator. Web might have performance limitations.

### Navigation not working?
Ensure all screens are properly imported in `Navigation.js`

## Future Enhancements

- Form validation
- API integration for auth
- Biometric authentication
- Social login options
- Theme switching (light/dark)
- Multi-language support

## License

This project is created for educational purposes.

---

**Created with ❤️ using React Native + Expo**

For more information, visit:
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)
