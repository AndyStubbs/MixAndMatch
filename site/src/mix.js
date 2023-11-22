"use strict";

( function () {

	window.addEventListener( "DOMContentLoaded", init );

	function init () {

		// Create the PIXI application
		g.app = new PIXI.Application( {
			"width": g.width,
			"height": g.height,
			"backgroundAlpha": 0
		} );
		document.body.appendChild( g.app.view );
		window.addEventListener( "resize", resize );
		resize();
		loadAssets();
		createTitleScreen();
	}

	function resize() {
		g.app.renderer.resize( g.width, g.height );
		const ratio1 = document.body.clientWidth / g.width;
		const ratio2 = document.body.clientHeight / g.height;
		const newWidth = Math.floor( g.width * Math.min( ratio1, ratio2 ) );
		const newHeight = Math.floor( g.height * Math.min( ratio1, ratio2 ) );
		const canvas = document.querySelector( "canvas" );
		canvas.style.width = newWidth + "px";
		canvas.style.height = newHeight + "px";
	}

	async function loadAssets() {
		const basicTexturesPromise = PIXI.Assets.load( "assets/images/tiles.json" );
		g.spritesheet = await basicTexturesPromise;
	}

	function createTitleScreen() {
		const titleScreen = new PIXI.Container();
		g.app.stage.addChild( titleScreen );

		const title = new PIXI.Text( "Title Screen", {
			"fontSize": 64,
			"fill": 0xffffff,
			"align": "center"
		} );
		title.anchor.set( 0.5 );
		title.x = g.width / 2;
		title.y = 200;
		titleScreen.addChild( title );

		const button = PIXI.Sprite.from( "assets/images/button.png" );
		button.tint = "#5353c3";
		button.anchor.set( 0.5 );
		button.x = g.width / 2;
		button.y = g.height / 2;
		button.interactive = true;
		button.buttonMode = true;
		button.on( "pointerdown", () => {
			g.util.fade( titleScreen, -1, null, null, () => {
				g.app.stage.removeChild( titleScreen );
				g.game.start( g.levels[ 0 ] );
			} );
		} );
		button.on( "pointerover", () => {
			button.tint = "#404096";
		} );
		button.on( "pointerout", () => {
			button.tint = "#5353c3";
		} );
		titleScreen.addChild( button );

		const buttonText = new PIXI.Text( "Start", {
			"fontSize": 32,
			"fill": 0xffffff,
			"align": "center"
		} );
		buttonText.anchor.set( 0.5 );
		button.addChild( buttonText );

	}

} )();