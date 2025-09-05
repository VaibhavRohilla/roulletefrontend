import { Application } from "pixi.js";
import { SceneManager } from "./scenemanager";
import { Howl } from "howler";
import { gsap } from "gsap";
import { isMobile } from "pixi.js";
import { MyEmitter } from "./myemitter";
import { SoundHandler } from "./soundHandler";

export interface globalDataType {
  resources: any;
  emitter: MyEmitter | undefined;
  sceneManager: SceneManager | undefined;
  isMobile: boolean;
  // fpsStats: Stats | undefined;
  app: Application | undefined;
  soundResources: { [key: string]: Howl };
  gsap: typeof gsap | undefined;
  isProd: boolean;
  soundHandler: SoundHandler | undefined;
}

export const Globals: globalDataType = {
  resources: {},
  emitter: undefined,
  sceneManager : undefined,
  get isMobile() {
    //  return true;
    return isMobile.any;
  },
  // fpsStats: undefined,
  app: undefined,
  soundResources: {},
  gsap: undefined,
  isProd: true, // Set to false for development testing
  soundHandler: undefined,
};
