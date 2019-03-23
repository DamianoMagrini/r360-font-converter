# React 360 Font Converter

This is a CLI tool that allows you to easily convert a text FNT font into a JavaScript file that can be loaded from React 360 to display the font.

## Installation

### Installing globally

To install the tool globally, run `npm install --global damianomagrini/r360-font-converter` (or `npm i -g ...`) in the directory where you downloaded it. This will install it as a global module, which will allow you to run the `r360-font-converter` command.

### Installing locally

If you prefer using it as a local dependency, run `npm install --save-dev damianomagrini/r360-font-converter`, and to use the tool from the command line use `npx r360-font-converter`.

## Usage

This tool is extremely simple to use: it takes in the `-f`/`--font` and `-t`/`--texture` parameters, and it outputs a string that can be written to a JS file. An example would be:

```shell
r360-font-converter -f ./assets/myfont.fnt -t ./assets/myfont.png > LoadFont.js
```

which will simply bundle your font and write the output to `LoadFont.js`. Then (once you have copied the file into your React 360 workspace), in your `client.js`:

```javascript
import loadFont from './LoadFont';

/* ... */

function init(bundle, parent, options = {}) {
	const r360 = new ReactInstance(bundle, parent, {
		fullScreen: true,
		...options
	});

	r360.runtime.guiSys.font = loadFont();

	/* ... */
}

window.React360 = {
	init
};
```

## Changelog

### 1.1.0 (current)
* Added support for FNT fonts in JSON format
* Uploaded editor and Prettier configuration files

### 1.0.0 (initial)
* Added support for FNT fonts in text format

## License

[![Creative Commons License](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png 'Creative Commons License')](http://creativecommons.org/licenses/by-nc-sa/4.0/)

This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/).
