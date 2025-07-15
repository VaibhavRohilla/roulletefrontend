/**
 * 🎯 OrientationManager - Utility for managing device orientation
 * Provides centralized orientation detection and landscape mode enforcement
 */

export type OrientationType = 'landscape' | 'portrait';
export type OrientationCallback = (orientation: OrientationType) => void;

export class OrientationManager {
    private static instance: OrientationManager;
    private callbacks: OrientationCallback[] = [];
    private currentOrientation: OrientationType;

    private constructor() {
        this.currentOrientation = this.detectOrientation();
        this.setupListeners();
        console.log("🎯 OrientationManager initialized");
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): OrientationManager {
        if (!OrientationManager.instance) {
            OrientationManager.instance = new OrientationManager();
        }
        return OrientationManager.instance;
    }

    /**
     * 📐 Detect current orientation
     */
    private detectOrientation(): OrientationType {
        return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    }

    /**
     * 👂 Setup orientation change listeners
     */
    private setupListeners(): void {
        // Primary orientation change handler
        const handleOrientationChange = () => {
            const newOrientation = this.detectOrientation();
            if (newOrientation !== this.currentOrientation) {
                this.currentOrientation = newOrientation;
                this.notifyCallbacks(newOrientation);
                console.log(`📱 Orientation changed to: ${newOrientation}`);
            }
        };

        // Multiple event listeners for comprehensive coverage
        window.addEventListener('orientationchange', () => {
            // Delay to ensure dimensions are updated
            setTimeout(handleOrientationChange, 100);
        });

        window.addEventListener('resize', handleOrientationChange);

        // Modern Screen Orientation API
        if ('screen' in window && 'orientation' in window.screen) {
            const screen = window.screen as any;
            if (screen.orientation && screen.orientation.addEventListener) {
                screen.orientation.addEventListener('change', handleOrientationChange);
            }
        }

        // Media query listener for additional reliability
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(orientation: landscape)');
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleOrientationChange);
            } else if (mediaQuery.addListener) {
                mediaQuery.addListener(handleOrientationChange);
            }
        }
    }

    /**
     * 📢 Notify all registered callbacks
     */
    private notifyCallbacks(orientation: OrientationType): void {
        this.callbacks.forEach(callback => {
            try {
                callback(orientation);
            } catch (error) {
                console.error("🚨 Error in orientation callback:", error);
            }
        });
    }

    /**
     * 📝 Subscribe to orientation changes
     */
    public onOrientationChange(callback: OrientationCallback): () => void {
        this.callbacks.push(callback);
        
        // Return unsubscribe function
        return () => {
            const index = this.callbacks.indexOf(callback);
            if (index > -1) {
                this.callbacks.splice(index, 1);
            }
        };
    }

    /**
     * 📏 Get current orientation
     */
    public getCurrentOrientation(): OrientationType {
        return this.currentOrientation;
    }

    /**
     * 🖥️ Check if currently in landscape mode
     */
    public isLandscape(): boolean {
        return this.currentOrientation === 'landscape';
    }

    /**
     * 📱 Check if currently in portrait mode
     */
    public isPortrait(): boolean {
        return this.currentOrientation === 'portrait';
    }

    /**
     * 📱 Detect if device is mobile
     */
    public isMobileDevice(): boolean {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * 🔒 Attempt to lock orientation to landscape (where supported)
     */
    public async lockToLandscape(): Promise<boolean> {
        try {
            const screen = window.screen as any;
            
            if (screen.orientation && screen.orientation.lock) {
                await screen.orientation.lock('landscape');
                console.log("🔒 Successfully locked to landscape orientation");
                return true;
            } else {
                console.log("⚠️ Screen orientation lock not supported");
                return false;
            }
        } catch (error) {
            console.log("⚠️ Failed to lock orientation:", (error as Error).message);
            return false;
        }
    }

    /**
     * 🔓 Unlock orientation (where supported)
     */
    public async unlockOrientation(): Promise<boolean> {
        try {
            const screen = window.screen as any;
            
            if (screen.orientation && screen.orientation.unlock) {
                await screen.orientation.unlock();
                console.log("🔓 Orientation unlocked");
                return true;
            } else {
                console.log("⚠️ Screen orientation unlock not supported");
                return false;
            }
        } catch (error) {
            console.log("⚠️ Failed to unlock orientation:", (error as Error).message);
            return false;
        }
    }

    /**
     * 📊 Get device and orientation info
     */
    public getOrientationInfo(): {
        current: OrientationType;
        width: number;
        height: number;
        isMobile: boolean;
        supportsLock: boolean;
    } {
        const screen = window.screen as any;
        
        return {
            current: this.currentOrientation,
            width: window.innerWidth,
            height: window.innerHeight,
            isMobile: this.isMobileDevice(),
            supportsLock: !!(screen.orientation && screen.orientation.lock)
        };
    }

    /**
     * 🎯 Preferred method for games: enforce landscape with user feedback
     */
    public enforceLandscapeMode(): void {
        // Try to lock orientation first
        this.lockToLandscape();

        // Set up orientation monitoring and user feedback
        this.onOrientationChange((orientation) => {
            const warning = document.getElementById('orientationWarning');
            if (warning) {
                if (orientation === 'portrait' && this.isMobileDevice()) {
                    warning.style.display = 'flex';
                } else {
                    warning.style.display = 'none';
                }
            }
        });

        // Initial check
        const warning = document.getElementById('orientationWarning');
        if (warning && this.isPortrait() && this.isMobileDevice()) {
            warning.style.display = 'flex';
        }
    }

    /**
     * 🔧 Debug method: log current state
     */
    public debug(): void {
        const info = this.getOrientationInfo();
        console.log("🔍 OrientationManager Debug:", info);
    }
} 