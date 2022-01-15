import axios from 'axios';
import { limitExecution } from 'limit-execution';

/**
 * Limits a given axios get call, aborts if exceeds 500ms.
 * @returns {Promise<*>}
 */
const limitAxiosCall = async() => {
    const controller = new AbortController();

    try {
        const { data } = await limitExecution(
            axios.get('https://jsonapi.org/examples/', {
                signal: controller.signal
            }),
            450,
            () => controller.abort()
        );

        return data;
    } catch (error) {
        console.log('error ->', error);
        return '';
    }
}

const main = async() => {
    const result = await limitAxiosCall();

    console.log('Done', result);
};

main();