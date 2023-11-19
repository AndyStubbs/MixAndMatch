"use strict";

g.game = {};

( function () {

	const m = {
		"container": null,
		"tileContainerSize": 64,
		"tileSize": 50,
		"tileGap": 0,
		"tileBackTint": "#3f372c",
		"tileBackTintHover": "#6a8a6a",
		"nextPieceBackTint": "#aeaeae",
		"wildcardTint": "#838383",
		"nextPiece": null,
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
		for ( let row = 0; row < level.height; row++ ) {
			for ( let col = 0; col < level.width; col++ ) {
				createTileBack( col, row );
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
		const nextPieceBack = new PIXI.Sprite( g.spritesheet.textures[ "BackTile_05.png" ] );
		nextPieceBack.tint = m.nextPieceBackTint;
		nextPieceBack.anchor.set( 0.5 );
		
		// Set the scale so that the tile is the right size
		nextPieceBack.scale.x =  m.tileContainerSize / nextPieceBack.width;
		nextPieceBack.scale.y =  m.tileContainerSize / nextPieceBack.height;
		nextPieceBack.x = g.width / 2;
		nextPieceBack.y = g.height - m.tileSize * 3;
		m.container.addChild( nextPieceBack );
	}

	function createTileBack( x, y ) {

		// Create the tile background sprite
		const tileBack = new PIXI.Sprite( g.spritesheet.textures[ "BackTile_06.png" ] );
		tileBack.tint = m.tileBackTint;
		tileBack.anchor.set( 0.5 );

		// Set the scale so that the tile is the right size
		tileBack.scale.x =  m.tileContainerSize / tileBack.width;
		tileBack.scale.y =  m.tileContainerSize / tileBack.height;

		// Set the position so that the tile is in the right place
		const pos = tilePosToScreenPos( [ x, y ] );
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

		tileBack.on( "pointerdown", function () {
			g.util.ease(
				[ m.nextPiece.x, m.nextPiece.y ],
				[ tileBack.x, tileBack.y ],
				25,
				function ( pos ) {
					m.nextPiece.x = pos[ 0 ];
					m.nextPiece.y = pos[ 1 ];
				},
				function () {
					console.log( "Done" );
				}
			);
		} );

		// Add the tile to the game container
		m.container.addChild( tileBack );
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

		// Create the next piece container
		m.nextPiece = new PIXI.Container();
		m.nextPiece.x = g.width / 2;
		m.nextPiece.y = g.height - m.tileSize * 3;
		m.container.addChild( m.nextPiece );

		// Create the next piece tile
		const nextPieceSprite = new PIXI.Sprite( g.spritesheet.textures[ "tileBlue_33.png" ] );
		nextPieceSprite.tint = m.wildcardTint;
		nextPieceSprite.anchor.set( 0.5 );

		// Set the scale so that the tile is the right size
		nextPieceSprite.scale.x =  m.tileSize / nextPieceSprite.width;
		nextPieceSprite.scale.y =  m.tileSize / nextPieceSprite.height;
		nextPieceSprite.x = 0;
		nextPieceSprite.y = 0;
		m.nextPiece .addChild( nextPieceSprite );
	}

} )();