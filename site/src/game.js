"use strict";

g.game = {};

( function () {

	const m = {
		"container": null,
		"tileContainerSize": 64,
		"tileSize": 50,
		"tileGap": 0,
		"tileBackTint": "#5183ee",
		"validSquareTint": "#6aff6a",
		"invalidSquareTint": "#ff6a6a",
		"clearedSquareTint": "#eeee86",
		"nextPiece": null,
		"level": null,
		"map": null,
		"isActive": false,
		"activeSquare": null,
		"discardCounter": null
	};

	g.game.start = start;

	function start( level ) {
		m.level = level;
		m.container = new PIXI.Container();
		g.app.stage.addChild( m.container );
		createBlackHole();
		createGame();
	}

	function createGame() {
		let startBoardSquare = null;
		m.map = [];
		const level = m.level;
		for ( let row = 0; row < level.height; row++ ) {
			m.map.push( [] );
			for ( let col = 0; col < level.width; col++ ) {
				const boardSquare = createBoardSquare( col, row );
				m.map[ row ].push( {
					"tile": null,
					"square": boardSquare,
					"backTint": m.tileBackTint,
					"cleared": false,
				} );
				if( col === level.start[ 0 ] && row === level.start[ 1 ] ) {
					startBoardSquare = boardSquare;
				}
			}
		}

		// Create the starting tile
		const pos = tilePosToScreenPos( level.start );
		const tile = createTile( "*", "*", pos[ 0 ], pos[ 1 ] );
		placeTile( startBoardSquare, tile );
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
		let offsetY = 0;
		if( m.level.height > 8 ) {
			offsetY = m.tileContainerSize * 1.5;
		} else if( m.level.height > 7 ) {
			offsetY = m.tileContainerSize;
		} else if( m.level.height > 6 ) {
			offsetY = m.tileContainerSize / 2;
		}
		return [
			( tile[ 0 ] * ( m.tileContainerSize + m.tileGap ) ) +
				g.width / 2 - m.tileContainerSize * ( m.level.width - 1 ) / 2,
			( tile[ 1 ] * ( m.tileContainerSize + m.tileGap ) ) +
				( g.height / 2 - m.tileContainerSize * m.level.height / 2 ) - offsetY
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
		tile.sprite = sprite;
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
		m.nextPiece.ease = g.util.ease(
			[ m.nextPiece.container.x, m.nextPiece.container.y ],
			[ g.width - g.width / 4, g.height - m.tileSize * 3 ],
			500,
			function ( pos ) {
				m.nextPiece.container.x = pos[ 0 ];
				m.nextPiece.container.y = pos[ 1 ];
			}, function () {
				runDiscardAnimation( m.nextPiece );
				m.level.discards--;
				if( m.level.discards < 0 ) {
					m.level.discards = 0;
					console.log( "Game Over" );
				} else {
					createNextPiece();
				}
				m.discardCounter.text = m.level.discards;

			}
		);
		m.isActive = true;
	}

	function runDiscardAnimation( piece ) {
		g.util.ease(
			[ piece.container.scale.x, piece.container.scale.y ],
			[ 0, 0 ],
			30,
			function ( pos ) {
				piece.container.scale.x = pos[ 0 ];
				piece.container.scale.y = pos[ 1 ];
			}, function () {
				m.container.removeChild( piece.container );
				piece.container = null;
			}
		);
		g.util.rotate( piece.container, 0.2, 30 );
	}

	function createBlackHole() {

		// Create the black hole sprite
		const blackHole = new PIXI.Sprite( g.spritesheet.textures[ "black_hole.png" ] );
		blackHole.anchor.set( 0.5 );
		blackHole.x = g.width - g.width / 4;
		blackHole.y = g.height - m.tileSize * 3;
		blackHole.scale.x =  0.85;
		blackHole.scale.y =  0.85;
		blackHole.interactive = true;
		blackHole.buttonMode = true;
		blackHole.on( "pointerdown", blackHolePointerDown );
		blackHole.on( "pointerover", function () {
			blackHole.tint = "#aaaaaa"
		} );
		blackHole.on( "pointerout", function () {
			blackHole.tint = "#ffffff";
		} );
		m.container.addChild( blackHole );

		// Create the black hole animation
		g.util.rotate( blackHole, 0.004 );

		// Create the discard counter text
		const discardCounter = new PIXI.Text( m.level.discards, {
			"fontFamily": "Arial",
			"fontSize": 32,
			"fill": "#ffffff",
			"stroke": "#000000",
			"strokeThickness": 5
		} );
		discardCounter.anchor.set( 0.5 );
		discardCounter.x = g.width - g.width / 4;
		discardCounter.y = g.height - m.tileSize * 3 - blackHole.height / 2;
		m.container.addChild( discardCounter );
		m.discardCounter = discardCounter;
	}

	function blackHolePointerDown( e ) {
		moveNextPiece( e.currentTarget.x, e.currentTarget.y, function () {
			runDiscardAnimation( m.nextPiece );
			m.level.discards--;
			if( m.level.discards < 0 ) {
				m.level.discards = 0;
				console.log( "Game Over" );
			} else {
				createNextPiece();
			}
			m.discardCounter.text = m.level.discards;
		} );
	}

	function moveNextPiece( x, y, onComplete ) {
		if( !m.isActive ) {
			return;
		}
		m.isActive = false;
		m.nextPiece.ease.stop();
		m.nextPiece.ease = g.util.ease(
			[ m.nextPiece.container.x, m.nextPiece.container.y ],
			[ x, y ],
			25,
			function ( pos ) {
				m.nextPiece.container.x = pos[ 0 ];
				m.nextPiece.container.y = pos[ 1 ];
			},
			function () {
				onComplete();
			}
		);
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
		const square = m.map[ boardSquare.customData.y ][ boardSquare.customData.x ];
		boardSquare.tint = square.backTint;
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
		moveNextPiece( boardSquare.x, boardSquare.y, function () {
			placeTile( boardSquare, m.nextPiece );
		} );
	}

	function placeTile( boardSquare, tile ) {
		const pos = boardSquare.customData;
		m.map[ pos.y ][ pos.x ].tile = tile;
		m.map[ pos.y ][ pos.x ].backTint = m.clearedSquareTint;
		m.map[ pos.y ][ pos.x ].cleared = true;
		boardSquare.tint = m.clearedSquareTint;
		createNextPiece();

		// Set the tint of the active square
		if( m.activeSquare ) {
			setSquareHoverTint( m.activeSquare );
		}

		// Check if row is cleared
		let rowCleared = true;
		for( let col = 0; col < m.level.width; col++ ) {
			if( !m.map[ pos.y ][ col ].tile ) {
				rowCleared = false;
				break;
			}
		}
		if( rowCleared ) {
			clearRow( pos.y );
		}

		// Check if column is cleared
		let colCleared = true;
		for( let row = 0; row < m.level.height; row++ ) {
			if( !m.map[ row ][ pos.x ].tile ) {
				colCleared = false;
				break;
			}
		}
		if( colCleared ) {
			clearColumn( pos.x );
		}

		// Check if the level is complete
		let levelComplete = true;
		for( let row = 0; row < m.level.height; row++ ) {
			for( let col = 0; col < m.level.width; col++ ) {
				if( !m.map[ row ][ col ].cleared ) {
					levelComplete = false;
					break;
				}
			}
		}
		if( levelComplete ) {
			completeLevel();
		}
	}

	function clearRow( row ) {
		for( let col = 0; col < m.level.width; col++ ) {
			const tile = m.map[ row ][ col ].tile;
			if( tile ) {
				m.container.removeChild( tile.container );
				m.map[ row ][ col ].tile = null;
			}
		}
	}

	function clearColumn( col ) {
		for( let row = 0; row < m.level.height; row++ ) {
			const tile = m.map[ row ][ col ].tile;
			if( tile ) {
				m.container.removeChild( tile.container );
				m.map[ row ][ col ].tile = null;
			}
		}
	}

	function completeLevel() {
		unloadLevel();
	}

	function unloadLevel() {

		while( m.container.children.length > 0 ) {
			m.container.removeChildAt( 0 );
		}
		m.container = null;
		m.nextPiece = null;
		m.level = null;
		m.map = null;
		m.isActive = false;
		m.activeSquare = null;
		m.discardCounter = null;
	}

	function canPlaceTile( boardSquare ) {
		const pos = boardSquare.customData;
		const tile = m.map[ pos.y ][ pos.x ].tile;
		if( tile ) {
			return false;
		}

		const nextPiece = m.nextPiece;

		let hasMatch = false;

		// Check if the tile is adjacent to another tile
		const neighbors = getNeighbors( pos.x, pos.y );
		for( let i = 0; i < neighbors.length; i++ ) {
			const neighborTile = neighbors[ i ].tile;
			if( !neighborTile ) {
				continue;
			}
			if(
					neighborTile.shape !== "*" &&
					neighborTile.color !== nextPiece.color &&
					neighborTile.shape !== nextPiece.shape
			) {
				return false;
			} else {
				hasMatch = true;
			}
		}
		return hasMatch;
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