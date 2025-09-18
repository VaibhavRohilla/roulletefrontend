import { Globals } from "../globals";


export interface GameCycleEvents {
    onRoundStart: (timeLeft: number) => void;
    onSpinTrigger: (spinIndex: number) => void;
    onNoGames: (lastSpinResult?: {spin_number: number, color: string, parity: string, timestamp: string}) => void;
    onGameResumed: () => void;
    onConnectionError: () => void;
    onConnectionRestored: () => void;
}

export interface APIGameState {
    roundActive: boolean;
    isSpinning: boolean;
    spinIndex?: number;
    roundStartTime?: string;
    roundDuration?: number;
    lastSpinResult?: {
        spin_number: number;
        color: string;
        parity: string;
        timestamp: string;
    };
}

/**
 * 🔄 Game Cycle Manager
 * Handles API-driven polling-based game flow without WebSocket dependency
 */
export class GameCycleManager {
    private events: GameCycleEvents;
    private isPolling: boolean = false;
    private isCountdownActive: boolean = false;
    private isSpinInProgress: boolean = false;
    private isInIdleCountdown: boolean = false;
    private pollingInterval: NodeJS.Timeout | null = null;
    private apiBaseUrl: string;
    private lastGameState: APIGameState | null = null;
    private connectionErrors: number = 0;
    private maxRetries: number = 5;
    private lastCountdownEndTime: number = 0; // Track when countdown ended
    
    // Simple cost-effective polling configuration
    private readonly POLLING_INTERVAL = 5000; // 5s always (720 calls/hour - cost-effective)
    
    // CRITICAL FIX: Add polling state management to prevent race conditions
    private pollingLock: boolean = false;
    private isDestroyed: boolean = false;

    constructor(events: GameCycleEvents) {
        this.events = events;
        this.apiBaseUrl = Globals.isProd ? 'https://roulletebackend.onrender.com' : 'http://localhost:3001';
        console.log("🔄 GameCycleManager initialized with API polling");
    }

    /**
     * 🚀 Start the API-driven game cycle
     */
    public async start(): Promise<void> {
        console.log("🚀 Starting API-driven game cycle");
        
        try {
            // Initial API call to get current state
            const gameState = await this.fetchGameState();
            this.handleGameStateResponse(gameState);
            
            // Start polling
            this.startPolling();
            
            console.log("✅ Game cycle started successfully");
        } catch (error) {
            console.error("❌ Failed to start game cycle:", error);
            this.events.onConnectionError();
            this.handleConnectionError();
        }
    }

    /**
     * ⏹️ Stop the game cycle
     */
    public stop(): void {
        console.log("⏹️ Stopping game cycle");
        this.stopPolling();
        this.isCountdownActive = false;
        this.isSpinInProgress = false;
        this.isInIdleCountdown = false;
    }

    /**
     * 📡 Fetch current game state from API
     */
    private async fetchGameState(): Promise<APIGameState> {
        const response = await fetch(`${this.apiBaseUrl}/api/game-state`);
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        return response.json();
    }

