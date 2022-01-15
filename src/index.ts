import ExecutionLimitError from './errors';

/**
 * Limits a given promise execution under a given time.
 * @param promise - The promise to limit it's execution.
 * @param [limit] - The time to limit promise execution.
 * @param [onCancel] -
 */
const limitExecution = <T>(promise: Promise<T>, limit?: number, onCancel?: () => void): Promise<T> => {
    let timer: NodeJS.Timeout;

    if (!limit) {
        return promise;
    }

    const rejectAfter = (time: number): Promise<T> => new Promise((_resolve, reject) => (
        timer = setTimeout(
            () => {
                onCancel?.();
                reject(new ExecutionLimitError(time))
            },
            time
        )));

    return Promise.race([
        promise,
        rejectAfter(limit)
    ]).then((result: T) => {
        timer && clearTimeout(timer);

        return result;
    });
};

export {
    limitExecution,
    ExecutionLimitError
};
