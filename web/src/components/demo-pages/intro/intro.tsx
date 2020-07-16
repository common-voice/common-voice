import * as React from 'react';
import robot from './assets/red-robot.svg';
import './intro.css';
import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import { LinkButton, LabeledSelect } from '../../ui/ui';
import { ArrowRight } from '../../ui/icons';
import URLS from '../../../urls';
import { Locale } from '../../../stores/locale';
import StateTree from '../../../stores/tree';
import { connect } from 'react-redux';
import { LOCALES_WITH_NAMES } from '../../layout/layout';
import { useHistory } from 'react-router';
import { replacePathLocale } from '../../../utility';

const mapDispatchToProps = {
  setLocale: Locale.actions.set,
};

const mapStateToProps = (state: StateTree) => ({
  locale: state.locale,
});

interface PropsFromState {
  locale: Locale.State;
}

interface PropsFromDispatch {
  setLocale: typeof Locale.actions.set;
}

interface Props
  extends PropsFromState,
    PropsFromDispatch,
    WithLocalizationProps {}

export default connect<PropsFromState, PropsFromDispatch>(
  mapStateToProps,
  mapDispatchToProps
)(
  withLocalization(function Intro(props: Props) {
    const { locale, setLocale } = props;
    const history = useHistory();

    return (
      <div id="intro-container">
        <div id="intro-container--gradient-layer"></div>
        <img src={robot} id="robot" alt="red robot" />
        <div id="intro-container--text-box">
          <Localized id="demo-welcome">
            <h1 id="intro-container--text-box__text-header" />
          </Localized>
          <Localized id="demo-welcome-subheader">
            <p id="intro-container--text-box__text-body" />
          </Localized>
        </div>
        <LinkButton
          rounded
          to={URLS.DEMO_DATASETS}
          id="intro-container--btn-get-started">
          <Localized id="demo-get-started">
            <span />
          </Localized>
          <ArrowRight id="arrow-right" />
        </LinkButton>
        <LabeledSelect
          className="localization-select"
          value={locale}
          onChange={(event: any) => {
            let newLocale = event.target.value;
            setLocale(newLocale);
            history.push(
              replacePathLocale(history.location.pathname, newLocale)
            );
          }}>
          {LOCALES_WITH_NAMES.map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </LabeledSelect>
      </div>
    );
  })
);
