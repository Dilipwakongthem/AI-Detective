# AI Detective: Crime Scene Investigation

**A Sophisticated Web-Based Detective Mystery Game with Procedural Generation and Narrative Cases**

---

## 🎯 Overview

**AI Detective: Crime Scene Investigation** is a browser-based detective mystery game built with React. The game combines procedural case generation with hand-crafted narrative cases, featuring intelligent suspect personalities, evidence-based deduction, and comprehensive accessibility features.

### ✨ Key Features

- 🎲 **Hybrid Case System** - Mix of procedural and hand-crafted narrative cases
- 🧠 **Intelligent Suspects** - 10 distinct personalities with dynamic nervousness and behavioral patterns
- 🔍 **Evidence Matching** - Physical attributes system for indirect deduction
- 💬 **Advanced Interrogation** - Category-based questioning with emotional responses
- 📖 **Tutorial System** - Interactive step-by-step guidance for new players
- ♿ **Full Accessibility** - Font scaling, colorblind modes, high contrast, reduced motion
- 🎨 **Theme System** - Multiple visual themes with dynamic color palettes
- 🔊 **Sound Engine** - Immersive audio feedback system
- 📝 **Detective Notebook** - Take notes during investigation
- ⭐ **Progression System** - Ranks, reputation, achievements, and case ratings

---

## 🏗️ Technology Stack

### Frontend
- **React 18.2.0** - Modern UI library
- **JavaScript (ES6+)** - Core game logic
- **CSS3** - Styling with CSS variables for theming
- **LocalStorage** - Player data persistence

### Project Structure

```
AI-Detective/
├── src/
│   ├── components/          # React components
│   │   ├── DetectiveGame.jsx       # Main game component
│   │   ├── NotebookModal.jsx       # Detective's notebook
│   │   ├── StoreScreen.jsx         # In-game store
│   │   ├── SettingsModal.jsx       # Settings & accessibility
│   │   ├── TutorialModal.jsx       # Tutorial system
│   │   └── ThemeSelectorModal.jsx  # Theme selection
│   ├── utils/               # Utility systems
│   │   ├── soundEngine.js          # Audio management
│   │   ├── themeManager.js         # Theme system
│   │   ├── accessibilityManager.js # Accessibility features
│   │   ├── tutorialSystem.js       # Tutorial logic
│   │   ├── storageManager.js       # Save/load system
│   │   ├── notebookManager.js      # Note-taking system
│   │   ├── iapManager.js           # Monetization framework
│   │   └── adManager.js            # Ad integration
│   ├── gameLogic.js         # Core game engine
│   ├── handCraftedCases.js  # Narrative case definitions
│   └── index.js             # App entry point
├── public/
│   ├── assets/              # Game assets (audio, images)
│   └── index.html           # HTML template
├── ASSET_REQUIREMENTS.md    # Asset procurement guide
└── README.md                # This file
```

---

## 🎮 Core Game Systems

### 1. Case Generation System

The game features a **hybrid case system**:

#### Procedural Generation
- **Crime Types**: Murder, Theft, Fraud, Kidnapping, Arson
- **Dynamic Suspects**: 3-10 suspects (scales with difficulty)
- **Evidence Network**: 8-20+ pieces of evidence with complexity scaling
- **Physical Attributes**: Height, build, blood type, handedness, voice quality
- **Red Herring System**: Innocent suspects designed to mislead

#### Hand-Crafted Narrative Cases (NEW!)
- 3 fully-written detective stories with plot twists
- **The Midnight Gallery Heist** - Art theft with surprising revelation
- **Death at Le Bernardin** - Restaurant murder using victim's allergy
- **The Silicon Valley Sabotage** - Corporate espionage driven by revenge
- 30-40% chance to encounter narrative cases (Cases 3+)
- Avoids repetition through intelligent rotation

### 2. Interrogation System

