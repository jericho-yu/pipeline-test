import { ok, panic } from './types.js';

// 验证格式是否正确
export const must = (fileContent) => {
	if (!fileContent?.agent) return panic('not exist item "agent"');
	if (!fileContent?.environment)return panic('not exist item "environment"');
	if (!fileContent?.stages) return panic('not exist item "stages"');
	return ok();
}