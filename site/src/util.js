"use strict";

g.util = {};

( function () {

	const m = {
		"fade": {
			"container": null,
			"action": null,
			"direction": null,
			"isActive": false,
			"speed": 0.05,
		}
	};

	g.util.fade = fade;

	function fade ( container, direction, action, speed ) {
		if( direction === undefined ) {
			direction = 1;
		}
		m.fade.container = container;
		m.fade.action = action;
		m.fade.direction = direction;
		if( speed !== undefined ) {
			m.fade.speed = speed;
		}
		if( m.fade.isActive ) {
			g.app.ticker.remove( m.fade.ticker );
		}
		m.fade.isActive = true;
		g.app.ticker.add( runFade);
	};

	function runFade( delta ) {
		const f = m.fade;
		if (
			( f.direction === 1 && f.container.alpha >= 1 ) ||
			( f.direction === -1 && f.container.alpha <= 0 )
		) {
			f.isActive = false;
			g.app.ticker.remove( fade );
			if ( f.action ) {
				f.action();
			}
			return;
		}
		f.container.alpha += f.speed * f.direction * delta;
	}

} )();
