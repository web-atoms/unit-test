import TestItem from "./TestItem";
import TestMethod from "./TestMethod";

const isNode = typeof window !== "undefined" ? false: true;

async function runTestPromise(args: TestMethod) {
    const {testClass, name} = args;
    let t = null;
    try {
        t = new (testClass);
        await t.init();

        const r = t[name]();
        if (r) {
            await r;
        }
    } catch (e) {
        args.error = e.stack ? `${e.message}\r\n${e.stack}` : e.toString();
    } finally {
        try {
            await t.dispose();
        } catch (ex) {
            args.error =
                (args.error || "")
                + (ex.stack ? (`${ex.message}\r\n${ex.stack}`) : ex.toString());
        }
    }
    if (t && t.logText) {
        args.logText = (args.logText || "")  + t.logText;
    }
}

declare var require;

declare var global: any;

export default async function sandbox(args: TestMethod) {

    if (isNode) {

        const vm = require("vm");

        // global.window = {};
        
        // global.UMD = {
        //     // tslint:disable-next-line: typedef
        //     resolvePath(v) {
        //         return v;
        //     }
        // };
        
        // global.DI = global.UMD;
        
        // global.window.UMD = global.UMD;
        // global.window.DI = global.DI;
        await new Promise((resolve, reject) => {
            const g = {
                document: null,
                window: {
                    DI: null,
                    UMD: null
                },
                UMD: {
                    resolvePath(v) {
                        return v;
                    }
                },
                DI: null,
                testCase: {
                    ... args, runTestPromise, resolve, reject
                },
                CustomEvent: null,
            };
            g.DI = g.UMD;
            g.window.DI = g.UMD;
            g.window.UMD = g.UMD;
            g.CustomEvent = function CustomEvent(type: string, p?: any) {
                const e = document.createEvent("CustomEvent");
                const pe = p ? { ... p } : {};
                e.initCustomEvent(type, pe.bubble, pe.cancelable, pe.detail);
                return e;
            };
            vm.createContext(g);

            const script = vm.Script(`
            const t = global.testCase;
            t.runTestPromise(t).then(t.resolve).catch(t.reject);`);
            script.runInContext(g);
        });

    } else {
        await runTestPromise(args)
    }

}