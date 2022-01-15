import { limitExecution } from 'limit-execution';

const run = async() => {
    const abortController = new AbortController();

    const res = await limitExecution(
        axios.get('./somewher', { signal: abortController.signal }),
        200,
        abortController.abort
    );

    console.log(res, );
};

run();