import { ILogInfo } from "./TestItem";

export default class TestMethod {

    public name: string;
    public category: string;
    public description: any;

    public testClass: any;

    public time: number;

    public errors: string[];

    public logs: ILogInfo[];

    public get error() {
        return this.errors.join("\n");
    }

    constructor(desc: any, name: string, category: string, target: any) {
        this.description = desc;
        this.name = name;
        this.category = category;
        this.testClass = target;
        this.logs = [];
        this.errors = [];
    }

    get path(): string {
        return `${this.category}/${this.name}`;
    }

}
