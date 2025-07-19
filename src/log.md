App.ts:54 Application initialized, starting loading...
LoadingScene.ts:33 LoadingScene: Creating loading scene
LoadingScene.ts:57 LoadingScene: Created successfully
App.ts:124 Loading scene added to stage
App.ts:126 Starting loading process...
LoadingScene.ts:87 LoadingScene: Starting loading process, width: 667, height: 375
LoadingScene.ts:96 LoadingScene: Loading manifest
LoadingManager.ts:46 Loading manifest from: /assets/manifest.json
LoadingManager.ts:62 Manifest loaded successfully: {bundles: Array(1)}
LoadingScene.ts:102 LoadingScene: Initializing assets
LoadingManager.ts:76 Initializing Assets with basePath: /assets/
LoadingManager.ts:100 Prepared detailed asset info: (9) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
LoadingScene.ts:108 LoadingScene: Loading all assets
LoadingManager.ts:116 Starting to load 9 assets...
LoadingManager.ts:149 Loading asset with PIXI.Assets: GameBG
LoadingManager.ts:155 Loaded asset 1/9: GameBG (PixiAsset)
LoadingManager.ts:149 Loading asset with PIXI.Assets: NumberCircle
LoadingManager.ts:155 Loaded asset 2/9: NumberCircle (PixiAsset)
LoadingManager.ts:149 Loading asset with PIXI.Assets: ball
LoadingManager.ts:155 Loaded asset 3/9: ball (PixiAsset)
LoadingManager.ts:149 Loading asset with PIXI.Assets: divider
LoadingManager.ts:155 Loaded asset 4/9: divider (PixiAsset)
LoadingManager.ts:149 Loading asset with PIXI.Assets: inneroutline
LoadingManager.ts:155 Loaded asset 5/9: inneroutline (PixiAsset)
LoadingManager.ts:149 Loading asset with PIXI.Assets: RedBlackstrips
LoadingManager.ts:155 Loaded asset 6/9: RedBlackstrips (PixiAsset)
LoadingManager.ts:149 Loading asset with PIXI.Assets: Roulette
LoadingManager.ts:155 Loaded asset 7/9: Roulette (PixiAsset)
LoadingManager.ts:149 Loading asset with PIXI.Assets: top
LoadingManager.ts:155 Loaded asset 8/9: top (PixiAsset)
LoadingManager.ts:149 Loading asset with PIXI.Assets: table
LoadingManager.ts:155 Loaded asset 9/9: table (PixiAsset)
LoadingManager.ts:163 Loaded all assets: {GameBG: Texture, NumberCircle: Texture, ball: Texture, divider: Texture, inneroutline: Texture, …}
LoadingScene.ts:113 LoadingScene: Assets loaded successfully {GameBG: Texture, NumberCircle: Texture, ball: Texture, divider: Texture, inneroutline: Texture, …}
LoadingScene.ts:122 LoadingScene: Animating out
LoadingScene.ts:130 LoadingScene: Animation complete, calling onComplete callback
App.ts:113 Loading complete! Processing assets: {GameBG: Texture, NumberCircle: Texture, ball: Texture, divider: Texture, inneroutline: Texture, …}
App.ts:142 Stored texture: GameBG
App.ts:142 Stored texture: NumberCircle
App.ts:142 Stored texture: ball
App.ts:142 Stored texture: divider
App.ts:142 Stored texture: inneroutline
App.ts:142 Stored texture: RedBlackstrips
App.ts:142 Stored texture: Roulette
App.ts:142 Stored texture: top
App.ts:142 Stored texture: table
LoadingScene.ts:159 LoadingScene: Destroying
App.ts:118 Globals after loading: {resources: {…}, soundResources: {…}}
App.ts:164 Creating MainScene...
scene.ts:25 {GameBG: Texture, NumberCircle: Texture, ball: Texture, divider: Texture, inneroutline: Texture, …}
background.ts:76 PixiJS Deprecation Warning: addChild: Only Containers will be allowed to add children in v8.0.0Deprecated since v8.0.0
scene.ts:27 BackgroundSprite BackgroundSprite {_events: Events, _eventsCount: 0, uid: 10, _updateFlags: 15, renderGroup: null, …}
scene.ts:75 addChildToFullScene BackgroundSprite {_events: Events, _eventsCount: 0, uid: 10, _updateFlags: 15, renderGroup: null, …}
mainscene.ts:71 🎾 Ball sprite created and positioned for visibility
mainscene.ts:76 🎮 Core scene components initialized
roullete.ts:372 📏 Calculated outermost radius: 286.0px (texture: 635.5px, scale: 0.45)
roullete.ts:387 🎾 Ball start radius: 259.4px (26.55px margin from wheel edge 286.0px)
roullete.ts:405 🎾 Ball end radius: 125.5px (80% of number radius 85.5px)
BallPhysics.ts:79 📏 Ball physics dimensions calculated:
        🎯 Center: (960, 490.9090909090909)
        🚀 Start radius: 259.4px
        🎾 End radius: 125.5px
