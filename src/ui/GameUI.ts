import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { Globals } from "../globals";
import { config } from "../appconfig";
import { UI_CONFIG } from "../config/GameConfig";


export interface GameUIEvents {
    onCountdownComplete: () => void;
}

/**
 * 🎨 Game UI Manager
 * Handles all UI elements: countdown, time display, connection status
 */
export class GameUI {
    private container: Container;
    private events: GameUIEvents;
    
    // Time Display
    private timeDisplay!: Text;
    
    // Countdown System
    private countdownOverlay!: Container;
    private countdownBackground!: Graphics;
    private countdownText!: Text;
    private countdownValue: number = 0;
    private isCountdownActive: boolean = false;
    private countdownTween: any = null;
    
    // Connection Status
    private connectionStatusText!: Text;

    constructor(container: Container, events: GameUIEvents) {
        this.container = container;
        this.events = events;
        
        this.initializeUI();
        console.log("🎨 Game UI initialized");
    }

    /**
     * 🎨 Initialize all UI elements
     */
    private initializeUI(): void {
        this.createTimeDisplay();
        this.createCountdownOverlay();
        this.createConnectionStatus();
    }

    /**
     * 🕒 Create real-time dual timezone display
     */
    private createTimeDisplay(): void {
        const timeStyle = new TextStyle({
            fontFamily: UI_CONFIG.timeDisplay.fontFamily,
            fontSize: UI_CONFIG.timeDisplay.fontSize,
            fill: UI_CONFIG.timeDisplay.color,
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 400,
            leading: 8
        });

        this.timeDisplay = new Text(this.formatCurrentTime(), timeStyle);
        this.timeDisplay.anchor.set(0.5);
        this.timeDisplay.x = UI_CONFIG.timeDisplay.x;
        this.timeDisplay.y = UI_CONFIG.timeDisplay.y;
        this.container.addChild(this.timeDisplay);

        console.log("🕒 Time display created");
    }

