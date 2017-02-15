require('../styles/MusicPlayer.scss');
var mp3source = require('../Music/sugar.mp3');

import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

class MusicPlayer extends React.Component {
	constructor(props) {
		super(props);
		this.musicPlay = this.musicPlay.bind(this);
		this.state = {
			played: false
		}
	}

	musicPlay(e) {
		var media = document.getElementById("media");
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
		var classes = cx({
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