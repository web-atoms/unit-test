
export interface ILogInfo {
    title: string;
    body: string;
    filePath?: string;
    time: number;
}

export default class TestItem {

    private endTime;

    public readonly startTime = Date.now();

    public get time() {
        return this.endTime - this.startTime;
    }

    public logs: ILogInfo[] = [];

    public async init(): Promise<any> {
        return 0;
    }

    public async dispose(): Promise<any> {
        return 0;
    }

    public log(text: string): void {
        if (text) {
            // this.logText += text;
            this.logs.push({
                title: "Log",
                body: text,
                time: Date.now()
            });
        }
    }

    public logAttachment({ title, body, filePath}) {
        this.logs.push({ title, body, filePath, time: Date.now()})
    }

    public delay(n: number): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, n);
        });
    }

    private done() {
        this.endTime = Date.now();
        return this.time;
    }
}
