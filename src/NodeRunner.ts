import System from "./System";
import TestRunner from "./TestRunner";

declare var require: any;
// tslint:disable-next-line: no-var-requires
const { statSync, readdirSync } = require("fs") as any;

// tslint:disable-next-line: no-var-requires
const Module = require("module");
// tslint:disable-next-line: ban-types
const oldRequire: Function = Module.prototype.require;
const r = function(name) {
    if (/\.(svg|jpg|gif|png|less|css)$/i.test(name)) {
        return name;
    }
    return oldRequire.call(this, name);
};
r.resolve = (oldRequire as any).resolve;
Module.prototype.require = r;
const oldCompile = Module.prototype._compile;
Module.prototype._compile = function (content, filename, format) {
    content = content.replace(/System\.register\s{0,20}\(/, `System.register(module,`);
    return oldCompile.call(this, content, filename, format);
}
declare var global;

// tslint:disable-next-line: no-var-requires
const { JSDOM } = require("jsdom");
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
global.window = dom.window;
global.document = dom.window.document;

// global.window = {};
// global.bridge = {};

global.UMD = {
    // tslint:disable-next-line: typedef
    resolvePath(v) {
        return v;
    }
};

global.DI = global.UMD;

global.window.UMD = global.UMD;
global.window.DI = global.DI;
global.System = System;
global.window.System = System;

global.CustomEvent = function CustomEvent(type: string, p?: any) {
    const e = document.createEvent("CustomEvent");
    const pe = p ? { ... p } : {};
    e.initCustomEvent(type, pe.bubble, pe.cancelable, pe.detail);
    return e;
};

function loadScripts(start) {
    const ss = statSync(start);
    if (ss.isDirectory()) {
        for (const item of readdirSync(start)) {
            const file = `${start}/${item}`;
            loadScripts(file);
        }
    } else {
        if (start.endsWith(".js")) {
            if (start.endsWith(".sys.js") || start.endsWith(".esm.js")) {
                return;
            }
            const md = start.substr(0, start.length - 3);
            require(process.cwd() + "/" + md);
        }
    }
}

// loadScripts("./dist/tests");

declare var process: any;

const arg = process.argv ? ( process.argv[2] ) : null;

// tslint:disable-next-line: no-console
// console.log(JSON.stringify(process.argv));

if (arg) {
    loadScripts(arg);
} else {
    loadScripts("./");
}

// now run tests..

TestRunner.instance.run().then(() => {
    process.exit(0);
}).catch((e) => {
    // tslint:disable-next-line: no-console
    console.error(e.message);
    if (e.stack) {
        // tslint:disable-next-line: no-console
        console.error(e.stack);
    }
    process.exit(1);

} );

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
    // Recommended: send the information to sentry.io
    // or whatever crash reporting service you use
})