    /**
     * 🎰 Fetch spin result from API (optional endpoint)
     */
    private async fetchSpinResult(): Promise<{ spinIndex: number } | null> {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/spin-result`);
            
            if (response.status === 404) {
                return null; // No active spin
            }
            
            if (!response.ok) {
                throw new Error(`Spin result request failed: ${response.status}`);
            }
            
            return response.json();
        } catch (error) {
            console.warn("⚠️ Could not fetch spin result:", error);
            return null;
        }
    }

    /**
     * 🔄 Start simple cost-effective polling - RACE CONDITION FIXED
     */
    private startPolling(): void {
        // CRITICAL FIX: Add polling lock to prevent concurrent execution
        if (this.pollingLock) {
            console.log("🔒 Polling start already in progress");
            return;
        }

        if (this.isPolling) {
            console.warn("⚠️ Polling already active");
            return;
        }

        if (this.isDestroyed) {
            console.warn("⚠️ Cannot start polling - GameCycleManager destroyed");
            return;
        }

        this.pollingLock = true;

        try {
            // CRITICAL FIX: Clear any existing interval before starting new one
            this.stopPolling();

            this.isPolling = true;
            console.log(`🔄 Starting cost-effective polling every ${this.POLLING_INTERVAL}ms (720 calls/hour)`);

            // CRITICAL FIX: Use setInterval consistently (not mixed with setTimeout)
            this.pollingInterval = setInterval(async () => {
                if (!this.isDestroyed && this.isPolling) {
                    await this.pollGameState();
                } else {
                    console.log("⏹️ Polling stopped due to destroy or stop flag");
                    this.stopPolling();
                }
            }, this.POLLING_INTERVAL);

            this.pollingLock = false;

        } catch (error) {
            this.pollingLock = false;
            console.error("❌ Error starting polling:", error);
        }
    }

    /**
     * ⏹️ Stop polling - MEMORY LEAK FIXED
     */
    private stopPolling(): void {
        // CRITICAL FIX: Proper interval cleanup to prevent memory leaks
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
            console.log("🧹 Polling interval cleared");
        }
        
        this.isPolling = false;
        this.pollingLock = false; // Reset lock on stop
        console.log("⏹️ Cost-effective polling stopped");
    }

    /**
     * 📊 Poll game state and handle response - RACE CONDITION FIXED
     */
    private async pollGameState(): Promise<void> {
        // CRITICAL FIX: Check if destroyed or not polling
        if (this.isDestroyed || !this.isPolling) {
            return;
        }

        // Only poll when appropriate (not during countdown or spin)
        if (this.shouldSkipPolling()) {
            return;
        }

        try {
            const gameState = await this.fetchGameState();
            
            // CRITICAL FIX: Check again if destroyed before processing response
            if (this.isDestroyed) {
                return;
            }
            
            this.handleGameStateResponse(gameState);
            
            // Reset error count on success and restore connection if needed
            if (this.connectionErrors > 0) {
                this.connectionErrors = 0;
                this.events.onConnectionRestored();
            }
            
        } catch (error) {
            // CRITICAL FIX: Only handle connection error if not destroyed
            if (!this.isDestroyed) {
                this.handleConnectionError();
            }
        }
    }

    /**
     * 🤔 Check if we should skip polling
     */
    private shouldSkipPolling(): boolean {
        return this.isCountdownActive || this.isSpinInProgress || this.isInIdleCountdown;
    }

    /**
     * 📨 Handle game state response from API (SIMPLE 5S POLLING)
     */
    private handleGameStateResponse(gameState: APIGameState): void {
        console.log("📨 Game state received (5s polling):", {
            roundActive: gameState.roundActive,
            isSpinning: gameState.isSpinning,
            spinIndex: gameState.spinIndex,
            hasLastSpin: !!gameState.lastSpinResult,
            frontendState: {
                isCountdownActive: this.isCountdownActive,
                isSpinInProgress: this.isSpinInProgress,
                timeSinceCountdown: this.lastCountdownEndTime ? Date.now() - this.lastCountdownEndTime : 'N/A'
            }
        });

        // Check for significant state changes
        const isNewState = !this.lastGameState || this.hasSignificantChange(this.lastGameState, gameState);
        this.lastGameState = gameState;

        if (!isNewState) {
            return; // No significant changes - cost-effective approach
        }

        if (gameState.roundActive && gameState.roundStartTime && gameState.roundDuration) {
            console.log("🎯 Handling active round state (5s max delay)");
            this.handleActiveRound(gameState);
        } else if (gameState.isSpinning && gameState.spinIndex !== undefined) {
            console.log("🎰 Handling active spin state (5s max delay)");
            this.handleActiveSpin(gameState);
        } else {
            console.log("💤 Handling idle state (5s max delay acceptable)");
            this.handleIdleState();
        }
    }

    /**
     * 🔍 Check if there are significant changes in game state
     */
    private hasSignificantChange(oldState: APIGameState, newState: APIGameState): boolean {
        return (
            oldState.roundActive !== newState.roundActive ||
            oldState.isSpinning !== newState.isSpinning ||
            oldState.spinIndex !== newState.spinIndex
        );
    }

    /**
     * 🎯 Handle active round with countdown
     */
    private handleActiveRound(gameState: APIGameState): void {
        const { roundStartTime, roundDuration } = gameState;
        
        if (!roundStartTime || !roundDuration) {
            console.warn("⚠️ Invalid round data");
            return;
        }

        // Calculate remaining time
        const startTime = new Date(roundStartTime).getTime();
        const currentTime = Date.now();
        const timeElapsed = currentTime - startTime;
        const timeRemaining = Math.max(0, roundDuration - timeElapsed);

        if (timeRemaining > 0) {
            const secondsRemaining = Math.ceil(timeRemaining / 1000);
            console.log(`🎯 Active round detected - ${secondsRemaining}s remaining`);
            
            this.stopPolling();
            this.isCountdownActive = true;
            this.events.onRoundStart(secondsRemaining);

            // Near-end safeguard: probe for spin in the last 3 seconds of countdown
            const earlyResumeMs = Math.max(0, timeRemaining - 3000);
            setTimeout(() => {
                if (this.isDestroyed || !this.isCountdownActive) return;
                console.log("🛡️ Near-end safeguard: probing for spin-result every 1s during last 3s of countdown");
                const probe = setInterval(async () => {
                    if (this.isDestroyed || !this.isCountdownActive) { clearInterval(probe); return; }
                    try {
                        const spin = await this.fetchSpinResult();
                        if (spin) {
                            clearInterval(probe);
                            console.log("🛡️ Safeguard caught spin during countdown end:", spin);
                            this.isCountdownActive = false;
                            this.handleActiveSpin({ roundActive: false, isSpinning: true, spinIndex: spin.spinIndex });
                        }
                    } catch (e) {
                        // ignore and keep probing
                    }
                }, 1000);
            }, earlyResumeMs);
            
            // Resume polling after countdown (existing flow)
            setTimeout(() => {
                this.onCountdownComplete();
            }, timeRemaining);
        } else {
            console.log("⏰ Round has expired, should trigger spin soon");
        }
    }

    /**
     * 🎰 Handle active spin
     */
    private handleActiveSpin(gameState: APIGameState): void {
        const { spinIndex } = gameState;
        
        if (spinIndex === undefined) {
            console.warn("⚠️ Spin active but no spin index provided");
            return;
        }

        console.log(`🎰 Active spin detected - Index: ${spinIndex} (caught by 5s polling)`);
        
        this.stopPolling();
        this.isSpinInProgress = true;
        this.lastCountdownEndTime = 0; // Reset countdown tracking since we found a spin
        this.events.onSpinTrigger(spinIndex);
        
        // Resume polling after estimated spin duration (frontend handles timing)
        setTimeout(() => {
            this.onSpinComplete();
        }, 18000); // 18 seconds to account for animation + buffer
    }

    /**
     * 💤 Handle idle state (no active round or spin) - SIMPLE APPROACH
     */
    private handleIdleState(): void {
        const lastSpinInfo = this.lastGameState?.lastSpinResult;
        const timeSinceCountdown = Date.now() - this.lastCountdownEndTime;
        
        // Give a brief grace period if countdown just ended (accept 5s delay vs cost)
        if (this.lastCountdownEndTime > 0 && timeSinceCountdown < 10000) {
            console.log(`⏳ Recent countdown (${Math.round(timeSinceCountdown/1000)}s ago) - continuing polling, may show spin within 5s`);
            
            // Just continue polling - if there's a spin, we'll catch it in next poll cycle
            if (!this.isPolling) {
                this.startPolling();
            }
            return;
        }
        
        console.log("💤 Confirmed idle state - showing no games banner", lastSpinInfo ? `with last spin: ${lastSpinInfo.spin_number}` : 'no last spin');
        this.stopPolling(); // Temporarily stop polling
        this.events.onNoGames(lastSpinInfo);
        
        // Resume polling after short delay to check for new rounds
        setTimeout(() => {
            if (!this.isPolling && !this.isCountdownActive && !this.isSpinInProgress) {
                this.startPolling();
            }
        }, 3000);
    }

    /**
     * ⏰ Handle countdown completion
     */
    private onCountdownComplete(): void {
        console.log("⏰ Countdown completed - waiting for spin");
        this.isCountdownActive = false;
        this.lastCountdownEndTime = Date.now(); // Track when countdown ended
        
        // Try to get spin result or resume polling
        this.handleCountdownCompleteFlow();
    }

    /**
     * 🔄 Handle the flow after countdown completes (SIMPLE & COST-EFFECTIVE)
     */
    private async handleCountdownCompleteFlow(): Promise<void> {
        try {
            console.log("🔄 Countdown complete - checking for immediate spin (simple approach)");
            
            // Quick check for immediate spin result
            const spinResult = await this.fetchSpinResult();
            if (spinResult) {
                console.log(`🎰 Immediate spin found: ${spinResult.spinIndex}`);
                this.isSpinInProgress = true;
                this.lastCountdownEndTime = 0; // Reset countdown tracking
                this.events.onSpinTrigger(spinResult.spinIndex);
                
                setTimeout(() => {
                    this.onSpinComplete();
                }, 18000);
                return;
            }
            
            // No immediate spin - just resume polling and let it catch the spin within 5s
            console.log("🔄 No immediate spin - resuming polling (will catch spin within 5s if available)");
            this.startPolling();
            
        } catch (error) {
            console.error("❌ Error in countdown complete flow:", error);
            console.log("🔄 Fallback: resuming polling");
            this.startPolling();
        }
    }

    /**
     * 🏁 Handle spin completion
     */
    private onSpinComplete(): void {
        console.log("🏁 Spin completed - starting idle countdown");
        this.isSpinInProgress = false;
        this.isInIdleCountdown = true;
        
        // Wait 10 seconds idle time before resuming polling
        setTimeout(() => {
            console.log("⏰ Idle countdown finished - resuming polling");
            this.isInIdleCountdown = false;
            this.events.onGameResumed();
            this.startPolling();
        }, 10000);
    }

    /**
     * ❌ Handle connection errors
     */
    private handleConnectionError(): void {
        this.connectionErrors++;
        console.error(`❌ Connection error #${this.connectionErrors}`);
        
        if (this.connectionErrors >= this.maxRetries) {
            console.error("💀 Max retries reached, showing error state");
            this.events.onConnectionError();
            this.stopPolling();
            
            // Try to reconnect after longer delay
            setTimeout(() => {
                console.log("🔄 Attempting to reconnect...");
                this.connectionErrors = 0;
                this.start();
            }, 10000);
        } else {
            // Exponential backoff
            const delay = Math.pow(2, this.connectionErrors) * 1000;
            console.log(`🔄 Retrying in ${delay}ms...`);
            
            setTimeout(() => {
                this.pollGameState();
            }, delay);
        }
    }

