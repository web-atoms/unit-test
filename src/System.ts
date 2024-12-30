declare var require: any;
declare var module: any;

const path = require("path");

export default class System {

    static register(
        context,
        imports: string[],
        fx: (_export: (a, e) => any, _context: any) => { setters: ((a: any) => void)[], execute: () => void }) {
        let i = 0;

        const { setters, execute } = fx((n, e) => {
            if (typeof n === "string") {
                context.exports[n] = e;
            } else {
                context.exports = n;
            }
        }, this);

        const dir = path.dirname(context.path);

        for (const element of imports) {
            const x = require( path.join(dir, element));
            const s = setters[i++];
            s(x);
        }

        execute();
    }

}
