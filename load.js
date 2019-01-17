import * as THREE from 'three';

function loadFont() {
	const vertexShader = `
		varying vec2 vUv;
		attribute vec4 fontParms;
		attribute vec4 textColors;
		varying vec4 vFontParms;
		varying vec4 vTextColor;
		varying vec4 vMVPosition;
		void main( ) {
			vUv = uv;
			vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
			vFontParms = fontParms;
			vTextColor = textColors;
			vMVPosition = mvPosition;
			gl_Position = projectionMatrix * mvPosition;
		}
	`;


	/**
	 * Signed distance field font shader which makes use of fontParms encoded per vertex.
	 * The use of per vertex fontParams allows the potential of encoding changable params
	 * within one render
	 */
	const fragmentShader = `
		uniform sampler2D texture;
		uniform vec4 textColor;
		uniform vec4 clipRegion;
		varying vec4 vTextColor;
		varying vec4 vFontParms;
		varying vec4 vMVPosition;
		varying vec2 vUv;

		void main( void ) {
			float distance = texture2D( texture, vUv ).r;
			float ds = vFontParms.z * 255.0;
			float dd = fwidth( vUv.x ) * vFontParms.w * 16.0 * ds;
			float ALPHA_MIN = vFontParms.x - dd;
			float ALPHA_MAX = vFontParms.x + dd;
			float COLOR_MIN = vFontParms.y - dd;
			float COLOR_MAX = vFontParms.y + dd;
			float value = ( clamp( distance, COLOR_MIN, COLOR_MAX ) - COLOR_MIN ) / max(0.00001, COLOR_MAX - COLOR_MIN );
			float alpha = ( clamp( distance, ALPHA_MIN, ALPHA_MAX ) - ALPHA_MIN ) / max(0.00001,  ALPHA_MAX - ALPHA_MIN );
			if (vMVPosition.x < clipRegion.x) {
				discard;
			}
			if (vMVPosition.y < clipRegion.y) {
				discard;
			}
			if (vMVPosition.x > clipRegion.z) {
				discard;
			}
			if (vMVPosition.y > clipRegion.w) {
				discard;
			}
			float premultAlphaValue = value * vTextColor.w * textColor.w;
			gl_FragColor = vec4(
				premultAlphaValue,
				premultAlphaValue,
				premultAlphaValue,
				alpha
			) * vTextColor * textColor;
		}
	`;


	const tex = new THREE.TextureLoader().load(font_texture, (texture) => {
		texture.wrapS = THREE.ClampToEdgeWrapping;
		texture.wrapT = THREE.ClampToEdgeWrapping;
		texture.minFilter = THREE.LinearFilter;
		texture.flipY = false;
	});


	const uniforms = {
		texture: {
			value: tex,
		},
		textColor: {
			type: 'v4',
			value: new THREE.Vector4(),
		},
		clipRegion: {
			type: 'v4',
			value: new THREE.Vector4(-16384, -16384, 16384, 16384),
		},
	};


	// custom shader used for signed distance field rendering
	const material = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		side: THREE.DoubleSide,
		extensions: {
			derivatives: true
		},
	});


	material.premultipliedAlpha = true;
	material.depthWrite = false;
	material.transparent = true;


	function getFont() {
		const font = {
			CharMap: {},
			NaturalWidth: font_json.NaturalWidth,
			NaturalHeight: font_json.NaturalHeight,
			FontHeight: font_json.FontHeight,
			MaxAscent: font_json.MaxAscent,
			MaxDescent: font_json.MaxDescent,
		};

		const glyphs = font_json.Glyphs;

		for (let i = glyphs.length; i--;) {
			const glyph = glyphs[i];

			const glyphData = {
				X: glyph[1],
				Y: glyph[2],
				Width: glyph[3],
				Height: glyph[4],
				AdvanceX: glyph[5],
				AdvanceY: glyph[6],
				BearingX: glyph[7],
				BearingY: glyph[8],
			};

			font.CharMap[glyph[0]] = glyphData;
		}

		return font;
	}


	const font = {
		data: getFont(),
		material: material,
		fallbacks: [],
	};


	return font;
};



export default loadFont;