import { Sprite } from "pixi.js";
import { Globals } from "./globals";
import { Scene } from "./scene";
import { RoulleteBoard } from "./roullete";

// Import modular components
import { BallPhysics } from "./physics/BallPhysics";
import { GameUI } from "./ui/GameUI";
import { GameNetworkManager } from "./network/GameNetworkManager";
import { InputController } from "./controls/InputController";
import { WheelSynchronizer } from "./sync/WheelSynchronizer";
import { ROULETTE_CONFIG } from "./config/GameConfig";
import { config } from "./appconfig";


/**
 * 🎯 Main Scene - Game Orchestrator
 * Coordinates all game systems and manages their interactions
 */
export class MainScene extends Scene {
    // Core game components
    private roulette: RoulleteBoard = new RoulleteBoard();
    private ball!: Sprite;
    
    // Modular systems
    private ballPhysics!: BallPhysics;
    private gameUI!: GameUI;
    private networkManager!: GameNetworkManager;
    private inputController!: InputController;
    private wheelSync!: WheelSynchronizer;
    
    // Game state
    private isSpinning: boolean = false;


    constructor() {
        super(false);
        // rouletteBoard.alpha = 0.1;
        // rouletteBoard.blendMode = 'multiply';
        this.initializeScene();
        this.initializeSystems();
        this.connectSystems();
        
        // Show "No Games" banner by default until connected to backend
        // this.gameUI.showNoGamesBanner();
        
        console.log("🎯 MainScene orchestrator initialized");
    }

    /**
     * 🎮 Initialize core scene components
     */
    private initializeScene(): void {
        const rouletteBoard = new Sprite(Globals.resources.table);
        this.mainContainer.addChild(rouletteBoard);
        rouletteBoard.anchor.set(0.5);

        rouletteBoard.scale.set(0.7,0.6);
        rouletteBoard.anchor.set(0.5);
        rouletteBoard.position.set(this.roulette.position.x , this.roulette.position.y + this.roulette.height/2.5);
        // Add roulette board to scene
        this.mainContainer.addChild(this.roulette);
        
        // Create ball sprite
        this.ball = new Sprite(Globals.resources.ball);
        this.mainContainer.addChild(this.ball);
        
        console.log("🎮 Core scene components initialized");
    }

    /**
     * 🔧 Initialize all modular systems
     */
    private initializeSystems(): void {
        // Initialize ball physics system
        this.ballPhysics = new BallPhysics(this.ball, this.roulette, {
            onSpinComplete: (winningNumber: number) => this.handleSpinComplete(winningNumber),
            onBallLanded: (winningNumber: number) => this.handleBallLanded(winningNumber),
            onPhaseChanged: (phase: string, progress: number) => this.handlePhaseChanged(phase, progress)
        });

        // Initialize UI system
        this.gameUI = new GameUI(this.mainContainer, {
            onCountdownComplete: () => this.handleCountdownComplete()
        });

        // Initialize network system
        this.networkManager = new GameNetworkManager({
            onConnected: () => this.handleNetworkConnected(),
            onDisconnected: () => this.handleNetworkDisconnected(),
            onError: (error) => this.handleNetworkError(error),
            onRoundStart: (timeLeft) => this.handleAPIRoundStart(timeLeft),
            onServerSpin: (spinIndex) => this.handleAPIServerSpin(spinIndex),
            onNoGames: () => this.handleNoGames(),
            onGameResumed: () => this.handleGameResumed()
        });

        // Initialize input system
        this.inputController = new InputController(this.mainContainer, {
            onSpin: (targetNumber) => this.handleInputSpin(targetNumber),
            onRandomSpin: () => this.handleInputRandomSpin(),
            onCountdownStart: (seconds) => this.handleInputCountdownStart(seconds),
            onCountdownStop: () => this.handleInputCountdownStop()
        });

        // Initialize wheel synchronizer
        this.wheelSync = new WheelSynchronizer(this.roulette);

        console.log("🔧 All modular systems initialized");
    }

