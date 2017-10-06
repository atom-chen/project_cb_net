/***********************************************************************
 ** Author:	jaron.ho
 ** Date:	2015-08-11
 ** Brief:	audio Model
 ***********************************************************************/
AudioModel = {
	mIsMusicEnabled: true,		// 音乐是否开启
	mIsSoundEnabled: true,		// 音效是否开启
	mCurrMusicURL: ""			// 当前播放音乐
};

// 初始化
AudioModel.init = function() {
    // 音乐
    var musicOn = laya.net.LocalStorage.getItem("MusicOn");
    if ('string' == typeof(musicOn) && musicOn.length > 0) {
        musicOn = parseInt(musicOn) ? true : false;
    } else {
        musicOn = true;
    }
    this.setMusicEnabled(musicOn);
    // 音效
    var soundOn = laya.net.LocalStorage.getItem("SoundOn");
    if ('string' == typeof(soundOn) && soundOn.length > 0) {
        soundOn = parseInt(soundOn) ? true : false;
    } else {
        soundOn = true;
    }
	this.setSoundEnabled(soundOn);
};

// 暂停音频
AudioModel.pause = function() {
	laya.media.SoundManager.stopMusic();
	laya.media.SoundManager.stopAll();
};

// 恢复音频
AudioModel.resume = function() {
	if (this.mIsMusicEnabled) {
		if (this.mCurrMusicURL.length > 0) {
			laya.media.SoundManager.playMusic(this.mCurrMusicURL);
		}
	}
};

// 设置音乐音量
AudioModel.setMusicVolume = function(volume) {
	laya.media.SoundManager.setMusicVolume(volume);
};

// 设置音效音量
AudioModel.setSoundVolume = function(volume) {
	laya.media.SoundManager.setSoundVolume(volume);
};

// 获取音乐音量
AudioModel.getMusicVolume = function() {
	return laya.media.SoundManager.musicVolume;
};

// 获取音效音量
AudioModel.getSoundVolume = function() {
	return laya.media.SoundManager.soundVolume;
};

// 设置音乐开启
AudioModel.setMusicEnabled = function(enabled) {
	if (enabled) {
		if (this.mCurrMusicURL.length > 0) {
			laya.media.SoundManager.playMusic(this.mCurrMusicURL);
		}
	} else {
		laya.media.SoundManager.stopMusic();
	}
	this.mIsMusicEnabled = enabled ? true : false;
	laya.net.LocalStorage.setItem("MusicOn", this.mIsMusicEnabled ? "1" : "0");
};

// 设置音效开启
AudioModel.setSoundEnabled = function(enabled) {
	if (!enabled) {
		laya.media.SoundManager.stopSound();
	}
	this.mIsSoundEnabled = enabled ? true : false;
	laya.net.LocalStorage.setItem("SoundOn", this.mIsSoundEnabled ? "1" : "0");
};

// 音乐是否开启
AudioModel.isMusicEnabled = function() {
	return this.mIsMusicEnabled;
};

// 音效是否开启
AudioModel.isSoundEnabled = function() {
	return this.mIsSoundEnabled;
};

// 停止音乐
AudioModel.stopMusic = function() {
	laya.media.SoundManager.stopMusic();
};

// 播放音乐
AudioModel.playMusic = function(musicId) {
	this.stopMusic();
	if (this.mIsMusicEnabled) {
		var musicData = DataTB.get("audio_tplt", musicId, false);
		if (musicData) {
			this.mCurrMusicURL = ResURL(musicData.file)
			laya.media.SoundManager.playMusic(this.mCurrMusicURL);
		}
	}
};

// 播放音效
AudioModel.playSound = function(effectId) {
	if (this.mIsSoundEnabled) {
		var soundData = DataTB.get("audio_tplt", effectId, false);
		if (soundData) {
			laya.media.SoundManager.playSound(ResURL(soundData.file));
		}
	}
};
