import { Injectable } from '@angular/core';
import { OptionsService } from './options.service';

export enum SoundResEnum {
  TYPESOUND="TYPESOUND",
  TYPEBG="TYPEBG"
}

@Injectable({
  providedIn: 'root'
})
export class AudioServiceService {

  public soundAffectVolume:number;
  public backgroundSoundVolume:number;

  public audioMap:AudioSound[] = [];
  public audioWaitMap:{name:string,time:number}[] = [];

  constructor( optionsService: OptionsService ) {
    this.soundAffectVolume = optionsService.soundAffectVolume;
    this.backgroundSoundVolume = optionsService.backgroundSoundVolume;
    // todo subscribers probably want to listen to the options setters
  }

  update() {
    this.audioWaitMap.forEach(audio => audio.time=audio.time-1);
    this.audioWaitMap = this.audioWaitMap.filter(audio => audio.time > 0);
  }
	//https://developer.mozilla.org/en/docs/Web/HTML/Element/audio

	addAudio( name, audio:HTMLAudioElement, type = SoundResEnum.TYPESOUND) {
    if(type == SoundResEnum.TYPEBG) {
      this.audioMap.push(new AudioSound(name,audio,type,this.backgroundSoundVolume));
    } else if(type == SoundResEnum.TYPESOUND) {
      this.audioMap.push(new AudioSound(name,audio,type,this.soundAffectVolume));
    }
	}

  /**
   * Will probably be used for the BG sounds, as they can be looped and paused.
   */
	playAudio( name, loop:boolean=false) {
    const audioObj = this.audioMap.find(audio => audio.name == name);
    if(audioObj){
      const waitTime = this.audioWaitMap.find(waitTime => waitTime.name == name);
      if(!waitTime){
        audioObj.audio.volume = audioObj.volume;
        if(audioObj.audio.readyState > 0)
          audioObj.audio.play();
        if(loop){
          audioObj.audio.loop = true;
        }
        this.audioWaitMap.push({name:name, time:5});
			}
    } else {
      console.log("Could not find audio "+name);
    }
	}

  /**
   * Will probably be used for the sound effects
   */
	playAudioNewInstance( name ) {
    const audioObj = this.audioMap.find(audio => audio.name == name);
    if(audioObj){
      const waitTime = this.audioWaitMap.find(waitTime => waitTime.name == name);
      if(!waitTime){
        var tmp = new Audio();
        tmp.src = audioObj.audio.src;
        tmp.volume = audioObj.volume;
        tmp.play();
        this.audioWaitMap.push({name:name, time:5});
      }
    }
	}

	stopAudio( name, resetTime:boolean=false) {
    const audioObj = this.audioMap.find(audio => audio.name == name);
    if(audioObj){
      audioObj.audio.pause();
      if(resetTime) {
        audioObj.audio.currentTime = 0;
      }
    }
	}

	stopAllAudio( resetTime:boolean=false ) {
    for( let audioObj of this.audioMap ) {
      audioObj.audio.pause();
      if(resetTime) {
        audioObj.audio.currentTime = 0;
      }
    }
	}

	loopAudio( name, bool = true ) {
    const audioObj = this.audioMap.find(audio => audio.name == name);
    if(audioObj){
      audioObj.audio.loop = bool;
    }
	}

	// adjustAudio(topic, {sav, bsv}){ // if a user moves a sound slider on sf or bg sound, have to loop over all sounds and set their volume. // some may be hard coded
	// 	let p = this.props;

	// 	if(sav){
	// 		p.soundAffectVolume = sav/10;
	// 	}
	// 	if(bsv){
	// 		p.backgroundSoundVolume = bsv/10; // because slider works with 0-9 but audio uses 0-0.9
	// 	}

	// 	for (let key in p.audioMap) {
	// 		if (p.audioMap.hasOwnProperty(key)) {
	// 			let d = p.audioMap[key];
	// 			if(d.type == "TYPESOUND"){
	// 				d.volume = p.soundAffectVolume;
	// 			}
	// 			else{ // only one other option at the moment TYPEBG
	// 				d.volume = p.backgroundSoundVolume;
	// 			}
	// 		}
	// 	}
	// }
}

export class AudioSound {

  constructor(
    public name:string,
    public audio:HTMLAudioElement,
    public type:SoundResEnum,
    public volume:number = 0.1
  ) {

  }

}
