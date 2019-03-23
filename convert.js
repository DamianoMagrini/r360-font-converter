const { readFileSync } = require('fs');

const bmfont2json = require('bmfont2json');
const Datauri = require('datauri');

function is_valid_json(data) {
	try {
		JSON.parse(data);
		return true;
	} catch (e) {
		return false;
	}
}

module.exports = (font_path, texture_path) => {
	const data = readFileSync(font_path);

	let react_fnt = {};

	if (is_valid_json(data)) {
		const json_data = JSON.parse(data);

		react_fnt = {
			FontName: json_data.FontName,
			CommandLine: json_data.CommandLine,
			Version: json_data.Version,
			ImageFileName: json_data.ImageFileName,
			NaturalWidth: json_data.NaturalWidth,
			NaturalHeight: json_data.NaturalHeight,
			HorizontalPad: json_data.HorizontalPad,
			VerticalPad: json_data.VerticalPad,
			FontHeight: json_data.FontHeight,
			CenterOffset: json_data.CenterOffset,
			TweakScale: json_data.TweakScale,
			EdgeWidth: json_data.EdgeWidth,
			NumGlyphs: json_data.NumGlyphs,
			Weights: json_data.Weights || [
				{
					AlphaCenterOffset: 0.0,
					ColorCenterOffset: 0.0
				},
				{
					AlphaCenterOffset: -0.025,
					ColorCenterOffset: -0.025
				},
				{
					AlphaCenterOffset: -0.0385,
					ColorCenterOffset: -0.0385
				},
				{
					AlphaCenterOffset: -0.05,
					ColorCenterOffset: -0.05
				}
			],
			Glyphs: json_data.Glyphs
		};
	} else {
		const json_data = bmfont2json(data);

		const { common } = json_data;

		react_fnt.NaturalWidth = common.scaleW;
		react_fnt.NaturalHeight = common.scaleH;

		react_fnt.FontHeight = common.base;
		react_fnt.MaxAscent = common.lineHeight;
		react_fnt.MaxDescent = (common.lineHeight - (common.lineHeight % 2)) / 2;

		react_fnt.Weights = [
			{
				AlphaCenterOffset: 0,
				ColorCenterOffset: 0
			},
			{
				AlphaCenterOffset: -0.025,
				ColorCenterOffset: -0.025
			},
			{
				AlphaCenterOffset: -0.0385,
				ColorCenterOffset: -0.0385
			},
			{
				AlphaCenterOffset: -0.05,
				ColorCenterOffset: -0.05
			}
		];

		react_fnt.Glyphs = json_data.chars.map((value) => {
			const { id, x, y, width, height, xadvance, xoffset, yoffset } = value;

			return [id, x, y, width, height, xadvance, 0, xoffset, -yoffset];
		});
	}

	return `
		const font_json = ${JSON.stringify(react_fnt)};
		const font_texture = '${Datauri.sync(texture_path)}';

		${readFileSync(__dirname + '/load.js')}
	`;
};
