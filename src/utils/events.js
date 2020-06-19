/**
 * Progrmatically invoke change event simulation on a given element.
 *
 * @param {String} elementName Element name.
 * @returns {Void} None.
 */
export function simulateInputChangeEvent(elementName) {
  const matches = document.getElementsByName(elementName);
  const item = matches[0] || null;

  // @ts-ignore
  if (item && item._valueTracker) {
    // @ts-ignore
    item._valueTracker.setValue("");
    // Programatically invoke change event.
    const event = new Event("input", { bubbles: true });
    item.dispatchEvent(event);
  }
}