    /**
     * 🔍 Get current state info
     */
    public getStateInfo(): {
        isPolling: boolean;
        isCountdownActive: boolean;
        isSpinInProgress: boolean;
        isInIdleCountdown: boolean;
        connectionErrors: number;
        lastGameState: APIGameState | null;
        pollingInterval: number;
    } {
        return {
            isPolling: this.isPolling,
            isCountdownActive: this.isCountdownActive,
            isSpinInProgress: this.isSpinInProgress,
            isInIdleCountdown: this.isInIdleCountdown,
            connectionErrors: this.connectionErrors,
            lastGameState: this.lastGameState,
            pollingInterval: this.POLLING_INTERVAL
        };
    }

    /**
     * 🗑️ Cleanup method - MEMORY LEAK FIXED
     */
    public destroy(): void {
        console.log("🗑️ Starting GameCycleManager destruction...");
        
        // CRITICAL FIX: Set destroyed flag to prevent further operations
        this.isDestroyed = true;
        
        // Stop all polling and clear timers
        this.stop();
        
        // CRITICAL FIX: Force clear all state to prevent memory leaks
        this.isCountdownActive = false;
        this.isSpinInProgress = false;
        this.isInIdleCountdown = false;
        this.lastGameState = null;
        this.connectionErrors = 0;
        this.lastCountdownEndTime = 0;
        this.pollingLock = false;
        
        console.log("🗑️ GameCycleManager destroyed - All state cleared");
    }
} 