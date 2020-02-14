declare var require: any;
// tslint:disable-next-line: no-var-requires
const { statSync, readdirSync } = require("fs") as any;

// tslint:disable-next-line: no-var-requires
const Module = require("module");
// tslint:disable-next-line: ban-types
const oldRequire: Function = Module.prototype.require;
const r = function(name) {
    if (/\.(svg|jpg|gif|png)$/i.test(name)) {
        return name;
    }
    return oldRequire.call(this, name);
};
r.resolve = (oldRequire as any).resolve;
Module.prototype.require = r;

function loadScripts(start) {
    const ss = statSync(start);
    if (ss.isDirectory()) {
        for (const item of readdirSync(start)) {
            const file = `${start}/${item}`;
            loadScripts(file);
        }
    } else {
        if (start.endsWith(".js")) {
            const md = start.substr(0, start.length - 3);
            require("." + md);
        }
    }
}

// loadScripts("./dist/tests");

declare var process: any;

const arg = process.argv ? ( process.argv[2] ) : null;

if (arg) {
    loadScripts(arg);
} else {
    loadScripts("./");
}
