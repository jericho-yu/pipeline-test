import { panic } from './types.js';

/**
 * 写入字符串
 * @param {string} content 待写入的内容
 * @param {int} level 缩进等级
 * @returns string
 */
export const writeString = (content, level = 0) => {
	return `${'\t'.repeat(level)}${content}\n`;
}

// 根据等级生成制表符
const generateTabs = (level) => {
	return '\t'.repeat(level);
}

export const generatePipeline = (content, level = 0) => {
	if (!fileContent?.agent) return panic('not exist item "agent"');
	if (!fileContent?.environment) return panic('not exist item "environment"');
	if (!fileContent?.stages) return panic('not exist item "stages"');

	let agentContent = generatePipelineAgent(fileContent.agent);
	let environmentContent = generatePipelineEnvironment(fileContent.environment);
}

/**
 * 递归生成 pipeline 脚本
 * @param {string} content 
 * @param {int} level 
 * @returns string
 */
export const generatePipelineScript = (content, level = 0) => {
	let script = '';
	const tabs = generateTabs(level);

	for (const key in content) {
		if (typeof content[key] === 'object' && content[key] !== null) {
			script += `${tabs}${key} {\n`;
			script += generatePipelineScript(content[key], level + 1);
			script += `${tabs}}\n`;
		} else {
			script += `${tabs}${key} = ${content[key]}\n`;
		}
	}

	return script;
}

const generatePipelineEnvironment = (content, extra, level = 1) => {
	let environmentContent = '';
	const tabs = generateTabs(level);

	environmentContent += tabs + `environment {`;
	for (const key in content) {
		environmentContent += generateTabs(level + 1) + `${key} = ${content[key]}\n\n${extra}`;
	}
	environmentContent += tabs + `}`;

	return environmentContent;
};

const generatePipelineAgent = (content, extra, level = 1) => {
	let agentContent = '';
	const tabs = generateTabs(level);

	agentContent += tabs + `agent {`;
	for (const key in content) {
		agentContent += generateTabs(level + 1) + `${key} ${content[key]}\n\n${extra}`;
	}
	agentContent += tabs + `}`;

	return agentContent;
};