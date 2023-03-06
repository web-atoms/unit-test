export type JSXFactory = string | ((attributes: any, ... nodes: JSXNode[]) => JSXNode);

export default class JSXNode {

    public static create(name: JSXFactory, attributes: any, ... nodes: JSXNode[]) {
        if (typeof name === "string") {
            return new JSXNode(name, attributes, nodes);
        }
        return name(attributes, ... nodes);
    }

    public name: string;

    private constructor(
        public type: string,
        public attributes: any,
        public children: JSXNode[]) {
    }

}
