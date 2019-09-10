/**
 * Adds root level category name to class name
 * @param name Category Name
 */
export default function Category(name: string): any {

    return (target: any) => {

        // target.testCategory = name;
        // return target;

        // save a reference to the original constructor
        const original: any = target;

        // a utility function to generate instances of a class
        // tslint:disable-next-line: ban-types
        function cx(constructor: Function, args: any[]): any {
            const c: any = function(): any {
                return constructor.apply(this, args);
            };
            c.prototype = constructor.prototype;
            return new c();
        }

        // the new constructor behavior
        const f: any = function( ... args: any[]): any {
            this.testCategory = name;
            return cx(original, args);
        };

        // copy prototype so instance of operator still works
        f.prototype = original.prototype;

        // return new constructor (will override original)
        return f;
    };
}
