/**
 * Present a modal dialog (asynchronously). Usage:
 *
 *   const isConfirmed = await confirm('are you sure?', 'yes', 'no')
 *   if (!isConfirmed) { ... show error ... }
 *
 * @param label The main text/label for the dialog.
 * @param okLabel Label for the "OK" button.
 * @param cancelLabel Label for the "Cancel" button.
 * @returns A Promise that is resolved with `true` if user clicks the "OK" button,
 *    or resolved with `false` if user clicks the "Cancel" button.
 */
export default function confirm(
  label: string,
  okLabel: string,
  cancelLabel: string
) {
  const element = document.createElement('div');
  element.classList.add('confirm-modal');

  const mainSection = document.createElement('div');
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
