import ExecutionLimitError from './errors';

/**
 * Limits a given promise execution under a given time executing an "onCancel" callback if exceeded.
 * @param promise - The promise to limit it's execution.
 * @param [limit] - The time to limit promise execution.
 * @param [onCancel] - The cancel callback to trigger once executing limit reached.
 */
const limitExecution = <T>(promise: Promise<T>, limit?: number, onCancel?: () => void): Promise<T> => {
    let timer: NodeJS.Timeout;

    if (!(promise instanceof Promise)) {
        throw new Error(`Cannot limit none promise, instead got: ${typeof promise}`);
    }

    if (!limit) {
        return promise;
    }

    // Creates the error at upper scope so trace would be useful.
    const executionLimitError = new ExecutionLimitError(limit);

    const rejectAfter = (): Promise<T> => new Promise((_resolve, reject) => {
        timer = setTimeout(
            () => {
                onCancel?.();
                reject(executionLimitError)
            },
            limit
        );

        timer.unref?.()
    });

    const clean = () => timer && clearTimeout(timer);

    return Promise.race([
        promise,
        rejectAfter()
    ]).then((result: T) => {
        clean();

        return result;
    }).catch((error: unknown) => {
        clean();

        throw error;
    });
};

export {
    limitExecution,
    ExecutionLimitError
};