    /**
     * 🕒 Format current time for Nepal (NPT) and India (IST) time zones
     */
    private formatCurrentTime(): string {
        const now = new Date();
        
        // Nepal Time (NPT - UTC+5:45)
        const nepalTime = new Date(now.getTime() + (5.75 * 60 * 60 * 1000) - (now.getTimezoneOffset() * 60 * 1000));
        const nepalFormatted = this.formatTime12Hour(nepalTime);
        
        // Indian Standard Time (IST - UTC+5:30)
        const indiaTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000) - (now.getTimezoneOffset() * 60 * 1000));
        const indiaFormatted = this.formatTime12Hour(indiaTime);
        
        return `NPT: ${nepalFormatted} \\ IST: ${indiaFormatted}`;
    }

    /**
     * 🕒 Helper function to format time in 12-hour format
     */
    private formatTime12Hour(date: Date): string {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'AM' : 'PM';
        
        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // Hour '0' should be '12'
        
        const displayHours = hours.toString().padStart(2, '0');
        return `${displayHours}:${minutes} ${ampm}`;
    }

    /**
     * ⏳ Create countdown overlay with modern styling
     */
    private createCountdownOverlay(): void {
        this.countdownOverlay = new Container();

        // Full screen overlay background
        const overlay = new Graphics();
        overlay.rect(-config.logicalWidth, -config.logicalHeight, config.logicalWidth*10, config.logicalHeight*10);
        overlay.fill({color: UI_CONFIG.countdown.overlayColor, alpha: UI_CONFIG.countdown.overlayAlpha});
        this.countdownOverlay.addChild(overlay);

        // Center countdown container
        const centerX = config.logicalWidth / 2;
        const centerY = config.logicalHeight / 2;

        // Modern styled background with border and shadow
        this.countdownBackground = new Graphics();
        this.drawCountdownBackground();
        this.countdownBackground.x = centerX - UI_CONFIG.countdown.containerWidth / 2;
        this.countdownBackground.y = centerY - UI_CONFIG.countdown.containerHeight / 2;
        this.countdownOverlay.addChild(this.countdownBackground);

        // Countdown text with modern styling
        const textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: UI_CONFIG.countdown.fontSize,
            fill: UI_CONFIG.countdown.textColor,
            align: 'center',
            fontWeight: 'bold',
            stroke: { color: UI_CONFIG.countdown.shadowColor, width: 2 },
            dropShadow: {
                color: UI_CONFIG.countdown.shadowColor,
                blur: 4,
                angle: Math.PI / 2,
                distance: 2
            }
        });

        this.countdownText = new Text('0', textStyle);
        this.countdownText.anchor.set(0.5);
        this.countdownText.x = centerX;
        this.countdownText.y = centerY;
        this.countdownOverlay.addChild(this.countdownText);

        // Initially hidden
        this.countdownOverlay.visible = false;
        this.container.addChild(this.countdownOverlay);

        console.log("⏳ Countdown overlay created");
    }

    /**
     * 🎨 Draw modern countdown background with glassmorphism effect
     */
    private drawCountdownBackground(): void {
        const countdownConfig = UI_CONFIG.countdown;
        const currentBorderColor = (this.countdownBackground as any).currentBorderColor || countdownConfig.borderColor;
        
        this.countdownBackground.clear();

        // Drop shadow
        this.countdownBackground.roundRect(4, 4, countdownConfig.containerWidth, countdownConfig.containerHeight, countdownConfig.borderRadius);
        this.countdownBackground.fill({color: 0x000000, alpha: 0.7});

        // Main background with glassmorphism
        this.countdownBackground.fill({color: countdownConfig.backgroundColor, alpha: 0.9});
        this.countdownBackground.roundRect(0, 0, countdownConfig.containerWidth, countdownConfig.containerHeight, countdownConfig.borderRadius);

        // Glowing border with dynamic color
        this.countdownBackground.lineStyle(countdownConfig.borderWidth, currentBorderColor, 1);
        this.countdownBackground.roundRect(0, 0, countdownConfig.containerWidth, countdownConfig.containerHeight, countdownConfig.borderRadius);

        // Inner glow effect with dynamic color
        this.countdownBackground.lineStyle(1, currentBorderColor, 0.3);
        this.countdownBackground.roundRect(2, 2, countdownConfig.containerWidth - 4, countdownConfig.containerHeight - 4, countdownConfig.borderRadius - 2);
    }

    /**
     * 📡 Create connection status display
     */
    private createConnectionStatus(): void {
        const statusStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xFFFFFF,
            align: 'left'
        });

        this.connectionStatusText = new Text('🟡 CONNECTING', statusStyle);
        this.connectionStatusText.x = 20;
        this.connectionStatusText.y = config.logicalHeight - 40;
        this.container.addChild(this.connectionStatusText);

        console.log("📡 Connection status display created");
    }

    /**
     * ⏳ Start countdown from specified seconds
     */
    public startCountdown(seconds: number, onComplete?: () => void): void {
        if (seconds <= 0) {
            console.warn("⏳ Invalid countdown value:", seconds);
            return;
        }

        this.stopCountdown(); // Stop any existing countdown
        
        this.countdownValue = seconds;
        this.isCountdownActive = true;
        this.countdownOverlay.visible = true;
        this.countdownText.text = seconds.toString();

        console.log(`⏳ Starting countdown from ${seconds} seconds`);

        // Entrance animation
        this.countdownOverlay.alpha = 0;
        this.countdownOverlay.scale.set(0.8);
        
        Globals.gsap?.to(this.countdownOverlay, {
            alpha: 1,
            duration: 0.3,
            ease: "power2.out"
        });

        Globals.gsap?.to(this.countdownOverlay.scale, {
            x: 1,
            y: 1,
            duration: 0.4,
            ease: "back.out(1.7)"
        });

        // Start the countdown animation
        this.animateCountdown(() => {
            if (onComplete) onComplete();
            this.events.onCountdownComplete();
        });
    }

    /**
     * ⏹️ Stop active countdown
     */
    public stopCountdown(): void {
        if (!this.isCountdownActive) return;

        this.isCountdownActive = false;
        
        if (this.countdownTween) {
            this.countdownTween.kill();
            this.countdownTween = null;
        }

        // Exit animation
        Globals.gsap?.to(this.countdownOverlay, {
            alpha: 0,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
                this.countdownOverlay.visible = false;
                this.countdownOverlay.scale.set(1);
            }
        });

        console.log("⏹️ Countdown stopped");
    }

    /**
     * 🎬 Animate the countdown with smooth transitions and effects
     */
    private animateCountdown(onComplete?: () => void): void {
        if (!this.isCountdownActive) return;

        this.countdownTween = Globals.gsap?.to({ value: this.countdownValue }, {
            value: 0,
            duration: this.countdownValue,
            ease: "none",
            onUpdate: () => {
                if (!this.isCountdownActive) return;
                
                const currentValue = Math.ceil(this.countdownTween?.progress() ? 
                    this.countdownValue * (1 - this.countdownTween.progress()) : this.countdownValue);
                
                if (currentValue !== Number(this.countdownText.text)) {
                    this.countdownText.text = currentValue.toString();
                    
                    // Pulse effect on number change
                    this.animateNumberChange(currentValue);
                    
                    // Update border color based on urgency
                    this.updateCountdownUrgency(currentValue);
                }
            },
            onComplete: () => {
                if (!this.isCountdownActive) return;
                
                this.countdownText.text = "0";
                console.log("⏰ Countdown reached zero!");
                
                // Final flash effect
                this.animateFinalFlash(() => {
                    this.stopCountdown();
                    if (onComplete) onComplete();
                });
            }
        });
    }

    /**
     * 💥 Animate number change with pulse effect
     */
    private animateNumberChange(value: number): void {
        // Scale pulse animation
        this.countdownText.scale.set(1.2);
        Globals.gsap?.to(this.countdownText.scale, {
            x: 1,
            y: 1,
            duration: 0.3,
            ease: "back.out(2)"
        });

        // Color flash for urgency (last 3 seconds)
        if (value <= 3 && value > 0) {
            const originalColor = UI_CONFIG.countdown.textColor;
            this.countdownText.style.fill = 0xFF4444; // Red flash
            
            Globals.gsap?.to(this.countdownText.style, {
                fill: originalColor,
                duration: 0.4,
                ease: "power2.out"
            });
        }
    }

    /**
     * 🚨 Update visual urgency based on remaining time
     */
    private updateCountdownUrgency(value: number): void {
        // Update border color by redrawing background with urgency colors
        if (value <= 3) {
            (this.countdownBackground as any).currentBorderColor = 0xFF4444; // Red for last 3 seconds
        } else if (value <= 10) {
            (this.countdownBackground as any).currentBorderColor = 0xFF8844; // Orange for last 10 seconds
        } else {
            (this.countdownBackground as any).currentBorderColor = UI_CONFIG.countdown.borderColor; // Default blue
        }
        
        this.drawCountdownBackground();
    }

    /**
     * ⚡ Final flash animation when countdown reaches zero
     */
    private animateFinalFlash(onComplete: () => void): void {
        // Flash white text
        this.countdownText.style.fill = 0xFFFFFF;
        
        // Scale up dramatically
        Globals.gsap?.to(this.countdownText.scale, {
            x: 1.5,
            y: 1.5,
            duration: 0.2,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
            onComplete
        });
        
        // Flash the entire overlay
        Globals.gsap?.to(this.countdownOverlay, {
            alpha: 0.3,
            duration: 0.1,
            ease: "power2.out",
            yoyo: true,
            repeat: 3
        });
    }

    /**
     * 📡 Update connection status display
     */
    public updateConnectionStatus(status: string): void {
        const statusEmoji = {
            'CONNECTING': '🟡',
            'CONNECTED': '🟢',
            'DISCONNECTED': '🔴',
            'ERROR': '❌',
            'FAILED': '⚠️'
        }[status] || '❓';

        this.connectionStatusText.text = `${statusEmoji} ${status}`;
        
        // Update color based on status
        this.connectionStatusText.style.fill = {
            'CONNECTED': 0x00FF00,
            'CONNECTING': 0xFFFF00,
            'DISCONNECTED': 0xFF6666,
            'ERROR': 0xFF0000,
            'FAILED': 0xFFA500
        }[status] || 0xFFFFFF;

        console.log(`📡 Connection status updated: ${status}`);
    }

    /**
     * 🔍 Public state getters
     */
    public isCountdownRunning(): boolean {
        return this.isCountdownActive;
    }

    public getCountdownValue(): number {
        return this.countdownValue;
    }

    public getCountdownTimeRemaining(): number {
        if (!this.isCountdownActive || !this.countdownTween) return 0;
        
        const progress = this.countdownTween.progress() || 0;
        return Math.ceil(this.countdownValue * (1 - progress));
    }

    /**
     * 🔄 Update method (called from main loop)
     */
    public update(_dt: number): void {
        // Update real-time clock display
        this.timeDisplay.text = this.formatCurrentTime();
    }

    /**
     * 🗑️ Cleanup method
     */
    public destroy(): void {
        this.stopCountdown();
        
        // Remove all UI elements
        if (this.timeDisplay) this.container.removeChild(this.timeDisplay);
        if (this.countdownOverlay) this.container.removeChild(this.countdownOverlay);
        if (this.connectionStatusText) this.container.removeChild(this.connectionStatusText);
        
        console.log("🎨 Game UI destroyed");
    }
} 