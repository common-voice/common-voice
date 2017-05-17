/**
 * Functions to be shared across mutiple modules.
 */

/**
 * Get some random string in a certain format.
 */
export function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Capitalize first letter for nice display.
 */
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Add js handler for link clicking.
 */
export function jsifyLink(link: HTMLAnchorElement, handler: Function) {
  link.addEventListener('click', (evt: Event) => {
    evt.preventDefault();
    evt.stopPropagation();
    handler(link.href);
  }, true);
}
