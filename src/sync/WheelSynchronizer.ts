import { Globals } from "../globals";
import { RoulleteBoard } from "../roullete";
import { ROULETTE_CONFIG } from "../config/GameConfig";


/**
 * 🔄 Wheel Synchronizer
 * Manages constant wheel rotation that never stops - like a real casino
 */
export class WheelSynchronizer {
    private roulette: RoulleteBoard;
    private constantWheelTween: any = null;
    private isRunning: boolean = false;

    constructor(roulette: RoulleteBoard) {
        this.roulette = roulette;
        console.log("🔄 Wheel synchronizer initialized - constant speed mode");
    }

    /**
     * 🔄 Start constant wheel rotation that never stops
     * Just like a real casino roulette wheel
     */
    public startConstantRotation(): void {
        if (this.isRunning) {
            console.log("🔄 Wheel rotation already running");
            return;
        }

        console.log(`🔄 Starting constant wheel rotation at ${ROULETTE_CONFIG.constantWheelSpeed} rotations per second - NEVER STOPS`);
        
        this.isRunning = true;
        
        // Start infinite rotation at constant speed
        this.constantWheelTween = Globals.gsap?.to(this.roulette, {
            rotation: "+=6.283185307179586", // Add 2π radians (one full rotation)
            duration: 1 / ROULETTE_CONFIG.constantWheelSpeed, // Duration for one rotation
            ease: "none", // Linear motion for constant speed
            repeat: -1, // Infinite repeat
            onRepeat: () => {
                // Keep rotation in a reasonable range to prevent floating point issues
                this.roulette.rotation = this.roulette.rotation % (2 * Math.PI);
            }
        });

        console.log("🔄 Constant wheel rotation started - wheel will NEVER stop like a real casino");
    }

    /**
     * ⏸️ Pause wheel rotation (temporary stop)
     */
    public pauseRotation(): void {
        if (this.constantWheelTween) {
            this.constantWheelTween.pause();
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
        console.log("▶️ Wheel rotation resumed");
    }

    /**
     * 🛑 Stop wheel rotation completely
     */
    public stopRotation(): void {
        if (this.constantWheelTween) {
            this.constantWheelTween.kill();
            this.constantWheelTween = null;
        }
        this.isRunning = false;
        console.log("🛑 Wheel rotation stopped completely");
    }

    /**
     * ⚙️ Change wheel rotation speed
     */
    public setRotationSpeed(rotationsPerSecond: number): void {
        if (rotationsPerSecond <= 0) {
            console.warn("⚠️ Invalid rotation speed:", rotationsPerSecond);
            return;
        }

        const wasRunning = this.isRunning;
        
        // Stop current rotation
        this.stopRotation();
        
        // Update speed and restart if it was running
        if (wasRunning) {
            // Temporarily modify the config (this could be made more elegant)
            (ROULETTE_CONFIG as any).constantWheelSpeed = rotationsPerSecond;
            this.startConstantRotation();
            console.log(`⚙️ Wheel rotation speed changed to ${rotationsPerSecond} rotations/sec`);
        }
    }

    /**
     * 🔍 Get current wheel rotation in degrees
     */
    public getCurrentRotationDegrees(): number {
        return (this.roulette.rotation * 180 / Math.PI) % 360;
    }

    /**
     * 🔍 Get current wheel rotation in radians
     */
    public getCurrentRotationRadians(): number {
        return this.roulette.rotation % (2 * Math.PI);
    }

    /**
     * 📊 Get wheel rotation status
     */
    public getStatus(): {
        isRunning: boolean;
        speed: number;
        currentRotationDegrees: number;
        currentRotationRadians: number;
    } {
        return {
            isRunning: this.isRunning,
            speed: ROULETTE_CONFIG.constantWheelSpeed,
            currentRotationDegrees: this.getCurrentRotationDegrees(),
            currentRotationRadians: this.getCurrentRotationRadians()
        };
    }

    /**
     * 🔍 Check if wheel is rotating
     */
    public isRotating(): boolean {
        return this.isRunning;
    }

    /**
     * 📍 Set wheel to specific rotation (while maintaining constant speed)
     */
    public setRotation(radians: number): void {
        this.roulette.rotation = radians % (2 * Math.PI);
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
        console.log("🔄 Wheel synchronizer destroyed");
    }
} 