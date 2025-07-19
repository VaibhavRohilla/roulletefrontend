import { Globals } from "../globals";
import { RoulleteBoard } from "../roullete";
import { ROULETTE_CONFIG } from "../config/GameConfig";


/**
 * 🔄 Wheel Synchronizer
 * Manages smooth wheel rotation with gradual start/stop - like a real casino
 */
export class WheelSynchronizer {
    private roulette: RoulleteBoard;
    private constantWheelTween: any = null;
    private transitionTween: any = null;
    private isRunning: boolean = false;
    private isTransitioning: boolean = false;
    private currentSpeed: number = 0;
    private targetSpeed: number = ROULETTE_CONFIG.constantWheelSpeed;

    // Callbacks for coordination with other systems
    private onStartComplete?: () => void;
    private onStopComplete?: () => void;

    constructor(roulette: RoulleteBoard) {
        this.roulette = roulette;
        console.log("🔄 Wheel synchronizer initialized - smooth transitions enabled");
    }

    /**
     * 🚀 Start wheel rotation gradually and smoothly
     * @param onComplete Optional callback when start transition is complete
     */
    public startGradualRotation(onComplete?: () => void): void {
        if (this.isRunning || this.isTransitioning) {
            console.log("🔄 Wheel rotation already running or transitioning");
            return;
        }

        console.log("🚀 WHEEL SYNCHRONIZER: Starting gradual wheel rotation with smooth acceleration - NEW VERSION ACTIVE!");
        
        this.onStartComplete = onComplete;
        this.isTransitioning = true;
        this.currentSpeed = 0;

        // Start with very slow rotation and gradually accelerate
        this.transitionTween = Globals.gsap?.to(this, {
            currentSpeed: this.targetSpeed,
            duration: 2.5, // EASING FIX: Slightly longer for smoother feel
            ease: "expo.out", // EASING FIX: Exponential easing for ultra-smooth casino feel
            onUpdate: () => {
                this.updateConstantRotation();
            },
            onComplete: () => {
                this.isTransitioning = false;
                this.isRunning = true;
                console.log(`✅ Wheel reached full speed: ${this.targetSpeed} rotations/sec`);
                
                if (this.onStartComplete) {
                    this.onStartComplete();
                    this.onStartComplete = undefined;
                }
            }
        });

        console.log("🔄 Gradual wheel acceleration started");
    }

    /**
     * 🛑 Stop wheel rotation gradually and smoothly
     * @param onComplete Optional callback when stop transition is complete
     */
    public stopGradualRotation(onComplete?: () => void): void {
        if (!this.isRunning || this.isTransitioning) {
            console.log("🔄 Wheel not running or already transitioning");
            return;
        }

        console.log("🛑 Starting gradual wheel stop with smooth deceleration");
        
        this.onStopComplete = onComplete;
        this.isTransitioning = true;

        // Kill the constant rotation tween
        if (this.constantWheelTween) {
            this.constantWheelTween.kill();
            this.constantWheelTween = null;
        }

        // Gradually decelerate to stop
        this.transitionTween = Globals.gsap?.to(this, {
            currentSpeed: 0,
            duration: 4.0, // EASING FIX: Longer stop for more realistic casino feel
            ease: "expo.out", // EASING FIX: Exponential easing for ultra-smooth casino stop
            onUpdate: () => {
                this.updateConstantRotation();
            },
            onComplete: () => {
                this.isTransitioning = false;
                this.isRunning = false;
                this.currentSpeed = 0;
                console.log("✅ Wheel stopped completely");
                
                if (this.onStopComplete) {
                    this.onStopComplete();
                    this.onStopComplete = undefined;
                }
            }
        });

        console.log("🔄 Gradual wheel deceleration started");
    }

    /**
     * 🔄 Update wheel rotation based on current speed
     */
    private updateConstantRotation(): void {
        if (this.currentSpeed <= 0) {
            // Stop rotation completely
            if (this.constantWheelTween) {
                this.constantWheelTween.kill();
                this.constantWheelTween = null;
            }
            return;
        }

        // Kill existing tween before creating new one
        if (this.constantWheelTween) {
            this.constantWheelTween.kill();
        }

        // Create new rotation tween with current speed
        this.constantWheelTween = Globals.gsap?.to(this.roulette.roulleteSpinContainer, {
            rotation: "+=6.283185307179586", // Add 2π radians (one full rotation)
            duration: 1 / this.currentSpeed, // Duration for one rotation at current speed
            ease: "none", // Linear motion for constant speed
            repeat: -1, // Infinite repeat
            onRepeat: () => {
                // Keep rotation in a reasonable range to prevent floating point issues
                this.roulette.roulleteSpinContainer.rotation = this.roulette.roulleteSpinContainer.rotation % (2 * Math.PI);
            }
        });
    }

