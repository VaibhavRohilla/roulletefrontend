import { Globals } from "../globals";

export interface GameCycleEvents {
    onRoundStart: (timeLeft: number) => void;
    onSpinTrigger: (spinIndex: number) => void;
    onNoGames: () => void;
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
     * 🔄 Start polling for game state
     */
    private startPolling(): void {
        if (this.isPolling) {
            console.warn("⚠️ Polling already active");
            return;
        }

        this.isPolling = true;
        console.log("🔄 Starting game state polling");

        this.pollingInterval = setInterval(async () => {
            await this.pollGameState();
        }, 5000); // Poll every second
    }

    /**
     * ⏹️ Stop polling
     */
    private stopPolling(): void {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
        this.isPolling = false;
        console.log("⏹️ Polling stopped");
    }

    /**
     * 📊 Poll game state and handle response
     */
    private async pollGameState(): Promise<void> {
        // Only poll when appropriate (not during countdown or spin)
        if (this.shouldSkipPolling()) {
            return;
        }

        try {
            const gameState = await this.fetchGameState();
            this.handleGameStateResponse(gameState);
            this.connectionErrors = 0; // Reset error count on success

            // Restore connection if it was previously lost
            if (this.connectionErrors > 0) {
                this.events.onConnectionRestored();
            }
        } catch (error) {
            this.handleConnectionError();
        }
    }

    /**
     * 🤔 Check if we should skip polling
     */
    private shouldSkipPolling(): boolean {
        return this.isCountdownActive || this.isSpinInProgress || this.isInIdleCountdown;
    }

    /**
     * 📨 Handle game state response from API
     */
    private handleGameStateResponse(gameState: APIGameState): void {
        console.log("📨 Game state received:", gameState);

        // Check for significant state changes
        const isNewState = !this.lastGameState || this.hasSignificantChange(this.lastGameState, gameState);
        this.lastGameState = gameState;

        if (!isNewState) {
            return; // No significant changes
        }

        if (gameState.roundActive && gameState.roundStartTime && gameState.roundDuration) {
            this.handleActiveRound(gameState);
        } else if (gameState.isSpinning && gameState.spinIndex !== undefined) {
            this.handleActiveSpin(gameState);
        } else {
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
            
            // Resume polling after countdown
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

        console.log(`🎰 Active spin detected - Index: ${spinIndex}`);
        
        this.stopPolling();
        this.isSpinInProgress = true;
        this.events.onSpinTrigger(spinIndex);
        
        // Resume polling after estimated spin duration (frontend handles timing)
        setTimeout(() => {
            this.onSpinComplete();
        }, 18000); // 18 seconds to account for animation + buffer
    }

    /**
     * 💤 Handle idle state (no active round or spin)
     */
    private handleIdleState(): void {
        console.log("💤 Idle state detected - showing no games banner");
        this.stopPolling(); // Temporarily stop polling
        this.events.onNoGames();
        
        // Resume polling after short delay
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
        
        // Try to get spin result or resume polling
        this.handleCountdownCompleteFlow();
    }

    /**
     * 🔄 Handle the flow after countdown completes
     */
    private async handleCountdownCompleteFlow(): Promise<void> {
        try {
            // Option 1: Try to get spin result immediately
            const spinResult = await this.fetchSpinResult();
            
            if (spinResult) {
                console.log(`🎰 Spin result available: ${spinResult.spinIndex}`);
                this.isSpinInProgress = true;
                this.events.onSpinTrigger(spinResult.spinIndex);
                
                setTimeout(() => {
                    this.onSpinComplete();
                }, 18000);
            } else {
                // Option 2: Resume polling to detect spin start
                console.log("🔄 No immediate spin result, resuming polling");
                this.startPolling();
            }
        } catch (error) {
            console.error("❌ Error in countdown complete flow:", error);
            this.startPolling(); // Fallback to polling
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
    } {
        return {
            isPolling: this.isPolling,
            isCountdownActive: this.isCountdownActive,
            isSpinInProgress: this.isSpinInProgress,
            isInIdleCountdown: this.isInIdleCountdown,
            connectionErrors: this.connectionErrors,
            lastGameState: this.lastGameState
        };
    }

    /**
     * 🗑️ Cleanup method
     */
    public destroy(): void {
        this.stop();
        console.log("🗑️ GameCycleManager destroyed");
    }
} 