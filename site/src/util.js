"use strict";

g.util = {};

( function () {

	const m = {
		"animate": {
			"animations": [],
			"ticker": null
		}
	};

	g.util.fade = fade;
	g.util.ease = ease;
	g.util.rotate = rotate;

	function fade ( container, direction, speed, onStep, onComplete ) {
		if( direction === undefined || direction === null ) {
			direction = 1;
		}
		if( speed === undefined || speed === null ) {
			speed = 0.05;
		}
		return animate( {
			"action": "fade",
			"container": container,
			"direction": direction,
			"speed": speed,
			"onStep": onStep,
			"onComplete": onComplete
		} );
	}

	function ease( from, to, duration, onStep, onComplete ) {
		if( !Array.isArray( from ) ) {
			from = [ from ];
		}
		if( !Array.isArray( to ) ) {
			to = [ to ];
		}

		// Compute the change for each value
		const change = [];
		for( let i = 0; i < from.length; i++ ) {
			const diff = to[ i ] - from[ i ];
			change.push( diff );
		}

		return animate( {
			"action": "ease",
			"from": from,
			"to": to,
			"change": change,
			"duration": duration,
			"onStep": onStep,
			"onComplete": onComplete
		} );
	}

	function rotate( container, speed ) {
		if( speed === undefined || speed === null ) {
			speed = 0.05;
		}
		animate( {
			"action": "rotate",
			"container": container,
			"speed": speed
		} );
	}

	function animate( options ) {
		if( !options.duration ) {
			options.duration = Infinity;
		}
		const animation = {
			"action": options.action,
			"duration": options.duration,
			"elapsed": 0,
			"onComplete": options.onComplete,
			"onStep": options.onStep,
			"stepFunction": null,
			"isActive": true
		};
		if( animation.action === "fade" ) {
			animation.stepFunction = fadeStep;
			animation.container = options.container;
			animation.direction = options.direction;
			animation.speed = options.speed;
		} else if( animation.action === "ease" ) {
			animation.stepFunction = easeStep;
			animation.from = options.from;
			animation.to = options.to;
			animation.change = options.change;
		} else if( animation.action === "rotate" ) {
			animation.stepFunction = rotateStep;
			animation.container = options.container;
			animation.speed = options.speed;
		}
		m.animate.animations.push( animation );

		if( !m.animate.ticker ) {
			m.animate.ticker = g.app.ticker.add( runAnimations );
		}

		return {
			"stop": function () {
				const index = m.animate.animations.indexOf( animation );
				if( index !== -1 ) {
					m.animate.animations.splice( index, 1 );
				}
			}
		};
	}

	function runAnimations( delta ) {
		const animationsToRemove = [];
		m.animate.animations.forEach( ( animation, i ) => {
			animation.elapsed += delta;
			const timeRemaining = animation.duration - animation.elapsed;
			const t = timeRemaining / animation.duration;
			const stepValue = animation.stepFunction( animation, delta, t );
			if( animation.onStep ) {
				animation.onStep( stepValue );
			}
			if( timeRemaining <= 0 || animation.isActive === false ) {
				animation.elapsed = 0;
				animationsToRemove.push( i );
				if( animation.onComplete ) {
					animation.onComplete();
				}
				return;
			}
		} );

		// Remove completed animations
		for ( let i = 0; i < animationsToRemove.length; i++ ) {
			m.animate.animations.splice( animationsToRemove[ i ], 1 );
		}

		// Remove ticker if there are no more animations
		if( m.animate.animations.length === 0 ) {
			g.app.ticker.remove( animate );
			m.animate.ticker = null;
		}
	}

	function fadeStep( animation, delta, t ) {
		const f = animation;
		if (
			( f.direction === 1 && f.container.alpha >= 1 ) ||
			( f.direction === -1 && f.container.alpha <= 0 )
		) {
			f.isActive = false;
			return;
		}
		f.container.alpha += f.speed * f.direction * delta;
	}

	function easeStep( animation, delta, t ) {
		const vals = [];
		for( let i = 0; i < animation.from.length; i++ ) {
			const val = animation.from[ i ] + ( 1 - easeInOutSine( t ) ) * animation.change[ i ];
			vals.push( val );
		}
		return vals;
	}

	function rotateStep( animation, delta ) {
		animation.container.rotation += animation.speed * delta;
	}

	function easeInOutSine( time ) {
		return ( 1 - Math.cos( Math.PI * time ) ) / 2;
	}

} )();