**Question Categories**:
- **ALIBI** - Whereabouts and timeline verification
- **MOTIVE** - Relationship and conflict exploration
- **OPPORTUNITY** - Access and presence at crime scene
- **KNOWLEDGE** - Awareness of crime details
- **BEHAVIOR** - Emotional state and reactions
- **EVIDENCE_CONFRONTATION** - Direct confrontation with evidence

**Personality-Based Responses**:
- 10 unique personalities: Nervous, Calculating, Defensive, Charming, Evasive, Aggressive, Cooperative, Suspicious, Calm, Arrogant
- 200+ response templates tailored to guilt status and personality
- Dynamic nervousness calculation based on questioning pressure

### 3. Evidence Matching System

**Physical Attributes Tracked**:
- Height ranges, build types, hair/eye color
- Blood type (8 types), handedness
- Shoe size, distinctive marks
- Voice quality, phone area code
- Behavioral patterns

**Match Confidence Levels**:
- 🔴 **HIGH** (40%+): Multiple traits align
- 🟡 **MEDIUM** (20-39%): Moderate connection
- 🟢 **LOW** (10-19%): Weak circumstantial match

### 4. Tutorial System (NEW!)

**Interactive Onboarding**:
- 9-step guided tutorial for first-time players
- Context-aware tooltips and highlights
- Covers investigation, interrogation, evidence analysis, and accusation
- Skippable for experienced players
- Can be reset from Settings

**Tutorial Steps**:
1. Welcome & case overview
2. Investigation mechanics
3. Evidence discovery
4. Interrogation introduction
5. Reading suspects (nervousness, body language)
6. Evidence matching explanation
7. Making accusations
8. Case completion

### 5. Accessibility Features (NEW!)

**Font Scaling**:
- Small, Normal, Large, Extra Large (87.5% - 130%)
- Proportional scaling across all UI elements

**Colorblind Modes**:
- Protanopia (Red-Blind) - Orange/blue palette adjustments
- Deuteranopia (Green-Blind) - Modified green/red indicators
- Tritanopia (Blue-Blind) - Turquoise/red color scheme

**Additional Options**:
- High Contrast Mode - Enhanced borders and text weight
- Reduced Motion - Minimized animations for motion sensitivity
- Keyboard Navigation - Full keyboard support with focus indicators

### 6. Theme System

**Available Themes**:
- Classic Detective - Traditional noir aesthetic
- Modern Sleuth - Contemporary blue/white palette
- Neon Nights - Cyberpunk-inspired visuals
- Royal Mystery - Elegant purple/gold theme
- Forest Mystery - Nature-inspired green tones
- Ocean Deep - Deep blue underwater aesthetic
- Crimson Shadow - Dark red thriller theme
- Golden Age - Vintage detective style
- Midnight Blue - Professional dark mode
- Arctic Investigation - Cool blue-white palette

### 7. Progression System

**Detective Ranks**:
1. **Cadet** (0 rep)
2. **Rookie** (500)
3. **Detective** (1,500)
4. **Senior Detective** (3,000)
5. **Lieutenant** (5,000)
6. **Captain** (8,000)
7. **Commander** (12,000)
8. **Chief Detective** (20,000)

**Case Rating (0-5 ⭐)**:
- Correct suspect identified
- Critical evidence collected
- High evidence collection rate (60%+)
- All suspects interrogated
- Strong evidence against guilty party
- Hint penalty (reduces stars)

**Statistics Tracked**:
- Cases solved / wrong accusations
- Perfect cases (5-star ratings)
- Current / longest streak
- Elite rating (0-10,000 points)
- Legendary cases completed
- Total play time

---

## 🚀 Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js 16+ (for development)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Dilipwakongthem/AI-Detective.git
cd AI-Detective

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Running the Game

Open `index.html` in your browser, or use a local development server:

```bash
# Using Node.js http-server
npx http-server public -p 8080

# Using Python
python -m http.server 8080

# Using PHP
php -S localhost:8080
```

Then navigate to `http://localhost:8080`

---

## 📱 Game Controls

### Main Menu
- **New Case** - Start investigation (5 daily free cases)
- **Continue** - Resume in-progress case
- **Profile** - View stats and achievements
- **Store** - Purchase premium features
- **Settings** - Audio, accessibility, account management

