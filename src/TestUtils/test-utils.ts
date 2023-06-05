export const waitUntil = async (condition: () => boolean, timeout = 5000) => {
    const startTime = Date.now();

    while (!condition()) {
        if (Date.now() - startTime > timeout) {
            throw new Error('Timeout: Condition not met within the specified time');
        }
        await new Promise((resolve) => setTimeout(resolve, 10));
    }
};

export function tryVerify(verification: () => void, returnValue: boolean): boolean {
    try {
        verification();
        return returnValue;
    } catch (e) {
        return !returnValue;
    }
}

export async function assertTrueAtLeast(condition: () => boolean, ms: number): Promise<void> {
    const endTime = Date.now() + ms;

    while (Date.now() < endTime) {
        if (!condition()) {
            throw new Error(`Condition did not remain true for at least ${ms} milliseconds.`);
        }
        await delay(10);
    }
}

export async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
