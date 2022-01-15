import ExecutionLimitError from './errors';

/**
 * Limits a given promise execution under a given time executing an "onCancel" callback if exceeded.
 * @param promise - The promise to limit it's execution.
 * @param [limit] - The time to limit promise execution.
 * @param [onCancel] - The cancel callback to trigger once executing limit reached.
 */
const limitExecution = <T>(promise: Promise<T>, limit?: number, onCancel?: () => void): Promise<T> => {
    let timer: NodeJS.Timeout;

    if (!limit) {
        return promise;
    }

    const rejectAfter = (): Promise<T> => new Promise((_resolve, reject) => (
        timer = setTimeout(
            () => {
                onCancel?.();
                reject(new ExecutionLimitError(limit))
            },
            limit
        )));

    return Promise.race([
        promise,
        rejectAfter()
    ]).then((result: T) => {
        timer && clearTimeout(timer);

        return result;
    });
};

export {
    limitExecution,
    ExecutionLimitError
};
