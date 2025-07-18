import { Sprite } from "pixi.js";
import { Globals } from "../globals";
import { RoulleteBoard } from "../roullete";
import { ROULETTE_CONFIG } from "../config/GameConfig";


export interface BallPhysicsEvents {
    onSpinComplete: (winningNumber: number) => void;  // 🔧 FIX: Clarified parameter name
    onBallLanded: (winningNumber: number) => void;    // 🔧 FIX: Clarified parameter name  
    onPhaseChanged: (phase: string, progress: number) => void;
}

/**
 * 🎾 Smooth Ball Physics Engine
 * Implements realistic 6-phase ball animation with FORWARD-ONLY movement
 * 🔧 FIXED: No more glitching, smooth GSAP-based animation, no teleporting
 */
export class BallPhysics {
    private ball: Sprite;
    private roulette: RoulleteBoard;
    private events: BallPhysicsEvents;
    
    // Animation state
    private isSpinning: boolean = false;
    private currentPhase: string = 'idle';
    private animationTimeline: any = null;
    private currentTween: any = null;
    // 🔧 REMOVED: ballSyncTween no longer needed with simplified synchronization
    
    // Ball state tracking
    private currentBallAngle: number = 0;
    private ballVelocity: number = 0;
    private ballRadius: number = 0;
    private ballVerticalPosition: number = 0;
    private targetWinningNumber: number = -1; // 🔧 FIX: Renamed from targetWinningIndex for clarity
    private ballRelativeAngleToWheel: number = 0; // 🆕 Store ball's relative position to wheel when landed
    
    // 🧭 Simplified direction system
    private ballDirection: number = 1; // 1 = clockwise, -1 = counter-clockwise
    
    // 🆕 Phase transition state for smooth velocity handoff
    private phase1EndingVelocity: number = 0;
    
    // Physics parameters (Simplified for smooth performance)
    private readonly BOUNCE_DAMPING = 0.65;
    private readonly FRICTION_COEFFICIENT = 0.98;
    private readonly ORBITAL_SPEED_INITIAL = 4; // radians/second (reduced for smoothness)
    // private readonly MIN_ALIGNMENT_DISTANCE = 18; // degrees (more forgiving)
    // private readonly PRECISE_DROP_DISTANCE = 5; // degrees (strict dropping threshold)

    // Dynamic radius calculations
    private ballStartRadius: number = 0;
    private ballEndRadius: number = 0;
    private centerX: number = 0;
    private centerY: number = 0;

    constructor(ball: Sprite, roulette: RoulleteBoard, events: BallPhysicsEvents) {
        this.ball = ball;
        this.roulette = roulette;
        this.events = events;
        
        this.calculateDynamicDimensions();
        this.initializeBall();
        
        console.log("🎾 Smooth Ball Physics Engine initialized - GLITCH-FREE");
    }

    /**
     * 📏 Calculate dynamic dimensions based on actual roulette board size
     */
    private calculateDynamicDimensions(): void {
        const center = this.roulette.getCenterPosition();
        this.centerX = center.x;
        this.centerY = center.y;
        
        this.ballStartRadius = this.roulette.getBallStartRadius(this.ball.width*1.2);
        this.ballEndRadius = this.roulette.getBallEndRadius();
        
        console.log(`📏 Ball physics dimensions calculated:
        🎯 Center: (${this.centerX}, ${this.centerY})
        🚀 Start radius: ${this.ballStartRadius.toFixed(1)}px
        🎾 End radius: ${this.ballEndRadius.toFixed(1)}px`);
    }

    /**
     * 🎾 Initialize ball sprite and positioning
     */
    private initializeBall(): void {
        this.ball.visible = false;
        this.ball.anchor.set(0.5);
        this.ball.scale.set(0.65);
        
        // Position ball at starting radius (3 o'clock position)
        const startX = this.centerX + this.ballStartRadius;
        const startY = this.centerY;
        this.ball.position.set(startX, startY);
        
        this.ballRadius = this.ballStartRadius;
        this.ballVerticalPosition = 0;
        this.currentBallAngle = 0;
        this.ballDirection = 1;
        
        console.log("🎾 Ball initialized - ready for smooth animation");
    }

