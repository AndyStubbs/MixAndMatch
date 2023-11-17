"use strict";

const g = {
	"width": 768,
	"height": 1024,
};

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

} )();