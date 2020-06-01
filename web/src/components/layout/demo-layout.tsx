import { Suspense } from 'react';
import * as React from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router';
import { useLocale } from '../locale-helpers';
import { Spinner } from '../ui/ui';
import URLS from '../../urls';
import Intro from '../demo-pages/Intro/intro';

const Kiosk = React.lazy(() => import('../demo-pages/kiosk/kiosk'));

function DemoLayout() {
  const [_, toLocaleRoute] = useLocale();

  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route exact path={toLocaleRoute(URLS.DEMO)} component={Intro} />
          {[URLS.DEMO_DATASETS, URLS.DEMO_DASHBOARD].map(route => (
            <Route exact path={toLocaleRoute(route)} component={Kiosk} />
          ))}
          {/* more routes to be added */}

          <Route render={() => <Redirect to={URLS.DEMO} />} />
        </Switch>
      </Suspense>
    </div>
  );
}

export default withRouter(DemoLayout);
