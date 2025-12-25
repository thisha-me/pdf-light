import Handlebars from 'handlebars';

export class HandlebarsRenderer {
  static render(templateHtml: string, data?: Record<string, any>): string {
    if (!data) return templateHtml;
    const template = Handlebars.compile(templateHtml);
    return template(data);
  }
}
