import { GameCycleManager } from "./GameCycleManager";

export interface GameNetworkEvents {
    onConnected: () => void;
    onDisconnected: () => void;
    onError: (error: any) => void;
    onRoundStart: (timeLeft: number) => void;
    onServerSpin: (spinIndex: number) => void;
    onNoGames: () => void;
    onGameResumed: () => void;
}

/**
 * 🌐 Game Network Manager - API-Driven Version
 * Handles API-based game communication replacing WebSocket with HTTP polling
 */
export class GameNetworkManager {
    private events: GameNetworkEvents;
    private gameCycleManager: GameCycleManager;
    private isAPIConnected: boolean = false;

    constructor(events: GameNetworkEvents) {
        this.events = events;
        
        // Create GameCycleManager with event mapping
        this.gameCycleManager = new GameCycleManager({
            onRoundStart: (timeLeft: number) => this.handleRoundStart(timeLeft),
            onSpinTrigger: (spinIndex: number) => this.handleSpinTrigger(spinIndex),
            onNoGames: () => this.handleNoGames(),
            onGameResumed: () => this.handleGameResumed(),
            onConnectionError: () => this.handleConnectionError(),
            onConnectionRestored: () => this.handleConnectionRestored()
        });
        
        console.log("🌐 Game network manager initialized with API polling");
    }

    /**
     * 📡 Connect to the game server using API polling
     */
    public async connectToServer(): Promise<void> {
        try {
            console.log("📡 Connecting to API-driven game server...");
            await this.gameCycleManager.start();
            
            this.isAPIConnected = true;
            console.log('🟢 Connected to API game server! Now using polling-based game flow.');
            this.events.onConnected();
            
        } catch (error) {
            console.error('❌ Failed to connect to API game server:', error);
            console.log('🎮 API connection failed. Manual controls remain available.');
            this.events.onError(error);
        }
    }

    /**
     * 🔌 Disconnect from the game server
     */
    public disconnect(): void {
        console.log("🔌 Disconnecting from API game server...");
        this.gameCycleManager.stop();
        this.isAPIConnected = false;
        this.events.onDisconnected();
    }

    /**
     * 🎯 Handle round start from API
     */
    private handleRoundStart(timeLeft: number): void {
        console.log(`🎯 API Round started! ${timeLeft}s remaining`);
        this.events.onRoundStart(timeLeft);
    }

    /**
     * 🎰 Handle spin trigger from API
     */
    private handleSpinTrigger(spinIndex: number): void {
        console.log(`🎰 API Spin triggered! Index: ${spinIndex}`);
        this.events.onServerSpin(spinIndex);
    }

    /**
     * 💤 Handle no games state
     */
    private handleNoGames(): void {
        console.log('💤 No active games detected via API');
        this.events.onNoGames();
    }

    /**
     * ▶️ Handle game resumed state
     */
    private handleGameResumed(): void {
        console.log('▶️ Game resumed via API');
        this.events.onGameResumed();
    }

    /**
     * ❌ Handle connection error
     */
    private handleConnectionError(): void {
        console.error('❌ API connection error detected');
        this.isAPIConnected = false;
        this.events.onError(new Error('API connection lost'));
    }

    /**
     * ✅ Handle connection restored
     */
    private handleConnectionRestored(): void {
        console.log('✅ API connection restored');
        this.isAPIConnected = true;
        this.events.onConnected();
    }

    /**
     * 🔍 Check if connected to server
     */
    public isConnected(): boolean {
        return this.isAPIConnected;
    }

    /**
     * 📊 Get connection state info
     */
    public getConnectionInfo(): {
        isConnected: boolean;
        gameCycleState: any;
    } {
        return {
            isConnected: this.isAPIConnected,
            gameCycleState: this.gameCycleManager.getStateInfo()
        };
    }

    /**
     * 🔄 Force refresh game state
     */
    public async refreshGameState(): Promise<void> {
        if (this.isAPIConnected) {
            console.log("🔄 Force refreshing game state...");
            await this.gameCycleManager.stop();
            await this.gameCycleManager.start();
        }
    }

    /**
     * 🗑️ Cleanup method
     */
    public destroy(): void {
        console.log("🗑️ Destroying game network manager");
        this.gameCycleManager.destroy();
        this.isAPIConnected = false;
    }
} 