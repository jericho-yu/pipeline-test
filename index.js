import readJsonFile from './util/file.js';
import { must } from './util/parse.js';
import { generatePipelineScript } from './util/builder.js';


async function main() {
	// 读取文件
	const fileContentJson = await readJsonFile();
	if (!fileContentJson) {
		console.log('Error reading file');
		return;
	}
	let fileContent = JSON.parse(fileContentJson);  // 解析json字符串

	// 验证文件格式与内容是否正确
	let { err, msg } = must(fileContent);
	if (err) {
		console.error(msg);
	}

	// 构建
	let level = 1;
	let content = '';

	content = generatePipelineScript(fileContent, level);

	console.log(content);
}

main();