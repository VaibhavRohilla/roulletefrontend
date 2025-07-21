import { Howl } from "howler";
import { Globals } from "./globals";
import { AnimatedSprite, Container, Texture } from "pixi.js";
import { config } from "./appconfig";

export class SoundHandler extends Container{
   
    // Background music
    bgMusic: Howl = Globals.soundResources.bgMusic;
    
    // 🎰 ROULETTE SOUND EFFECTS
    startSpinnerSound: Howl = Globals.soundResources.startSpinner;    // When ball launches and orbits
    ballDampingSound: Howl = Globals.soundResources["ball-damping"];  // When ball bounces/settles
    endSpinnerSound: Howl = Globals.soundResources.endspiner;         // When spin completes
    
    
    
    // Sound state tracking
    isSpinSoundPlaying: boolean = false;
    isBgMusicPlaying: boolean = false;
    isSoundOn: boolean = false;
    private isSpinActive: boolean = false;  // Track if a spin is currently active
    
    // Current sound instances for control
    private currentStartSpinnerInstance: number | null = null;
    private currentBallDampingInstance: number | null = null;
    private currentEndSpinnerInstance: number | null = null;
    
    // UI Elements
    soundSprites: Texture[] = [Globals.resources.MusicOn, Globals.resources.MusicOff];
    soundSprite: AnimatedSprite = new AnimatedSprite(this.soundSprites);

    constructor() {
        super();
        this.initBgMusic();
        this.setupSoundSprites();
        this.initializeRouletteSound();
        console.log("🔊 Enhanced SoundHandler initialized with roulette physics sound effects");
    }

    setupSoundSprites() {
        this.soundSprite.gotoAndStop(this.isSoundOn ? 0 : 1);
        this.soundSprite.scale.set(0.1);
        this.soundSprite.anchor.set(0,0.5);
        this.addChild(this.soundSprite);
        this.soundSprite.interactive = true;
        this.soundSprite.on("pointerdown", () => {
            this.isSoundOn = !this.isSoundOn;
            this.soundSprite.gotoAndStop(this.isSoundOn ? 0 : 1);
            this.startStopBGMusic(this.isSoundOn);
            
            // If sounds are turned off, stop all roulette sounds
            if (!this.isSoundOn) {
                this.stopAllRouletteSounds();
            }
        });
        this.soundSprite.position.set(config.logicalWidth*0.55,config.logicalHeight*0.17);
    }

    initBgMusic() {
        if (this.bgMusic) {
            this.bgMusic.loop(true);
            this.bgMusic.volume(0.1);
            this.isBgMusicPlaying = true;
        }
    }

