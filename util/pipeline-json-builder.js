import { collect } from 'collect.js';

export let parsed = {
	agent: {},
	environment: {},
	stages: [],
};

let stage = {
	name: "",
	comment: "",
	steps: [],
};

let step = {
	type: "",
	commands: [],
	docker: [],
};

/**
 * 解析 pipeline
 * @param {object} filePath 文件内容
 * @returns {Promise<Array>} 解析后的行数组
 */
export const parsePipeline = async (fileContent) => {
	try {
		let parsedLines = collect(fileContent.split('\n'))
			.map((line, lineNum) => {
				// 统计每一行的缩进
				const match = line.match(/^\t+/);
				return { level: match ? match[0].length : 0, line: lineNum, content: line };
			})
			.all();

		return parseToBlocks(parsedLines);
	} catch (err) {
		console.error('Error reading file:', err);
		return [];
	}
}

/**
 * 解析块
 * @param {Array<{level: number, lineNum: number, content: string}>} lines 解析后的行数组
 * @param {number} level 当前解析的缩进等级
 * @returns {Array} 解析后的块数组
 */
const parseToBlocks = (lines, level = 0) => {
	let blocks = [];
	let currentBlock = null;

	collect(lines).map(line => {
		line.content = line.content.replace(new RegExp(`^\t{${line.level}}`), '');
		if (line.content === "") return

		if (line.level === level) {
			if (currentBlock) {
				blocks.push(currentBlock);
			}
			currentBlock = { content: line.content, children: [] };
		} else if (line.level > level) {
			if (currentBlock) {
				currentBlock.children.push(line);
			}
		}
	});

	if (currentBlock) blocks.push(currentBlock);

	// 递归解析子块
	blocks = blocks.map(block => {
		if (block.children.length > 0) {
			block.children = parseToBlocks(block.children, level + 1);
		}
		return block;
	});

	return blocks;
}

/**
 * 解析block到json
 * @param {array} blocks
 * @returns {array}
 */
export const blockToJson = (blocks = []) => {
	collect(blocks)
		.map(block => {
			if (block.content.startsWith("pipeline") && block?.children.length > 0) {
				blockToJson(block.children);
			} else if (block.content.startsWith("agent") && block?.children.length > 0) {
				parsed.agent = blockToJsonAgent(block.children);
			} else if (block.content.startsWith("environment") && block?.children.length > 0) {
				parsed.environment = blockToJsonEnvironment(block.children);
			} else if (block.content.startsWith("stages") && block?.children.length > 0) {
				parsed.stages = blockToJsonStages(block.children);
			}
		});
};

/**
 * 解析agent
 * @param {object} block 
 * @returns 
 */
const blockToJsonAgent = (block) => {
	let a = {};
	collect(block)
		.map(item => {
			if (!item.content.endsWith("{") && !item.content.endsWith("}")) {
				let i = item.content.split(" ");
				a[i[0]] = i[1];
			}
		});

	return a;
};

/**
 * 解析environment
 * @param {object} block 
 * @returns 
 */
const blockToJsonEnvironment = (block) => {
	let e = {};
	collect(block)
		.map(item => {
			if (!item.content.endsWith("{") && !item.content.endsWith("}")) {
				let i = item.content.split(" = ");
				e[i[0]] = i[1];
			}
		});

	return e;
};

/**
 * 解析stages
 * @param {array} block 
 * @returns 
 */
const blockToJsonStages = (block, type = "") => {
	let stages = [];

	switch (type) {
		default: {
			collect(block)
				.each(item => {
					let stage = { name: "", comment: "", steps: [] };
					if (item.content.startsWith("//")) {
						let match = item.content.match(/\/\/(.*)/);
						if (match?.length > 1) stage.comment = match[1].trim();
					}
					if (item.content.startsWith("stage")) {
						let match = item.content.match(/stage\(['"](.+?)['"]\)/);
						if (match?.length > 1) stage.name = match[1].trim();

						if (item?.children) {
							collect(item.children).each(step => {
								let s = { type: "steps", commands: [], docker: [] };
								if (step.content.startsWith("steps")) {
									collect(step.children).each(i => {
										s.commands.push(i.content);
										collect(i.children).each(i2 => {
											s.commands.push(i2.content);
										});
									});
								}

								if (step.content.startsWith("agent")) _agent(step.children);


								stage.steps.push(s);
							});
						}
					}

					stages.push(stage);
				});
		}
	}


	return stages;
};

const _step = (block, level = 1) => {
	let ret = {
		type: "step",
		commands: [],
		docker: [],
	};

	collect(block.children).each(val => {
		ret.commands.push(val.content);
		
	});
}

const _agent = (block) => {
	let ret = {
		type: "agent",
		commends: [],
		docker: [],
	};
	collect(block.children).each(val => {
		if (val.content.startsWith("docker")) collect(block).each(val => docker.push(val.content));
	});

	return ret;
};