import { Container} from "pixi.js";
import { config } from "./appconfig";
import { BackgroundGraphic, BackgroundSprite } from "./background";
import { Globals } from "./globals";


export abstract class Scene {


    sceneContainer: Container;
    mainContainer: Container;
    // mainBackground: BackgroundGraphic;
    private mainBackground: BackgroundGraphic | BackgroundSprite;


    constructor(isGraphics : boolean) {
        this.sceneContainer = new Container();
        if (isGraphics) {
            this.mainBackground = new BackgroundGraphic( window.innerWidth, window.innerHeight, 0x000000);
            
            } 
            else {
                this.mainBackground = new BackgroundSprite(Globals.resources.GameBG , window.innerWidth, window.innerHeight)
              }


        this.sceneContainer.addChild(this.mainBackground);
        this.mainContainer = new Container();
        this.resetMainContainer();      
        this.sceneContainer.addChild(this.mainContainer);

        // const mask = new Graphics();
        // mask.beginFill(0xffffff);
        // mask.drawRect(0, 0, config.logicalWidth, config.logicalHeight);
        // mask.endFill();
        // this.mainContainer.addChild(mask);
        // this.mainContainer.mask = mask;

    }

    // changeBackgroundSprite(index: number) {
    //     this.fullBackground.updateBackgroundIndex(index);
    // }

    resetMainContainer() {
        this.mainContainer.x = config.leftX;
        this.mainContainer.y = config.topY;
        this.mainContainer.scale.set(config.scaleFactor);
    }
    addToScene(obj: any) {
        this.sceneContainer.addChild(obj);

    }
    resize(): void {
        this.resetMainContainer();
        this.mainBackground.resetBg(window.innerWidth, window.innerHeight);
        this.mainBackground.width =  window.innerWidth;
        this.mainBackground.height =  window.innerHeight;

    }

    initScene(container: Container) {
        container.addChild(this.sceneContainer);
    }
    destroyScene() {
        this.sceneContainer.destroy();
    }

    addChildToFullScene(component: any) {
        this.sceneContainer.addChild(component);
    }

    addChildToIndexFullScene(component: any, index: number) {
        this.sceneContainer.addChildAt(component, index);
    }



    abstract update(dt: number): void;

    abstract recievedMessage(msgType: string, msgParams: any): void;
}