import Path from 'path';
import CodeGen from '../lib/codegen';

new CodeGen({
	mainFile: Path.join(__dirname, './api/content.json'),
	pathBaseRefs: Path.join(__dirname, './'),
}).writeFile(
	Path.join(__dirname, './myClass.js')
);
