/**
 * The custom error to be thrown when execution exceeds it's limit.
 */
class ExecutionLimitError extends Error {
    constructor(maxExecutionTime: number) {
        super();
        this.message = `[ExecutionLimitError] - Max execution limit ${maxExecutionTime}ms reached`;

        Object.setPrototypeOf(this, ExecutionLimitError.prototype);
    }
}

export default ExecutionLimitError;
