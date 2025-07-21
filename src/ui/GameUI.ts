import { Container, Graphics, Text, TextStyle ,HTMLText, HTMLTextStyle} from "pixi.js";
import { Globals } from "../globals";
import { config } from "../appconfig";
import { getRouletteProperties, UI_CONFIG } from "../config/GameConfig";


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
    
    // No Games Banner
    private noGamesBanner!: Container;
    private noGamesBannerBackground!: Graphics;
    private noGamesBannerText!: Text;
    private bannerVisible: boolean = false;

    // Winning Banner
    private winningBanner!: Container;
    private winningBannerBackground!: Graphics;
    private winningBannerText!: HTMLText;
    private winningBannerVisible: boolean = false;

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
        this.createNoGamesBanner();
        this.createWinningBanner();
    }

    /**
     * 🕒 Create elegant casino-style dual timezone display
     */
    private createTimeDisplay(): void {
        // Create sophisticated time display container
        const timeContainer = new Container();
        
        // Elegant casino-style background for time display
        const timeBackground = new Graphics();
        this.drawTimeDisplayBackground(timeBackground);
        timeContainer.addChild(timeBackground);

        // Premium typography with casino elegance
        const timeStyle = new TextStyle({
            fontFamily: '"Times New Roman", "Georgia", serif', // Elegant serif font
            fontSize: 20, // Slightly larger for prominence
            fontWeight: 'bold',
            fill: '#FFD700', // Luxurious gold
            align: 'center',
            stroke: { color: '#000000', width: 1.5 }, // Subtle black outline
            dropShadow: {
                color: '#000000',
                blur: 4,
                angle: Math.PI / 4,
                distance: 2
            },
            letterSpacing: 1, // Elegant spacing
            wordWrap: true,
            wordWrapWidth: 400,
            leading: 6
        });

        this.timeDisplay = new Text(this.formatCurrentTime(), timeStyle);
        this.timeDisplay.anchor.set(0.5);
        
        // Position relative to background center
        const bgWidth = 380;
        const bgHeight = 50;
        this.timeDisplay.x = bgWidth / 2;
        this.timeDisplay.y = bgHeight / 2;
        timeContainer.addChild(this.timeDisplay);

        // Position the entire time container
        timeContainer.x = UI_CONFIG.timeDisplay.x - bgWidth / 2;
        timeContainer.y = UI_CONFIG.timeDisplay.y - bgHeight / 2;
        
        this.container.addChild(timeContainer);

        console.log("🕒 Elegant casino time display created");
    }

    /**
     * 🎨 Draw sophisticated background for time display
     */
    private drawTimeDisplayBackground(graphics: Graphics): void {
        const width = 380;
        const height = 50;
        const radius = 8;

        graphics.clear();

        // Subtle drop shadow
        graphics.roundRect(3, 3, width, height, radius);
        graphics.fill({ color: 0x000000, alpha: 0.4 });

        // Main casino green background with gradient effect
        graphics.roundRect(0, 0, width, height, radius);
        graphics.fill({color: 0x0D4F3C, alpha: 0.8}); // Semi-transparent casino green

        // Inner highlight for depth
        graphics.roundRect(2, 2, width - 4, height / 3, radius - 1);
        graphics.fill({color: 0x1A6B4F, alpha: 0.4}); // Lighter green

        // Elegant golden border
        graphics.lineStyle(2, 0xFFD700, 0.8); // Gold border
        graphics.roundRect(0, 0, width, height, radius);

        // Subtle inner accent
        graphics.lineStyle(1, 0xFFD700, 0.4);
        graphics.roundRect(2, 2, width - 4, height - 4, radius - 1);

        // Add decorative corner details
        this.drawTimeDisplayCorners(graphics, width, height);
    }

    /**
     * ✨ Add elegant corner decorations for time display
     */
    private drawTimeDisplayCorners(graphics: Graphics, width: number, height: number): void {
        const accentSize = 8;
        const color = 0xFFD700;
        
        // Delicate corner accents
        graphics.lineStyle(1, color, 0.6);
        
        // Top-left
        graphics.moveTo(6, 6);
        graphics.lineTo(6 + accentSize, 6);
        graphics.moveTo(6, 6);
        graphics.lineTo(6, 6 + accentSize);

        // Top-right
        graphics.moveTo(width - 6, 6);
        graphics.lineTo(width - 6 - accentSize, 6);
        graphics.moveTo(width - 6, 6);
        graphics.lineTo(width - 6, 6 + accentSize);

        // Bottom-left
        graphics.moveTo(6, height - 6);
        graphics.lineTo(6 + accentSize, height - 6);
        graphics.moveTo(6, height - 6);
        graphics.lineTo(6, height - 6 - accentSize);

        // Bottom-right
        graphics.moveTo(width - 6, height - 6);
        graphics.lineTo(width - 6 - accentSize, height - 6);
        graphics.moveTo(width - 6, height - 6);
        graphics.lineTo(width - 6, height - 6 - accentSize);
    }

/**
 * 🕒 Format current time with elegant casino styling for Nepal (NPT) and India (IST)
 */
