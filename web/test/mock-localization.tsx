import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import { LocalizationProvider, ReactLocalization } from '@fluent/react';
import { render } from '@testing-library/react';

import { asBundleGenerator } from '../src/services/localization';

function readENMessageFile() {
  const filepath = path.resolve(__dirname, '../locales/en/messages.ftl');
  return fs.readFileSync(filepath, 'utf8');
}

function createMockLocalization() {
  const localeMessages = [['en', readENMessageFile()]];
  return new ReactLocalization(asBundleGenerator(localeMessages));
}

const MOCK_LOCALIZATION = createMockLocalization();

export async function renderWithLocalization(children: React.ReactNode) {
  return render(
    <LocalizationProvider l10n={MOCK_LOCALIZATION}>
      {children}
    </LocalizationProvider>
  );
}
