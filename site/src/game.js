"use strict";

g.game = {};

( function () {

	const m = {
		"gameContainer": null,
		"tileContainerSize": 64,
		"tileSize": 50,
		"tileGap": 0,
		"level": 0,
		"levels": [
			{ "name": "Level 1", "width": 3, "height": 3, "start": [ 1, 1 ] }
		]
	};

	g.game.start = start;

	function start() {
		createGame();
	}

	function createGame() {
		m.gameContainer = new PIXI.Container();
		g.app.stage.addChild( m.gameContainer );

		const width = g.width;
		const height = g.height;
		const background = new PIXI.TilingSprite( g.background, width, height );
		background.anchor.set( 0.5 );
		background.x = g.width / 2;
		background.y = g.height / 2;
		background.tint = "#96A6BC";
		background.alpha = 0.5;
		m.gameContainer.addChild( background );

		const level = m.levels[ m.level ];
		for ( let i = 0; i < level.height; i++ ) {
			for ( let j = 0; j < level.width; j++ ) {

				// Create the tile background sprite
				const tileBack = new PIXI.Sprite( g.spritesheet.textures[ "BackTile_06.png" ] );
				tileBack.tint = "#bcbcbc";
				tileBack.anchor.set( 0.5 );

				// Set the scale so that the tile is the right size
				tileBack.scale.x =  m.tileContainerSize / tileBack.width;
				tileBack.scale.y =  m.tileContainerSize / tileBack.height;

				// Set the position so that the tile is in the right place
				const pos = tilePosToScreenPos( [ j, i ] );
				tileBack.x = pos[ 0 ];
				tileBack.y = pos[ 1 ];

				// Set the alpha so that the tile is transparent
				tileBack.alpha = 0.75;

				m.gameContainer.addChild( tileBack );
			}
		}

		// Create the starting tile
		const tile = new PIXI.Sprite( g.spritesheet.textures[ "tileGrey_39.png" ] );
		tile.tint = "#838383";
		tile.anchor.set( 0.5 );

		// Set the scale so that the tile is the right size
		tile.scale.x =  m.tileSize / tile.width;
		tile.scale.y =  m.tileSize / tile.height;
		const pos = tilePosToScreenPos( level.start );
		tile.x = pos[ 0 ];
		tile.y = pos[ 1 ];
		m.gameContainer.addChild( tile );
	}

	function tilePosToScreenPos( tile ) {
		return [
			( tile[ 0 ] * ( m.tileContainerSize + m.tileGap ) ) +
				g.width / 2 - m.tileContainerSize * ( m.levels[ m.level ].width - 1 ) / 2,
			( tile[ 1 ] * ( m.tileContainerSize + m.tileGap ) ) +
				g.height / 2 - m.tileContainerSize * m.levels[ m.level ].height / 2
		];
	}

} )();