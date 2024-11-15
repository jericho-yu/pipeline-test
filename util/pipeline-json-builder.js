import { collect } from 'collect.js';

/**
 * 解析 pipeline
 * @param {object} filePath 文件内容
 * @returns {Promise<Array<{level: number, line: number, content: string}>>} 解析后的行数组
 */
export const parsePipeline = async (fileContent) => {
	try {
		let parsedLines = collect(fileContent.split('\n')).map((line, lineNum) => {
			// 统计每一行的缩进
			const match = line.match(/^\t+/);
			return { level: match ? match[0].length : 0, line: lineNum, content: line };
		});

		collect(parsedLines).each(line => {
			parsePipelineScript(line.content, line.level);
		});
	} catch (err) {
		console.error('Error reading file:', err);
		return [];
	}
}

/**
 * 解析 pipeline 脚本
 */
const parsePipelineScript = async (content, level = 1) => {
	const re = new RegExp(`^\t{${level}}`);
	console.log(content.replace(re, ''));
};