    /**
     * 🔗 Connect systems and start operations
     */
    private connectSystems(): void {
        // Start wheel rotation
        this.wheelSync.startConstantRotation();
        
        // Connect to network
        this.networkManager.connectToServer();
        
        // Log controls
        this.inputController.logControls();
        
        console.log("🔗 Systems connected and operational");
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎾 BALL PHYSICS EVENT HANDLERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    private handleSpinComplete(winningNumber: number): void {
        this.isSpinning = false;
        this.updateGameState();
        
        // Check actual winner
        const actualWinner = this.roulette.getCurrentWinningNumber();
        
        console.log(`🎉 Spin complete! Target: ${winningNumber}, Actual: ${actualWinner}`);
        
        if (actualWinner === winningNumber) {
            console.log("✅ PERFECT LANDING!");
        } else {
            console.warn(`❌ ALIGNMENT MISMATCH: Expected ${winningNumber}, Got ${actualWinner}`);
            this.roulette.debugWheelState();
        }

        // 🌟 Start glow effect for the winning number
        this.roulette.startWinningNumberGlow(actualWinner);

        // 🔧 FIX: No need to restart wheel - it never stops in real casino mode
        console.log("🎰 Wheel continues constant rotation - ready for next spin immediately");

        // Start countdown for next round (manual mode only)
        if (!Globals.isProd) {
            Globals.gsap?.delayedCall(1.5, () => {
                console.log("🎰 Manual mode: Starting countdown for next round...");
                
                // 🌑 Stop glow effect when countdown starts
                this.roulette.stopWinningNumberGlow();
                
                this.gameUI.startCountdown(ROULETTE_CONFIG.autoCountdownDuration, () => {
                    console.log("⏰ Countdown finished! You can spin again!");
                });
            });
        } else {
            console.log("🌐 Server mode: Waiting for server to control next round timing.");
        }
    }

    private handleBallLanded(winningNumber: number): void {
        console.log(`🎾 Ball landed on number ${winningNumber}!`);
        // Future: Add visual effects, sounds, etc.
    }

    private handlePhaseChanged(phase: string, progress: number): void {
        console.log(`🎬 Ball physics phase: ${phase} (${(progress * 100).toFixed(1)}%)`);
        
        // You can add visual feedback here based on the phase
        // For example, update UI to show current animation phase
        
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎨 UI EVENT HANDLERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    private handleCountdownComplete(): void {
        console.log("⏰ UI countdown completed");
        this.updateGameState();
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🌐 NETWORK EVENT HANDLERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    private handleNetworkConnected(): void {
        this.gameUI.updateConnectionStatus('CONNECTED');
        // this.gameUI.hideNoGamesBanner(); // Hide banner on successful connection
        this.updateGameState();
        console.log("🌐 API connected - polling-based game mode activated");
    }

    private handleNetworkDisconnected(): void {
        this.gameUI.updateConnectionStatus('DISCONNECTED');
        // this.gameUI.showNoGamesBanner(); // Show banner when disconnected
        this.updateGameState();
        console.log("🔴 API disconnected - manual mode activated");
    }

    private handleNetworkError(error: any): void {
        this.gameUI.updateConnectionStatus('ERROR');
        // this.gameUI.showNoGamesBanner(); // Show banner on error
        console.error("❌ API connection error:", error);
    }

    /**
     * 🎯 Handle API round start (new polling-based method)
     */
    private handleAPIRoundStart(timeLeft: number): void {
        console.log(`🎯 API Round started! ${timeLeft}s remaining`);
        
        // Stop any current spin
        if (this.isSpinning) {
            this.ballPhysics.stopAllAnimations();
            this.isSpinning = false;
            this.updateGameState();
        }

        // 🌑 Stop glow effect when new round starts
        this.roulette.stopWinningNumberGlow();

        // Hide no games banner if showing
        this.gameUI.hideNoGamesBanner();

        // Start countdown with server time
        this.gameUI.startCountdown(timeLeft, () => {
            console.log('⏰ API countdown finished! Waiting for spin...');
        });
    }

    /**
     * 🎰 Handle API server spin (new polling-based method)
     */
    private handleAPIServerSpin(spinIndex: number): void {
        console.log(`🎰 API Spin triggered! Index: ${spinIndex}`);
        
        // Validate spin index
        if (spinIndex < 0 || spinIndex >= 37) {
            console.error(`❌ Invalid spin index from API: ${spinIndex}. Valid range: 0-36`);
            return;
        }
        
        // 🔧 FIX: Convert server index to actual number
        const rouletteNumbers = this.roulette.getRouletteNumbers();
        const targetNumber = rouletteNumbers[spinIndex];
        
        if (targetNumber === undefined) {
            console.error(`❌ Invalid server index: ${spinIndex}. Valid range: 0-${rouletteNumbers.length - 1}`);
            return;
        }
        
        console.log(`🎯 Converted API index ${spinIndex} to target number ${targetNumber}`);
        
        // Hide no games banner and stop countdown
        this.gameUI.hideNoGamesBanner();
        this.gameUI.stopCountdown();
        
        // Execute spin with the actual number
        this.startSpin(targetNumber);
    }

    /**
     * 💤 Handle no games state
     */
    private handleNoGames(): void {
        console.log('💤 No active games - showing banner');
        
        // Stop any current spin or countdown
        if (this.isSpinning) {
            this.ballPhysics.stopAllAnimations();
            this.isSpinning = false;
            this.updateGameState();
        }
        
        this.gameUI.stopCountdown();
        // this.gameUI.showNoGamesBanner();
    }

    /**
     * ▶️ Handle game resumed state
     */
    private handleGameResumed(): void {
        console.log('▶️ Game resumed - hiding banner');
        this.gameUI.hideNoGamesBanner();
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎮 INPUT EVENT HANDLERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    private handleInputSpin(targetNumber: number): void {
        if (this.canSpin()) {
            this.startSpin(targetNumber);
            console.log(`🎮 Input spin to number ${targetNumber}`);
        }
    }

    private handleInputRandomSpin(): void {
        if (this.canSpin()) {
            const randomWinner = Math.floor(Math.random() * ROULETTE_CONFIG.pocketCount);
            this.startSpin(randomWinner);
            console.log(`🎮 Input random spin to number ${randomWinner}`);
        }
    }

    private handleInputCountdownStart(seconds: number): void {
        if (!Globals.isProd) {
            // 🌑 Stop glow effect when manual countdown starts
            this.roulette.stopWinningNumberGlow();
            
            this.gameUI.startCountdown(seconds, () => {
                console.log("Manual countdown completed!");
            });
            console.log(`🎮 Input countdown started: ${seconds}s`);
        }
    }

    private handleInputCountdownStop(): void {
        if (!Globals.isProd) {
            this.gameUI.stopCountdown();
            console.log("🎮 Input countdown stopped");
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎯 CORE GAME METHODS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    /**
     * 🎯 Start roulette spin
     * @param winningNumber The target roulette number (0-36) where ball should land
     */
    private startSpin(winningNumber: number): void {
        if (!this.canSpin()) {
            console.warn("🎯 Cannot start spin - game not ready");
            return;
        }

        console.log(`🎯 Starting spin to NUMBER ${winningNumber} (not index!)`);
        
        // 🌑 Stop any existing glow effect when new spin starts
        this.roulette.stopWinningNumberGlow();
        
        this.isSpinning = true;
        this.updateGameState();
        
        // 🔧 FIX: No wheel synchronization - wheel rotates constantly like a real casino
        // Ball physics handles all timing to land when target number passes top position
        console.log(`🎰 REAL CASINO MODE: Wheel continues constant rotation, ball must time itself perfectly`);
        
        // Start ball physics - ball is responsible for timing its landing
        this.ballPhysics.startSpin(winningNumber);
    }

    /**
     * 🔍 Check if game can accept new spins
     */
    private canSpin(): boolean {
        return !this.isSpinning && !this.gameUI.isCountdownRunning();
    }

    /**
     * 🔄 Update game state across all systems
     */
    private updateGameState(): void {
        this.inputController.updateGameState(
            this.isSpinning, 
            this.gameUI.isCountdownRunning(), 
        );
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📋 PUBLIC API METHODS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    public getIsSpinning(): boolean {
        return this.isSpinning;
    }

    public isReadyToSpin(): boolean {
        return this.canSpin();
    }

    public spin(targetNumber?: number): void {
        if (Globals.isProd) {
            console.log("🌐 Server mode: Manual spin ignored");
            return;
        }

        if (targetNumber !== undefined && targetNumber >= 0 && targetNumber < ROULETTE_CONFIG.pocketCount) {
            this.handleInputSpin(targetNumber);
        } else {
            this.handleInputRandomSpin();
        }
    }

    public startCountdown(seconds: number, onComplete?: () => void): void {
        if (!Globals.isProd) {
            this.gameUI.startCountdown(seconds, onComplete);
        }
    }

    public stopCountdown(): void {
        this.gameUI.stopCountdown();
    }

    public isCountdownRunning(): boolean {
        return this.gameUI.isCountdownRunning();
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🔄 SCENE LIFECYCLE METHODS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    public recievedMessage(msgType: string, msgParams: any): void {
        console.log("📨 Scene message:",{ msgType, msgParams});
    }

    public update(dt: number): void {
        // Update UI system
        this.gameUI.update(dt);
        
        // Update ball physics (ensures settled ball moves with wheel)
        this.ballPhysics.update(dt);
    }

    public resize(): void {
        super.resize();
        // this.roulette.resize();
    }

    /**
     * 🗑️ Cleanup method - called when scene is destroyed
     */
    public destroyScene(): void {
        console.log('🗑️ Destroying MainScene and cleaning up all systems');
        
        // Destroy all modular systems
        if (this.ballPhysics) this.ballPhysics.destroy();
        if (this.gameUI) this.gameUI.destroy();
        if (this.networkManager) this.networkManager.destroy();
        if (this.inputController) this.inputController.destroy();
        if (this.wheelSync) this.wheelSync.destroy();

        // Call parent cleanup
        super.destroyScene();
        
        console.log('🗑️ MainScene destruction complete');
    }
}
