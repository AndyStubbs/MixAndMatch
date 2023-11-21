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
			"eases": [],
			"ticker": null
		},
		"rotate": {
			"rotations": [],
			"ticker": null
		}
	};

	g.util.fade = fade;
	g.util.ease = ease;
	g.util.rotate = rotate;

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
		const ease = {
			"from": from,
			"to": to,
			"change": [],
			"duration": duration,
			"elapsed": 0,
			"onStep": onStep,
			"onComplete": onComplete
		};

		// Compute the change for each value
		for( let i = 0; i < from.length; i++ ) {
			const diff = to[ i ] - from[ i ];
			ease.change.push( diff );
		}

		m.ease.eases.push( ease );
		if( !m.ease.ticker ) {
			m.ease.ticker = g.app.ticker.add( runEase );
		}

		return {
			"stop": function () {
				const index = m.ease.eases.indexOf( ease );
				if( index !== -1 ) {
					m.ease.eases.splice( index, 1 );
				}
			}
		};
	}

	function runEase( delta ) {
		const easesToRemove = [];
		m.ease.eases.forEach( ( ease, i ) => {
			ease.elapsed += delta;
			const timeRemaining = ease.duration - ease.elapsed;
			if ( timeRemaining <= 0 ) {
				ease.elapsed = 0;
				ease.onStep( ease.to );
				easesToRemove.push( i );
				if ( ease.onComplete ) {
					ease.onComplete();
				}
				return;
			}
			const t = timeRemaining / ease.duration;
			const vals = [];
			for( let i = 0; i < ease.from.length; i++ ) {
				const val = ease.from[ i ] + ( 1 - easeInOutSine( t ) ) * ease.change[ i ];
				vals.push( val );
			}
			ease.onStep( vals );
		} );

		// Remove completed eases
		for ( let i = 0; i < easesToRemove.length; i++ ) {
			m.ease.eases.splice( easesToRemove[ i ], 1 );
		}

		// Remove ticker if there are no more eases
		if( m.ease.eases.length === 0 ) {
			g.app.ticker.remove( runEase );
			m.ease.ticker = null;
		}
	}

	function easeInOutSine( time ) {
		return ( 1 - Math.cos( Math.PI * time ) ) / 2;
	}

	function rotate( container, speed ) {
		const rotation = {
			"container": container,
			"speed": speed
		};
		m.rotate.rotations.push( rotation );
		if ( !m.rotate.ticker ) {
			m.rotate.ticker = g.app.ticker.add( runRotate );
		}
	}

	function runRotate( delta ) {
		for ( let i = 0; i < m.rotate.rotations.length; i++ ) {
			const rotation = m.rotate.rotations[ i ];
			rotation.container.rotation += rotation.speed * delta;
		}
	}

} )();
