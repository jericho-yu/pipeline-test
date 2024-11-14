import { collect } from 'collect.js';

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
const tabs = (level) => {
	return '\t'.repeat(level);
}

/**
 * 生成pipeline脚本
 * @param {any} content 待生成内容
 * @param {int} level 缩进等级
 * @returns ret
 */
export const generatePipeline = (content, level = 1) => {
	if (!content?.agent) return 'not exist item "agent"';
	if (!content?.environment) return 'not exist item "environment"';
	if (!content?.stages) return 'not exist item "stages"';

	let pipeline = [];
	pipeline.push('pipeline {');

	pipeline.push(generatePipelineAgent(content.agent, level)+"\n");
	pipeline.push(generatePipelineEnvironment(content.environment, level)+"\n");
	pipeline.push(generatePipelineStages(content.stages, level));

	pipeline.push('}');

	return pipeline.join('\n');
}

/**
 * 递归生成 pipeline 脚本
 * @param {string} contents 
 * @param {int} level 
 * @returns string
 */
export const generatePipelineStages = (contents = [], level = 1) => {
	let stagesContents = collect([]);

	stagesContents.push(`${tabs(level)} stages {`);

	collect(contents).each(content => {
		if (content?.comment) stagesContents.push(`${tabs(level + 1)}// ${content.comment}`);

		stagesContents.push(`${tabs(level + 1)}stage${content?.name ? "(" + content.name + ")" : ""}{`);

		if (content?.steps) {
			collect(content.steps).each(step => {
				stagesContents.push(`${tabs(level + 2)}${step.type} {`);

				if (step?.commands) stagesContents.push(generateCommands(step.commands, level + 3));
				if (step?.docker) stagesContents.push(generateDocker(step.docker, level + 3));

				stagesContents.push(`${tabs(level + 2)}}`);
			});
		}

		stagesContents.push(`${tabs(level + 1)}}`);
	});

	stagesContents.push(`${tabs(level)}}`);

	return stagesContents.filter(val => val != "").join('\n');
}

/**
 * 命令行
 * @param {array} commands 命令行
 * @param {int} level 缩进级别
 * @returns string
 */
const generateCommands = (commands = [], level = 0) => {
	let contents = collect([]);
	collect(commands).each(command => contents.push(`${tabs(level)}${command}`));
	return contents.filter(val => val != "").join('\n');
};

/**
 * docker
 * @param {array} dockers docker命令行
 * @param {int} level 缩进等级
 */
const generateDocker = (dockers = [], level = 0) => {
	if (dockers.length > 0) {
		let contents = collect([]);

		contents.push(`${tabs(level)}docker {`);
		collect(dockers).each(docker => {
			contents.push(`${tabs(level + 1)}${docker}`);
		});
		contents.push(`${tabs(level)}}`);

		return contents.filter(val => val != "").join('\n');
	}
	return "";
};

/**
 * 生成环境变量
 * @param {object} content 内容
 * @param {int} level 缩进等级
 * @returns string
 */
const generatePipelineEnvironment = (content = {}, level = 1) => {
	let environmentContents = collect([]);

	environmentContents.push(`${tabs(level)}environment {`);
	collect(content).each((val, key) => {
		environmentContents.push(`${tabs(level + 1)}${key} = ${val}`);
	});
	environmentContents.push(`${tabs(level)}}`);

	return environmentContents.filter(val => val != "").join('\n');
};

/**
 * 生成代理
 * @param {object} content 内容
 * @param {int} level 缩进等级
 * @returns string
 */
const generatePipelineAgent = (content = {}, level = 1) => {
	let agentContents = collect([]);

	agentContents.push(`${tabs(level)}agent {`);
	collect(content).each((val, key) => {
		agentContents.push(`${tabs(level + 1)}${key} ${val}`);
	});
	agentContents.push(`${tabs(level)}}`);

	return agentContents.filter(val => val != "").join('\n');
};