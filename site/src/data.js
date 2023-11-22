"use strict";

const g = {
	"width": 675,
	"height": 900,
	"app": null,
	"spritesheet": null,
	"util": null,
	"game": null,
};

g.shapes = {
	"*": "39",
	"quad": "28",
	"pentagon": "29",
	"octogon": "30",
	"triangle": "31",
	"star1": "32",
	"star2": "33",
	"diamond": "34",
	"circle": "35",
	"heart": "36",
};

g.levels = [
	{
		"name": "Level 1",
		"width": 5,
		"height": 5,
		"start": [ 2, 2 ],
		"colors": [ "Red", "Blue", "Green" ],
		"shapes": [ "star2", "circle", "diamond" ],
		"discards": 3
	}
]