import { collect } from 'collect.js';
import { parsePipeline, blockToJson, parsed } from './util/pipeline-json-builder.js';
import { promises as fs } from 'fs';

const main = async () => {
	const fileContent = await fs.readFile('./pipeline', 'utf8');

	// const parsedLines = await parsePipeline(fileContent);
	// console.log(parsedLines);

	const blocks = await parsePipeline(fileContent);
	fs.writeFile('./pipeline.json', JSON.stringify(blocks), 'utf8');


	blockToJson(blocks);
	console.log("END", JSON.stringify(parsed, null, 2))

	// fs.writeFile('./pipeline.json', JSON.stringify(blockToJson(blocks)), 'utf8');
}

main();