BallPhysics.ts:104 🎾 Ball initialized and VISIBLE at position (1219.4, 490.9) - ready for smooth animation
BallPhysics.ts:105 📏 Ball positioned at radius 259.4px from center (960, 490.9090909090909)
BallPhysics.ts:65 🎾 Smooth Ball Physics Engine initialized - GLITCH-FREE
GameUI.ts:130 PixiJS Deprecation Warning: Graphics#beginFill is no longer needed. Use Graphics#fill to fill the shape with the desired style.Deprecated since v8.0.0
GameUI.ts:132 PixiJS Deprecation Warning: Graphics#endFill is no longer needed. Use Graphics#fill to fill the shape with the desired style.Deprecated since v8.0.0
GameUI.ts:140 PixiJS Deprecation Warning: Graphics#lineStyle is no longer needed. Use Graphics#setStrokeStyle to set the stroke style.Deprecated since v8.0.0
GameUI.ts:96 PixiJS Deprecation Warning: use new Text({ text: "hi!", style }) insteadDeprecated since v8.0.0
GameUI.ts:112 🕒 Elegant casino time display created
GameUI.ts:285 ⏳ Countdown overlay created
GameUI.ts:395 📡 Elegant casino connection status created
GameUI.ts:526 🚫 No Games banner with overlay created
GameUI.ts:605 🏆 Winning banner with celebration overlay created
GameUI.ts:50 🎨 Game UI initialized
GameCycleManager.ts:39 🔄 GameCycleManager initialized with API polling
GameNetworkManager.ts:35 🌐 Game network manager initialized with API polling
InputController.ts:59 🖱️ Mouse controls configured
InputController.ts:70 ⌨️ Keyboard controls configured
InputController.ts:27 🎮 Input controller initialized
WheelSynchronizer.ts:25 🔄 Wheel synchronizer initialized - smooth transitions enabled
mainscene.ts:130 🔧 All modular systems initialized
WheelSynchronizer.ts:148 ⚠️ Using legacy startConstantRotation. Consider using startGradualRotation() for smoother experience.
startConstantRotation @ WheelSynchronizer.ts:148
connectSystems @ mainscene.ts:138
MainScene @ mainscene.ts:41
createGameScene @ App.ts:165
onComplete @ App.ts:119
onComplete @ LoadingScene.ts:133
_callback2 @ gsap.js?v=3fbf701c:753
render3 @ gsap.js?v=3fbf701c:2425
render3 @ gsap.js?v=3fbf701c:1613
_lazySafeRender2 @ gsap.js?v=3fbf701c:171
updateRoot @ gsap.js?v=3fbf701c:1918
_tick2 @ gsap.js?v=3fbf701c:970
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
WheelSynchronizer.ts:38 🚀 WHEEL SYNCHRONIZER: Starting gradual wheel rotation with smooth acceleration - NEW VERSION ACTIVE!
WheelSynchronizer.ts:64 🔄 Gradual wheel acceleration started
GameNetworkManager.ts:43 📡 Connecting to API-driven game server...
GameCycleManager.ts:46 🚀 Starting API-driven game cycle
InputController.ts:190 
🎮 ROULETTE INPUT CONTROLS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 SERVER CONNECTION:
  • Automatically connects to localhost:3001
  • 🟢 Connected: Server controls all spins and timing
  • 🔴 Disconnected: Manual controls available
  • 📡 Connection status shown in bottom-left corner
  • 🔄 Auto-reconnection with state synchronization

🎮 ROULETTE CONTROLS (Manual Mode Only):
  • Click anywhere: Random spin
  • SPACEBAR/R: Random spin  
  • 0-9: Spin to specific number
  • Q: Spin to 32 (red)
  • W: Spin to 15 (black)
  • E: Spin to 0 (green)

🎮 SERVER-CONTROLLED GAME FLOW:
  • Server sends roundStart → Countdown begins
  • Server sends spin commands → Automatic spins
  • All connected clients see the same results
  • Manual controls disabled when server connected

⏰ MANUAL COUNTDOWN CONTROLS (Manual Mode Only):
  • C: Start 15-second countdown
  • T: Start 30-second countdown  
  • X: Stop countdown

