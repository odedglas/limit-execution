import { limitExecution, ExecutionLimitError } from './index';

describe('limitExecution', () => {
    afterEach(jest.clearAllMocks);

    it('Resolves with given promise result when settled before limit', async() => {
        await expect(
            limitExecution(Promise.resolve(true), 10)
        ).resolves.toBeTruthy();
    });

    it('Rejects with given given promise result when settled before limit', async() => {
        const error = new Error('Crap');

        await expect(
            limitExecution(Promise.reject(error), 10)
        ).rejects.toThrowError(error);
    });

    it('Throws ExecutionLimitError once limit breached', async() => {
         const lateResolve = () => new Promise((resolve) => setTimeout(
             () => resolve('Ok'),
             1000
         ));

        await expect(
            limitExecution(lateResolve(), 500)
        ).rejects.toThrowError(ExecutionLimitError);
    });

    describe('onCancel', () => {
        const limit = 500;
        let onCancel: () => void;

        beforeEach(() => onCancel = jest.fn());

        it('Not triggered if promise resolves before limit', async() => {
            const fastResolve = () => new Promise((resolve) => setTimeout(
                () => resolve('Ok'),
                limit / 2
            ));

            await expect(
                limitExecution(fastResolve(), limit, onCancel)
            ).resolves.toEqual('Ok');

            expect(onCancel).toHaveBeenCalledTimes(0);
        });

        it('Triggered once limit breached', async() => {
            const lateResolve = () => new Promise((resolve) => setTimeout(
                () => resolve('Ok'),
                limit * 2
            ));

            await expect(
                limitExecution(lateResolve(), limit, onCancel)
            ).rejects.toThrowError(ExecutionLimitError);

            expect(onCancel).toHaveBeenCalledTimes(1);
        });
    });

    describe('When time limit is set to "0"', () =>{
        it('Resolves if origin promise is settled', async() => {
            await expect(
                limitExecution(Promise.resolve(true), 0)
            ).resolves.toBeTruthy();
        });

        it('Rejects when origin promise is settled', async() => {
            const rejecting = () => new Promise((_resolve, reject) => (
                setTimeout(() => reject(new Error('Whops')), 1000)
            ));

            await expect(
                limitExecution(rejecting(), 0)
            ).rejects.toThrowError('Whops');
        });
    });
});
