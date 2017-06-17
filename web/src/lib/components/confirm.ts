/**
 * Present a modal dialog (asynchronously). Usage:
 *
 *   confirm('are you sure?').then(...)
 *
 * @param label A string label.
 * @return {Promise}
 */
export default function confirm(label: string, okLabel: string, cancelLabel: string) {
  let element = document.createElement('div');
  element.classList.add('confirm-modal');

  let mainSection = document.createElement('div');
  mainSection.classList.add('main-section');
  element.appendChild(mainSection);

  const labelElement = document.createElement('label');
  labelElement.textContent = label;
  mainSection.appendChild(labelElement);

  const confirmButton = document.createElement('button');
  confirmButton.id = 'confirm-confirm';
  confirmButton.textContent = okLabel;
  mainSection.appendChild(confirmButton);

  const cancelButton = document.createElement('button');
  cancelButton.id = 'confirm-cancel';
  cancelButton.textContent = cancelLabel;
  mainSection.appendChild(cancelButton);

  function close() {
    element.parentElement.removeChild(element);
  }

  return new Promise((resolve, reject) => {
    document.body.appendChild(element);
    confirmButton.addEventListener('click', () => {
      close();
      resolve(true);
    });
    cancelButton.addEventListener('click', () => {
      close();
      resolve(false);
    });

    // In the next loop, add the visible class so that we can animate the transition.
    setTimeout(() => {
      element.classList.add('visible');
    });
  });
}
