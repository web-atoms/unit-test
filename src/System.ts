declare var require: any;
declare var module: any;

const path = require("path");

export default class System {

    static register(
        location: string,
        imports: string[],
        fx: (_export: (a, e) => any, _context: any) => { setters: ((a: any) => void)[], execute: () => void }) {
        let i = 0;

        const { setters, execute } = fx((n, e) => {
            if (e !== void 0) {
                module.exports[n] = e;
            } else {
                module.exports = n;
            }
        }, this);

        const dir = path.dirname(location);

        for (const element of imports) {
            const x = require( path.join(dir, element));
            const s = setters[i++];
            s(x);
        }

        execute();
    }

}