⚙️ CONFIGURATION:
  • Pockets: 37
  • Spin Duration: 5-10s (dynamic)
  • Wheel Speed: 0.3 rotations/sec (CONSTANT)
  • Ball Spins: 2
  • Ball Radius: 270→140
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        
mainscene.ts:146 🔗 Systems connected and operational
mainscene.ts:46 🎯 MainScene orchestrator initialized
App.ts:167 MainScene started via SceneManager
App.ts:128 Loading process initiated by LoadingScene.start()
GameCycleManager.ts:58 ❌ Failed to start game cycle: SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON
start @ GameCycleManager.ts:58
await in start
connectToServer @ GameNetworkManager.ts:44
connectSystems @ mainscene.ts:141
MainScene @ mainscene.ts:41
createGameScene @ App.ts:165
onComplete @ App.ts:119
onComplete @ LoadingScene.ts:133
_callback2 @ gsap.js?v=3fbf701c:753
render3 @ gsap.js?v=3fbf701c:2425
render3 @ gsap.js?v=3fbf701c:1613
_lazySafeRender2 @ gsap.js?v=3fbf701c:171
updateRoot @ gsap.js?v=3fbf701c:1918
_tick2 @ gsap.js?v=3fbf701c:970
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
GameNetworkManager.ts:103 ❌ API connection error detected
handleConnectionError @ GameNetworkManager.ts:103
onConnectionError @ GameNetworkManager.ts:31
start @ GameCycleManager.ts:59
await in start
connectToServer @ GameNetworkManager.ts:44
connectSystems @ mainscene.ts:141
MainScene @ mainscene.ts:41
createGameScene @ App.ts:165
onComplete @ App.ts:119
onComplete @ LoadingScene.ts:133
_callback2 @ gsap.js?v=3fbf701c:753
render3 @ gsap.js?v=3fbf701c:2425
render3 @ gsap.js?v=3fbf701c:1613
_lazySafeRender2 @ gsap.js?v=3fbf701c:171
updateRoot @ gsap.js?v=3fbf701c:1918
_tick2 @ gsap.js?v=3fbf701c:970
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
GameUI.ts:1015 📡 Connection status updated: ERROR
mainscene.ts:244 ❌ API connection error: Error: API connection lost
    at GameNetworkManager.handleConnectionError (GameNetworkManager.ts:105:29)
    at Object.onConnectionError (GameNetworkManager.ts:31:43)
    at GameCycleManager.start (GameCycleManager.ts:59:25)
    at async GameNetworkManager.connectToServer (GameNetworkManager.ts:44:13)
