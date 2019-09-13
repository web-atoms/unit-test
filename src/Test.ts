import TestItem from "./TestItem";
import TestMethod from "./TestMethod";
import TestRunner from "./TestRunner";

export default function Test<T extends TestItem>(name: string | T, propertyKey?: string, descriptor?: any): any {

    if (typeof name === "string") {
        return (t: T, p: string, d: any): void => {

            // console.log(`Test called for ${target.constructor.name} in ${propertyKey}`)
            TestRunner.instance.tests.push(new TestMethod(
                name || p,
                p,
                t.constructor.name,
                t.constructor ));
        };
    }

    TestRunner.instance.tests.push(new TestMethod(
        propertyKey,
        propertyKey,
        name.constructor.name,
        name.constructor ));
}
