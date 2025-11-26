# Background Images

This directory contains background images for crime scene investigations.

## Required Images

- **CrimeScene.png** - First tutorial crime scene background image
  - Used for: Tutorial Case 1 (The Missing Coffee Mug)
  - Location: Office Break Room setting
  - Recommended size: 1920x1080 or 1280x720
  - Format: PNG with transparency support

## Usage

Background images are referenced in case definitions using the `backgroundImage` property:

```javascript
{
  id: 'tutorial_coffee_theft',
  title: 'Tutorial: The Missing Coffee Mug',
  backgroundImage: '/src/Assets/Background/CrimeScene.png',
  // ... rest of case definition
}
```

The background image will be displayed during the investigation phase as the scene backdrop.
