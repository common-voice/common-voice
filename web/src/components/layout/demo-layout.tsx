import { Suspense } from 'react';
import * as React from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router';
import * as Sentry from '@sentry/react';

import { useLocale } from '../locale-helpers';
import { Spinner } from '../ui/ui';
import URLS from '../../urls';
import Intro from '../demo-pages/intro/intro';
import getCreateAccountComponents from '../demo-pages/kiosk/create-account';
import getContributeComponents from '../demo-pages/kiosk/contribute-intro';
import SpeakPage from '../pages/contribution/speak/speak';
import ListenPage from '../pages/contribution/listen/listen';

const Kiosk = React.lazy(() => import('../demo-pages/kiosk/kiosk'));

const SentryRoute = Sentry.withSentryRouting(Route);

function DemoLayout() {
  const [_, toLocaleRoute] = useLocale();

  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <Switch>
          <SentryRoute
            exact
            path={toLocaleRoute(URLS.DEMO)}
            component={Intro}
          />
          {[
            {
              route: URLS.DEMO_CONTRIBUTE,
              pageContent: getContributeComponents(),
            },
            {
              route: URLS.DEMO_ACCOUNT,
              pageContent: getCreateAccountComponents(),
            },
          ].map(({ route, pageContent }, index) => (
            <SentryRoute
              exact
              path={toLocaleRoute(route)}
              key={index}
              render={() => <Kiosk {...{ pageContent }} />}
            />
          ))}
          {/* more routes to be added */}
          <SentryRoute
            exact
            path={toLocaleRoute(URLS.DEMO_SPEAK)}
            component={SpeakPage}
          />
          <SentryRoute
            exact
            path={toLocaleRoute(URLS.DEMO_LISTEN)}
            component={ListenPage}
          />
          <SentryRoute render={() => <Redirect to={URLS.DEMO} />} />
        </Switch>
      </Suspense>
    </div>
  );
}

export default withRouter(DemoLayout);
