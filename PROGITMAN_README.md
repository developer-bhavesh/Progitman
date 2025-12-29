# Progitman - GitHub Credential Manager

A modern, professional desktop application built with Wails, React, and TypeScript for managing GitHub credentials in Apple Lab environments. Features a complete GitHub-inspired dark theme with premium UI components.

## 🎨 Design System

### GitHub Dark Theme
- **Canvas Background**: `#0d1117` - Main application background
- **Default Background**: `#161b22` - Cards and panels
- **Subtle Background**: `#21262d` - Input fields and secondary elements
- **Border Colors**: `#30363d` - Default borders and separators
- **Text Colors**: 
  - Primary: `#c9d1d9` - Main text
  - Secondary: `#8b949e` - Secondary text
  - Tertiary: `#6e7681` - Muted text
- **Accent Color**: `#58a6ff` - GitHub blue for interactive elements
- **Status Colors**:
  - Success: `#3fb950` - Active tokens
  - Warning: `#db9a04` - Expiring soon
  - Danger: `#f85149` - Expired tokens

### Typography
- **Font Family**: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold)
- **Line Height**: 1.5 for body text, 1.25 for headings

## 🏗️ Architecture

### Project Structure
```
src/
├── pages/
│   ├── Home.tsx              # Main dashboard with profile grid
│   ├── CreateProfile.tsx     # New profile creation wrapper
│   └── ProfileManage.tsx     # Profile editing wrapper
├── components/
│   ├── ProfileCard.tsx       # Individual profile card component
│   ├── PinModal.tsx          # PIN authentication modal
│   ├── ProfileForm.tsx       # Create/edit profile form
│   └── ProfileManagePanel.tsx # Profile details side panel
├── data/
│   └── profiles.ts           # Data models and mock data
└── ui/                       # shadcn/ui components
```

### Data Model
```typescript
interface Profile {
  id: string;
  name: string;
  email: string;
  username: string;
  encryptedToken: string;
  expiry: string; // YYYY-MM-DD
  pin: string;
}
```

## 🎯 Features

### 1. Home Dashboard
- **Modern Header**: GitHub-inspired navigation with app branding
- **Search Functionality**: Real-time filtering by name, username, or email
- **Profile Grid**: Responsive card layout with hover animations
- **Status Indicators**: Visual badges for token expiry status
- **Empty States**: Helpful messaging when no profiles exist

### 2. Profile Cards
- **GitHub Avatar Style**: Circular avatars with initials
- **Status Badges**: Color-coded expiry indicators
- **Hover Effects**: Smooth animations and border highlights
- **Compact Information**: Name, username, and expiry date
- **Click to Authenticate**: Opens PIN modal for security

### 3. PIN Authentication
- **Security Modal**: GitHub-styled dialog with backdrop blur
- **4-Digit PIN Input**: Masked password field with validation
- **Error Handling**: Shake animation for incorrect attempts
- **Auto-focus**: Immediate input focus for better UX

### 4. Profile Management Panel
- **Side Drawer**: Slide-out panel with profile details
- **Information Sections**: Organized display of all profile data
- **Token Management**: Show/hide toggle with copy functionality
- **Copy Feedback**: Visual confirmation when data is copied
- **Quick Actions**: Git setup, Xcode configuration, and profile management

### 5. Profile Form
- **Multi-section Layout**: Organized into Personal Info, GitHub Credentials, and Security
- **Real-time Validation**: Immediate feedback on form errors
- **Password Visibility**: Toggle for token and PIN fields
- **Responsive Design**: Adapts to different screen sizes
- **GitHub Styling**: Consistent with GitHub's form patterns

## 🎨 UI Components

### Custom GitHub Components
- **GitHub Cards**: `.github-card` with hover effects
- **GitHub Inputs**: `.github-input` with focus states
- **GitHub Buttons**: `.btn-primary` and `.btn-secondary` styles
- **Status Badges**: `.badge-success`, `.badge-warning`, `.badge-danger`
- **GitHub Modal**: `.github-modal` with proper shadows and borders

### Animations
- **Framer Motion**: Smooth page transitions and micro-interactions
- **Hover Effects**: Card elevation and scale transforms
- **Loading States**: Skeleton screens and loading indicators
- **Gesture Feedback**: Tap animations and visual responses

## 🔧 Technical Implementation

### State Management
- React hooks for local component state
- Centralized profile data management
- Form validation with real-time feedback

### Security Features
- PIN-based authentication for profile access
- Masked token display with reveal option
- Secure clipboard operations

### Responsive Design
- Mobile-first approach with breakpoint system
- Flexible grid layouts that adapt to screen size
- Touch-friendly interface elements

### Performance Optimizations
- Lazy loading of components
- Optimized re-renders with React.memo
- Efficient search filtering

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Go 1.19+
- Wails v2

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd Progitman

# Install frontend dependencies
cd frontend
npm install

# Install additional dependencies
npm install framer-motion date-fns

# Install shadcn/ui components
npx shadcn@latest add card avatar button input badge scroll-area dialog alert label separator sheet tooltip calendar popover

# Build the application
npm run build

# Run in development mode
wails dev
```

### Building for Production
```bash
# Build the complete application
wails build

# The built application will be in the build/ directory
```

## 🎯 Usage Scenarios

### Apple Lab Environment
- **150+ Students**: Efficiently manage large numbers of student profiles
- **Secure Access**: PIN-protected profile management
- **Quick Setup**: Streamlined Git and Xcode configuration
- **Token Management**: Easy token updates and expiry tracking

### Educational Workflow
1. **Add Student**: Create new profile with GitHub credentials
2. **Secure Access**: Students use PIN to access their credentials
3. **Token Monitoring**: Visual indicators for expiring tokens
4. **Quick Actions**: One-click Git and development environment setup

## 🔒 Security Considerations

- **PIN Protection**: 4-digit PIN required for profile access
- **Token Encryption**: Secure storage of GitHub Personal Access Tokens
- **No Persistent Sessions**: Re-authentication required for each access
- **Clipboard Security**: Automatic clipboard clearing after copy operations

## 🎨 Design Philosophy

The application follows GitHub's design principles:
- **Clarity**: Clean, uncluttered interface with clear information hierarchy
- **Consistency**: Uniform styling and interaction patterns throughout
- **Accessibility**: High contrast colors and keyboard navigation support
- **Performance**: Fast, responsive interactions with smooth animations

## 📱 Responsive Breakpoints

- **Mobile**: < 640px - Single column layout
- **Tablet**: 640px - 1024px - Two column grid
- **Desktop**: 1024px - 1280px - Three column grid
- **Large Desktop**: > 1280px - Four column grid

## 🔄 Future Enhancements

- **Dark/Light Theme Toggle**: User preference for theme selection
- **Bulk Operations**: Multi-select for batch profile management
- **Export/Import**: Profile data backup and restore functionality
- **Integration**: Direct GitHub API integration for token validation
- **Notifications**: System notifications for expiring tokens
- **Analytics**: Usage statistics and token expiry reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style and GitHub design patterns
4. Test thoroughly across different screen sizes
5. Submit a pull request with detailed description

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for Apple Lab environments using modern web technologies and GitHub's design system.