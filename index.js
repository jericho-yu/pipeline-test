import { generatePipeline } from './util/json-pipeline-builder.js';
import fs from 'fs/promises';


const main = async () => {
	// 读取文件
	try {
		const fileContentJson = await fs.readFile('./config.json', 'utf8');
		let fileContent = JSON.parse(fileContentJson);  // 解析json字符串

		// 构建pipeline脚本
		let content = await generatePipeline(fileContent);

		// 保存文本到文件
		await fs.writeFile('./pipeline.xml', content, 'utf8');
		console.log('Pipeline script saved to pipeline');
	} catch (err) {
		console.error("Error reading file" + err)
		return;
	}
}

main();