    /**
     * 🎰 Initialize roulette sound effects with proper settings
     */
    initializeRouletteSound() {
        console.log("🔊 Initializing roulette sounds...");
        console.log("🔍 Sound resources available:", Object.keys(Globals.soundResources));
        console.log("🔍 startSpinner:", this.startSpinnerSound ? "✅ Loaded" : "❌ Missing");
        console.log("🔍 ball-damping:", this.ballDampingSound ? "✅ Loaded" : "❌ Missing");
        console.log("🔍 endspiner:", this.endSpinnerSound ? "✅ Loaded" : "❌ Missing");

        // Configure start spinner sound (ball launching and orbital motion)
        if (this.startSpinnerSound) {
            this.startSpinnerSound.loop(true);  // Loop during orbital phase
            this.startSpinnerSound.volume(0.6);
            console.log("🔊 Start spinner sound configured");
        } else {
            console.error("❌ startSpinnerSound is null/undefined!");
        }

        // Configure ball damping sound (bouncing and settling)
        if (this.ballDampingSound) {
            this.ballDampingSound.loop(false); // Play once per bounce
            this.ballDampingSound.volume(0.8);
            console.log("🔊 Ball damping sound configured");
        } else {
            console.error("❌ ballDampingSound is null/undefined!");
        }

        // Configure end spinner sound (final settling)
        if (this.endSpinnerSound) {
            this.endSpinnerSound.loop(false);  // Play once at end
            this.endSpinnerSound.volume(0.7);
            console.log("🔊 End spinner sound configured");
        } else {
            console.error("❌ endSpinnerSound is null/undefined!");
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎰 ROULETTE PHYSICS SOUND METHODS - Synchronized with BallPhysics phases
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    /**
     * 🚀 Phase 1-3: Start spinner sound (ball launching, orbital, approach)
     * Called when ball physics starts Phase 1: Smooth Launch
     */
    startSpinnerSoundEffect() {
        console.log("🔍 startSpinnerSoundEffect called with conditions:");
        console.log("  - isSoundOn:", this.isSoundOn);
        console.log("  - startSpinnerSound exists:", !!this.startSpinnerSound);
        console.log("  - isSpinActive:", this.isSpinActive);
        
        if (!this.isSoundOn || !this.startSpinnerSound || !this.isSpinActive) {
            console.log("❌ startSpinnerSoundEffect: Conditions not met, returning");
            return;
        }
        
        this.stopAllRouletteSounds(); // Clean slate
        
        try {
            this.currentStartSpinnerInstance = this.startSpinnerSound.play();
            this.isSpinSoundPlaying = true;
            console.log("🚀 ✅ Started spinner sound for ball launch/orbital phases, instance:", this.currentStartSpinnerInstance);
        } catch (error) {
            console.error("❌ Error playing start spinner sound:", error);
        }
    }

    /**
     * 🏀 Phase 5: Ball damping sound (bouncing and settling)
     * Called when ball physics enters Phase 5: Smooth Bounce
     */
    ballBouncingSoundEffect() {
        if (!this.isSoundOn || !this.ballDampingSound || !this.isSpinActive) return;
        
        // Stop start spinner when ball starts bouncing
        this.stopStartSpinnerSound();
        
        this.currentBallDampingInstance = this.ballDampingSound.play();
        
        console.log("🏀 Started ball damping sound for bouncing phase");
    }

    /**
     * 🏁 Ball settled: End spinner sound (when ball is settled and moving with board)
     * Called when ball physics enters 'settled' phase
     */
    endSpinnerSoundEffect() {
        if (!this.isSoundOn || !this.endSpinnerSound) return;
        
        // Clean up previous sounds first
        this.stopStartSpinnerSound();
        this.stopBallDampingSound();
        
        // Play the completion sound
        this.currentEndSpinnerInstance = this.endSpinnerSound.play();
        
        // Set up cleanup when sound finishes
        if (this.currentEndSpinnerInstance) {
            this.endSpinnerSound.once('end', () => {
                this.currentEndSpinnerInstance = null;
                console.log("🏁 End spinner sound completed naturally");
            });
        }
        
        // Reset spinning state when end sound plays
        this.isSpinSoundPlaying = false;
        
        console.log("🏁 Started end spinner sound - ball is settled and moving with board");
    }

    /**
     * 🔇 Stop specific sound effects
     */
    stopStartSpinnerSound() {
        if (this.currentStartSpinnerInstance !== null && this.startSpinnerSound) {
            this.startSpinnerSound.stop(this.currentStartSpinnerInstance);
            this.currentStartSpinnerInstance = null;
            console.log("🔇 Stopped start spinner sound");
        }
    }

    stopBallDampingSound() {
        if (this.currentBallDampingInstance !== null && this.ballDampingSound) {
            this.ballDampingSound.stop(this.currentBallDampingInstance);
            this.currentBallDampingInstance = null;
            console.log("🔇 Stopped ball damping sound");
        }
    }

    stopEndSpinnerSound() {
        if (this.currentEndSpinnerInstance !== null && this.endSpinnerSound) {
            this.endSpinnerSound.stop(this.currentEndSpinnerInstance);
            this.currentEndSpinnerInstance = null;
            console.log("🔇 Stopped end spinner sound");
        }
    }

    /**
     * 🔇 Stop all roulette sound effects
     */
    stopAllRouletteSounds() {
        this.stopStartSpinnerSound();
        this.stopBallDampingSound();
        this.stopEndSpinnerSound();
        this.isSpinSoundPlaying = false;
        console.log("🔇 Stopped all roulette sound effects");
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🔄 LEGACY METHODS - For backward compatibility with existing code
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    /**
     * 🔄 Legacy: Start spin sound (maps to new system)
     */
    startSpinSound() {
        this.startSpin(); // Start spin state
        this.startSpinnerSoundEffect();
    }

    /**
     * 🔄 Legacy: Start/stop spin sound (maps to new methods)
     */
    startStopSpinSound(start: boolean) {
        if (start) {
            this.startSpin(); // Start spin state
            this.startSpinnerSoundEffect();
        } else {
            this.endSpin(); // End spin state and stop sounds
        }
    }

    /**
     * 🔄 Background music controls (unchanged)
     */
    startStopBGMusic(start: boolean) {
        if (!this.bgMusic) return;
        
        if (start) {
            this.bgMusic.play();
            this.isBgMusicPlaying = true;
        } else {
            this.bgMusic.pause();
            this.isBgMusicPlaying = false;
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎯 SPIN STATE MANAGEMENT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    /**
     * 🎯 Start a new spin - enables sound effects
     * Called when startSpin() is initiated
     */
    startSpin() {
        this.isSpinActive = true;
        console.log("🎯 ✅ Spin started - sound effects enabled");
        console.log("🔍 Current sound state:", this.getSoundStatus());
    }

    /**
     * 🏁 End current spin - disables sound effects
     * Called when spin completes or is stopped
     */
    endSpin() {
        this.isSpinActive = false;
        
        // Stop spinning sounds but let end spinner complete if it just started
        this.stopStartSpinnerSound();
        this.stopBallDampingSound();
        
        // If end spinner just started playing, let it finish
        if (this.currentEndSpinnerInstance) {
            console.log("🏁 Spin ended - letting end spinner sound complete");
            // End spinner will stop naturally when it finishes
        } else {
            console.log("🏁 Spin ended - sound effects disabled");
        }
    }

    /**
     * 🔍 Check if spin is currently active
     */
    isSpinCurrentlyActive(): boolean {
        return this.isSpinActive;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎮 PUBLIC API - Phase-based sound control for BallPhysics integration
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    /**
     * 🎮 Handle ball physics phase changes
     * @param phase - Current ball physics phase
     * @param progress - Phase progress (0-1)
     */
    onBallPhysicsPhaseChanged(phase: string, progress: number) {
        console.log(`🎮 onBallPhysicsPhaseChanged called: phase=${phase}, progress=${progress}`);
        console.log(`🔍 Current state: isSoundOn=${this.isSoundOn}, isSpinActive=${this.isSpinActive}`);
        
        if (!this.isSoundOn || !this.isSpinActive) {
            console.log("❌ Phase change handler: Conditions not met, returning");
            return;
        }

        switch(phase) {
            case 'launching':
                if (progress === 0) { // Phase just started
                    console.log("🚀 Launching phase detected, calling startSpinnerSoundEffect");
                    this.startSpinnerSoundEffect();
                }
                break;
                
            case 'falling':
                if (progress === 0) { // Ball starts falling - fade out start spinner
                    console.log("⬇️ Falling phase detected, stopping start spinner");
                    this.stopStartSpinnerSound();
                }
                break;
                
            case 'bouncing':
                if (progress === 0) { // Ball starts bouncing
                    console.log("🏀 Bouncing phase detected, playing ball damping sound");
                    this.ballBouncingSoundEffect();
                }
                break;
                
            case 'gradual_capture':
                if (progress === 0) { // Final phase starts
                    console.log("🎯 Gradual capture phase detected, ball approaching final position");
                    // Don't play end sound here - wait for actual settling
                }
                break;
                
            case 'settled':
                // Ball is now settled and moving with the board - play completion sound
                console.log("🏁 Ball settled and moving with board - playing end spinner sound");
                this.endSpinnerSoundEffect();
                break;
                
            default:
                console.log(`🔍 Unknown phase: ${phase}`);
                break;
        }
    }

    /**
     * 🎮 Handle spin completion
     * @param winningNumber - The winning number
     */
    onSpinComplete(winningNumber: number) {
        // Ensure end spinner sound plays if not already playing and spin is active
        if (!this.currentEndSpinnerInstance && this.isSpinActive && this.isSoundOn) {
            this.endSpinnerSoundEffect();
        }
        
        // 🔊 SOUND FIX: Don't automatically end spin here - let BallPhysics manage it
        // The spin state will be ended when the ball is actually settled
        
        console.log(`🏆 Spin complete sound sequence for number ${winningNumber}`);
    }

    /**
     * 🔍 Get current sound status for debugging
     */
    getSoundStatus() {
        return {
            isSoundOn: this.isSoundOn,
            isSpinActive: this.isSpinActive,
            isSpinSoundPlaying: this.isSpinSoundPlaying,
            isBgMusicPlaying: this.isBgMusicPlaying,
            soundResourcesLoaded: {
                startSpinner: !!this.startSpinnerSound,
                ballDamping: !!this.ballDampingSound,
                endSpinner: !!this.endSpinnerSound,
                bgMusic: !!this.bgMusic
            },
            currentSounds: {
                startSpinner: this.currentStartSpinnerInstance !== null,
                ballDamping: this.currentBallDampingInstance !== null,
                endSpinner: this.currentEndSpinnerInstance !== null
            }
        };
    }

    /**
     * 🧪 Test method to enable sound and test each sound effect
     * Call this in console: Globals.soundHandler.testSounds()
     */
    testSounds() {
        console.log("🧪 Testing all sound effects...");
        
        // Enable sound
        this.isSoundOn = true;
        this.isSpinActive = true;
        this.soundSprite.gotoAndStop(0); // Show sound as enabled
        
        console.log("🔊 Sound enabled, testing start spinner...");
        
        setTimeout(() => {
            this.startSpinnerSoundEffect();
        }, 500);
        
        setTimeout(() => {
            console.log("🔊 Testing ball damping...");
            this.ballBouncingSoundEffect();
        }, 3000);
        
        setTimeout(() => {
            console.log("🔊 Testing end spinner...");
            this.endSpinnerSoundEffect();
        }, 5000);
        
        setTimeout(() => {
            console.log("🔊 Test complete, stopping all sounds");
                         this.stopAllRouletteSounds();
             this.isSpinActive = false;
         }, 8000);
     }

     /**
     * 🔧 Debug method to manually test the complete sound flow
     * Call this in console: Globals.soundHandler.debugSoundFlow()
     */
    debugSoundFlow() {
        console.log("🔧 === SOUND DEBUG FLOW TEST ===");
        
        // Step 1: Enable sound
        this.isSoundOn = true;
        this.soundSprite.gotoAndStop(0);
        console.log("1. Sound enabled");
        
        // Step 2: Start spin state  
        this.startSpin();
        console.log("2. Spin state started");
        
        // Step 3: Test launching phase
        setTimeout(() => {
            console.log("3. Testing launching phase...");
            this.onBallPhysicsPhaseChanged('launching', 0);
        }, 500);
        
        // Step 4: Test other phases
        setTimeout(() => {
            console.log("4. Testing falling phase...");
            this.onBallPhysicsPhaseChanged('falling', 0);
        }, 2000);
        
        setTimeout(() => {
            console.log("5. Testing bouncing phase...");
            this.onBallPhysicsPhaseChanged('bouncing', 0);
        }, 3500);
        
        setTimeout(() => {
            console.log("6. Testing gradual capture phase...");
            this.onBallPhysicsPhaseChanged('gradual_capture', 0);
        }, 5000);
        
        setTimeout(() => {
            console.log("7. Testing ball settled (end sound should play)...");
            this.onBallPhysicsPhaseChanged('settled', 1);
        }, 6500);
        
        setTimeout(() => {
            console.log("8. Ending spin...");
            this.endSpin();
            console.log("🔧 === SOUND DEBUG FLOW COMPLETE ===");
        }, 9000);
    }
}