const {
	readFileSync
} = require('fs');

const bmfont2json = require('bmfont2json');
const Datauri = require('datauri');

module.exports = (font_path, texture_path) => {
	var json_fnt = bmfont2json(readFileSync(font_path));

	var react_fnt = {};


	const {
		common
	} = json_fnt;

	react_fnt.NaturalWidth = common.scaleW;
	react_fnt.NaturalHeight = common.scaleH;

	react_fnt.FontHeight = common.base;
	react_fnt.MaxAscent = common.lineHeight;
	react_fnt.MaxDescent = (common.lineHeight - (common.lineHeight % 2)) / 2;


	react_fnt.Weights = [{
		AlphaCenterOffset: 0,
		ColorCenterOffset: 0
	}, {
		AlphaCenterOffset: -0.025,
		ColorCenterOffset: -0.025
	}, {
		AlphaCenterOffset: -0.0385,
		ColorCenterOffset: -0.0385
	}, {
		AlphaCenterOffset: -0.05,
		ColorCenterOffset: -0.05
	}];


	react_fnt.Glyphs = json_fnt.chars.map((value) => {
		const {
			id,
			x,
			y,
			width,
			height,
			xadvance,
			xoffset,
			yoffset
		} = value;

		return [id, x, y, width, height, xadvance, 0, xoffset, -yoffset];
	});


	return `
		const font_json = ${JSON.stringify(react_fnt)};
		const font_texture = '${Datauri.sync(texture_path)}';

		${readFileSync(__dirname + '/load.js')}
	`;
};