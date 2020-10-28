import { Injectable } from '@angular/core';
import { Subject } from '../../../node_modules/rxjs';
import { CompiledResources } from './res/CompiledResources';
import { ResourcesEnum } from './res/ResourcesEnum';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

    private resourcesToLoad:{code:string,path:string, type:ResourcesEnum}[];
	  private resourcesToLoadB64:{code:string,path:string, type:ResourcesEnum}[];
    private resourcesLoaded: Subject<boolean>; // all resources loaded
    private resources:Map<string,any>;// could be images, sounds, etc
    private loaderRun:boolean = false;
    constructor() {
  		this.resourcesToLoadB64 = []
			this.resources = new Map();
			this.resourcesLoaded = new Subject();

      this.resourcesToLoad = [

    {code:"boss-5", path:"assets/img/boss/boss-5-update-Judge/boss-5.png", type:ResourcesEnum.ImageRes},
    {code:"boss-5-damaged", path:"assets/img/boss/boss-5-update-Judge/boss-5-damaged.png", type:ResourcesEnum.ImageRes},
    {code:"judge-shadow", path:"assets/img/boss/boss-5-update-Judge/judge-shadow.png", type:ResourcesEnum.ImageRes},
    {code:"exploding-bullet", path:"assets/img/boss/boss-5-update-Judge/exploding-bullet.png", type:ResourcesEnum.ImageRes},

    {code:"starship-hull-1", path:"assets/img/boss/Starship/starship-hull-1.png", type:ResourcesEnum.ImageRes},
    {code:"starship-hull-1-damage", path:"assets/img/boss/Starship/starship-hull-1-damage.png", type:ResourcesEnum.ImageRes},
    {code:"starship-hull-2", path:"assets/img/boss/Starship/starship-hull-2.png", type:ResourcesEnum.ImageRes},
    {code:"starship-hull-2-damage", path:"assets/img/boss/Starship/starship-hull-2-damage.png", type:ResourcesEnum.ImageRes},
    {code:"starship-hull-3", path:"assets/img/boss/Starship/starship-hull-3.png", type:ResourcesEnum.ImageRes},
    {code:"starship-hull-3-damage", path:"assets/img/boss/Starship/starship-hull-3-damage.png", type:ResourcesEnum.ImageRes},
    {code:"starship-hull-4", path:"assets/img/boss/Starship/starship-hull-4.png", type:ResourcesEnum.ImageRes},
    {code:"starship-hull-4-damage", path:"assets/img/boss/Starship/starship-hull-4-damage.png", type:ResourcesEnum.ImageRes},
    {code:"starship-hull-shadow-1", path:"assets/img/boss/Starship/starship-hull-shadow-1.png", type:ResourcesEnum.ImageRes},
    {code:"starship-hull-shadow-2", path:"assets/img/boss/Starship/starship-hull-shadow-2.png", type:ResourcesEnum.ImageRes},
    {code:"starship-main-turret", path:"assets/img/boss/Starship/starship-main-turret.png", type:ResourcesEnum.ImageRes},
    {code:"starship-main-turret-damage", path:"assets/img/boss/Starship/starship-main-turret-damage.png", type:ResourcesEnum.ImageRes},
    {code:"starship-main-turret-shadow", path:"assets/img/boss/Starship/starship-main-turret-shadow.png", type:ResourcesEnum.ImageRes},
    {code:"starship-small-turret", path:"assets/img/boss/Starship/starship-small-turret.png", type:ResourcesEnum.ImageRes},
    {code:"starship-small-turret-damag", path:"assets/img/boss/Starship/starship-small-turret-damag.png", type:ResourcesEnum.ImageRes},
    {code:"starship-small-turret-shado", path:"assets/img/boss/Starship/starship-small-turret-shado.png", type:ResourcesEnum.ImageRes},
    {code:"starship-turret-full", path:"assets/img/boss/Starship/starship-turret-full.png", type:ResourcesEnum.ImageRes},
    {code:"starship-turret-full-damage", path:"assets/img/boss/Starship/starship-turret-full-damage.png", type:ResourcesEnum.ImageRes},
    {code:"starship-weakpoint", path:"assets/img/boss/Starship/starship-weakpoint.png", type:ResourcesEnum.ImageRes},
    {code:"starship-weakpoint-damage", path:"assets/img/boss/Starship/starship-weakpoint-damage.png", type:ResourcesEnum.ImageRes},

    {code:"starship-firing-1", path:"assets/img/boss/Starship/starship-firing-1.png", type:ResourcesEnum.ImageRes},
    {code:"starship-firing-2", path:"assets/img/boss/Starship/starship-firing-2.png", type:ResourcesEnum.ImageRes},
    {code:"starship-firing-3", path:"assets/img/boss/Starship/starship-firing-3.png", type:ResourcesEnum.ImageRes},
    {code:"starship-firing-4", path:"assets/img/boss/Starship/starship-firing-4.png", type:ResourcesEnum.ImageRes},
    {code:"starship-firing-5", path:"assets/img/boss/Starship/starship-firing-5.png", type:ResourcesEnum.ImageRes},
    {code:"starship-firing-6", path:"assets/img/boss/Starship/starship-firing-6.png", type:ResourcesEnum.ImageRes},

    {code:"enemy-rocket-1", path:"assets/img/bots/enemy-rocket-1.png", type:ResourcesEnum.ImageRes},
    {code:"enemy-rocket-2", path:"assets/img/bots/enemy-rocket-2.png", type:ResourcesEnum.ImageRes},

    {code:"level-2-bg-buildings", path:"assets/img/levels/level-2-update_1/level-2-bg-buildings.png", type:ResourcesEnum.ImageRes},
    {code:"level-2-bg-shadows", path:"assets/img/levels/level-2-update_1/level-2-bg-shadows.png", type:ResourcesEnum.ImageRes},

    {code:"diver-1", path:"assets/img/bots/diver-update/diver-1.png", type:ResourcesEnum.ImageRes},
    {code:"diver-2", path:"assets/img/bots/diver-update/diver-2.png", type:ResourcesEnum.ImageRes},
    {code:"diver-1-damaged", path:"assets/img/bots/diver-update/diver-1-damaged.png", type:ResourcesEnum.ImageRes},
    {code:"diver-2-damaged", path:"assets/img/bots/diver-update/diver-2-damaged.png", type:ResourcesEnum.ImageRes},
    {code:"diver-shadow-1", path:"assets/img/bots/diver-update/diver-shadow-1.png", type:ResourcesEnum.ImageRes},
    {code:"diver-shadow-2", path:"assets/img/bots/diver-update/diver-shadow-2.png", type:ResourcesEnum.ImageRes},

    {code:"player-muzzle-flash-1", path:"assets/img/player/player-muzzle-flash-1.png", type:ResourcesEnum.ImageRes},
    {code:"player-muzzle-flash-2", path:"assets/img/player/player-muzzle-flash-2.png", type:ResourcesEnum.ImageRes},
    {code:"player-muzzle-flash-3", path:"assets/img/player/player-muzzle-flash-3.png", type:ResourcesEnum.ImageRes},

    {code:"explosion-huge-1", path:"assets/img/bots/explosion/explosion-huge-1.png", type:ResourcesEnum.ImageRes},
    {code:"explosion-huge-2", path:"assets/img/bots/explosion/explosion-huge-2.png", type:ResourcesEnum.ImageRes},
    {code:"explosion-huge-3", path:"assets/img/bots/explosion/explosion-huge-3.png", type:ResourcesEnum.ImageRes},
    {code:"explosion-huge-4", path:"assets/img/bots/explosion/explosion-huge-4.png", type:ResourcesEnum.ImageRes},
    {code:"explosion-tiny-1", path:"assets/img/bots/explosion/explosion-tiny-1.png", type:ResourcesEnum.ImageRes},
    {code:"explosion-tiny-2", path:"assets/img/bots/explosion/explosion-tiny-2.png", type:ResourcesEnum.ImageRes},
    {code:"explosion-tiny-3", path:"assets/img/bots/explosion/explosion-tiny-3.png", type:ResourcesEnum.ImageRes},
    {code:"explosion-tiny-4", path:"assets/img/bots/explosion/explosion-tiny-4.png", type:ResourcesEnum.ImageRes},

    {code:"sentry-hull", path:"assets/img/bots/sentry-update/sentry-hull.png", type:ResourcesEnum.ImageRes},
    {code:"sentry-hull-damaged", path:"assets/img/bots/sentry-update/sentry-hull-damaged.png", type:ResourcesEnum.ImageRes},
    {code:"sentry-hull-shadow", path:"assets/img/bots/sentry-update/sentry-hull-shadow.png", type:ResourcesEnum.ImageRes},
    {code:"sentry-wreckage", path:"assets/img/bots/sentry-update/sentry-wreckage.png", type:ResourcesEnum.ImageRes},
    {code:"sentry-turret", path:"assets/img/bots/sentry-update/sentry-turret.png", type:ResourcesEnum.ImageRes},
    {code:"sentry-turret-damaged", path:"assets/img/bots/sentry-update/sentry-turret-damaged.png", type:ResourcesEnum.ImageRes},
    {code:"sentry-turret-shadow", path:"assets/img/bots/sentry-update/sentry-turret-shadow.png", type:ResourcesEnum.ImageRes},

    {code:"enemy-missile-1", path:"assets/img/bots/sentry-update/enemy-missile-1.png", type:ResourcesEnum.ImageRes},
    {code:"enemy-missile-2", path:"assets/img/bots/sentry-update/enemy-missile-2.png", type:ResourcesEnum.ImageRes},
    {code:"enemy-missile-3", path:"assets/img/bots/sentry-update/enemy-missile-3.png", type:ResourcesEnum.ImageRes},

    {code:"heavy-jet", path:"assets/img/bots/heavy-jet/heavy-jet.png", type:ResourcesEnum.ImageRes},
    {code:"heavy-jet-damaged", path:"assets/img/bots/heavy-jet/heavy-jet-damaged.png", type:ResourcesEnum.ImageRes},
    {code:"heavy-jet-shadow", path:"assets/img/bots/heavy-jet/heavy-jet-shadow.png", type:ResourcesEnum.ImageRes},
    {code:"heavy-jet-flames-1", path:"assets/img/bots/heavy-jet/heavy-jet-flames-1.png", type:ResourcesEnum.ImageRes},
    {code:"heavy-jet-flames-2", path:"assets/img/bots/heavy-jet/heavy-jet-flames-2.png", type:ResourcesEnum.ImageRes},
    {code:"heavy-jet-flames-3", path:"assets/img/bots/heavy-jet/heavy-jet-flames-3.png", type:ResourcesEnum.ImageRes},
    {code:"heavy-jet-flames-4", path:"assets/img/bots/heavy-jet/heavy-jet-flames-4.png", type:ResourcesEnum.ImageRes},
    {code:"heavy-jet-flames-5", path:"assets/img/bots/heavy-jet/heavy-jet-flames-5.png", type:ResourcesEnum.ImageRes},

    {code:"miniboss-3-no-cannon-shadow", path:"assets/img/boss/miniboss-3-changes/miniboss-3-no-cannon-shadow.png", type:ResourcesEnum.ImageRes},
    {code:"shield-1", path:"assets/img/player/shield/shield-1.png", type:ResourcesEnum.ImageRes},
    {code:"shield-2", path:"assets/img/player/shield/shield-2.png", type:ResourcesEnum.ImageRes},
    {code:"shield-3", path:"assets/img/player/shield/shield-3.png", type:ResourcesEnum.ImageRes},
    {code:"shield-4", path:"assets/img/player/shield/shield-4.png", type:ResourcesEnum.ImageRes},
    {code:"shield-5", path:"assets/img/player/shield/shield-5.png", type:ResourcesEnum.ImageRes},
    {code:"shield-6", path:"assets/img/player/shield/shield-6.png", type:ResourcesEnum.ImageRes},
    {code:"shield-7", path:"assets/img/player/shield/shield-7.png", type:ResourcesEnum.ImageRes},
    {code:"shield-8", path:"assets/img/player/shield/shield-8.png", type:ResourcesEnum.ImageRes},

    {code:"aa-tank-hull-horizontal", path:"assets/img/bots/aa-tank/aa-tank-hull-horizontal.png", type:ResourcesEnum.ImageRes},
    {code:"aa-tank-wreckage-horizontal", path:"assets/img/bots/aa-tank/aa-tank-wreckage-horizontal.png", type:ResourcesEnum.ImageRes},
    {code:"aa-tank-hull-horizontal-shadow", path:"assets/img/bots/aa-tank/aa-tank-hull-horizontal-shadow.png", type:ResourcesEnum.ImageRes},
    {code:"aa-tank-turret-1", path:"assets/img/bots/aa-tank/aa-tank-turret-1.png", type:ResourcesEnum.ImageRes},
    {code:"aa-tank-turret-3", path:"assets/img/bots/aa-tank/aa-tank-turret-3.png", type:ResourcesEnum.ImageRes},
    {code:"aa-tank-turret-5", path:"assets/img/bots/aa-tank/aa-tank-turret-5.png", type:ResourcesEnum.ImageRes},
    {code:"aa-tank-turret-7", path:"assets/img/bots/aa-tank/aa-tank-turret-7.png", type:ResourcesEnum.ImageRes},
    {code:"aa-tank-turret-damaged", path:"assets/img/bots/aa-tank/aa-tank-turret-damaged.png", type:ResourcesEnum.ImageRes},
    {code:"aa-tank-hull-horizontal-dam", path:"assets/img/bots/aa-tank/aa-tank-hull-horizontal-dam.png", type:ResourcesEnum.ImageRes},
    {code:"aa-tank-track-horizontal", path:"assets/img/bots/aa-tank/aa-tank-track-horizontal.png", type:ResourcesEnum.ImageRes},
    {code:"aa-tank-turret-2", path:"assets/img/bots/aa-tank/aa-tank-turret-2.png", type:ResourcesEnum.ImageRes},
    {code:"aa-tank-turret-4", path:"assets/img/bots/aa-tank/aa-tank-turret-4.png", type:ResourcesEnum.ImageRes},
    {code:"aa-tank-turret-6", path:"assets/img/bots/aa-tank/aa-tank-turret-6.png", type:ResourcesEnum.ImageRes},
    {code:"aa-tank-turret-8", path:"assets/img/bots/aa-tank/aa-tank-turret-8.png", type:ResourcesEnum.ImageRes},

    {code:"enemy-1-1-shadow", path:"assets/img/bots/level-2/enemy-1-1-shadow.png", type:ResourcesEnum.ImageRes},
    {code:"enemy-1-1-shadow-separate", path:"assets/img/bots/level-2/enemy-1-1-shadow-separate.png", type:ResourcesEnum.ImageRes},
    {code:"enemy-1-2-shadow", path:"assets/img/bots/level-2/enemy-1-2-shadow.png", type:ResourcesEnum.ImageRes},
    {code:"enemy-1-2-shadow-separate", path:"assets/img/bots/level-2/enemy-1-2-shadow-separate.png", type:ResourcesEnum.ImageRes},
    {code:"ground-enemy-1-1", path:"assets/img/bots/level-2/ground-enemy-1-1.png", type:ResourcesEnum.ImageRes},
    {code:"ground-enemy-1-1-cannon", path:"assets/img/bots/level-2/ground-enemy-1-1-cannon.png", type:ResourcesEnum.ImageRes},
    {code:"ground-enemy-1-1-example", path:"assets/img/bots/level-2/ground-enemy-1-1-example.png", type:ResourcesEnum.ImageRes},
    {code:"player-1-ship-shadow-separa", path:"assets/img/player/player-1-ship-shadow.png", type:ResourcesEnum.ImageRes},
    {code:"player-1-ship", path:"assets/img/player/player-1-ship.png", type:ResourcesEnum.ImageRes},

    {code:"HUD-resized", path:"assets/img/hud/HUD-resized.png", type:ResourcesEnum.ImageRes},
    {code:"stage-1-complete", path:"assets/img/desc/stage-1-complete.png", type:ResourcesEnum.ImageRes},

    {code:"scene-1-1", path:"assets/img/loading/scene_1/scene-1-1.png", type:ResourcesEnum.ImageRes},
    {code:"scene-1-2", path:"assets/img/loading/scene_1/scene-1-2.png", type:ResourcesEnum.ImageRes},
    {code:"scene-1-3", path:"assets/img/loading/scene_1/scene-1-3.png", type:ResourcesEnum.ImageRes},
    {code:"scene-1-4", path:"assets/img/loading/scene_1/scene-1-4.png", type:ResourcesEnum.ImageRes},
    {code:"scene-1-5", path:"assets/img/loading/scene_1/scene-1-5.png", type:ResourcesEnum.ImageRes},
    {code:"scene-1-6", path:"assets/img/loading/scene_1/scene-1-6.png", type:ResourcesEnum.ImageRes},
    {code:"scene-1-7", path:"assets/img/loading/scene_1/scene-1-7.png", type:ResourcesEnum.ImageRes},
    {code:"scene-1-8", path:"assets/img/loading/scene_1/scene-1-8.png", type:ResourcesEnum.ImageRes},
    {code:"scene-1-9", path:"assets/img/loading/scene_1/scene-1-9.png", type:ResourcesEnum.ImageRes},
    {code:"scene-1-10", path:"assets/img/loading/scene_1/scene-1-10.png", type:ResourcesEnum.ImageRes},
    {code:"scene-1-11", path:"assets/img/loading/scene_1/scene-1-11.png", type:ResourcesEnum.ImageRes},
    {code:"scene-1-12", path:"assets/img/loading/scene_1/scene-1-12.png", type:ResourcesEnum.ImageRes},
    {code:"scene-1-13", path:"assets/img/loading/scene_1/scene-1-13.png", type:ResourcesEnum.ImageRes},
    {code:"scene-1-14", path:"assets/img/loading/scene_1/scene-1-14.png", type:ResourcesEnum.ImageRes},
    {code:"scene-1-15", path:"assets/img/loading/scene_1/scene-1-15.png", type:ResourcesEnum.ImageRes},
    {code:"scene-1-16", path:"assets/img/loading/scene_1/scene-1-16.png", type:ResourcesEnum.ImageRes},
    {code:"scene-1-17", path:"assets/img/loading/scene_1/scene-1-17.png", type:ResourcesEnum.ImageRes},
    {code:"scene-1-18", path:"assets/img/loading/scene_1/scene-1-18.png", type:ResourcesEnum.ImageRes},
    {code:"scene-1-19", path:"assets/img/loading/scene_1/scene-1-19.png", type:ResourcesEnum.ImageRes},
    {code:"scene-1-20", path:"assets/img/loading/scene_1/scene-1-20.png", type:ResourcesEnum.ImageRes},

    {code:"scene-2-1", path:"assets/img/loading/scene_2/scene-2-1.png", type:ResourcesEnum.ImageRes},
    {code:"scene-2-2", path:"assets/img/loading/scene_2/scene-2-2.png", type:ResourcesEnum.ImageRes},
    {code:"scene-2-3", path:"assets/img/loading/scene_2/scene-2-3.png", type:ResourcesEnum.ImageRes},
    {code:"scene-2-4", path:"assets/img/loading/scene_2/scene-2-4.png", type:ResourcesEnum.ImageRes},
    {code:"scene-2-5", path:"assets/img/loading/scene_2/scene-2-5.png", type:ResourcesEnum.ImageRes},
    {code:"scene-2-6", path:"assets/img/loading/scene_2/scene-2-6.png", type:ResourcesEnum.ImageRes},
    {code:"scene-2-7", path:"assets/img/loading/scene_2/scene-2-7.png", type:ResourcesEnum.ImageRes},
    {code:"scene-2-8", path:"assets/img/loading/scene_2/scene-2-8.png", type:ResourcesEnum.ImageRes},
    {code:"scene-2-9", path:"assets/img/loading/scene_2/scene-2-9.png", type:ResourcesEnum.ImageRes},
    {code:"scene-2-10", path:"assets/img/loading/scene_2/scene-2-10.png", type:ResourcesEnum.ImageRes},
    {code:"scene-2-11", path:"assets/img/loading/scene_2/scene-2-11.png", type:ResourcesEnum.ImageRes},
    {code:"scene-2-12", path:"assets/img/loading/scene_2/scene-2-12.png", type:ResourcesEnum.ImageRes},
    {code:"scene-2-13", path:"assets/img/loading/scene_2/scene-2-13.png", type:ResourcesEnum.ImageRes},
    {code:"scene-2-14", path:"assets/img/loading/scene_2/scene-2-14.png", type:ResourcesEnum.ImageRes},
    {code:"scene-2-15", path:"assets/img/loading/scene_2/scene-2-15.png", type:ResourcesEnum.ImageRes},
    {code:"scene-2-16", path:"assets/img/loading/scene_2/scene-2-16.png", type:ResourcesEnum.ImageRes},

    {code:"scene-3-1", path:"assets/img/loading/scene_3/scene-3-1.png", type:ResourcesEnum.ImageRes},
    {code:"scene-3-2", path:"assets/img/loading/scene_3/scene-3-2.png", type:ResourcesEnum.ImageRes},
    {code:"scene-3-3", path:"assets/img/loading/scene_3/scene-3-3.png", type:ResourcesEnum.ImageRes},
    {code:"scene-3-4", path:"assets/img/loading/scene_3/scene-3-4.png", type:ResourcesEnum.ImageRes},
    {code:"scene-3-5", path:"assets/img/loading/scene_3/scene-3-5.png", type:ResourcesEnum.ImageRes},
    {code:"scene-3-6", path:"assets/img/loading/scene_3/scene-3-6.png", type:ResourcesEnum.ImageRes},

    {code:"scene-4-1", path:"assets/img/loading/scene_4/scene-4-1.png", type:ResourcesEnum.ImageRes},
    {code:"scene-4-2", path:"assets/img/loading/scene_4/scene-4-2.png", type:ResourcesEnum.ImageRes},
    {code:"scene-4-3", path:"assets/img/loading/scene_4/scene-4-3.png", type:ResourcesEnum.ImageRes},
    {code:"scene-4-4", path:"assets/img/loading/scene_4/scene-4-4.png", type:ResourcesEnum.ImageRes},
    {code:"scene-4-5", path:"assets/img/loading/scene_4/scene-4-5.png", type:ResourcesEnum.ImageRes},
    {code:"scene-4-6", path:"assets/img/loading/scene_4/scene-4-6.png", type:ResourcesEnum.ImageRes},

    {code:"miniboss-3-1-cannon", path:"assets/img/boss/miniboss-3-changes/miniboss-3-1-cannon.png", type:ResourcesEnum.ImageRes},
    {code:"miniboss-3-missile-no-cannon", path:"assets/img/boss/miniboss-3-changes/miniboss-3-missile.png", type:ResourcesEnum.ImageRes},
    {code:"miniboss-3-no-cannon", path:"assets/img/boss/miniboss-3-changes/miniboss-3-no-cannon.png", type:ResourcesEnum.ImageRes},
    {code:"miniboss-3-no-cannon-damage", path:"assets/img/boss/miniboss-3-changes/miniboss-3-no-cannon-damage.png", type:ResourcesEnum.ImageRes},

		{code:"explosion-small-1", path:"assets/img/boss/level2-boss-update/explosion-small-1.png", type:ResourcesEnum.ImageRes},
		{code:"explosion-small-2", path:"assets/img/boss/level2-boss-update/explosion-small-2.png", type:ResourcesEnum.ImageRes},
		{code:"explosion-small-3", path:"assets/img/boss/level2-boss-update/explosion-small-3.png", type:ResourcesEnum.ImageRes},
		{code:"explosion-small-4", path:"assets/img/boss/level2-boss-update/explosion-small-4.png", type:ResourcesEnum.ImageRes},
		{code:"miniboss-3", path:"assets/img/boss/level2-boss-update/miniboss-3.png", type:ResourcesEnum.ImageRes},
		{code:"miniboss-3-damaged", path:"assets/img/boss/level2-boss-update/miniboss-3-damaged.png", type:ResourcesEnum.ImageRes},
		{code:"miniboss-3-missile", path:"assets/img/boss/level2-boss-update/miniboss-3-missile.png", type:ResourcesEnum.ImageRes},
		{code:"miniboss-3-muzzle-flash", path:"assets/img/boss/level2-boss-update/miniboss-3-muzzle-flash.png", type:ResourcesEnum.ImageRes},

		{code:"enemy-08-1", path:"assets/img/bots/enemy-08-update/enemy-08-1.png", type:ResourcesEnum.ImageRes},
		{code:"enemy-08-2", path:"assets/img/bots/enemy-08-update/enemy-08-2.png", type:ResourcesEnum.ImageRes},
		{code:"enemy-08-damaged", path:"assets/img/bots/enemy-08-update/enemy-08-damaged.png", type:ResourcesEnum.ImageRes},

		{code:"player-explosion-1", path:"assets/img/player/player-explosion-1.png", type:ResourcesEnum.ImageRes},
		{code:"player-explosion-2", path:"assets/img/player/player-explosion-2.png", type:ResourcesEnum.ImageRes},
		{code:"player-explosion-3", path:"assets/img/player/player-explosion-3.png", type:ResourcesEnum.ImageRes},
		{code:"player-explosion-4", path:"assets/img/player/player-explosion-4.png", type:ResourcesEnum.ImageRes},

		{code:"bot-explosion-1", path:"assets/img/bots/explosion/explosion-1.png", type:ResourcesEnum.ImageRes},
		{code:"bot-explosion-2", path:"assets/img/bots/explosion/explosion-2.png", type:ResourcesEnum.ImageRes},
		{code:"bot-explosion-3", path:"assets/img/bots/explosion/explosion-3.png", type:ResourcesEnum.ImageRes},
		{code:"bot-explosion-4", path:"assets/img/bots/explosion/explosion-4.png", type:ResourcesEnum.ImageRes},

		{code:"main-boss-1-guardian", path:"assets/img/bots/main-boss-1-guardian/main-boss-1-guardian.png", type:ResourcesEnum.ImageRes},
    {code:"main-boss-1-guardian-damage", path:"assets/img/bots/main-boss-1-guardian/main-boss-1-guardian-damage.png",  type:ResourcesEnum.ImageRes},

		{code:"miniboss-1-damaged", path:"assets/img/boss/miniboss-1-damaged.png", type:ResourcesEnum.ImageRes},
    {code:"player-1-muzzle-flash", path:"assets/img/bots/redesign/player-1-muzzle-flash.png", type:ResourcesEnum.ImageRes},
    {code:"enemy-3-1-damaged", path:"assets/img/bots/redesign/enemy-3-1-damaged.png", type:ResourcesEnum.ImageRes},

    {code:"enemy-1-1-v2", path:"assets/img/bots/redesign/enemy-1-1.png", type:ResourcesEnum.ImageRes},
    {code:"enemy-1-2-v2", path:"assets/img/bots/redesign/enemy-1-2.png", type:ResourcesEnum.ImageRes},
    {code:"enemy-1-damaged-v2", path:"assets/img/bots/redesign/enemy-1-damaged.png", type:ResourcesEnum.ImageRes},

    {code:"enemy-2-1-v2", path:"assets/img/bots/redesign/enemy-2-1.png", type:ResourcesEnum.ImageRes},
    {code:"enemy-2-2-v2", path:"assets/img/bots/redesign/enemy-2-2.png", type:ResourcesEnum.ImageRes},
    {code:"enemy-2-damaged-v2", path:"assets/img/bots/redesign/enemy-2-damaged.png", type:ResourcesEnum.ImageRes},

		{code:"enemy-07", path:"assets/img/bots/enemy-07/enemy-07.png", type:ResourcesEnum.ImageRes},
		{code:"enemy-07-damaged", path:"assets/img/bots/enemy-07/enemy-07-damaged.png", type:ResourcesEnum.ImageRes},
		{code:"enemy-07-firing-1", path:"assets/img/bots/enemy-07/enemy-07-firing-1.png", type:ResourcesEnum.ImageRes},
		{code:"enemy-07-firing-2", path:"assets/img/bots/enemy-07/enemy-07-firing-2.png", type:ResourcesEnum.ImageRes},
		{code:"enemy-07-firing-3", path:"assets/img/bots/enemy-07/enemy-07-firing-3.png", type:ResourcesEnum.ImageRes},
		{code:"enemy-07-firing-4", path:"assets/img/bots/enemy-08-update/enemy-07-firing-4.png", type:ResourcesEnum.ImageRes},
		{code:"enemy-07-firing-5", path:"assets/img/bots/enemy-08-update/enemy-07-firing-5.png", type:ResourcesEnum.ImageRes},
		{code:"enemy-07-firing-6", path:"assets/img/bots/enemy-08-update/enemy-07-firing-6.png", type:ResourcesEnum.ImageRes},

		{code:"miniboss-2", path:"assets/img/boss/bos2/miniboss-2.png", type:ResourcesEnum.ImageRes},
		{code:"miniboss-2-1", path:"assets/img/boss/bos2/miniboss-2-1.png", type:ResourcesEnum.ImageRes},
		{code:"miniboss-2-2", path:"assets/img/boss/bos2/miniboss-2-2.png", type:ResourcesEnum.ImageRes},
		{code:"miniboss-2-bullet", path:"assets/img/boss/bos2/miniboss-2-bullet.png", type:ResourcesEnum.ImageRes},
		{code:"miniboss-2-muzzle-flash", path:"assets/img/boss/bos2/miniboss-2-muzzle-flash.png", type:ResourcesEnum.ImageRes},
		{code:"miniboss-2-damaged", path:"assets/img/boss/bos2/miniboss-2-damaged.png", type:ResourcesEnum.ImageRes},

    {code:"boss1-laser-1", path:"assets/img/boss/main-boss-1/laser-1.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-laser-2", path:"assets/img/boss/main-boss-1/laser-2.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-laser-3", path:"assets/img/boss/main-boss-1/laser-3.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-laser-4", path:"assets/img/boss/main-boss-1/laser-4.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-laser-5", path:"assets/img/boss/main-boss-1/laser-5.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-laser-6", path:"assets/img/boss/main-boss-1/laser-6.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-laser-7", path:"assets/img/boss/main-boss-1/laser-7.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-laser-8", path:"assets/img/boss/main-boss-1/laser-8.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-laser-9", path:"assets/img/boss/main-boss-1/laser-9.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-laser-9-1", path:"assets/img/boss/main-boss-1/laser-9-1.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-laser-9-2", path:"assets/img/boss/main-boss-1/laser-9-2.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-laser-10", path:"assets/img/boss/main-boss-1/laser-10.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-main-boss-1-firing-gif", path:"assets/img/boss/main-boss-1/main-boss-1-firing-gif.gif", type:ResourcesEnum.ImageRes},
    {code:"boss1-main-boss-1-weakpoint", path:"assets/img/boss/main-boss-1/main-boss-1-weakpoint.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-main-boss-1-weakpoint-damag", path:"assets/img/boss/main-boss-1/main-boss-1-weakpoint-damag.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-main-boss-armor-1", path:"assets/img/boss/main-boss-1/main-boss-armor-1.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-main-boss-armor-2", path:"assets/img/boss/main-boss-1/main-boss-armor-2.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-main-boss-armor-3", path:"assets/img/boss/main-boss-1/main-boss-armor-3.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-main-boss-armor-4", path:"assets/img/boss/main-boss-1/main-boss-armor-4.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-main-boss-armor-5", path:"assets/img/boss/main-boss-1/main-boss-armor-5.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-main-boss-armor-6", path:"assets/img/boss/main-boss-1/main-boss-armor-6.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-main-boss-armor-7", path:"assets/img/boss/main-boss-1/main-boss-armor-7.png", type:ResourcesEnum.ImageRes},
    {code:"boss1-main-boss-armor-8", path:"assets/img/boss/main-boss-1/main-boss-armor-8.png", type:ResourcesEnum.ImageRes},



    {code:"level-2-background", path:"assets/img/levels/level-2-update_1/level-2-background.png", type:ResourcesEnum.ImageRes},
    {code:"level-2-background-full", path:"assets/img/levels/level-2-update_1/level-2-background-full.png", type:ResourcesEnum.ImageRes},

		{code:"new-intro-1", path:"assets/img/loading/intro-vertical/intro-1.png", type:ResourcesEnum.ImageRes},
		{code:"new-intro-16", path:"assets/img/loading/intro-vertical/intro-16.png", type:ResourcesEnum.ImageRes},
          {
              code: "intro15", path: "data:image/png;base64,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",
              type: ResourcesEnum.ImageRes
          },
          {
              code: "intro0", path: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAeRSURBVHja7NzBCcAgEERRN6T/lidWIHoIKL5XwlzyETaVpAEAcI/HBAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAEIAAAAhAAAAEIAAAZ3pNsKhajAAAm0n/QjPNCyAAgAAEAEAAAgAgAAEAEIAAABygEket44Xmrn7L8REA/C6zP+NwFTzkBRAAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAhAAAABCACAAAQAQAACACAAAQAQgAAACEAAADZSSaywtFgzGADsJv0LzTQvgAAAAhAAAAEIAIAABABAAAIAcABXwAAAl/ECCAAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAAAQgAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAAAQgAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAAAQgAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIACEATAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAEIAIAABABAAAIAIAABABCAAAAIQAAANvAJMACenBezYekAhgAAAABJRU5ErkJggg==",
              type: ResourcesEnum.ImageRes
          },
          {
              code: "level-1-background", path: "data: image / png; base64, iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAIAAAC6s0uzAAAABGdBTUEAAK / INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAADi7SURBVHja7J1Nrh1HrqCv1L0A442keXkjMnoDNTAK0LAG1egV + K2gtYT2QMMCDA96B / JG9OZu1MgrkLruObdceZ2KFJkkg2Tk9w18jaNU3Dz5J34ZJOPFg5IPf3rzz / 9 + 91 +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",
              type: ResourcesEnum.ImageRes },
          {
              code: "enemy-2-2", path: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAABOCAYAAAB1/dXCAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIhSURBVHja7JpbUsMwDEUjyqJg/x+wKTAwHTOJ0htJlp2AJf902k790PHVK6VSynLGuC2vm4U+ljc6Y92nZfJBowlycnyMJpkEe5H7pPetZcvLKSSTYG9yOwsPJjk9wTxgarBRe2dpMa9oHnB2DXq1N1qLeUXzgHnAPOD/zGS8IzMZ5XjuPWHvOJgEr6roW6uJrOitBNEXiCzyltXyRFSJFKN2ab2utM7uIERJ8CE5bbWAqgCkSa457zqIZByCiJzUkUYWt8Yz7zqIZDyCrXGMW1Qigr73rrvz5mEI1rjVqgVvTtk638FNoNjVBNeE9N6rJe182n1kPYjuPtKC1bLW32n3kQSRl0KW1v7O2wFo3UfGQSn+eDMQqzYzDnINrnJQl0ZGZzLWfdRzzU9QW/dpLdia8Vi1jPZXX2/lfq54cRBZFn3+21Mpx3WkNW6ieRE5eFOymhDi0KoP2qXnop03MxlEUNIeGpIWRUvzngpouktaTIKtmUPVzHcGsSEpaRB1w7yZTxyCWu1oLbYiQOsq5cAbHmqutYdTzzU/QRRvvLkiIsXrz151It9XmM626EVHVeytw9y1C0vQW9GfRTJ8HFQ/H5SqC+4lvYN7WW2HINzzQfWzCW39NWpY4188L4oymtZnAlfHv3heVOtNH2iCBmtPtQ9UT8b7U/qPBbRV9Z+6imDfceOgtmN92dVTduHiEpS6ZFcR4zdM8hfTE/wSYABEq9w9pMh+5wAAAABJRU5ErkJggg==",
              type: ResourcesEnum.ImageRes
          },
          { code: "enemy-2-1", path: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAABOCAYAAAB1/dXCAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIISURBVHja7FpbUsMwDIwoh4L7f8ClwMAwZoLajSTLaSBa/XTaTm2v1qtXKq215cz2sJzcCJAACZAACZAACZAACZAACZAACZAACfA/2uOshS7L89ThztvyImTwngx2e5fXnMfbEzUYMZk9F+1ajDLZmZulvToMoi8Qsyhads+LSGekBbUr632tfa6AiJDBm8xpTyJt6ejXPY00qTWX3QcxWYdBxBzyvJX/ovksuw9ish6Do3lMe9RiBH2f3fcqmpdhsOetUS1ka8rR9TZugtTuJrQmrPdZLXnX856D/SC6+0gLUc9Gf+c9BxlEUQp52vu77ARg9BzMg1b+yVYgUW0yD2oNrmrQlEb2rmSi5+i4zs+gt+/zenC04olqGZ2vv17aN656eRB5Fn3+M1Np231kNG+idRFz8KawmzDy0GoOOmXm4l2XlQxi0NIeMkuLpqf1TAUM3S0tksHRyqFr5rOC+MWkpUE0DctWPnUY9GrH67EVA7LuUjai4abmRmc4Hdf5GUT5JlsrIqZ0/zmrT9TnKjPZNqPoXh37qIWndmUZzHb092KyfB50Px+0ugsdJbOmo6x3QlDu+aD72YS3/9rLovmvXhRFFc3oM4Gj81+9KOqNpjc0ITtrz3UO1E/W+1P6lwe8XfWfuorg3HXzoHdifdjVc07h6jJoTcmOYkzfMCtenJ7BDwEGAPrXrFc5eGF5AAAAAElFTkSuQmCC",
              type: ResourcesEnum.ImageRes
          },
          {
              code: "player-1-bullets", path: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAWCAYAAADXYyzPAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABrSURBVHja7JbBCsAgDENb//+fsx10YCEYLxZcc1RC+qgtOgCb5BYOuvDeKBL9zZLkHzGrVCXf9CcS29xkJ0CIQIM8kKr+NOIKruD7gunmGvNI53exuVb+6nEFH3jV//uBsMpV0k1/GvEjwAAa7jAVF4qAdgAAAABJRU5ErkJggg==",
              type: ResourcesEnum.ImageRes },
          {
              code: "enemy-3-1", path: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAA0CAYAAAD19ArKAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAFnSURBVHja7FnRDsIwCCzOj3L//6A/pXWZqQ9k7KDMRDpIfJirtrse14NRrbV4Yirz+gfPcqdfjJfiUoIG9SLekHvR44NAvZU9JK3jh0VcvXAiWj/hFv5vcUUcbrHkAu1xtV1Pdd5MGjS+cZ3PK+XAOIhLOsuRlkJCFo3nyKP1xEfceqIhRNH32h3h3G/XcRHnWcyfTMttvhPaHUBcl9YX16ssCG3qspWbiLPa32nnj68q0pN61aVXTVDuxEcccayXw1q1QTs+PsetOm5VBXSfzz8Mx781J/IqEvJWlUB6juaP71U0taYm63vPAWk+1H0YF3FteN3j+ap8by/P68dRjFdzHoW01atkJwtW23X7BO31MvzEpEKJ+O4Jqq1s0H1rJ/h8qsIR1Prto1RmXMS5S1t88S63kbpIfRTru6h862ZVlXzrlguPWgFJXPb68VSV3n6LV02S496qPznu5bq1Wj8d4m8BBgC9MzBWpOM3jQAAAABJRU5ErkJggg==",
              type: ResourcesEnum.ImageRes },
          {
              code: "enemy-1-1", path: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA4CAYAAACyutuQAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAElSURBVHja7FrRDsIwCGydH6X//6A/pZhF2QMWCxtqw47E+LBl4+56QLdVIiqZ4lCSBQABEAABEAABEAABEAABEAABEACJmMqZ5t9oCffySqfQscVAFJOfjt/KpUZcX14nr0Ij+gVVruWhqOC1LZXf6p2el/IrdK/X51qk01eqnFadvKHlCQ95lWEmFwZfjEYphSrnVcbqQT5volil8inUmxB6a10q88ZYkFLWPPfnIcmgt09E9S+rN1HlzNXG6B1M21sVYqat1Ucqo00K/C+Pq/cxejidQpW/U9A6vbWDr50Uou6zn/3Q2n3QskMl27TtVcaaJ/qQ91mCxmT0PggKrVXq15H/7cPM7L/Y9a6AVp544QVAAARAtj40aqXr5ZVOoYcAAwBVqJgZdQn7YgAAAABJRU5ErkJggg==",
              type: ResourcesEnum.ImageRes },
          {
              code: "enemy-1-2", path: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA4CAYAAACyutuQAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAE+SURBVHja7FpbDsJACNytHkrv/6GX0jXG0KRYAvsgbdjhp0ltugzPgZpLKclTLum+OeCVHtnzvCUFEwACIADqk6t3dXvn5/Z++d33qnYIOQACIADaSB7N5aTq9mfJcnPhdgg5AAIgALIB+lYrPm2eQTS94rPtXq9QXyFWrT3X2+/4e+J66Iz5girnObGuueS8l+O5FN9DxJKJDfdazlqdakXSEzlU6xk+F5FFR3kKVa51UtVykJ4bvaeL5yGNIWixru0QRnnKqud8OcQtWNsnRvUva26iypmrjTF3wLZ7PaRtOHnMc89ITIGu/HfxHGMOx91tS53e2sFbmcKoc+aZh1rnIGnbo+VQK4eT9EQfqt0lSJbEV/CjmYL3v66m8dCyZ9mjrFsbAXt64oMXAAEQANn60FkrnaZXOA99BBgAPYSt3HxtEd8AAAAASUVORK5CYII=",
              type: ResourcesEnum.ImageRes },
          {
              code: "enemy-bullet", path: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAWCAYAAADwza0nAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABYSURBVHjaYvz//z8DNsDMYAmW+MtwnBGbPBMDmYAR3UaYTegA3WbKbUS36R/jCYjJ/y2w2ky2jSNBIyMw1LCGJoYNaKE7GqqDKx5x5Q5cgOLcQf8SACDAAKHvJlA3iz5KAAAAAElFTkSuQmCC",
              type: ResourcesEnum.ImageRes },
          {
              code: "enemy-bullet-target", path: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAOCAYAAAArMezNAAAABGdBTUEAAK/INwWK6QAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMS42/U4J6AAAAGRJREFUOE/VkDEOgEAIBImv8v8fW7UgAXZFLM7EYgrIMJecARixYUdH9dPQoWKR6qfhQh29wTvrw0qK2Kl2kL8sTAtxNIE6tBBHE6jzvz/28PSBJ7zzXfgOFYlUPw0dKhbJPuwA7VOl229hSMgAAAAASUVORK5CYII=",
              type: ResourcesEnum.ImageRes },
          {
              code: "boss-sub-1", path: " data: image / png; base64, iVBORw0KGgoAAAANSUhEUgAAAMQAAAD8CAYAAAAojwurAAAABGdBTUEAAK / INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAZSSURBVHja7N3dkto4EAZQBHmmrc37X2Qr7wTeqcrVCIqeTkuyYc65TBgwmA + prR + 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",
              type: ResourcesEnum.ImageRes
          },{
              code: "boss-sub-1_2", path: "data:image/png;base64,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",
              type: ResourcesEnum.ImageRes
          }
      ];

      let compiledRes = new CompiledResources();
      this.resourcesToLoad = compiledRes.res;

		}

    getRes():Map<string,any> {
        return this.resources;
    }

    getResourcesLoaded():Subject<boolean>{
        return this.resourcesLoaded;
    }

    // should only be called once.
    loadResources(){
        if(!this.loaderRun){
            this.loaderRun = true;
            for(let i = 0; i < this.resourcesToLoad.length;i++){
                const res = this.resourcesToLoad[i];
                if(res.type == ResourcesEnum.ImageRes){
                    this.loadImage(res.code,res.path);
                } else {

                }
            }
        }
    }

    loadImage(code,path) {
        let loadedImage:HTMLImageElement = new Image();
        loadedImage.crossOrigin = "Anonymous";
        loadedImage.src = path;

        loadedImage.onload = function () {
            this.imageLoaded(code,loadedImage);
        }.bind(this);
    }

    imageLoaded(code,loadedImage:HTMLImageElement){
        this.resources.set(code,loadedImage);
        // store as global variable and then copy(temp1) to copy the object
        //this.resourcesToLoadB64.push({code:code,path:this.imgToBase64(loadedImage),type:ResourcesEnum.ImageRes})
        if(this.resources.size == this.resourcesToLoad.length){
          //console.log("base64",this.resourcesToLoadB64);
          this.getResourcesLoaded().next(true);
        }
      }

	imgToBase64(img) {
	  const canvas = document.createElement('canvas');
	  const ctx = canvas.getContext('2d');
	  canvas.width = img.width;
	  canvas.height = img.height;
	  ctx.drawImage(img, 0, 0);
	  return canvas.toDataURL();
	}
}
