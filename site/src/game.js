"use strict";

g.game = {};

( function () {

	const m = {
		"level": 0,
		"levels": [
			{
				"name": "Level 1", 
				"map": [
					"...",
					".X.",
					"..."
				]
			}
		]
	};

	g.game.start = start;

	function start() {
		const background = new PIXI.Sprite( g.background );
		background.anchor.set( 0.5 );
		background.x = g.width / 2;
		background.y = g.height / 2;
		background.width = 480;
		background.height = 480;
		background.tint = "#96A6BC";
		g.app.stage.addChild( background );

		const level = m.levels[ m.level ];
		const map = level.map;
		for ( let i = 0; i < map.length; i++ ) {
			for ( let j = 0; j < map[ i ].length; j++ ) {
				const tile = new PIXI.Sprite( g.spritesheet.textures[ "tileGrey_21.png" ] );
				tile.anchor.set( 0.5 );
				tile.x = j * 128 - 128;
				tile.y = i * 128 - 128;
				tile.tint = "#beA6BC";
				background.addChild( tile );
			}
		}
	}

} )();