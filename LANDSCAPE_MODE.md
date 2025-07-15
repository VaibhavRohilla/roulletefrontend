# 🎯 Landscape Mode Implementation

This roulette game is optimized for landscape orientation and includes comprehensive landscape mode enforcement.

## Features

### 🔒 Automatic Orientation Locking
- Attempts to lock device orientation to landscape mode (where supported)
- Works on modern mobile browsers with Screen Orientation API support
- Falls back gracefully on unsupported devices

### 📱 Portrait Mode Warning
- Shows a user-friendly overlay when device is in portrait mode
- Encourages users to rotate to landscape for optimal experience
- Automatically hides when switching to landscape

### 🎮 Game Optimization
- Game logic designed for 1920x1080 landscape resolution
- Responsive scaling maintains aspect ratio across different screen sizes
- Performance optimized for landscape gameplay

## Implementation Details

### Core Files
- `style.css` - CSS media queries and orientation styles
- `OrientationManager.ts` - Centralized orientation handling utility
- `main.ts` - Integration with game initialization
- `index.html` - HTML meta tags for orientation hints

### CSS Features
```css
/* Landscape mode (preferred) */
@media screen and (orientation: landscape) {
    .orientation-warning { display: none !important; }
}

/* Portrait mode (show warning) */
@media screen and (orientation: portrait) {
    .orientation-warning { display: flex !important; }
}
```

### JavaScript API
```typescript
import { OrientationManager } from './OrientationManager';

const orientationManager = OrientationManager.getInstance();

// Enforce landscape mode with user feedback
orientationManager.enforceLandscapeMode();

// Subscribe to orientation changes
const unsubscribe = orientationManager.onOrientationChange((orientation) => {
    console.log(`Orientation changed to: ${orientation}`);
});

// Check current orientation
if (orientationManager.isLandscape()) {
    // Landscape mode active
}

// Attempt to lock orientation
await orientationManager.lockToLandscape();
```

## Browser Support

### Full Support (Orientation Lock)
- Chrome 38+ (Android)
- Firefox 44+ (Android)
- Safari 13+ (iOS - limited)

### Partial Support (Warning Only)
- All modern browsers with CSS media queries
- Internet Explorer 10+
- All desktop browsers

### Fallback Behavior
- Desktop browsers: No warnings shown (assumed landscape capable)
- Unsupported mobile: Shows warning overlay, no orientation lock
- Older browsers: Basic responsive behavior

## Testing

### Debug Mode
Add `#debug` to the URL to enable debug information:
```
http://localhost:5173/#debug
```

This displays:
- Current orientation
- Screen dimensions
- Mobile device detection
- Orientation lock support
- Scale factors

### Manual Testing
1. **Mobile Device**: 
   - Portrait → Should show warning overlay
   - Landscape → Warning should disappear
   - Lock should attempt (may require user gesture)

2. **Desktop Browser**: 
   - Resize window to portrait aspect ratio
   - Should not show warnings (desktop assumed capable)

3. **Tablet**:
   - Behavior varies by device and browser
   - Generally follows mobile behavior

## Configuration

### Disable Portrait Warning
To disable the portrait mode warning entirely:

```css
.orientation-warning {
    display: none !important;
}
```

### Customize Warning Message
Edit the HTML in `index.html`:

```html
<div class="orientation-warning" id="orientationWarning">
    <h1>Your Custom Title</h1>
    <p>Your custom message here!</p>
</div>
```

### Adjust Detection Sensitivity
Modify the orientation detection logic in `OrientationManager.ts`:

```typescript
private detectOrientation(): OrientationType {
    // Add buffer zone to prevent orientation flicker
    const aspectRatio = window.innerWidth / window.innerHeight;
    return aspectRatio > 1.2 ? 'landscape' : 'portrait';
}
```

## Game Integration

### Scene Management
The game automatically handles orientation changes:
- Recalculates scale factors
- Triggers scene resize
- Updates render dimensions

### Performance
- Orientation changes are debounced (100ms delay)
- Multiple event listeners ensure reliability
- Minimal performance impact

### User Experience
- Smooth transitions between orientations
- Visual feedback for required orientation
- Non-blocking (game continues in portrait if desired)

## Troubleshooting

### Common Issues

1. **Orientation lock not working**
   - Requires user gesture on many browsers
   - Check browser console for error messages
   - Ensure HTTPS in production

2. **Warning not appearing**
   - Check if `orientationWarning` element exists
   - Verify CSS media queries are working
   - Test mobile device detection

3. **Performance issues**
   - Check for multiple orientation listeners
   - Verify debouncing is working
   - Monitor console for excessive logging

### Debug Commands
```javascript
// In browser console
const om = OrientationManager.getInstance();
om.debug(); // Shows current state
om.getOrientationInfo(); // Detailed info
```

## Future Enhancements

- [ ] Haptic feedback on orientation change
- [ ] Progressive Web App manifest orientation
- [ ] Gamepad API integration for landscape gaming
- [ ] Advanced orientation animations
- [ ] Multi-display support 