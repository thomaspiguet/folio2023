
export function focusKeyDown(e, handlers) {
  const { key, shiftKey } = e;
  const { onEnter, onShiftTab, onTab } = handlers;
  if ((key === ' ' || key === 'Enter') && onEnter) {
    e.preventDefault();
    e.stopPropagation();
    onEnter();
  } else if (key === 'Tab' && shiftKey && onShiftTab) {
    e.preventDefault();
    e.stopPropagation();
    onShiftTab();
  } else if (key === 'Tab' && !shiftKey && onTab) {
    e.preventDefault();
    e.stopPropagation();
    onTab();
  }
}
