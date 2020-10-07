import ReactDOMServer from "react-dom/server";

export function toHTMLElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  view: JSX.Element
) {
  const element = document.createElement(tagName);
  element.innerHTML = ReactDOMServer.renderToStaticMarkup(view);

  return element;
}
