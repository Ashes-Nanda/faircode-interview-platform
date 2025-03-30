<<<<<<< HEAD
# Fair Code 👁️

A powerful Chrome extension designed to maintain academic integrity during technical interviews and coding assessments. ShadowSight Proctor monitors and prevents unfair practices on coding platforms like LeetCode, HackerEarth, HackerRank, and CodeChef.

## 🚀 Features

### Core Monitoring Capabilities
- **Fullscreen Enforcement**: Automatically enters and maintains fullscreen mode during assessments
- **Tab Switch Detection**: Prevents and reports attempts to switch between tabs
- **Copy/Paste Prevention**: Blocks unauthorized code copying and pasting
- **Keyboard Shortcut Control**: Monitors and prevents use of suspicious keyboard combinations
- **Window Focus Tracking**: Detects attempts to switch windows or applications

### Anti-Cheating Measures
- **DOM Manipulation Detection**: 
  - Identifies hidden content and invisible overlays
  - Detects semi-transparent solution overlays
  - Monitors suspicious iframe creation
  - Catches attempts to inject algorithm solutions
- **DevTools Prevention**: Detects and reports attempts to open browser developer tools
- **Algorithm Solution Detection**: Identifies attempts to display solutions through:
  - Semi-transparent overlays
  - Hidden DOM elements
  - Code snippets with specific patterns

### Security Features
- **Anti-Tampering Protection**: Prevents modification of critical monitoring functions
- **Rate-Limited Notifications**: Intelligent notification system to prevent spam
- **Violation Logging**: Comprehensive logging of all detected violations
- **Real-time Monitoring**: Instant detection and reporting of suspicious activities

## 📋 Requirements

- Google Chrome Browser (Version 88 or higher)
- Supported coding platforms:
  - LeetCode
  - HackerEarth
  - HackerRank
  - CodeChef

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/shadowsight-proctor.git
   ```

2. Open Chrome Extensions:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right

3. Load the extension:
   - Click "Load unpacked"
   - Select the `extension` folder from the cloned repository

## 💻 Usage

1. **Start Monitoring**:
   - Click the ShadowSight icon in your Chrome toolbar
   - Click "Start Monitoring" on any supported coding platform
   - The page will enter fullscreen mode automatically

2. **During Monitoring**:
   - A status indicator shows active monitoring
   - Violations are logged and displayed in the popup
   - Notifications appear for detected violations
   - The system prevents common cheating methods

3. **Stop Monitoring**:
   - Click the ShadowSight icon
   - Click "Stop Monitoring"
   - The page will exit fullscreen mode

## 🛡️ Security Measures

### Violation Types Detected
- `SECURITY_VIOLATION`: Tab switching, fullscreen exit attempts
- `DOM_MANIPULATION`: Hidden content, overlay injection
- `CHEATING_ATTEMPT`: Solution overlays, code injection
- `COPY_PASTE`: Unauthorized code copying
- `KEYBOARD_SHORTCUT`: Suspicious keyboard combinations
- `DEVTOOLS_OPEN`: Browser developer tools usage

### Prevention Mechanisms
- Fullscreen mode enforcement
- Event listener protection
- DOM mutation monitoring
- Keyboard shortcut blocking
- Copy/paste prevention
- Window focus tracking

## ⚙️ Configuration

The extension supports customizable settings:
- Tab switch detection
- DOM manipulation monitoring
- Copy/paste prevention
- Notification preferences
- Violation cooldown periods

## 🔍 Debugging

For development and testing:
1. Open Chrome DevTools
2. Check the console for detailed logs
3. Monitor the background script via chrome://extensions
4. Review violation logs in the extension popup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔐 Privacy

ShadowSight Proctor respects user privacy:
- Only monitors supported coding platforms
- No personal data collection
- Local violation storage
- Transparent monitoring indicators

## ⚠️ Known Limitations

- Requires Chrome browser
- Fullscreen mode must be allowed
- Some keyboard shortcuts may be blocked
- May conflict with other monitoring extensions

## 📞 Support

For issues, feature requests, or questions:
- Open an issue in the repository
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- Chrome Extensions API
- MutationObserver API
- Fullscreen API
- Chrome Storage API

---

Built with ❤️ for maintaining academic integrity in technical assessments.
=======

>>>>>>> d6148569ad838be013e58045a3dc67571c8c8cad
