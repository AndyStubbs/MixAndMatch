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
		},
		"ease": {
			"from": null,
			"to": null,
			"change": null,
			"duration": null,
			"elapsed": 0,
			"onStep": null,
			"onComplete": null
		}
	};

	g.util.fade = fade;
	g.util.ease = ease;

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
			g.app.ticker.remove( runFade );
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
			g.app.ticker.remove( runFade );
			if ( f.action ) {
				f.action();
			}
			return;
		}
		f.container.alpha += f.speed * f.direction * delta;
	}

	function ease( from, to, duration, onStep, onComplete ) {
		if( !Array.isArray( from ) ) {
			from = [ from ];
		}
		if( !Array.isArray( to ) ) {
			to = [ to ];
		}
		m.ease.from = from;
		m.ease.to = to;
		m.ease.change = [];
		m.ease.duration = duration;
		m.ease.onStep = onStep;
		m.ease.onComplete = onComplete;

		// Compute the change for each value
		for( let i = 0; i < from.length; i++ ) {
			const diff = to[ i ] - from[ i ];
			m.ease.change.push( diff );
		}
		g.app.ticker.add( runEase );
	}

	function runEase( delta ) {
		m.ease.elapsed += delta;
		const timeRemaining = m.ease.duration - m.ease.elapsed;
		if ( timeRemaining <= 0 ) {
			m.ease.elapsed = 0;
			m.ease.onStep( m.ease.to );
			g.app.ticker.remove( runEase );
			if ( m.ease.onComplete ) {
				m.ease.onComplete();
			}
			return;
		}
		const t = timeRemaining / m.ease.duration;
		const vals = [];
		for( let i = 0; i < m.ease.from.length; i++ ) {
			const val = m.ease.from[ i ] + ( 1 - easeInOutSine( t ) ) * m.ease.change[ i ];
			vals.push( val );
		}
		m.ease.onStep( vals );
	}

	function easeInOutSine( time ) {
		return ( 1 - Math.cos( Math.PI * time ) ) / 2;
	}

} )();
