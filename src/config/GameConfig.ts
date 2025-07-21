import { config } from "../appconfig";

// ⚙️ ROULETTE GAME CONFIGURATION
export const ROULETTE_CONFIG = {
    pocketCount: 37,
    wheelRadius: 200,
    centerX: config.logicalWidth / 2,
    centerY: config.logicalHeight / 2,

    // 🚨 DEPRECATED: These are now calculated dynamically by BallPhysics
    // ballStartRadius and ballEndRadius are no longer used as hardcoded values
    // The ball now calculates its starting position from the actual roulette board dimensions
    ballStartRadius: 270,  // ⚠️ Legacy value - replaced by dynamic calculation
    ballEndRadius: 140,    // ⚠️ Legacy value - replaced by dynamic calculation

    // 🎯 NEW 4-PHASE ANIMATION SYSTEM
    // Total spin duration range (will be calculated dynamically based on angular distance)
    spinDurationMin: 5.0,   // Minimum duration when ball is close to target
    spinDurationMax: 10.0,  // Maximum duration when ball is far from target
    
    // 🎬 PHASE DURATIONS (as percentages of total duration)
    phase1Duration: 0.05,   // 5% - Spin Setup (board starts, ball launches)
    phase2Duration: 0.70,   // 70% - Outer Track Movement (ball orbits, alignment detection)
    phase3Duration: 0.15,   // 15% - Auto-Pocket Transition (spiral inward to pocket)
    phase4Duration: 0.10,   // 10% - Final Bounce & Stop (settle in pocket)

    // 🌀 BALL ROTATION PARAMETERS
    wheelSpins: 4,          // Total wheel rotations during animation
    ballSpins: 2,           // Total ball rotations during outer track phase
    
    // 🎯 ANGULAR PROXIMITY DETECTION
    pocketDetectionThreshold: 3, // Degrees - when ball is considered "aligned" with pocket
    
    // Constant wheel rotation (never stops)
    constantWheelSpeed: 0.3, // rotations per second (slow and steady)
    
    // 🎨 EASING CONFIGURATIONS
    wheelEasing: "power4.out",        // Board deceleration easing
    ballOuterEasing: "circ.out",      // Ball outer track movement  
    ballSpiralEasing: "power2.in",    // Ball spiral inward easing
    ballBounceEasing: "back.out(1.7)", // Ball pocket bounce easing
    ballSettleEasing: "sine.out",     // Ball final settle easing

    // Automatic countdown after each spin
    autoCountdownDuration: 15 // seconds to wait before next spin is allowed
} as const;
 // European roulette wheel layout (37 numbers: 0-36)
    // Numbers arranged in clockwise order starting from 0 at the top
    export const rouletteNumbers = [
        0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
    ];
    
    // Define red and black numbers for European roulette
    export const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    export const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

    export function getRouletteProperties(number: number) {
        const red = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
        const black = new Set([2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35]);
    
        const color = red.has(number)
            ? 'Red'
            : black.has(number)
            ? 'Black'
            : 'Green';
    
        const parity = number === 0
            ? 'None'
            : (number % 2 === 0 ? 'Even' : 'Odd'); // 💡 even or odd check here
    
        return { number, color, parity };
    }
    
// ⏰ UI CONFIGURATION
export const UI_CONFIG = {
    // Time Display
    timeDisplay: {
        x: config.logicalWidth / 2,
        y: 120,
        fontSize: 24,
        color: 0xFFFFFF,
        fontFamily: "Arial",
        lineHeight: 32
    },
    
    // Countdown Overlay
    countdown: {
        overlayColor: 0x000000,
        overlayAlpha: 0.7,
        backgroundColor: 0x1a1a1a,
        borderColor: 0x4a90e2,
        borderWidth: 3,
        borderRadius: 15,
        fontSize: 48,
        textColor: 0xFFFFFF,
        shadowColor: 0x000000,
        glowColor: 0x4a90e2,
        containerWidth: 300,
        containerHeight: 120,
        autoCountdownDuration: 15
    }
} as const;

// 🎯 GAME CONSTANTS
export const GAME_CONSTANTS = {
    TARGET_NUMBERS: {
        RED: 32,
        BLACK: 15,
        GREEN: 0
    },
    
    SPIN_COMMANDS: {
        RANDOM: [' ', 'r'],
        NUMBERS: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        SPECIAL: ['q', 'w', 'e'],
        COUNTDOWN: ['c', 'x', 't']
    }
} as const; 