handleNetworkError @ mainscene.ts:244
onError @ mainscene.ts:112
handleConnectionError @ GameNetworkManager.ts:105
onConnectionError @ GameNetworkManager.ts:31
start @ GameCycleManager.ts:59
await in start
connectToServer @ GameNetworkManager.ts:44
connectSystems @ mainscene.ts:141
MainScene @ mainscene.ts:41
createGameScene @ App.ts:165
onComplete @ App.ts:119
onComplete @ LoadingScene.ts:133
_callback2 @ gsap.js?v=3fbf701c:753
render3 @ gsap.js?v=3fbf701c:2425
render3 @ gsap.js?v=3fbf701c:1613
_lazySafeRender2 @ gsap.js?v=3fbf701c:171
updateRoot @ gsap.js?v=3fbf701c:1918
_tick2 @ gsap.js?v=3fbf701c:970
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
GameCycleManager.ts:336 ❌ Connection error #1
handleConnectionError @ GameCycleManager.ts:336
start @ GameCycleManager.ts:60
await in start
connectToServer @ GameNetworkManager.ts:44
connectSystems @ mainscene.ts:141
MainScene @ mainscene.ts:41
createGameScene @ App.ts:165
onComplete @ App.ts:119
onComplete @ LoadingScene.ts:133
_callback2 @ gsap.js?v=3fbf701c:753
render3 @ gsap.js?v=3fbf701c:2425
render3 @ gsap.js?v=3fbf701c:1613
_lazySafeRender2 @ gsap.js?v=3fbf701c:171
updateRoot @ gsap.js?v=3fbf701c:1918
_tick2 @ gsap.js?v=3fbf701c:970
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
GameCycleManager.ts:352 🔄 Retrying in 2000ms...
GameNetworkManager.ts:47 🟢 Connected to API game server! Now using polling-based game flow.
GameUI.ts:1015 📡 Connection status updated: CONNECTED
mainscene.ts:231 🌐 API connected - polling-based game mode activated
mainscene.ts:80 🔍 BALL DEBUG STATUS:
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            🎾 Ball visible: true
            📍 Ball position: (1219.425, 490.9090909090909)
            📏 Ball scale: (0.5, 0.5)
            🔢 Ball z-index: 2
            📦 Total children: 8
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GameCycleManager.ts:336 ❌ Connection error #2
handleConnectionError @ GameCycleManager.ts:336
pollGameState @ GameCycleManager.ts:158
await in pollGameState
(anonymous) @ GameCycleManager.ts:355
setTimeout
handleConnectionError @ GameCycleManager.ts:354
start @ GameCycleManager.ts:60
await in start
connectToServer @ GameNetworkManager.ts:44
connectSystems @ mainscene.ts:141
MainScene @ mainscene.ts:41
createGameScene @ App.ts:165
onComplete @ App.ts:119
onComplete @ LoadingScene.ts:133
_callback2 @ gsap.js?v=3fbf701c:753
render3 @ gsap.js?v=3fbf701c:2425
render3 @ gsap.js?v=3fbf701c:1613
_lazySafeRender2 @ gsap.js?v=3fbf701c:171
updateRoot @ gsap.js?v=3fbf701c:1918
_tick2 @ gsap.js?v=3fbf701c:970
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
GameCycleManager.ts:352 🔄 Retrying in 4000ms...
mainscene.ts:383 🎯 Starting spin to NUMBER 35 (not index!)
mainscene.ts:384 🔥 NEW CODE VERSION - WHEEL SYNC FIX ACTIVE
mainscene.ts:390 🎰 Starting wheel gradual rotation first - FIXED VERSION
mainscene.ts:391 🔍 WheelSync object: EXISTS
mainscene.ts:392 🔍 WheelSync status: {isRunning: false, isTransitioning: true, currentSpeed: 0.299896, targetSpeed: 0.3, currentRotationDegrees: 0, …}
WheelSynchronizer.ts:34 🔄 Wheel rotation already running or transitioning
mainscene.ts:349 🎮 Input random spin to number 35
WheelSynchronizer.ts:55 ✅ Wheel reached full speed: 0.3 rotations/sec
GameCycleManager.ts:336 ❌ Connection error #3
handleConnectionError @ GameCycleManager.ts:336
pollGameState @ GameCycleManager.ts:158
await in pollGameState
(anonymous) @ GameCycleManager.ts:355
setTimeout
handleConnectionError @ GameCycleManager.ts:354
pollGameState @ GameCycleManager.ts:158
await in pollGameState
(anonymous) @ GameCycleManager.ts:355
setTimeout
handleConnectionError @ GameCycleManager.ts:354
start @ GameCycleManager.ts:60
await in start
connectToServer @ GameNetworkManager.ts:44
connectSystems @ mainscene.ts:141
MainScene @ mainscene.ts:41
createGameScene @ App.ts:165
onComplete @ App.ts:119
onComplete @ LoadingScene.ts:133
_callback2 @ gsap.js?v=3fbf701c:753
render3 @ gsap.js?v=3fbf701c:2425
render3 @ gsap.js?v=3fbf701c:1613
_lazySafeRender2 @ gsap.js?v=3fbf701c:171
updateRoot @ gsap.js?v=3fbf701c:1918
_tick2 @ gsap.js?v=3fbf701c:970
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
GameCycleManager.ts:352 🔄 Retrying in 8000ms...
GameCycleManager.ts:336 ❌ Connection error #4
handleConnectionError @ GameCycleManager.ts:336
pollGameState @ GameCycleManager.ts:158
await in pollGameState
(anonymous) @ GameCycleManager.ts:355
setTimeout
handleConnectionError @ GameCycleManager.ts:354
pollGameState @ GameCycleManager.ts:158
await in pollGameState
(anonymous) @ GameCycleManager.ts:355
setTimeout
handleConnectionError @ GameCycleManager.ts:354
pollGameState @ GameCycleManager.ts:158
await in pollGameState
(anonymous) @ GameCycleManager.ts:355
setTimeout
handleConnectionError @ GameCycleManager.ts:354
start @ GameCycleManager.ts:60
await in start
connectToServer @ GameNetworkManager.ts:44
connectSystems @ mainscene.ts:141
MainScene @ mainscene.ts:41
createGameScene @ App.ts:165
onComplete @ App.ts:119
onComplete @ LoadingScene.ts:133
_callback2 @ gsap.js?v=3fbf701c:753
render3 @ gsap.js?v=3fbf701c:2425
render3 @ gsap.js?v=3fbf701c:1613
_lazySafeRender2 @ gsap.js?v=3fbf701c:171
updateRoot @ gsap.js?v=3fbf701c:1918
_tick2 @ gsap.js?v=3fbf701c:970
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
requestAnimationFrame
_tick2 @ gsap.js?v=3fbf701c:967
GameCycleManager.ts:352 🔄 Retrying in 16000ms...
