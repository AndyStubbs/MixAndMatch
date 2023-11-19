"use strict";

g.game = {};

( function () {

	const m = {
		"container": null,
		"tileContainerSize": 64,
		"tileSize": 50,
		"tileGap": 0,
		"tileBackTint": "#3f372c",
		"tileBackTintHover": "#8a8a6a",
		"nextPieceBackTint": "#121212",
		"wildcardTint": "#838383",
		"level": 0,
		"levels": [
			{ "name": "Level 1", "width": 3, "height": 3, "start": [ 1, 1 ] }
		]
	};

	g.game.start = start;

	function start() {
		createGame();
		createNextPiece();
	}

	function createGame() {
		m.container = new PIXI.Container();
		g.app.stage.addChild( m.container );

		const level = m.levels[ m.level ];
		for ( let i = 0; i < level.height; i++ ) {
			for ( let j = 0; j < level.width; j++ ) {

				// Create the tile background sprite
				const tileBack = new PIXI.Sprite( g.spritesheet.textures[ "BackTile_06.png" ] );
				tileBack.tint = m.tileBackTint;
				tileBack.anchor.set( 0.5 );

				// Set the scale so that the tile is the right size
				tileBack.scale.x =  m.tileContainerSize / tileBack.width;
				tileBack.scale.y =  m.tileContainerSize / tileBack.height;

				// Set the position so that the tile is in the right place
				const pos = tilePosToScreenPos( [ j, i ] );
				tileBack.x = pos[ 0 ];
				tileBack.y = pos[ 1 ];

				// Setup the tile to be interactive
				tileBack.interactive = true;
				tileBack.buttonMode = true;

				// Setup events for the tile
				tileBack.on( "pointerover", function () {
					this.tint = m.tileBackTintHover;
				} );

				tileBack.on( "pointerout", function () {
					this.tint = m.tileBackTint;
				} );

				// Add the tile to the game container
				m.container.addChild( tileBack );
			}
		}

		// Create the starting tile
		const tile = new PIXI.Sprite( g.spritesheet.textures[ "tileGrey_39.png" ] );
		tile.tint = m.wildcardTint;
		tile.anchor.set( 0.5 );

		// Set the scale so that the tile is the right size
		tile.scale.x =  m.tileSize / tile.width;
		tile.scale.y =  m.tileSize / tile.height;
		const pos = tilePosToScreenPos( level.start );
		tile.x = pos[ 0 ];
		tile.y = pos[ 1 ];
		m.container.addChild( tile );

		// Create the next piece tile background
		const nextPieceBack = new PIXI.Sprite( g.spritesheet.textures[ "BackTile_06.png" ] );
		nextPieceBack.tint = m.nextPieceBackTint;
		nextPieceBack.anchor.set( 0.5 );
		
		// Set the scale so that the tile is the right size
		nextPieceBack.scale.x =  m.tileContainerSize / nextPieceBack.width;
		nextPieceBack.scale.y =  m.tileContainerSize / nextPieceBack.height;
		nextPieceBack.x = g.width / 2;
		nextPieceBack.y = g.height - m.tileSize * 3;
		m.container.addChild( nextPieceBack );
	}

	function tilePosToScreenPos( tile ) {
		return [
			( tile[ 0 ] * ( m.tileContainerSize + m.tileGap ) ) +
				g.width / 2 - m.tileContainerSize * ( m.levels[ m.level ].width - 1 ) / 2,
			( tile[ 1 ] * ( m.tileContainerSize + m.tileGap ) ) +
				g.height / 2 - m.tileContainerSize * m.levels[ m.level ].height / 2
		];
	}

	function createNextPiece() {
		const nextPiece = new PIXI.Sprite( g.spritesheet.textures[ "tileBlue_33.png" ] );
		nextPiece.tint = m.wildcardTint;
		nextPiece.anchor.set( 0.5 );

		// Set the scale so that the tile is the right size
		nextPiece.scale.x =  m.tileSize / nextPiece.width;
		nextPiece.scale.y =  m.tileSize / nextPiece.height;
		nextPiece.x = g.width / 2;
		nextPiece.y = g.height - m.tileSize * 3;
		m.container.addChild( nextPiece );
	}

} )();