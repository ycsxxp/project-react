require('../styles/MusicPlayer.scss');
var mp3source = require('../Music/sugar.mp3');

import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

class MusicPlayer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			played: false
		}
		//获取播放器
		let media = document.getElementById('media');
		// (function(){
			//ios Safari不允许自动播放 监听一个ios 屏幕触摸事件touchstart
		    document.addEventListener('touchstart', function(){
		    	media.play();
		    	this.setState({
					played: !this.state.played 
				});
		    }, false);

		    //微信中自动播放 解决 监听微信WeixinJSBridgeReady事件
		    document.addEventListener("WeixinJSBridgeReady", function () {
		    	media.play();
		    	this.setState({
					played: !this.state.played 
				});
			}, false);
		// })();
		this.musicPlay = this.musicPlay.bind(this);
		

	}

	musicPlay(e) {
		if(this.state.played){
			media.pause();
		}else {
			media.play();
		}
		this.setState({
			played: !this.state.played 
		});
	}

	render() {
		let classes = cx({
			'off': true,
			'rotate': this.state.played
		});
		return (
			<div id="audio_btn" className={classes} onClick={this.musicPlay}>
      			<audio loop="loop" src={mp3source} id="media" preload="auto"></audio>
      		</div>
		);
	}
}
MusicPlayer.propTypes = {
	name: React.PropTypes.string,
}

module.exports = MusicPlayer;