    /**
     * 🔄 Start constant wheel rotation that never stops (legacy method)
     * @deprecated Use startGradualRotation() for smooth transitions
     */
    public startConstantRotation(): void {
        console.warn("⚠️ Using legacy startConstantRotation. Consider using startGradualRotation() for smoother experience.");
        this.startGradualRotation();
    }

    /**
     * ⏸️ Pause wheel rotation (temporary stop)
     */
    public pauseRotation(): void {
        if (this.constantWheelTween) {
            this.constantWheelTween.pause();
        }
        if (this.transitionTween) {
            this.transitionTween.pause();
        }
        console.log("⏸️ Wheel rotation paused");
    }

    /**
     * ▶️ Resume wheel rotation
     */
    public resumeRotation(): void {
        if (this.constantWheelTween) {
            this.constantWheelTween.resume();
        }
        if (this.transitionTween) {
            this.transitionTween.resume();
        }
        console.log("▶️ Wheel rotation resumed");
    }

    /**
     * 🛑 Stop wheel rotation completely (immediate)
     */
    public stopRotation(): void {
        if (this.constantWheelTween) {
            this.constantWheelTween.kill();
            this.constantWheelTween = null;
        }
        if (this.transitionTween) {
            this.transitionTween.kill();
            this.transitionTween = null;
        }
        this.isRunning = false;
        this.isTransitioning = false;
        this.currentSpeed = 0;
        console.log("🛑 Wheel rotation stopped completely");
    }

    /**
     * ⚙️ Change wheel rotation speed gradually
     */
    public setRotationSpeedGradually(rotationsPerSecond: number, duration: number = 1.5): void {
        if (rotationsPerSecond <= 0) {
            console.warn("⚠️ Invalid rotation speed:", rotationsPerSecond);
            return;
        }

        console.log(`⚙️ Changing wheel speed to ${rotationsPerSecond} rotations/sec over ${duration}s`);
        
        this.targetSpeed = rotationsPerSecond;
        
        if (this.isRunning || this.isTransitioning) {
            // Kill any transition tween
            if (this.transitionTween) {
                this.transitionTween.kill();
            }

            this.transitionTween = Globals.gsap?.to(this, {
                currentSpeed: this.targetSpeed,
                duration: duration,
                ease: "power2.inOut",
                onUpdate: () => {
                    this.updateConstantRotation();
                },
                onComplete: () => {
                    console.log(`✅ Wheel speed changed to ${this.targetSpeed} rotations/sec`);
                }
            });
        }
    }

    /**
     * ⚙️ Change wheel rotation speed (legacy method)
     * @deprecated Use setRotationSpeedGradually() for smooth transitions
     */
    public setRotationSpeed(rotationsPerSecond: number): void {
        this.setRotationSpeedGradually(rotationsPerSecond);
    }

    /**
     * 🔍 Get current wheel rotation in degrees
     */
    public getCurrentRotationDegrees(): number {
        return (this.roulette.roulleteSpinContainer.rotation * 180 / Math.PI) % 360;
    }

    /**
     * 🔍 Get current wheel rotation in radians
     */
    public getCurrentRotationRadians(): number {
        return this.roulette.roulleteSpinContainer.rotation % (2 * Math.PI);
    }

    /**
     * 📊 Get wheel rotation status
     */
    public getStatus(): {
        isRunning: boolean;
        isTransitioning: boolean;
        currentSpeed: number;
        targetSpeed: number;
        currentRotationDegrees: number;
        currentRotationRadians: number;
    } {
        return {
            isRunning: this.isRunning,
            isTransitioning: this.isTransitioning,
            currentSpeed: this.currentSpeed,
            targetSpeed: this.targetSpeed,
            currentRotationDegrees: this.getCurrentRotationDegrees(),
            currentRotationRadians: this.getCurrentRotationRadians()
        };
    }

    /**
     * 🔍 Check if wheel is rotating
     */
    public isRotating(): boolean {
        return this.isRunning || this.isTransitioning;
    }

    /**
     * 🔍 Check if wheel is in transition (starting or stopping)
     */
    public isInTransition(): boolean {
        return this.isTransitioning;
    }

    /**
     * 📍 Set wheel to specific rotation (while maintaining speed)
     */
    public setRotation(radians: number): void {
        this.roulette.roulleteSpinContainer.rotation = radians % (2 * Math.PI);
        console.log(`📍 Wheel rotation set to ${(radians * 180 / Math.PI).toFixed(2)}°`);
    }

    /**
     * 🔄 Reset wheel to 0 rotation
     */
    public resetRotation(): void {
        this.setRotation(0);
        console.log("🔄 Wheel rotation reset to 0°");
    }

    /**
     * 🗑️ Cleanup method
     */
    public destroy(): void {
        this.stopRotation();
        this.onStartComplete = undefined;
        this.onStopComplete = undefined;
        console.log("🔄 Wheel synchronizer destroyed");
    }
} 