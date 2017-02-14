require('../styles/MusicPlayer.scss');
var mp3source = require('../Music/sugar.mp3');

import React from 'react';
import ReactDOM from 'react-dom';


class MusicPlayer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id="audio_btn" className="off rotate">
      			<audio loop="loop" src={mp3source} id="media" autoPlay="autoPlay" preload="auto"></audio>
      		</div>
		);
	}
}
MusicPlayer.propTypes = {
	name: React.PropTypes.string,
}

module.exports = MusicPlayer;