private formatCurrentTime(): string {
    const now = new Date();

    const indiaFormatter = new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
    });

    const bhutanFormatter = new Intl.DateTimeFormat('en-NP', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Thimphu'
    });
    

    const indiaFormatted = indiaFormatter.format(now).replace(/am|pm/gi, (match) => match.toUpperCase());
    const nepalFormatted = bhutanFormatter.format(now).replace(/am|pm/gi, (match) => match.toUpperCase());

    return `NPT: ${nepalFormatted}  •  IST: ${indiaFormatted}`;
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

        // Casino-style countdown text with elegant typography
        const textStyle = new TextStyle({
            fontFamily: '"Times New Roman", "Georgia", serif', // Elegant serif font
            fontSize: UI_CONFIG.countdown.fontSize + 8, // Slightly larger
            fontWeight: 'bold',
            fill: '#FFD700', // Luxurious gold
            align: 'center',
            stroke: { color: '#000000', width: 3 }, // Bold black outline
            dropShadow: {
                color: '#000000',
                blur: 8,
                angle: Math.PI / 4,
                distance: 4
            },
            letterSpacing: 3 // Spaced out for elegance
        });

        this.countdownText = new Text('0', textStyle);
        this.countdownText.anchor.set(0.5);
        this.countdownText.x = centerX;
        this.countdownText.y = centerY+ this.countdownText.height/4;
        this.countdownOverlay.addChild(this.countdownText);

        // Add elegant subtitle for countdown
        const subtitleStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 18,
            fill: '#CCCCCC',
            align: 'center',
            fontStyle: 'italic',
            letterSpacing: 1
        });

        const subtitleText = new Text('Next Round Begins In', subtitleStyle);
        subtitleText.anchor.set(0.5);
        subtitleText.x = centerX;
        subtitleText.y = centerY - subtitleText.height*1.9;
        this.countdownOverlay.addChild(subtitleText);

        // Set pivot point to center for proper scaling animations
        this.countdownOverlay.pivot.set(centerX, centerY);
        this.countdownOverlay.position.set(centerX, centerY);

        // Initially hidden
        this.countdownOverlay.visible = false;
        this.container.addChild(this.countdownOverlay);

        console.log("⏳ Countdown overlay created");
    }

    /**
     * 🎨 Draw elegant casino-style countdown background
     */
    private drawCountdownBackground(): void {
        const countdownConfig = UI_CONFIG.countdown;
        const currentBorderColor = (this.countdownBackground as any).currentBorderColor || 0xFFD700; // Gold default
        
        this.countdownBackground.clear();

        // Luxurious drop shadow
        this.countdownBackground.roundRect(6, 6, countdownConfig.containerWidth, countdownConfig.containerHeight, countdownConfig.borderRadius);
        this.countdownBackground.fill({color: 0x000000, alpha: 0.8});

        // Main casino green background with gradient effect
        this.countdownBackground.roundRect(0, 0, countdownConfig.containerWidth, countdownConfig.containerHeight, countdownConfig.borderRadius);
        this.countdownBackground.fill({color: 0x0D4F3C, alpha: 0.95}); // Deep casino green

        // Inner gradient highlight for depth
        this.countdownBackground.roundRect(4, 4, countdownConfig.containerWidth - 8, countdownConfig.containerHeight / 3, countdownConfig.borderRadius - 4);
        this.countdownBackground.fill({color: 0x1A6B4F, alpha: 0.6}); // Lighter green

        // Elegant golden border with glow effect
        this.countdownBackground.lineStyle(4, currentBorderColor, 1);
        this.countdownBackground.roundRect(0, 0, countdownConfig.containerWidth, countdownConfig.containerHeight, countdownConfig.borderRadius);

        // Inner golden accent line
        this.countdownBackground.lineStyle(1, currentBorderColor, 0.7);
        this.countdownBackground.roundRect(6, 6, countdownConfig.containerWidth - 12, countdownConfig.containerHeight - 12, countdownConfig.borderRadius - 6);

        // Add casino-style corner decorations
        this.drawCountdownCornerDecorations(countdownConfig.containerWidth, countdownConfig.containerHeight, currentBorderColor);
    }

    /**
     * ✨ Add elegant corner decorations to countdown
     */
    private drawCountdownCornerDecorations(width: number, height: number, color: number): void {
        const accentSize = 15;
        
        // Casino-style corner accents
        this.countdownBackground.lineStyle(2, color, 0.9);
        
        // Top corners
        this.countdownBackground.moveTo(15, 15);
        this.countdownBackground.lineTo(15 + accentSize, 15);
        this.countdownBackground.moveTo(15, 15);
        this.countdownBackground.lineTo(15, 15 + accentSize);

        this.countdownBackground.moveTo(width - 15, 15);
        this.countdownBackground.lineTo(width - 15 - accentSize, 15);
        this.countdownBackground.moveTo(width - 15, 15);
        this.countdownBackground.lineTo(width - 15, 15 + accentSize);

        // Bottom corners
        this.countdownBackground.moveTo(15, height - 15);
        this.countdownBackground.lineTo(15 + accentSize, height - 15);
        this.countdownBackground.moveTo(15, height - 15);
        this.countdownBackground.lineTo(15, height - 15 - accentSize);

        this.countdownBackground.moveTo(width - 15, height - 15);
        this.countdownBackground.lineTo(width - 15 - accentSize, height - 15);
        this.countdownBackground.moveTo(width - 15, height - 15);
        this.countdownBackground.lineTo(width - 15, height - 15 - accentSize);
    }

    /**
     * 📡 Create elegant casino-style connection status display
     */
    private createConnectionStatus(): void {
        // Create sophisticated connection status container
        const statusContainer = new Container();
        
        // Elegant background for connection status
        const statusBackground = new Graphics();
        this.drawConnectionStatusBackground(statusBackground);
        statusContainer.addChild(statusBackground);

        // Premium casino-style typography
        const statusStyle = new TextStyle({
            fontFamily: '"Times New Roman", "Georgia", serif', // Elegant serif font
            fontSize: 14,
            fontWeight: 'bold',
            fill: '#FFD700', // Luxurious gold
            align: 'left',
            stroke: { color: '#000000', width: 1 }, // Subtle outline
            dropShadow: {
                color: '#000000',
                blur: 3,
                angle: Math.PI / 4,
                distance: 1
            },
            letterSpacing: 0.5
        });

        this.connectionStatusText = new Text('🟡 CONNECTING', statusStyle);
        this.connectionStatusText.anchor.set(0, 0.5);
        this.connectionStatusText.x = 15; // Padding from background edge
        this.connectionStatusText.y = 20; // Center vertically in background
        statusContainer.addChild(this.connectionStatusText);

        // Position the status container
        statusContainer.x = 20;
        statusContainer.y = config.logicalHeight - 50;
        this.container.addChild(statusContainer);

        console.log("📡 Elegant casino connection status created");
    }

    /**
     * 🎨 Draw sophisticated background for connection status
     */
    private drawConnectionStatusBackground(graphics: Graphics): void {
        const width = 180;
        const height = 40;
        const radius = 6;

        graphics.clear();

        // Subtle drop shadow
        graphics.roundRect(2, 2, width, height, radius);
        graphics.fill({ color: 0x000000, alpha: 0.3 });

        // Main casino green background
        graphics.roundRect(0, 0, width, height, radius);
        graphics.fill({color: 0x0D4F3C, alpha: 0.7}); // Semi-transparent casino green

        // Inner highlight
        graphics.roundRect(2, 2, width - 4, height / 3, radius - 1);
        graphics.fill({color: 0x1A6B4F, alpha: 0.3}); // Lighter green

        // Elegant golden border
        graphics.lineStyle(1.5, 0xFFD700, 0.7); // Gold border
        graphics.roundRect(0, 0, width, height, radius);

        // Add small corner accents
        this.drawConnectionStatusCorners(graphics, width, height);
    }

    /**
     * ✨ Add delicate corner decorations for connection status
     */
    private drawConnectionStatusCorners(graphics: Graphics, width: number, height: number): void {
        const accentSize = 6;
        const color = 0xFFD700;
        
        // Subtle corner accents
        graphics.lineStyle(1, color, 0.5);
        
        // Top-left and bottom-right corners only for subtle elegance
        graphics.moveTo(4, 4);
        graphics.lineTo(4 + accentSize, 4);
        graphics.moveTo(4, 4);
        graphics.lineTo(4, 4 + accentSize);

        graphics.moveTo(width - 4, height - 4);
        graphics.lineTo(width - 4 - accentSize, height - 4);
        graphics.moveTo(width - 4, height - 4);
        graphics.lineTo(width - 4, height - 4 - accentSize);
    }

    /**
     * 🚫 Create "No Current Games" banner with elegant casino styling and overlay
     */
    private createNoGamesBanner(): void {
        this.noGamesBanner = new Container();

        // Full screen overlay background (like countdown)
        const overlay = new Graphics();
        overlay.rect(-config.logicalWidth, -config.logicalHeight, config.logicalWidth*10, config.logicalHeight*10);
        overlay.fill({color: 0x000000, alpha: 0.6}); // Slightly lighter than countdown overlay
        overlay.interactive = true;
        this.noGamesBanner.addChild(overlay);

        // Center position
        const centerX = config.logicalWidth / 2;
        const centerY = config.logicalHeight / 2; // Center of screen

        // Banner dimensions
        const bannerWidth = 500;
        const bannerHeight = 120;

        // Elegant banner background with casino theme
        this.noGamesBannerBackground = new Graphics();
        this.drawNoGamesBannerBackground(bannerWidth, bannerHeight);
        this.noGamesBannerBackground.x = centerX - bannerWidth / 2;
        this.noGamesBannerBackground.y = centerY - bannerHeight / 2;
        this.noGamesBanner.addChild(this.noGamesBannerBackground);

        // Casino-style text with elegant typography
        const bannerTextStyle = new TextStyle({
            fontFamily: '"Times New Roman", "Georgia", serif',
            fontSize: 28,
            fontWeight: 'bold',
            fill: '#FFD700', // Gold color for casino elegance
            align: 'center',
            stroke: { color: '#000000', width: 2 },
            dropShadow: {
                color: '#000000',
                blur: 6,
                angle: Math.PI / 4,
                distance: 3
            },
            letterSpacing: 2
        });

        this.noGamesBannerText = new Text('🎰 NO CURRENT GAMES 🎰', bannerTextStyle);
        this.noGamesBannerText.anchor.set(0.5);
        this.noGamesBannerText.x = centerX;
        this.noGamesBannerText.y = centerY - 10;
        this.noGamesBanner.addChild(this.noGamesBannerText);

        // Secondary message
        const subTextStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 16,
            fill: '#CCCCCC',
            align: 'center',
            fontStyle: 'italic'
        });

        const subText = new Text('Please wait for the next round to begin', subTextStyle);
        subText.anchor.set(0.5);
        subText.x = centerX;
        subText.y = centerY + 30; 
        this.noGamesBanner.addChild(subText);

        // Set pivot point to center for proper scaling animations
        this.noGamesBanner.pivot.set(centerX, centerY);
        this.noGamesBanner.position.set(centerX, centerY);

        // Initially hidden
        this.noGamesBanner.visible = false;
        this.container.addChild(this.noGamesBanner);

        console.log("🚫 No Games banner with overlay created");
    }

    /**
     * 🏆 Create winning number banner with celebration animation
     */
    private createWinningBanner(): void {
        this.winningBanner = new Container();

        // Full screen overlay background (lighter than countdown for celebratory feel)
        const overlay = new Graphics();
        overlay.rect(-config.logicalWidth, -config.logicalHeight, config.logicalWidth*10, config.logicalHeight*10);
        overlay.fill({color: 0x000000, alpha: 0.5}); // Lighter overlay for celebration
        overlay.interactive = true;
        this.winningBanner.addChild(overlay);

        // Center position
        const centerX = config.logicalWidth / 2;
        const centerY = config.logicalHeight / 2;

        // Banner dimensions (larger for celebration)
        const bannerWidth = 600;
        const bannerHeight = 150;

        // Celebration banner background
        this.winningBannerBackground = new Graphics();
        this.drawWinningBannerBackground(bannerWidth, bannerHeight);
        this.winningBannerBackground.x = centerX - bannerWidth / 2;
        this.winningBannerBackground.y = centerY - bannerHeight / 2;
        this.winningBanner.addChild(this.winningBannerBackground);

        // Casino-style celebration text
        const bannerTextStyle = new HTMLTextStyle({
            fontFamily: '"Times New Roman", "Georgia", serif',
            fontSize: 36,
            fontWeight: 'bold',
            fill: '#FFD700', // Golden celebration color
            align: 'center',
            stroke: { color: '#000000', width: 3 },
            dropShadow: {
                color: '#FFD700',
                blur: 10,
                angle: Math.PI / 4,
                distance: 4,
                alpha: 0.6
            },
            letterSpacing: 3
        });

        this.winningBannerText = new HTMLText('🏆 WINNER: 0 🏆', bannerTextStyle);
        this.winningBannerText.anchor.set(0.5);
        this.winningBannerText.x = centerX;
        this.winningBannerText.y = centerY - 15;
        this.winningBanner.addChild(this.winningBannerText);

        // Secondary celebration message
        const subTextStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 18,
            fill: '#FFFFFF',
            align: 'center',
            fontStyle: 'italic',
            stroke: { color: '#000000', width: 1 }
        });

        const subText = new Text('Congratulations! Get ready for the next round!', subTextStyle);
        subText.anchor.set(0.5);
        subText.x = centerX;
        subText.y = centerY + 35; 
        this.winningBanner.addChild(subText);

        // Set pivot point to center for proper scaling animations
        this.winningBanner.pivot.set(centerX, centerY);
        this.winningBanner.position.set(centerX, centerY*1.5);

        // Initially hidden
        this.winningBanner.visible = false;
        this.container.addChild(this.winningBanner);

        console.log("🏆 Winning banner with celebration overlay created");
    }

    /**
     * 🎨 Draw elegant casino-style banner background
     */
    private drawNoGamesBannerBackground(width: number, height: number): void {
        this.noGamesBannerBackground.clear();

        // Drop shadow
        this.noGamesBannerBackground.roundRect(4, 4, width, height, 15);
        this.noGamesBannerBackground.fill({ color: 0x000000, alpha: 0.6 });

        // Main background with casino green gradient effect
        this.noGamesBannerBackground.roundRect(0, 0, width, height, 15);
        this.noGamesBannerBackground.fill({color: 0x0D4F3C, alpha: 0.7}); // Dark casino green

        // Inner gradient highlight
        this.noGamesBannerBackground.roundRect(2, 2, width - 4, height / 3, 13);
        this.noGamesBannerBackground.fill({color: 0x1A6B4F, alpha: 0.7}); // Lighter green

        // Golden border with casino elegance
        this.noGamesBannerBackground.lineStyle(3, 0xFFD700, 1); // Gold border
        this.noGamesBannerBackground.roundRect(0, 0, width, height, 15);

        // Inner golden accent
        this.noGamesBannerBackground.lineStyle(1, 0xFFD700, 0.6);
        this.noGamesBannerBackground.roundRect(4, 4, width - 8, height - 8, 11);

        // Decorative corner accents
        this.drawCornerAccents(width, height);
    }

    /**
     * ✨ Add decorative corner accents for premium feel
     */
    private drawCornerAccents(width: number, height: number): void {
        const accentSize = 20;
        const color = 0xFFD700;
        
        // Top-left corner
        this.noGamesBannerBackground.lineStyle(2, color, 0.8);
        this.noGamesBannerBackground.moveTo(10, 10);
        this.noGamesBannerBackground.lineTo(10 + accentSize, 10);
        this.noGamesBannerBackground.moveTo(10, 10);
        this.noGamesBannerBackground.lineTo(10, 10 + accentSize);

        // Top-right corner
        this.noGamesBannerBackground.moveTo(width - 10, 10);
        this.noGamesBannerBackground.lineTo(width - 10 - accentSize, 10);
        this.noGamesBannerBackground.moveTo(width - 10, 10);
        this.noGamesBannerBackground.lineTo(width - 10, 10 + accentSize);

        // Bottom-left corner
        this.noGamesBannerBackground.moveTo(10, height - 10);
        this.noGamesBannerBackground.lineTo(10 + accentSize, height - 10);
        this.noGamesBannerBackground.moveTo(10, height - 10);
        this.noGamesBannerBackground.lineTo(10, height - 10 - accentSize);

        // Bottom-right corner
        this.noGamesBannerBackground.moveTo(width - 10, height - 10);
        this.noGamesBannerBackground.lineTo(width - 10 - accentSize, height - 10);
        this.noGamesBannerBackground.moveTo(width - 10, height - 10);
        this.noGamesBannerBackground.lineTo(width - 10, height - 10 - accentSize);
    }

    /**
     * 🏆 Draw elegant background for winning banner with celebration effects
     */
    private drawWinningBannerBackground(width: number, height: number): void {
        this.winningBannerBackground.clear();

        // Drop shadow for depth
        this.winningBannerBackground.roundRect(4, 4, width, height, 15);
        this.winningBannerBackground.fill({ color: 0x000000, alpha: 0.7 });

        // Main celebration background with golden gradient effect
        this.winningBannerBackground.roundRect(0, 0, width, height, 15);
        this.winningBannerBackground.fill({color: 0x8B4513, alpha: 1}); // Rich brown/bronze base

        // Inner gradient highlight for celebration glow
        this.winningBannerBackground.roundRect(2, 2, width - 4, height / 3, 13);
        this.winningBannerBackground.fill({color: 0xFFD700, alpha: 0.3}); // Golden highlight

        // Celebration golden border
        this.winningBannerBackground.lineStyle(4, 0xFFD700, 1); // Thicker gold border for celebration
        this.winningBannerBackground.roundRect(0, 0, width, height, 15);

        // Inner celebration accent
        this.winningBannerBackground.lineStyle(2, 0xFFD700, 0.8);
        this.winningBannerBackground.roundRect(4, 4, width - 8, height - 8, 11);

        // Decorative celebration corner accents
        this.drawWinningCornerAccents(width, height);
    }

    /**
     * ✨ Add decorative corner accents for celebration banner
     */
    private drawWinningCornerAccents(width: number, height: number): void {
        const accentSize = 25; // Larger for celebration
        const color = 0xFFD700;
        
        // Top-left corner
        this.winningBannerBackground.lineStyle(3, color, 1);
        this.winningBannerBackground.moveTo(15, 15);
        this.winningBannerBackground.lineTo(15 + accentSize, 15);
        this.winningBannerBackground.moveTo(15, 15);
        this.winningBannerBackground.lineTo(15, 15 + accentSize);

        // Top-right corner
        this.winningBannerBackground.moveTo(width - 15, 15);
        this.winningBannerBackground.lineTo(width - 15 - accentSize, 15);
        this.winningBannerBackground.moveTo(width - 15, 15);
        this.winningBannerBackground.lineTo(width - 15, 15 + accentSize);

        // Bottom-left corner
        this.winningBannerBackground.moveTo(15, height - 15);
        this.winningBannerBackground.lineTo(15 + accentSize, height - 15);
        this.winningBannerBackground.moveTo(15, height - 15);
        this.winningBannerBackground.lineTo(15, height - 15 - accentSize);

        // Bottom-right corner
        this.winningBannerBackground.moveTo(width - 15, height - 15);
        this.winningBannerBackground.lineTo(width - 15 - accentSize, height - 15);
        this.winningBannerBackground.moveTo(width - 15, height - 15);
        this.winningBannerBackground.lineTo(width - 15, height - 15 - accentSize);

        // Additional celebration decorations - diamond shapes in corners
        const diamondSize = 8;
        // Top corners diamonds
        this.winningBannerBackground.lineStyle(2, color, 0.8);
        this.winningBannerBackground.moveTo(25, 35);
        this.winningBannerBackground.lineTo(25 + diamondSize, 35 + diamondSize);
        this.winningBannerBackground.lineTo(25, 35 + diamondSize * 2);
        this.winningBannerBackground.lineTo(25 - diamondSize, 35 + diamondSize);
        this.winningBannerBackground.lineTo(25, 35);

        this.winningBannerBackground.moveTo(width - 25, 35);
        this.winningBannerBackground.lineTo(width - 25 + diamondSize, 35 + diamondSize);
        this.winningBannerBackground.lineTo(width - 25, 35 + diamondSize * 2);
        this.winningBannerBackground.lineTo(width - 25 - diamondSize, 35 + diamondSize);
        this.winningBannerBackground.lineTo(width - 25, 35);
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
        this.countdownOverlay.interactive = true;
        this.countdownText.text = seconds.toString();

        console.log(`⏳ Starting countdown from ${seconds} seconds`);

        // Entrance animation (with proper pivot centering)
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
                // Reset position (with proper pivot centering)
                const centerX = config.logicalWidth / 2;
                const centerY = config.logicalHeight / 2;
                this.countdownOverlay.position.set(centerX, centerY);
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
     * 💎 Animate number change with elegant casino-style effects
     */
    private animateNumberChange(value: number): void {
        // Elegant scale pulse with casino bounce
        this.countdownText.scale.set(1.3);
        Globals.gsap?.to(this.countdownText.scale, {
            x: 1,
            y: 1,
            duration: 0.4,
            ease: "elastic.out(1, 0.5)"
        });

        // Sophisticated color transitions for urgency
        if (value <= 3 && value > 0) {
            // Elegant red flash for final seconds
            const originalFill = '#FFD700';
            this.countdownText.style.fill = '#FF6B6B'; // Soft red
            
            Globals.gsap?.to(this.countdownText.style, {
                fill: originalFill,
                duration: 0.6,
                ease: "power3.out"
            });

            // Add slight rotation for drama
            this.countdownText.rotation = -0.1;
            Globals.gsap?.to(this.countdownText, {
                rotation: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        } else if (value <= 10 && value > 3) {
            // Subtle orange flash for warning
            const originalFill = '#FFD700';
            this.countdownText.style.fill = '#FFB347';
            
            Globals.gsap?.to(this.countdownText.style, {
                fill: originalFill,
                duration: 0.5,
                ease: "power2.out"
            });
        }

        // Add subtle glow effect for last few seconds
        if (value <= 5) {
            Globals.gsap?.to(this.countdownText, {
                alpha: 0.7,
                duration: 0.2,
                ease: "power2.inOut",
                yoyo: true,
                repeat: 1
            });
        }
    }

    /**
     * 🚨 Update visual urgency based on remaining time with casino theme
     */
    private updateCountdownUrgency(value: number): void {
        // Update border color with casino-appropriate urgency colors
        if (value <= 3) {
            (this.countdownBackground as any).currentBorderColor = 0xFF2D2D; // Elegant red for urgency
        } else if (value <= 10) {
            (this.countdownBackground as any).currentBorderColor = 0xFF8C42; // Warm orange for warning
        } else {
            (this.countdownBackground as any).currentBorderColor = 0xFFD700; // Luxurious gold default
        }
        
        this.drawCountdownBackground();

        // Add subtle pulsing effect for urgency
        if (value <= 5 && this.countdownBackground) {
            Globals.gsap?.to(this.countdownBackground, {
                alpha: 0.8,
                duration: 0.5,
                ease: "power2.inOut",
                yoyo: true,
                repeat: 1
            });
        }
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
     * 📡 Update connection status display with casino elegance
     */
    public updateConnectionStatus(status: string): void {
        const statusEmoji = {
            'CONNECTING': '🟡',
            'CONNECTED': '🟢',
            'DISCONNECTED': '🔴',
            'ERROR': '❌',
            'FAILED': '⚠️'
        }[status] || '❓';

        // Elegant status text formatting
        this.connectionStatusText.text = `${statusEmoji} ${status}`;
        
        // Update color with casino-appropriate styling
        this.connectionStatusText.style.fill = {
            'CONNECTED': '#00C851',    // Elegant green
            'CONNECTING': '#FFD700',   // Luxurious gold (consistent with theme)
            'DISCONNECTED': '#FF6B6B', // Soft red
            'ERROR': '#FF4444',        // Error red
            'FAILED': '#FFB347'        // Warm orange
        }[status] || '#FFD700'; // Default to gold

        // Add subtle glow effect for important status changes
        if (status === 'CONNECTED' || status === 'ERROR') {
            Globals.gsap?.to(this.connectionStatusText, {
                alpha: 0.7,
                duration: 0.3,
                ease: "power2.inOut",
                yoyo: true,
                repeat: 1
            });
        }

        console.log(`📡 Connection status updated: ${status}`);
    }

    /**
     * 🎰 Show "No Current Games" banner with elegant casino styling and last spin results
     */
    public async showNoGamesBanner(lastSpinResult?: {spin_number: number, color: string, parity: string, timestamp: string}): Promise<void> {
        if (this.bannerVisible) return;

        this.bannerVisible = true;
        this.noGamesBanner.visible = true;

        // Update banner with last spin result if provided, otherwise fetch from backend
        if (lastSpinResult) {
            this.updateBannerWithLastSpin(lastSpinResult);
        }

        // Elegant entrance animation
        this.noGamesBanner.alpha = 0;
        this.noGamesBanner.scale.set(0.7);
        
        Globals.gsap?.to(this.noGamesBanner, {
            alpha: 1,
            duration: 0.6,
            ease: "power3.out"
        });

        Globals.gsap?.to(this.noGamesBanner.scale, {
            x: 1,
            y: 1,
            duration: 0.8,
            ease: "elastic.out(1, 0.6)"
        });

        // Subtle floating animation (using position since we have pivot set)
        const originalY = config.logicalHeight / 2;
        Globals.gsap?.to(this.noGamesBanner.position, {
            y: originalY - 10,
            duration: 3,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1
        });

        console.log("🎰 No Games banner shown with last spin results");
    }

   


    /**
     * 🎯 Update banner with provided last spin result
     */
    private updateBannerWithLastSpin(lastSpinResult: {spin_number: number, color: string, parity: string, timestamp: string}): void {
        console.log(`🎯 Updating banner with last spin: ${lastSpinResult.spin_number} ${lastSpinResult.color} ${lastSpinResult.parity}`);
        
        // Remove any existing results display
        const existingResults = this.noGamesBanner.children.find(child => 
            (child as any).label === 'lastSpinResults'
        );
        if (existingResults) {
            this.noGamesBanner.removeChild(existingResults);
        }

        // Create elegant results display container for single result
        const resultsContainer = new Container();
        (resultsContainer as any).label = 'lastSpinResults';

        const centerX = this.noGamesBanner.position.x ;
        const centerY = this.noGamesBanner.position.y ;

        // Title for last result
        const titleStyle = new TextStyle({
            fontFamily: '"Times New Roman", "Georgia", serif',
            fontSize: 18,
            fontWeight: 'bold',
            fill: '#FFD700',
            align: 'center',
            stroke: { color: '#000000', width: 1 },
            letterSpacing: 1
        });

        const titleText = new Text('🎯 Last Spin Result', titleStyle);
        titleText.anchor.set(0.5);
        titleText.x = centerX;
        titleText.y = centerY +90;
        resultsContainer.addChild(titleText);

        // Display the last spin result
        const { spin_number, color, parity } = lastSpinResult;
        const colorHex = color === 'Red' ? 0xFF0000 : color === 'Black' ? 0x000000 : 0x00AA00;

        // Elegant circular background for the number
        const resultBg = new Graphics();
        resultBg.circle(0, 0, 25);
        resultBg.fill(colorHex);
        resultBg.circle(0, 0, 23);
        resultBg.fill({color: 0xFFFFFF, alpha: 0.1});
        
        
        resultBg.x = centerX;
        resultBg.y = titleText.y + titleText.height*2;
        resultsContainer.addChild(resultBg);

        // Number text
        const numberStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 16,
            fontWeight: 'bold',
            fill: color === 'Black' ? 0xFFFFFF : 0xFFFFFF,
            align: 'center',
            stroke: { color: '#000000', width: 1.5 }
        });

        const numberText = new Text(spin_number.toString(), numberStyle);
        numberText.anchor.set(0.5);
        numberText.x = resultBg.position.x;
        numberText.y = resultBg.position.y ;
        resultsContainer.addChild(numberText);

        // Status indicator below
        const colorEmoji = color === 'Red' ? '🔴' : color === 'Black' ? '⚫' : '🟢';
        const parityText = parity !== 'None' ? ` ${parity}` : '';
        
        const statusStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 12,
            fill: '#CCCCCC',
            align: 'center'
        });

        const statusText = new Text(`${colorEmoji}${parityText}`, statusStyle);
        statusText.anchor.set(0.5);
        statusText.x = numberText.x;
        statusText.y = numberText.y + numberText.height*2;
        resultsContainer.addChild(statusText);

        // Add with animation
        resultsContainer.alpha = 0;
        this.noGamesBanner.addChild(resultsContainer);

        Globals.gsap?.to(resultsContainer, {
            alpha: 1,
            duration: 0.8,
            delay: 0.3,
            ease: "power2.out"
        });

        console.log(`🎨 Banner updated with last spin: ${spin_number} ${color} ${parity}`);
    }

    /**
     * 🎰 Hide "No Current Games" banner with smooth animation
     */
    public hideNoGamesBanner(): void {
        if (!this.bannerVisible) return;

        this.bannerVisible = false;

        // Smooth exit animation
        Globals.gsap?.to(this.noGamesBanner, {
            alpha: 0,
            duration: 0.4,
            ease: "power2.in"
        });

        Globals.gsap?.to(this.noGamesBanner.scale, {
            x: 0.8,
            y: 0.8,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
                this.noGamesBanner.visible = false;
                this.noGamesBanner.scale.set(1);
                // Kill floating animation
                Globals.gsap?.killTweensOf(this.noGamesBanner);
                // Reset position (with proper pivot centering)
                const centerX = config.logicalWidth / 2;
                const centerY = config.logicalHeight / 2;
                this.noGamesBanner.position.set(centerX, centerY);
            }
        });

        console.log("🎰 No Games banner hidden");
    }

    /**
     * 🏆 Show winning banner with complete roulette information including number, color, and parity
     * @param winningNumber The winning number to display with full details
     */
    public showWinningBanner(winningNumber: number): void {
        if (this.winningBannerVisible) return;
    
        this.winningBannerVisible = true;
        this.winningBanner.visible = true;
    
        const { number, color, parity } = getRouletteProperties(winningNumber);
    
        // 🎨 Dynamic color values
        const glowColor = color === 'Red' ? '#FF4444' :
                          color === 'Black' ? '#000000' :
                          '#00FF44';
    
        const goldColor = '#FFD700'; // for WINNER: and Odd/Even
    
        // 🧠 Construct styled rich HTML text
        const winningText = 
            `<span style="color:${goldColor}">🏆 WINNER:</span> ` +
            `<span style="color:${glowColor}">${number}</span>` +
            (parity !== 'None' ? ` <span style="color:${goldColor}">${parity}</span>` : '') +
            ` <span style="color:${goldColor}">🏆</span>`;
    
        // 📝 Set text and styles
        this.winningBannerText.text = winningText;
        this.winningBannerText.style = {
            fontFamily: 'Arial',
            fontSize: 48,
            fontWeight: 'bold',
            align: 'center',
            whiteSpace: 'pre',
            fill: '#ffffff', // Use CSS-compatible color
        };
    
        // 🎬 Entrance animation
        this.winningBanner.alpha = 0;
        this.winningBanner.scale.set(0.3);
        this.winningBanner.rotation = 0.2;
    
        Globals.gsap?.to(this.winningBanner, {
            alpha: 1,
            rotation: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    
        Globals.gsap?.to(this.winningBanner.scale, {
            x: 1,
            y: 1,
            duration: 1.2,
            ease: "elastic.out(1, 0.4)"
        });
    
        // 🎉 Celebration pulsing
        const pulseScale = color === 'Green' ? 1.25 : 1.15;
        Globals.gsap?.to(this.winningBannerText.scale, {
            x: pulseScale,
            y: pulseScale,
            duration: color === 'Green' ? 1.2 : 1.5,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1
        });
    
        // 🎈 Floating banner motion
        const originalY = this.winningBanner.position.y;
        Globals.gsap?.to(this.winningBanner.position, {
            y: originalY - (color === 'Green' ? 15 : 10),
            duration: 2.5,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1
        });
    
        // ✨ Glow pulsation
        const glowAlpha = color === 'Green' ? 0.6 : 0.8;
        Globals.gsap?.to(this.winningBannerText, {
            alpha: glowAlpha,
            duration: color === 'Green' ? 0.6 : 0.8,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1
        });
    
        console.log(`🏆 Enhanced winning banner shown: ${number} ${color} ${parity}`);
    }
    
    

    /**
     * 🏆 Hide winning banner with smooth animation
     */
    public hideWinningBanner(): void {
        if (!this.winningBannerVisible) return;

        this.winningBannerVisible = false;

        // Stop all celebration animations
        Globals.gsap?.killTweensOf(this.winningBannerText.scale);
        Globals.gsap?.killTweensOf(this.winningBannerText);
        Globals.gsap?.killTweensOf(this.winningBanner.position);

        // Smooth exit animation
        Globals.gsap?.to(this.winningBanner, {
            alpha: 0,
            rotation: -0.1,
            duration: 0.6,
            ease: "power2.in"
        });

        Globals.gsap?.to(this.winningBanner.scale, {
            x: 0.7,
            y: 0.7,
            duration: 0.6,
            ease: "power2.in",
            onComplete: () => {
                this.winningBanner.visible = false;
                this.winningBanner.scale.set(1);
                this.winningBanner.rotation = 0;
                this.winningBannerText.scale.set(1);
                this.winningBannerText.alpha = 1;
                
                // Reset position (with proper pivot centering)
                const centerX = config.logicalWidth / 2;
                const centerY = config.logicalHeight*0.75;
                this.winningBanner.position.set(centerX, centerY);
            }
        });

        console.log("🏆 Winning banner hidden");
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

    public isBannerVisible(): boolean {
        return this.bannerVisible;
    }

    public isWinningBannerVisible(): boolean {
        return this.winningBannerVisible;
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
        this.hideNoGamesBanner();
        this.hideWinningBanner();
        
        // Kill all GSAP animations
        if (this.noGamesBanner) {
            Globals.gsap?.killTweensOf(this.noGamesBanner);
        }
        if (this.winningBanner) {
            Globals.gsap?.killTweensOf(this.winningBanner);
            Globals.gsap?.killTweensOf(this.winningBannerText);
        }
        
        // Remove all UI elements
        if (this.timeDisplay) this.container.removeChild(this.timeDisplay);
        if (this.countdownOverlay) this.container.removeChild(this.countdownOverlay);
        if (this.connectionStatusText) this.container.removeChild(this.connectionStatusText);
        if (this.noGamesBanner) this.container.removeChild(this.noGamesBanner);
        if (this.winningBanner) this.container.removeChild(this.winningBanner);
        
        console.log("🎨 Game UI destroyed");
    }
} 