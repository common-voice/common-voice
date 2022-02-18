import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import { asBundleGenerator } from '../services/localization';
import { LocalizationProvider, ReactLocalization } from '@fluent/react';
import { render } from '@testing-library/react';

async function readENMessageFile() {
  const filepath = path.resolve(__dirname, '../../locales/en/messages.ftl');
  return await fs.promises.readFile(filepath, 'utf8');
}

async function createMockLocalization() {
  const enMessageFile = await readENMessageFile();
  const localeMessages = [['en', enMessageFile]];
  return new ReactLocalization(asBundleGenerator(localeMessages));
}

export async function renderWithLocalization(children: React.ReactNode) {
  const l10n = await createMockLocalization();
  return render(
    <LocalizationProvider l10n={l10n}>{children}</LocalizationProvider>
  );
}