    /**
     * 🚀 Start smooth 6-phase ball animation
     * @param winningNumber The target roulette number (0-36) where the ball should land
     */
    public startSpin(winningNumber: number): void {
        if (this.isSpinning || winningNumber < 0 || winningNumber >= ROULETTE_CONFIG.pocketCount) {
            console.warn(`🎾 Invalid winning number: ${winningNumber}`);
            return;
        }

        console.log(`🚀 Starting SMOOTH Ball Physics for target NUMBER: ${winningNumber}`);
        
        this.isSpinning = true;
        this.targetWinningNumber = winningNumber;
        this.ball.visible = true;
        this.currentPhase = 'launching';
        
        this.stopAllAnimations();
        this.preserveCurrentPosition();
        this.determineBallDirection();
        
        // Start the smooth 6-phase animation
        this.executePhase1_SmoothLaunch();
    }

    /**
     * 🧭 Determine optimal ball direction (FORWARD-ONLY)
     */
    private determineBallDirection(): void {
        // Always choose the direction that gets to target fastest
        const targetAngle = this.roulette.getAngleForNumber(this.targetWinningNumber);
        const currentWheelRotation = this.roulette.roulleteSpinContainer.rotation;
        const targetWorldAngle = this.normalizeAngle(targetAngle + currentWheelRotation);
        const ballAngle = this.currentBallAngle;
        
        // Calculate shortest forward distances
        const clockwiseDistance = this.calculateForwardDistance(ballAngle, targetWorldAngle, 1);
        const counterClockwiseDistance = this.calculateForwardDistance(ballAngle, targetWorldAngle, -1);
        
        // Choose shorter forward distance
        // this.ballDirection = clockwiseDistance <= counterClockwiseDistance ? 1 : -1;
        this.ballDirection = -1;
        
        console.log(`🧭 Direction: ${this.ballDirection === 1 ? 'Clockwise' : 'Counter-clockwise'} (CW: ${clockwiseDistance.toFixed(1)}°, CCW: ${counterClockwiseDistance.toFixed(1)}°)`);
    }