### Investigation Screen
- **Search for Evidence** - Discover clues at crime scene
- **View Evidence Board** - Review collected evidence and matches
- **Question Suspect** - Start interrogation
- **Make Accusation** - Accuse a suspect (final decision)
- **Request Hint** - Get guidance (costs hint tokens)
- **Notebook** - Take personal notes (premium feature)

### Interrogation
- **Ask Question** - Query suspect from category selection
- **End Interrogation** - Return to investigation
- Observe nervousness levels and body language

---

## 🎨 Asset Requirements

**The game is functionally complete but requires professional assets for market launch.**

See **[ASSET_REQUIREMENTS.md](ASSET_REQUIREMENTS.md)** for detailed specifications:

### Critical Assets Needed
1. **Character Portraits** (20 suspects + detective) - $1,500-$4,000
2. **Crime Scene Backgrounds** (10 locations) - $2,000-$6,000
3. **Background Music** (5-7 tracks) - $500-$3,000
4. **Sound Effects** (20-30 sounds) - $200-$800
5. **UI Icons** (30-40 icons) - $300-$1,000
6. **Logo & Branding** - $300-$1,500

**Estimated Budget**:
- Minimum Viable: ~$2,800
- Recommended Quality: ~$10,300
- Market-Competitive: ~$22,800

---

## 🔧 Configuration

### Game Settings

```javascript
// In DetectiveGame.jsx
const settings = {
  soundEnabled: true,
  masterVolume: 0.7,
  fontSize: 'normal', // small, normal, large, x-large
  colorblindMode: 'none', // none, protanopia, deuteranopia, tritanopia
  highContrast: false,
  reducedMotion: false
};
```

### Adding Custom Cases

Edit `src/handCraftedCases.js`:

```javascript
export const HAND_CRAFTED_CASES = [
  {
    id: 'your_case_id',
    title: 'Case Title',
    difficulty: 5, // 1-10
    narrative: {
      opening: 'Case opening description...',
      twist: 'Plot twist revelation...',
      conclusion: 'Case conclusion...'
    },
    suspects: [
      {
        name: 'Suspect Name',
        age: 35,
        occupation: 'Occupation',
        personality: 'Calculating',
        backstory: 'Character backstory...',
        secret: 'Hidden secret...',
        isGuilty: true,
        // ... physical attributes
      }
    ],
    evidence: [
      {
        type: 'Fingerprints',
        description: 'Evidence description linking to suspect...',
        location: 'Crime Scene',
        critical: true
      }
    ],
    hints: [
      { level: 1, text: 'Basic hint...' },
      { level: 2, text: 'Medium hint...' },
      { level: 3, text: 'Strong hint...' }
    ]
  }
];
```

### Customizing Themes

Edit `src/utils/themeManager.js`:

