"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlebarsRenderer = void 0;
const handlebars_1 = __importDefault(require("handlebars"));
class HandlebarsRenderer {
    static render(templateHtml, data) {
        if (!data)
            return templateHtml;
        const template = handlebars_1.default.compile(templateHtml);
        return template(data);
    }
}
exports.HandlebarsRenderer = HandlebarsRenderer;
