export const html = (strings, ...values) =>
  String.raw({ raw: strings }, ...values);

export function setupComponent(htmlString, context) {
  const template = document.createElement("template");
  template.innerHTML = htmlString;

  context.appendChild(template.content.cloneNode(true));
}
