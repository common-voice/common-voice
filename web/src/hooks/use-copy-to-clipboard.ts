// https://usehooks-ts.com/react-hook/use-copy-to-clipboard

import { WithLocalizationProps } from '@fluent/react';
import { useState } from 'react';

import { Notifications } from '../stores/notifications';
import { useAction } from './store-hooks';

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>; // Return success

function useCopyToClipboard(
  getString: WithLocalizationProps['getString']
): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);
  const addNotification = useAction(Notifications.actions.addPill);

  const copy: CopyFn = async text => {
    if (!navigator?.clipboard) {
      addNotification(getString('clipboard-not-supported'), 'error');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      addNotification(getString('sha256-checksum-copied'), 'success');
      return true;
    } catch (error) {
      setCopiedText(null);
      addNotification(getString('sha256-checksum-copied-error'), 'error');
      return false;
    }
  };

  return [copiedText, copy];
}

export default useCopyToClipboard;
