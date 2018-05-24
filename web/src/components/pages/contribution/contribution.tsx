import { Localized } from 'fluent-react';
import * as React from 'react';
import URLS from '../../../urls';
import { LocaleLink, LocaleNavLink } from '../../locale-helpers';
import {
  ArrowLeft,
  MicIcon,
  PlayIcon,
  RedoIcon,
  ShareIcon,
  SkipIcon,
} from '../../ui/icons';

import './contribution.css';
import { Button, TextButton } from '../../ui/ui';

// Without wrapping fluent adds children, which React doesn't like for imgs
const MicIconWrap = () => <MicIcon />;

const ClipPill = ({
  isOpen,
  num,
  status,
}: {
  isOpen: boolean;
  num: number;
  status: 'active' | 'done' | 'pending';
}) => (
  <div className={['pill', isOpen ? 'open' : 'closed', status].join(' ')}>
    <div className="contents">
      {status === 'active' && (
        <Localized id="record-cta">
          <div className="text" />
        </Localized>
      )}
      {status === 'done' && (
        <React.Fragment>
          <button type="button">
            <PlayIcon />
          </button>
          <button type="button">
            <RedoIcon />
          </button>
          <button type="button">
            <ShareIcon />
          </button>
        </React.Fragment>
      )}
    </div>
    <div className="num">{num}</div>
  </div>
);

export default () => (
  <div className="contribution-wrapper">
    <div className="contribution">
      <div className="top">
        <LocaleLink to={URLS.ROOT} className="back">
          <ArrowLeft />
        </LocaleLink>

        <div className="links">
          <Localized id="speak">
            <LocaleNavLink to={URLS.SPEAK} />
          </Localized>
          <Localized id="listen">
            <LocaleNavLink to={URLS.LISTEN} />
          </Localized>
        </div>

        <div className="counter">
          3/5{' '}
          <Localized id="clips">
            <span className="text" />
          </Localized>
        </div>
      </div>

      <div className="cards-and-pills">
        <div />

        <div className="cards">
          <Localized
            id="record-instruction"
            $actionType="Click"
            recordIcon={<MicIconWrap />}>
            <div className="instruction hidden-md-down" />
          </Localized>

          <div className="card">
            The selfish Welsh wish to sell fish, which smells swell when getting
            squished.
          </div>
        </div>

        <div className="pills">
          {[1, 2, 3, 4, 5].map(n => (
            <ClipPill
              key={n}
              isOpen={false}
              num={n}
              status={n < 3 ? 'done' : n === 3 ? 'active' : 'pending'}
            />
          ))}
        </div>
      </div>

      <Localized id="record-instruction" $actionType="Tap" recordIcon={null}>
        <div className="instruction hidden-lg-up" />
      </Localized>

      <div className="record">
        <button type="button">
          <MicIcon />
        </button>
        <div className="background" />
      </div>

      <div className="buttons">
        <div>
          <Localized id="shortcuts">
            <Button rounded outline className="hidden-md-down" />
          </Localized>
          <Localized id="unable-speak">
            <TextButton />
          </Localized>
        </div>
        <div>
          <Button rounded outline className="skip">
            <Localized id="skip">
              <span />
            </Localized>{' '}
            <SkipIcon />
          </Button>
          <Localized id="submit-form-action">
            <Button rounded outline disabled className="hidden-md-down" />
          </Localized>
        </div>
      </div>
    </div>
  </div>
);
