# limit-execution

This package offers a way to easly limit any promise execution having an optional onCancel callback triggered once the promise exceeds the given "limit".

## API

### limitExecution(promise: Promise<T>, limit: number, onCancel: () => void): Promise<T>

- Limits a given promise execution under a given time executing an "onCancel" callback if exceeded.

<b>Throws:</b> `ExecutionLimitError` if time exceeds limit.

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| promise | `Promise<T>` | The promise to limit it's execution time. |
| limit | `number` | The time limit to set provided in milliseconds |
| onCancel | `() => void` | a callback to execute once promise execution exceeds given limit |

<b>Returns:</b>

`Promise<T>`

#### Example:

Simple promise limit

```js
import { limitExecution, ExecutionLimitError } from 'limit-execution';

const lateResolvingPromise = () => new Promise(resolve => (
    setTimeout(resolve, 2000)
));

const main = async() => {
    try {
        await limitExecution(
            lateResolvingPromise(),
            1000
        );
    } catch (error) {
        if (error instanceof ExecutionLimitError) {
            // Do something
        }
    }
};
```

#### Example:

Aborting axios request

```js
import axios from 'axios';
import { limitExecution } from 'limit-execution';

/**
 * Limits a given axios get call, aborts if exceeds 500ms.
 * @returns {Promise<*>}
 */
const limitAxiosCall = async() => {
    const controller = new AbortController();
    
    const { data } = await limitExecution(
        axios.get('https://jsonapi.org/examples/', {
            signal: controller.signal
        }),
        500,
        () => controller.abort()
    );

    return data;
}
```