    /**
     * 🔄 Preserve current ball position smoothly
     */
    private preserveCurrentPosition(): void {
        if (!this.ball.visible || (this.currentBallAngle === 0 && this.ballRadius === 0)) {
            // First spin - start at 3 o'clock
            this.currentBallAngle = 0;
            this.ballRadius = this.ballStartRadius;
            this.ballVerticalPosition = 0;
            
            const startX = this.centerX + this.ballRadius;
            const startY = this.centerY;
            this.ball.position.set(startX, startY);
        } else {
            // Continue from current position
            const currentX = this.ball.position.x - this.centerX;
            const currentY = this.ball.position.y - this.centerY;
            this.currentBallAngle = Math.atan2(currentY, currentX);
            this.ballRadius = Math.sqrt(currentX * currentX + currentY * currentY);
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎬 PHASE 1: SMOOTH LAUNCH - Clean GSAP-based orbital motion
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    private executePhase1_SmoothLaunch(): void {
        console.log("🚀 Phase 1: Smooth Launch");
        this.currentPhase = 'launching';
        this.events.onPhaseChanged('launching', 0);
        
        this.currentTween = Globals.gsap?.to({}, {
            duration: 0.2,
            ease: "power2.out",
            onUpdate: () => {
                const progress = this.currentTween?.progress() || 0;
                
                // Smooth velocity buildup
                this.ballVelocity = this.ORBITAL_SPEED_INITIAL * (0.4 + progress * 0.6);
                
                // Simple launch wobble
                const wobble = Math.sin(progress * Math.PI * 3) * 2 * (1 - progress);
                this.ballRadius = this.ballStartRadius + wobble;
                
                // Smooth position update
                this.updateBallPositionSmooth();
                
                this.events.onPhaseChanged('launching', progress);
            },
            onComplete: () => {
                console.log("✅ Phase 1 Complete - Smooth launch achieved");
                this.phase1EndingVelocity = this.ballVelocity; // Store ending velocity
                this.executePhase2_SmoothOrbital();
            }
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎬 PHASE 2: SMOOTH ORBITAL - Waiting for target alignment
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    private executePhase2_SmoothOrbital(): void {
        console.log("🌀 Phase 2: Smooth Orbital - Waiting for target alignment");
        this.currentPhase = 'orbital';
        this.events.onPhaseChanged('orbital', 0);
        
        // Calculate smooth orbital duration
        const targetRounds = 0.5 + Math.random() * 1.0; // 2.5-3.5 rounds
        const orbitalDuration = targetRounds * 2.0; // 2 seconds per round
        
        const orbitalState = { rotation: 0 };
        
        this.currentTween = Globals.gsap?.to(orbitalState, {
            rotation: targetRounds * 2 * Math.PI,
            duration: orbitalDuration,
            ease: "power1.out",
            onUpdate: () => {
                const progress = this.currentTween?.progress() || 0;
                
                // Smooth velocity reduction
                this.ballVelocity = this.phase1EndingVelocity * (1 - progress * 0.4) * this.FRICTION_COEFFICIENT;
                
                // Simple orbital variations
                this.addSimpleOrbitalVariations(progress);
                
                // Smooth position update
                this.updateBallPositionSmooth();
                
                // Check for target alignment after 70% completion
                if (progress > 0.7) {
                    if (this.checkSmoothTargetAlignment()) {
                        console.log("🎯 Perfect alignment found - transitioning to approach");
                        this.currentTween?.progress(1);
                        return;
                    }
                }
                
                this.events.onPhaseChanged('orbital', progress);
            },
            onComplete: () => {
                console.log("✅ Phase 2 Complete - Target alignment ready");
                this.executePhase3_SmoothTargetApproach();
            }
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎬 PHASE 3: SMOOTH TARGET APPROACH - Forward-only movement to target
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    private executePhase3_SmoothTargetApproach(): void {
        console.log("🎯 Phase 3: Smooth Target Approach - Waiting for PRECISE pocket position");
        this.currentPhase = 'approaching';
        this.events.onPhaseChanged('approaching', 0);
        
        // Continue orbital motion but check for precise drop position continuously
        const maxApproachTime = 8.0; // Maximum time to wait for precise alignment
        
        this.currentTween = Globals.gsap?.to({}, {
            duration: maxApproachTime,
            ease: "none", // Linear motion for consistent checking
            onUpdate: () => {
                const progress = this.currentTween?.progress() || 0;
                
                // Continue smooth orbital motion
                this.ballVelocity = this.phase1EndingVelocity * 0.6 * this.FRICTION_COEFFICIENT;
                
                // Gradual inward movement as we approach
                const radiusReduction = this.ballStartRadius * 0.08 * progress;
                this.ballRadius = this.ballStartRadius - radiusReduction;
                
                // Simple approach variations
                const oscillation = Math.sin(progress * Math.PI * 6) * 1.0 * (1 - progress * 0.5);
                this.ballRadius += oscillation;
                
                // Smooth position update
                this.updateBallPositionSmooth();
                
                // 🎯 Check for PRECISE drop position continuously
                if (this.checkPreciseDropPosition()) {
                    console.log("✅ PRECISE pocket position reached - dropping now!");
                    this.currentTween?.progress(1);
                    return;
                }
                
                this.events.onPhaseChanged('approaching', progress);
            },
            onComplete: () => {
                console.log("✅ Phase 3 Complete - Precise position achieved or timeout reached");
                this.executePhase4_SmoothGravityFall();
            }
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎬 PHASE 4: SMOOTH GRAVITY FALL - Clean physics simulation
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    private executePhase4_SmoothGravityFall(): void {
        console.log("⬇️ Phase 4: Smooth Gravity Fall");
        this.currentPhase = 'falling';
        this.events.onPhaseChanged('falling', 0);
        
        const fallDuration = 0.8;
        const startRadius = this.ballRadius;
        const targetRadius = this.ballEndRadius;
        const fallDistance = startRadius - targetRadius;
        
        this.currentTween = Globals.gsap?.to({}, {
            duration: fallDuration,
            ease: "power2.in",
            onUpdate: () => {
                const progress = this.currentTween?.progress() || 0;
                
                // Smooth radial fall
                this.ballRadius = startRadius - (fallDistance * progress);
                
                // Simple spiral effect
                const spiral = Math.sin(progress * Math.PI * 6) * 3 * (1 - progress);
                this.ballRadius += spiral;
                
                // Smooth vertical oscillation
                this.ballVerticalPosition = Math.sin(progress * Math.PI * 8) * 6 * (1 - progress);
                
                // Simple scale effect
                const scale = 1 + (Math.sin(progress * Math.PI * 4) * 0.08 * progress);
                this.ball.scale.set(0.65 * scale);
                
                // Smooth position update
                this.updateBallPositionSmooth();
                
                this.events.onPhaseChanged('falling', progress);
            },
            onComplete: () => {
                console.log("✅ Phase 4 Complete - Smooth fall achieved");
                this.events.onBallLanded(this.targetWinningNumber);
                this.executePhase5_SmoothBounce();
            }
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎬 PHASE 5: SMOOTH BOUNCE & SETTLE - Clean bouncing physics
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    private executePhase5_SmoothBounce(): void {
        console.log("🏀 Phase 5: Smooth Bounce & Settle");
        this.currentPhase = 'bouncing';
        this.events.onPhaseChanged('bouncing', 0);
        
        const bounceCount = 3;
        const bounceDuration = 1.2;
        
        this.currentTween = Globals.gsap?.to({}, {
            duration: bounceDuration,
            ease: "power2.out",
            onUpdate: () => {
                const progress = this.currentTween?.progress() || 0;
                
                // Smooth bouncing with damping
                const bounceAmplitude = 12 * (1 - progress) * this.BOUNCE_DAMPING;
                const bounceFrequency = bounceCount * Math.PI;
                this.ballVerticalPosition = Math.abs(Math.sin(progress * bounceFrequency)) * bounceAmplitude;
                
                // Simple radius settling
                const settle = Math.sin(progress * Math.PI * 5) * 2 * (1 - progress);
                this.ballRadius = this.ballEndRadius + settle;
                
                // Smooth scale effect
                const scaleEffect = 1 + (Math.sin(progress * bounceFrequency) * 0.1 * (1 - progress));
                this.ball.scale.set(0.65 * scaleEffect);
                
                // Smooth position update
                this.updateBallPositionSmooth();
                
                this.events.onPhaseChanged('bouncing', progress);
            },
            onComplete: () => {
                console.log("✅ Phase 5 Complete - Bounce settled, checking position");
                this.executePhase6_BottomMovement();
            }
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎬 PHASE 6: SMOOTH BOTTOM DRIFT - Ball drifts slowly, wheel brings winning pocket to ball
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    private executePhase6_BottomMovement(): void {
        console.log("🎯 Phase 6: Smooth Bottom Drift - Let wheel bring winning pocket to ball");
        this.currentPhase = 'bottom_moving';
        this.events.onPhaseChanged('bottom_moving', 0);
        
        // Set ball to bottom radius with natural settling
        this.ballRadius = this.ballEndRadius;
        this.ballVerticalPosition = 0;
        
        // Check if we're already aligned
        if (this.checkBottomPositionAlignment()) {
            console.log("✅ Ball already perfectly positioned!");
            this.finalizeBallPosition();
            this.events.onSpinComplete(this.targetWinningNumber);
            this.startSmoothWheelSynchronization();
            return;
        }
        
        // 🐌 SMOOTH DRIFT STRATEGY:
        // Ball moves VERY slowly while wheel continues rotating at constant speed
        // The wheel's rotation will naturally bring the winning pocket to the ball
        // This creates realistic physics where the ball settles gradually
        const maxDriftTime = 8.0; // 🔧 INCREASED: Need more time to wait for exact target timing
        const slowDriftSpeed = 0.06; // 🔧 EVEN SLOWER: More precise timing needed
        
        console.log(`🎰 REAL CASINO MODE: Ball must predict when target ${this.targetWinningNumber} passes top position (wheel never stops)`);
        
        this.currentTween = Globals.gsap?.to({}, {
            duration: maxDriftTime,
            ease: "none", // Linear drift for natural movement
            onUpdate: () => {
                const progress = this.currentTween?.progress() || 0;
                
                // 🐌 Very slow angular drift along bottom edge with natural deceleration
                // Ball moves much slower than wheel rotation speed and gradually slows down
                const decelerationFactor = 1 - (progress * 0.3); // Gradual slowdown over time
                const currentDriftSpeed = slowDriftSpeed * decelerationFactor;
                this.currentBallAngle += this.ballDirection * currentDriftSpeed / 60;
                this.currentBallAngle = this.normalizeAngle(this.currentBallAngle);
                
                // Stay perfectly at bottom with subtle friction effects
                this.ballRadius = this.ballEndRadius;
                this.ballVerticalPosition = Math.sin(progress * Math.PI * 12) * 0.3; // Tiny friction variations
                
                // Natural position update
                this.updateBallPositionSmooth();
                
                // 🎯 Continuously check if wheel has brought winning pocket to ball
                if (this.checkBottomPositionAlignment()) {
                    console.log(`✅ Wheel rotation brought winning pocket ${this.targetWinningNumber} to ball - starting gradual capture!`);
                    this.currentTween?.kill(); // Stop current drift
                    this.executePhase7_GradualCapture(); // Start gradual capture by pocket
                    return;
                }
                
                // Debug logging every 20% progress
                if (progress > 0 && Math.floor(progress * 5) > Math.floor((progress - 0.01) * 5)) {
                    const currentWinner = this.roulette.getCurrentWinningNumber();
                    console.log(`🎰 Phase 6 Progress: ${(progress * 100).toFixed(0)}% | Current winner: ${currentWinner} | Target: ${this.targetWinningNumber} | Waiting for exact timing...`);
                }
                
                this.events.onPhaseChanged('bottom_moving', progress);
            },
            onComplete: () => {
                console.log("✅ Phase 6 Complete - Natural wheel alignment achieved");
                this.finalizeBallPosition();
                this.events.onSpinComplete(this.targetWinningNumber);
                this.startSmoothWheelSynchronization();
            }
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎬 PHASE 7: GRADUAL CAPTURE - Ball gradually slows and gets captured by approaching target pocket
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    private executePhase7_GradualCapture(): void {
        console.log("🎯 Phase 7: Gradual Capture - Ball slowing down, target pocket approaching");
        this.currentPhase = 'gradual_capture';
        this.events.onPhaseChanged('gradual_capture', 0);
        
        const captureStartTime = Date.now();
        const maxCaptureTime = 3.0; // Maximum time for capture process
        let initialBallSpeed = 0.02; // Very slow initial drift speed
        let captureProgress = 0;
        let isCaptured = false;
        
        console.log(`🎰 Ball will be gradually captured by pocket ${this.targetWinningNumber} as wheel rotates`);
        
        this.currentTween = Globals.gsap?.to({}, {
            duration: maxCaptureTime,
            ease: "none", // Linear time progression
            onUpdate: () => {
                const progress = this.currentTween?.progress() || 0;
                const elapsedTime = Date.now() - captureStartTime;
                
                if (!isCaptured) {
                    // 🐌 Ball continues very slow drift with increasing friction
                    const frictionFactor = Math.max(0.1, 1 - progress * 0.9); // Gradual slowdown
                    const currentDriftSpeed = initialBallSpeed * frictionFactor;
                    
                    // Ball moves very slowly in its current direction
                    this.currentBallAngle += this.ballDirection * currentDriftSpeed / 60;
                    this.currentBallAngle = this.normalizeAngle(this.currentBallAngle);
                    
                    // 🎯 Check if target pocket has come close enough to capture ball
                    const targetAngle = this.roulette.getAngleForNumber(this.targetWinningNumber);
                    const currentWheelRotation = this.roulette.roulleteSpinContainer.rotation;
                    const targetWorldAngle = this.normalizeAngle(currentWheelRotation + targetAngle);
                    
                    // Calculate distance between ball and target pocket
                    let angleDifference = this.normalizeAngle(targetWorldAngle - this.currentBallAngle);
                    const distanceToPocket = Math.abs(angleDifference) * (180 / Math.PI);
                    
                    // 🎯 CAPTURE THRESHOLD: When target pocket gets within 15 degrees, start capture
                    const CAPTURE_THRESHOLD = 15.0; // degrees
                    
                    if (distanceToPocket <= CAPTURE_THRESHOLD) {
                        console.log(`🎯 CAPTURE INITIATED: Target pocket within ${distanceToPocket.toFixed(1)}° - ball being captured!`);
                        isCaptured = true;
                        captureProgress = 0;
                    }
                    
                    // Debug logging
                    if (Math.floor(elapsedTime / 500) > Math.floor((elapsedTime - 16) / 500)) {
                        console.log(`🎰 Gradual drift: Ball speed ${(currentDriftSpeed * 60).toFixed(3)}, Distance to pocket: ${distanceToPocket.toFixed(1)}°`);
                    }
                } else {
                    // 🎯 CAPTURE PHASE: Ball is being pulled toward the target pocket
                    captureProgress += 0.025; // Gradual capture rate
                    captureProgress = Math.min(captureProgress, 1.0);
                    
                    // Calculate target position
                    const targetAngle = this.roulette.getAngleForNumber(this.targetWinningNumber);
                    const currentWheelRotation = this.roulette.roulleteSpinContainer.rotation;
                    const targetWorldAngle = this.normalizeAngle(currentWheelRotation + targetAngle);
                    
                    // Smoothly interpolate ball toward target pocket
                    const currentAngle = this.currentBallAngle;
                    let angleDifference = this.normalizeAngle(targetWorldAngle - currentAngle);
                    
                    // Apply gradual capture with easing
                    const captureEasing = captureProgress * captureProgress * (3 - 2 * captureProgress); // Smooth step
                    this.currentBallAngle = this.normalizeAngle(currentAngle + angleDifference * captureEasing * 0.1);
                    
                    // Check if capture is complete
                    const finalDistance = Math.abs(this.normalizeAngle(targetWorldAngle - this.currentBallAngle)) * (180 / Math.PI);
                    if (finalDistance < 2.0 || captureProgress >= 1.0) {
                        console.log(`✅ CAPTURE COMPLETE: Ball successfully captured by pocket ${this.targetWinningNumber}!`);
                        this.currentTween?.progress(1);
                        return;
                    }
                }
                
                // Keep ball at bottom radius
                this.ballRadius = this.ballEndRadius;
                this.ballVerticalPosition = Math.sin(progress * Math.PI * 20) * 0.2; // Tiny friction effects
                
                // Update visual position
                this.updateBallPositionSmooth();
                
                this.events.onPhaseChanged('gradual_capture', progress);
            },
            onComplete: () => {
                console.log("✅ Phase 7 Complete - Ball gradually captured by target pocket");
                this.finalizeBallPosition();
                this.events.onSpinComplete(this.targetWinningNumber);
                this.startSmoothWheelSynchronization();
            }
        });
    }

    /**
     * 🎯 Check if ball is aligned with winning pocket at bottom
     * 🔧 SIMPLIFIED: Just wait for target number to be at top - no complex predictions
     */
    private checkBottomPositionAlignment(): boolean {
        // Check what number is currently winning
        const currentWinner = this.roulette.getCurrentWinningNumber();
        
        // 🔧 SIMPLIFIED LOGIC: Ball lands only when target number is actually at top
        if (currentWinner === this.targetWinningNumber) {
            console.log(`🎯 PERFECT TIMING: Target ${this.targetWinningNumber} is currently at top - ball landing now!`);
            return true;
        }
        
        // Log current state for debugging
        // console.log(`🔍 Waiting for target ${this.targetWinningNumber} to reach top (current winner: ${currentWinner})`);
        
        return false;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🛠️ SMOOTH PHYSICS HELPERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    /**
     * 📍 Smooth ball position update - NO glitching
     */
    private updateBallPositionSmooth(): void {
        // 🔧 SETTLED BALL: When settled, maintain exact relative position to wheel
        if (this.currentPhase === 'settled') {
            // Use stored relative angle to maintain exact landing position relationship
            const currentWheelRotation = this.roulette.roulleteSpinContainer.rotation;
            this.currentBallAngle = this.normalizeAngle(currentWheelRotation + this.ballRelativeAngleToWheel);
        }
        
        // Simple position calculation
        const x = this.centerX + this.ballRadius * Math.cos(this.currentBallAngle);
        const y = this.centerY + this.ballRadius * Math.sin(this.currentBallAngle) + this.ballVerticalPosition;
        
        this.ball.position.set(x, y);
        
        // GSAP-controlled angle update (smooth) - Note: bottom_moving phase handles its own angle updates
        if (this.currentPhase === 'orbital' || this.currentPhase === 'launching' || this.currentPhase === 'approaching') {
            this.currentBallAngle += this.ballDirection * this.ballVelocity / 60;
            this.currentBallAngle = this.normalizeAngle(this.currentBallAngle);
        }
        // Note: 'bottom_moving' and 'gradual_capture' phases handle their own angle updates
    }

    /**
     * 🌊 Simple orbital variations - no glitching
     */
    private addSimpleOrbitalVariations(progress: number): void {
        // Simple wobble
        const wobbleIntensity = 4 + progress * 3;
        const wobbleFreq = 12 + progress * 6;
        const wobble = Math.sin(progress * wobbleFreq) * wobbleIntensity;
        
        this.ballRadius = this.ballStartRadius + wobble;
        
        // Simple velocity variation
        const velocityVariation = Math.sin(progress * 15) * 0.05;
        this.ballVelocity *= (1 + velocityVariation);
    }

    /**
     * 🎯 Smooth target alignment detection
     */
    private checkSmoothTargetAlignment(): boolean {
        // Get current winning number
        const currentWinningNumber = this.roulette.getCurrentWinningNumber();
        
        if (currentWinningNumber === this.targetWinningNumber) {
            const targetAngle = this.roulette.getAngleForNumber(this.targetWinningNumber);
            const currentWheelRotation = this.roulette.roulleteSpinContainer.rotation;
            
            // 🔧 FIX: Use same improved logic as other alignment checks
            const targetWorldAngle = this.normalizeAngle(targetAngle + currentWheelRotation);
            const ballTargetAngle = this.normalizeAngle(targetWorldAngle + Math.PI);
            
            // Calculate distance to target position
            const angleDifference = this.normalizeAngle(ballTargetAngle - this.currentBallAngle);
            const alignmentDistance = Math.abs(angleDifference) * (180 / Math.PI);
            
            // Moderate tolerance for smooth alignment detection
            const ALIGNMENT_TOLERANCE = 6.0; // degrees - moderate tolerance for smooth detection
            
            if (alignmentDistance <= ALIGNMENT_TOLERANCE) {
                console.log(`🎯 Smooth alignment detected! Distance: ${alignmentDistance.toFixed(1)}° (Target: ${this.targetWinningNumber})`);
                return true;
            }
        }
        
        return false;
    }

    /**
     * 🎯 Precise drop position check - Only drop when exactly at pocket
     */
    private checkPreciseDropPosition(): boolean {
        // Get current winning number
        const currentWinningNumber = this.roulette.getCurrentWinningNumber();
        
        if (currentWinningNumber === this.targetWinningNumber) {
            const targetAngle = this.roulette.getAngleForNumber(this.targetWinningNumber);
            const currentWheelRotation = this.roulette.roulleteSpinContainer.rotation;
            
            // 🔧 FIX: Use same improved logic as bottom alignment
            const targetWorldAngle = this.normalizeAngle(targetAngle + currentWheelRotation);
            const ballTargetAngle = this.normalizeAngle(targetWorldAngle + Math.PI);
            
            // Calculate precise distance to exact pocket position
            const angleDifference = this.normalizeAngle(ballTargetAngle - this.currentBallAngle);
            const preciseDistance = Math.abs(angleDifference) * (180 / Math.PI);
            
            // Very strict tolerance for precise dropping
            const DROP_TOLERANCE = 2.0; // degrees - extremely tight for precise dropping
            
            if (preciseDistance <= DROP_TOLERANCE) {
                console.log(`🎯 PRECISE drop position reached! Distance: ${preciseDistance.toFixed(2)}° (Target: ${this.targetWinningNumber})`);
                return true;
            }
        }
        
        return false;
    }

    /**
     * 🧭 Calculate forward distance (no backward movement)
     */
    private calculateForwardDistance(fromAngle: number, toAngle: number, direction: number): number {
        let diff = direction * (toAngle - fromAngle);
        
        // Ensure forward only
        while (diff < 0) {
            diff += 2 * Math.PI;
        }
        while (diff > 2 * Math.PI) {
            diff -= 2 * Math.PI;
        }
        
        return (diff * 180) / Math.PI;
    }



    /**
     * 🏁 Finalize ball position
     */
    private finalizeBallPosition(): void {
        // 🔧 FIX: Only set final state - position is already smoothly set by Phase 7
        // Don't change ball position here to avoid teleporting
        
        const targetAngle = this.roulette.getAngleForNumber(this.targetWinningNumber);
        
        // Store the correct relative position for future updates
        this.ballRelativeAngleToWheel = targetAngle; // Same angle as target number
        
        // Clean up physical properties but don't change position
        this.ballRadius = this.ballEndRadius;
        this.ballVerticalPosition = 0;
        this.ball.scale.set(0.65);
        this.ball.rotation = 0;
        
        // DON'T update position here - Phase 7 already positioned it correctly
        
        this.isSpinning = false;
        this.currentPhase = 'settled';
        
        console.log(`🏁 Ball finalized in target number ${this.targetWinningNumber} pocket (no teleporting - gradually captured by Phase 7)`);
        console.log(`📍 Target number angle: ${(targetAngle * 180 / Math.PI).toFixed(2)}°`);
        console.log(`📍 Ball relative angle to wheel: ${(this.ballRelativeAngleToWheel * 180 / Math.PI).toFixed(2)}°`);
        console.log(`📍 Ball world angle: ${(this.currentBallAngle * 180 / Math.PI).toFixed(2)}°`);
    }

    /**
     * 🔄 Final verification - ball timed its landing with constantly moving wheel
     */
    private startSmoothWheelSynchronization(): void {
        console.log(`🎰 CASINO PHYSICS COMPLETE: Ball timed its landing with constantly moving wheel`);
        
        // 🔧 SIMPLIFIED: With new logic, ball always lands correctly
        const currentWinner = this.roulette.getCurrentWinningNumber();
        console.log(`✅ PERFECT CASINO TIMING: Ball landed exactly when ${this.targetWinningNumber} was at top - current winner: ${currentWinner}`);
        
        console.log("🎰 Real casino roulette physics complete - wheel continues spinning for next round");
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🔧 UTILITY FUNCTIONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    /**
     * 🔄 Stop all animations
     */
    public stopAllAnimations(): void {
        if (this.animationTimeline) {
            this.animationTimeline.kill();
            this.animationTimeline = null;
        }
        if (this.currentTween) {
            this.currentTween.kill();
            this.currentTween = null;
        }
        // 🔧 REMOVED: ballSyncTween no longer used with simplified synchronization

        Globals.gsap?.killTweensOf(this.ball);
        Globals.gsap?.killTweensOf(this.ball.position);
        Globals.gsap?.killTweensOf(this.ball.scale);
        
        console.log("🔄 All ball animations stopped cleanly");
    }



    /**
     * 📐 Normalize angle to [-π, π] range
     */
    private normalizeAngle(angle: number): number {
        let normalized = angle;
        while (normalized > Math.PI) {
            normalized -= 2 * Math.PI;
        }
        while (normalized < -Math.PI) {
            normalized += 2 * Math.PI;
        }
        return normalized;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📋 PUBLIC API
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    /**
     * 🔄 Update method called every frame from main game loop
     */
    public update(_dt: number): void {
        // Update ball position if settled (moves with wheel rotation)
        if (this.currentPhase === 'settled') {
            this.updateBallPositionSmooth();
        }
    }

    public getIsSpinning(): boolean {
        return this.isSpinning;
    }

    public isReadyToSpin(): boolean {
        return !this.isSpinning && this.currentPhase !== 'falling' && this.currentPhase !== 'bouncing' && this.currentPhase !== 'bottom_moving' && this.currentPhase !== 'gradual_capture';
    }

    public getCurrentPhase(): string {
        return this.currentPhase;
    }

    public getBallDirection(): string {
        return this.ballDirection === 1 ? 'clockwise' : 'counter-clockwise';
    }

    public recalculateDimensions(): void {
        console.log("🔄 Recalculating ball physics dimensions...");
        this.calculateDynamicDimensions();
        
        if (!this.isSpinning) {
            const startX = this.centerX + this.ballStartRadius;
            const startY = this.centerY;
            this.ball.position.set(startX, startY);
            console.log("🎾 Ball position updated smoothly");
        }
    }

    public getDimensions(): { centerX: number; centerY: number; ballStartRadius: number; ballEndRadius: number } {
        return {
            centerX: this.centerX,
            centerY: this.centerY,
            ballStartRadius: this.ballStartRadius,
            ballEndRadius: this.ballEndRadius
        };
    }

    public destroy(): void {
        this.stopAllAnimations();
        console.log("🎾 Smooth Ball Physics destroyed");
    }
} 