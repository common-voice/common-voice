import * as React from 'react';
import URLS from '../../../../urls';
import { LinkButton } from '../../../ui/ui';

import './awards.css';

export default () => (
  <div className="no-awards-page">
    <h1>Earn your first award, create a goal</h1>
    <LinkButton rounded to={URLS.GOALS}>
      Get started with goals
    </LinkButton>
    <p>When you complete a custom goal, your awards will show up here.</p>
  </div>
);
