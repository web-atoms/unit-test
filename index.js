require("./dist/NodeRunner");

const { JSDOM } = require("jsdom");
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
global.window = dom.window;
global.document = dom.document;
