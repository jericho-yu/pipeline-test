import { collect } from 'collect.js';
import { parsePipeline } from './util/pipeline-json-builder.js';
import { promises as fs } from 'fs';

const main = async () => {
	const fileContent = await fs.readFile('./pipeline', 'utf8');

	const parsedLines = await parsePipeline(fileContent);

	console.log(parsedLines);
}

main();