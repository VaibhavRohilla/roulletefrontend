import { Application, Texture } from "pixi.js";

import LoadingScene from "./loaders/LoadingScene";
import { Globals } from "./globals";
import { SceneManager } from "./scenemanager";
import { MainScene } from "./mainscene";
import { Howl } from "howler";
import { MyEmitter } from "./myemitter";
import { config, calculateScaleFactor } from "./appconfig";
import { gsap } from "gsap";
import { OrientationManager } from "./OrientationManager";


export class Game {
  private app: Application;
  private loadingScene!: LoadingScene;
  private sceneManager!: SceneManager;

  constructor() {
    this.app = new Application();
    Globals.emitter = new MyEmitter();
    Globals.gsap = gsap;
  }

  async init(): Promise<void> {
    try {
      await this.app.init({ 
        background: config.backgroundColor,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        antialias: true,
        resizeTo: window,
        hello: false 
      });

      Globals.app = this.app;

      this.sceneManager = SceneManager.instance;
      this.app.stage.addChild(this.sceneManager.container);
      Globals.sceneManager = this.sceneManager;

      const pixiContainer = document.getElementById("pixi-container");
      if (!pixiContainer) {
        console.error("Could not find #pixi-container element");
        document.body.appendChild(this.app.canvas);
        console.warn("#pixi-container not found, appending canvas to document.body.");
      } else {
        pixiContainer.appendChild(this.app.canvas);
      }
      
      this.setupCanvasStyles();
      this.setupResizeHandler();
      this.setupOrientationHandling();

      console.log("Application initialized, starting loading...");
      
      await this.startLoading();
      
      this.app.ticker.add((ticker) => {
        const dt = ticker.deltaTime;
        this.sceneManager.update(dt);
      });

    } catch (error) {
      // console.error("Application error:", {error: error});
      // Logger.error("Application error:");
      console.error("Application error:", error);
    }
  }

  private setupCanvasStyles(): void {
    const canvas = this.app.canvas;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
    canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  private setupResizeHandler(): void {
    const resizeHandler = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      calculateScaleFactor(); 
      
      this.app.renderer.resize(width, height);
      
      if (this.sceneManager) {
        this.sceneManager.resize();
      }
    };

    window.addEventListener('resize', resizeHandler);
    window.addEventListener('orientationchange', resizeHandler);
    resizeHandler();
  }

  /**
   * 🎯 Setup orientation handling for landscape mode
   */
  private setupOrientationHandling(): void {
    console.log("🎯 Setting up landscape orientation handling");

    // Use the centralized OrientationManager
    const orientationManager = OrientationManager.getInstance();
    
    // Enforce landscape mode with automatic user feedback
    orientationManager.enforceLandscapeMode();

    // Optional: Subscribe to orientation changes for game-specific logic
    orientationManager.onOrientationChange((orientation) => {
      console.log(`🎮 Game received orientation change: ${orientation}`);
      
      // Trigger a resize to ensure proper scaling
      if (this.sceneManager) {
        setTimeout(() => {
          calculateScaleFactor();
          this.app.renderer.resize(window.innerWidth, window.innerHeight);
          this.sceneManager.resize();
        }, 100);
      }
    });

    // Debug mode: Log orientation info if URL contains #debug
    if (window.location.hash.includes('debug')) {
      orientationManager.debug();
      
      // Set up debug info display
      this.setupDebugDisplay(orientationManager);
    }
  }

  /**
   * 🔧 Setup debug display for orientation info
   */
  private setupDebugDisplay(orientationManager: OrientationManager): void {
    // Create debug display element
    const debugDiv = document.createElement('div');
    debugDiv.className = 'debug-mode active';
    debugDiv.id = 'orientationDebug';
    document.body.appendChild(debugDiv);

    // Update debug info
    const updateDebugInfo = () => {
      const info = orientationManager.getOrientationInfo();
      debugDiv.innerHTML = `
        <strong>🔍 Orientation Debug</strong><br>
        Orientation: ${info.current}<br>
        Dimensions: ${info.width}x${info.height}<br>
        Mobile: ${info.isMobile ? 'Yes' : 'No'}<br>
        Lock Support: ${info.supportsLock ? 'Yes' : 'No'}<br>
        Scale Factor: ${config.scaleFactor.toFixed(2)}<br>
        Min Scale: ${config.minScaleFactor.toFixed(2)}
      `;
    };

    // Initial update and subscribe to changes
    updateDebugInfo();
    orientationManager.onOrientationChange(updateDebugInfo);
    
    // Update on resize for scale factor changes
    window.addEventListener('resize', updateDebugInfo);
  }

  async startLoading(): Promise<void> {
    this.loadingScene = new LoadingScene({
      manifestPath: '/assets/manifest.json',
      basePath: '/assets/',
      loadingBarOptions: {
        width: 400,
        height: 40,
        backgroundColor: 0x000000,
        fillColor: 0x00aaff,
        textColor: 0xffffff
      },
      onComplete: (loadedAssets: Record<string, any>) => {
        console.log('Loading complete! Processing assets:', loadedAssets);
        this.storeAssets(loadedAssets);
        this.loadingScene.destroy({ children: true, texture: true, baseTexture: true });
        this.app.stage.removeChild(this.loadingScene);
        
        console.log("Globals after loading:", {resources: Globals.resources, soundResources: Globals.soundResources});
        this.createGameScene();
      }
    });

    // this.app.stage.addChild(this.loadingScene); 
    console.log("Loading scene added to stage");

    console.log("Starting loading process...");
    await this.loadingScene.start(this.app.screen.width, this.app.screen.height);
    console.log("Loading process initiated by LoadingScene.start()");
  }

  private storeAssets(assets: Record<string, any>): void {
    if (!assets || Object.keys(assets).length === 0) {
        console.warn("No assets returned from loading or assets object is empty.");
        return;
    }

    for (const key in assets) {
        if (Object.prototype.hasOwnProperty.call(assets, key)) {
            const resource = assets[key];
            if (resource instanceof Texture) {
                Globals.resources[key] = resource;
                console.log(`Stored texture: ${key}`);
            } else if (resource instanceof Howl) { 
                Globals.soundResources[key] = resource;
                console.log(`Stored sound: ${key}`);
            }
            // Add more checks for other asset types if needed (e.g., Spritesheet, BitmapFont, JSON data)
            // else if (resource instanceof Spritesheet) { 
            //    // If it's a spritesheet, PIXI.Assets often loads it as a Spritesheet object
            //    // which contains multiple textures. You might want to store them all or the Spritesheet itself.
            //    Globals.resources[key] = resource; // Storing the Spritesheet object
            //    // Or iterate through resource.textures and resource.animations
            //    console.log(`Stored spritesheet: ${key}`); 
            // }
            else {
                console.warn(`Unknown asset type for key ${key}:`, resource);
                // Optionally store it in a generic way or log, e.g. Globals.resources[key] = resource;
            }
        }
    }
  }

  createGameScene(): void {
    console.log("Creating MainScene...");
    const mainScene = new MainScene();
    this.sceneManager.start(mainScene);
    console.log("MainScene started via SceneManager");
  }
}

const game = new Game();
game.init();