```javascript
{
  id: 'custom_theme',
  name: 'Custom Theme',
  isPremium: false,
  colors: {
    bgPrimary: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    colorPrimary: '#f39c12',
    colorAccent: '#3498db',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    borderPrimary: '#f39c12'
  }
}
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Case generation (procedural and hand-crafted)
- [ ] Evidence discovery and matching
- [ ] Interrogation with all personality types
- [ ] Accusation (correct and incorrect)
- [ ] Tutorial flow (complete walkthrough)
- [ ] Accessibility features (all modes)
- [ ] Theme switching
- [ ] Sound effects and music
- [ ] Notebook functionality
- [ ] Save/load game state
- [ ] Settings persistence
- [ ] Mobile responsiveness

### Browser Compatibility

Tested on:
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+
- Mobile browsers (iOS Safari, Chrome Android)

---

## 📝 Complete Feature List

### ✅ Implemented Features

**Core Gameplay**:
- [x] Procedural case generation (5 crime types, 10+ difficulty levels)
- [x] Hand-crafted narrative cases with plot twists
- [x] 10 suspect personalities with 200+ response templates
- [x] Physical attribute evidence matching system
- [x] Red herring suspects to mislead players
- [x] 6-category interrogation system
- [x] Dynamic nervousness calculation
- [x] Evidence board with match confidence indicators
- [x] 5-star accusation rating system
- [x] Detective rank progression (8 ranks)

**User Experience**:
- [x] Interactive tutorial system (9 steps)
- [x] Font scaling (4 sizes)
- [x] Colorblind modes (3 types)
- [x] High contrast mode
- [x] Reduced motion support
- [x] Keyboard navigation
- [x] 10 visual themes
- [x] Sound effects and background music
- [x] Detective's notebook (note-taking)
- [x] Settings management
- [x] LocalStorage save/load

**Monetization Framework**:
- [x] Daily case limits (5 free cases)
- [x] Hint token system
- [x] Bonus case purchases
- [x] Case file bundles
- [x] Theme marketplace
- [x] Ad integration support
- [x] Premium features (notebook, themes, ad removal)

### 🔮 Future Enhancements

**Gameplay**:
- [ ] Case archive system to replay solved cases
- [ ] Interrogation contradiction tracking
- [ ] Multi-case story arcs
- [ ] Legendary case difficulty tier
- [ ] Forensics mini-games
- [ ] Partner detective AI assistant

**Technical**:
- [ ] Backend integration for cloud saves
- [ ] Multiplayer competitive mode
- [ ] Real-time leaderboards
- [ ] Daily challenge cases
- [ ] Achievement system expansion

**Content**:
- [ ] 20+ additional hand-crafted cases
- [ ] More crime types (cybercrime, espionage)
- [ ] Seasonal event cases
- [ ] Character storylines

---

## 🎬 Screenshots

*Professional screenshots to be added after asset integration*

Placeholder descriptions:
- Main menu with theme selection
- Case briefing screen
- Investigation view with evidence board
- Interrogation interface
- Accusation result screen
- Detective profile and stats
- Settings with accessibility options

---

## 🤝 Contributing

Contributions welcome! Areas for improvement:

1. **Content Creation**:
   - Write additional hand-crafted cases
   - Design new themes
   - Create interrogation question templates

2. **Code Enhancements**:
   - Performance optimizations
   - Mobile UI improvements
   - Additional accessibility features
   - Bug fixes

3. **Assets**:
   - Character artwork
   - Background illustrations
   - UI icons
   - Sound effects and music

4. **Documentation**:
   - Translation to other languages
   - Video tutorials
   - Case-writing guide

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎮 Credits

**Game Design & Development**: Dilipwakongthem
**Repository**: https://github.com/Dilipwakongthem/AI-Detective

**Built With**:
- React - UI library
- JavaScript - Core logic
- CSS3 - Styling and theming
- LocalStorage API - Data persistence

**Inspired by**:
- Return of the Obra Dinn
- Shadows of Doubt
- L.A. Noire
- Classic detective fiction (Agatha Christie, Arthur Conan Doyle)

---

## 📞 Support

For questions, issues, or feature requests:
- **GitHub Issues**: https://github.com/Dilipwakongthem/AI-Detective/issues
- **Asset Requirements**: See [ASSET_REQUIREMENTS.md](ASSET_REQUIREMENTS.md)

---

## 🌟 Acknowledgments

Special thanks to:
- The mystery/detective game community
- Open-source contributors
- Accessibility advocates for inclusive design principles
- Beta testers and early players

---

## 📊 Project Status

**Current Version**: 1.0.0-beta
**Status**: Feature-complete, awaiting professional assets
**Target Launch**: Q2 2025

**Completion Status**:
- ✅ Game Logic: 100%
- ✅ UI/UX Systems: 100%
- ✅ Accessibility: 100%
- ✅ Tutorial: 100%
- ⚠️ Visual Assets: 0% (requires procurement)
- ⚠️ Audio Assets: 0% (requires procurement)

See [ASSET_REQUIREMENTS.md](ASSET_REQUIREMENTS.md) for next steps.

---

**Happy Detecting! 🕵️‍♂️**

*The game is production-ready. Professional assets are the final piece needed for market launch.*
