import TestItem from "./TestItem";
import TestMethod from "./TestMethod";

const isNode = typeof window === "undefined";

async function runTestPromise(args: TestMethod) {

    const {testClass, name} = args;
    let t: TestItem = null;
    try {
        t = new (testClass)();
        await t.init();

        const r = t[name]();
        if (r) {
            await r;
        }
    } catch (e) {
        if (t) {
            t.failed = e;
        }
        args.errors.push(e.stack ? `${e.message}\r\n${e.stack}` : e.toString());
    } finally {
        try {
            await t.dispose();
        } catch (ex) {
            args.errors.push(ex.stack ? (`${ex.message}\r\n${ex.stack}`) : ex.toString());
        }
        if (t?.logs?.length) {
            args.logs.push( ... t.logs);
        }
        args.time = (t as any).done();
    }
}

declare var require;

declare var global: any;

export default async function sandbox(args: TestMethod) {

    if (!isNode) {

        const vm = require("vm");

        const g = {
            document: null,
            bridge: {},
            window: {
                DI: null,
                UMD: null,
                bridge: null
            },
            UMD: {
                resolvePath(v) {
                    return v;
                }
            },
            DI: null,
            testCase: {
                ... args, runTestPromise
            },
            CustomEvent: null,
        };

        await new Promise((resolve, reject) => {
            (g.testCase as any).resolve = resolve;
            (g.testCase as any).reject = reject;
            g.DI = g.UMD;
            const { JSDOM } = require("jsdom");
            const dom = new JSDOM(`<!DOCTYPE html><body><p>Hello world</p></body></html>`);
            g.window = dom.window;
            g.document = dom.window.document;
            g.CustomEvent = function CustomEvent(type: string, p?: any) {
                const e = document.createEvent("CustomEvent");
                const pe = p ? { ... p } : {};
                e.initCustomEvent(type, pe.bubble, pe.cancelable, pe.detail);
                return e;
            };
            g.window.DI = g.UMD;
            g.window.UMD = g.UMD;
            g.window.bridge = g.bridge;
            vm.createContext(g);

            const script = new vm.Script(`
            const t = testCase;
            t.runTestPromise(t).then(t.resolve).catch(t.reject);`);
            script.runInContext(g);
        });

        args.errors = g.testCase.errors;
        args.logs = g.testCase.logs;

    } else {
        await runTestPromise(args);
    }

}
