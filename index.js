#!/usr/bin/env node

const program = require('commander');

const convert = require('./convert');



program
	.version('1.0.0', '-v, --version')
	.description('A CLI tool that converts text FNT files to JSON FNT files, in a format that can be interpreted by React 360.')
	.option('-f, --font <path>', 'The path of the FNT file to be processed')
	.option('-t, --texture <path>', 'The path of the texture file to be processed')
	.parse(process.argv);


const fontLoader = convert(program.font, program.texture);


process.stdout.write(fontLoader);