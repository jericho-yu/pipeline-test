/**
 * 写入字符串
 * @param {string} content 待写入的内容
 * @param {int} level 缩进等级
 * @returns string
 */
export const writeString = (content,level=0) => {
	return `${'\t'.repeat(level)}${content}\n`;
}

// 根据等级生成制表符
const generateTabs = (level) => {
    return '\t'.repeat(level);
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
            script += `${tabs}${key}: ${content[key]}\n`;
        }
    }

    return script;
}