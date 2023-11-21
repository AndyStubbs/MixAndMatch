"use strict";

g.game = {};

( function () {

	const m = {
		"container": null,
		"tileContainerSize": 64,
		"tileSize": 50,
		"tileGap": 0,
		"tileBackTint": "#3f372c",
		"validSquareTint": "#6a8a6a",
		"invalidSquareTint": "#8a6a6a",
		"nextPieceBackTint": "#aeaeae",
		"wildcardTint": "#838383",
		"nextPiece": null,
		"level": null,
		"map": null,
		"isActive": false,
		"activeSquare": null
	};

	g.game.start = start;

	function start( level ) {
		m.level = level;
		createGame();
		createBlackHole();
		createNextPiece();
		m.isActive = true;
	}

	function createGame() {
		m.container = new PIXI.Container();
		g.app.stage.addChild( m.container );

		m.map = [];
		const level = m.level;
		for ( let row = 0; row < level.height; row++ ) {
			m.map.push( [] );
			for ( let col = 0; col < level.width; col++ ) {
				m.map[ row ].push( {
					"tile": null,
					"square": createBoardSquare( col, row )
				} );
			}
		}

		// Create the starting tile
		const pos = tilePosToScreenPos( level.start );
		const tile = createTile( "*", "*", pos[ 0 ], pos[ 1 ] );
		m.map[ level.start[ 1 ] ][ level.start[ 0 ] ].tile = tile;
	}

	function createBoardSquare( x, y ) {

		// Create the tile background sprite
		const boardSquare = new PIXI.Sprite( g.spritesheet.textures[ "BackTile_06.png" ] );

		boardSquare.customData = { "x": x, "y": y };
		boardSquare.tint = m.tileBackTint;
		boardSquare.anchor.set( 0.5 );

		// Set the scale so that the tile is the right size
		boardSquare.scale.x =  m.tileContainerSize / boardSquare.width;
		boardSquare.scale.y =  m.tileContainerSize / boardSquare.height;

		// Set the position so that the tile is in the right place
		const pos = tilePosToScreenPos( [ x, y ] );
		boardSquare.x = pos[ 0 ];
		boardSquare.y = pos[ 1 ];

		// Setup the tile to be interactive
		boardSquare.interactive = true;
		boardSquare.buttonMode = true;

		// Setup events for the tile
		boardSquare.on( "pointerover", squarePointerOver );

		boardSquare.on( "pointerout", squarePointerOut );

		boardSquare.on( "pointerdown", squarePointerDown );

		// Add the tile to the game container
		m.container.addChild( boardSquare );

		return boardSquare;
	}

	function tilePosToScreenPos( tile ) {
		return [
			( tile[ 0 ] * ( m.tileContainerSize + m.tileGap ) ) +
				g.width / 2 - m.tileContainerSize * ( m.level.width - 1 ) / 2,
			( tile[ 1 ] * ( m.tileContainerSize + m.tileGap ) ) +
				g.height / 2 - m.tileContainerSize * m.level.height / 2
		];
	}

	function createTile( shape, color, x, y ) {

		// Create the tile
		const tile = {
			"shape": shape,
			"color": color,
			"container": null,
			"sprite": null
		};

		// Create the tile container
		tile.container = new PIXI.Container();
		tile.container.x = x;
		tile.container.y = y;

		// Create the next piece tile
		if( color === "*" ) {
			color = "Grey";
		}
		let spriteName = "tile" + color + "_" + g.shapes[ shape ] + ".png";
		const sprite = new PIXI.Sprite( g.spritesheet.textures[ spriteName ] );
		//sprite.tint = m.wildcardTint;
		sprite.anchor.set( 0.5 );

		// Set the scale so that the tile is the right size
		sprite.scale.x =  m.tileSize / sprite.width;
		sprite.scale.y =  m.tileSize / sprite.height;
		sprite.x = 0;
		sprite.y = 0;

		tile.container.addChild( sprite );
		m.container.addChild( tile.container );

		return tile;
	}

	function createNextPiece() {
		const shape = m.level.shapes[ Math.floor( Math.random() * m.level.shapes.length ) ];
		const color = m.level.colors[ Math.floor( Math.random() * m.level.colors.length ) ];
		m.nextPiece = createTile( shape, color, g.width / 4, g.height - m.tileSize * 3 );

		// Slowly move the next piece to the black hole
		g.util.ease(
			[ m.nextPiece.container.x, m.nextPiece.container.y ],
			[ g.width - g.width / 4, g.height - m.tileSize * 3 ],
			125,
			function ( pos ) {
				m.nextPiece.container.x = pos[ 0 ];
				m.nextPiece.container.y = pos[ 1 ];
			}
		);
	}

	function createBlackHole() {
		const blackHole = new PIXI.Sprite( g.spritesheet.textures[ "black_hole.png" ] );
		blackHole.anchor.set( 0.5 );
		blackHole.x = g.width - g.width / 4;
		blackHole.y = g.height - m.tileSize * 3;
		blackHole.scale.x =  0.85;
		blackHole.scale.y =  0.85;
		m.container.addChild( blackHole );

		// Create the black hole animation
		g.util.rotate( blackHole, 0.004 );
	}

	function squarePointerOver( e ) {
		const boardSquare = e.currentTarget;

		m.activeSquare = boardSquare;
		setSquareHoverTint( boardSquare );
	}

	function setSquareHoverTint( boardSquare ) {
		if( m.isActive && canPlaceTile( boardSquare ) ) {
			boardSquare.tint = m.validSquareTint;
		} else {
			boardSquare.tint = m.invalidSquareTint;
		}
	}

	function squarePointerOut( e ) {
		const boardSquare = e.currentTarget;
		boardSquare.tint = m.tileBackTint;
		m.activeSquare = null;
	}

	function squarePointerDown( e ) {
		if( !m.isActive ) {
			return;
		}
		const boardSquare = e.currentTarget;
		if( !canPlaceTile( boardSquare ) ) {
			return;
		}
		m.isActive = false;
		g.util.ease(
			[ m.nextPiece.container.x, m.nextPiece.container.y ],
			[ boardSquare.x, boardSquare.y ],
			25,
			function ( pos ) {
				m.nextPiece.container.x = pos[ 0 ];
				m.nextPiece.container.y = pos[ 1 ];
			},
			function () {
				const pos = boardSquare.customData;
				m.map[ pos.y ][ pos.x ].tile = m.nextPiece;
				createNextPiece();
				m.isActive = true;
				if( m.activeSquare ) {
					setSquareHoverTint( m.activeSquare );
				}
			}
		);
	}

	function canPlaceTile( boardSquare ) {
		const pos = boardSquare.customData;
		const tile = m.map[ pos.y ][ pos.x ].tile;
		if ( tile ) {
			return false;
		}

		// Check if the tile is adjacent to another tile
		const neighbors = getNeighbors( pos.x, pos.y );
		for ( let i = 0; i < neighbors.length; i++ ) {
			const neighbor = neighbors[ i ];
			if ( neighbor.tile ) {
				return true;
			}
		}
		return false;
	}

	function getNeighbors( x, y ) {
		const neighbors = [];
		const level = m.level;
		if ( x > 0 ) {
			neighbors.push( m.map[ y ][ x - 1 ] );
		}
		if ( x < level.width - 1 ) {
			neighbors.push( m.map[ y ][ x + 1 ] );
		}
		if ( y > 0 ) {
			neighbors.push( m.map[ y - 1 ][ x ] );
		}
		if ( y < level.height - 1 ) {
			neighbors.push( m.map[ y + 1 ][ x ] );
		}
		return neighbors;
	}

} )();