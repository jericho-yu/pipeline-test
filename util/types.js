let ret = {
	err: false,
	msg: "",
	data: null,
};

/**
 * 错误
 * @param {string} msg 错误消息
 * @returns ret
 */
export const panic = msg => {
	ret.err = true;
	ret.msg = msg;

	return ret
};

/**
 * 正确
 * @param {string} msg 正确消息
 * @returns ret
 */
export const ok = (data, msg = '') => {
	ret.msg = msg;
	ret.data = data;

	return ret
};