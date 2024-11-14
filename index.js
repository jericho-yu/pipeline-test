import { generatePipeline } from './util/pipeline-builder.js';
import fs from 'fs/promises';


async function main() {
	// 读取文件
	try {
		const fileContentJson = await fs.readFile('./config.json', 'utf8');
		let fileContent = JSON.parse(fileContentJson);  // 解析json字符串
		// 构建pipeline脚本
		let level = 1;

		let content = generatePipeline(fileContent, level);

		// 保存文本到文件
		await fs.writeFile('./pipeline', content, 'utf8');
		console.log('Pipeline script saved to pipeline.txt');
	} catch (err) {
		console.error("Error reading file"+err)
		return;
	}
}

main();