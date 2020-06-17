import { Suspense } from 'react';
import * as React from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router';
import { useLocale } from '../locale-helpers';
import { Spinner } from '../ui/ui';
import URLS from '../../urls';
import Intro from '../demo-pages/intro/intro';
import getDatasetsComponents from '../demo-pages/kiosk/datasets';
import getDashboardComponents from '../demo-pages/kiosk/dashboard';

const Kiosk = React.lazy(() => import('../demo-pages/kiosk/kiosk'));

function DemoLayout() {
  const [_, toLocaleRoute] = useLocale();

  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route exact path={toLocaleRoute(URLS.DEMO)} component={Intro} />
          {[
            {route: URLS.DEMO_DATASETS, pageContent: getDatasetsComponents()}, 
            {route: URLS.DEMO_DASHBOARD, pageContent: getDashboardComponents()}
          ].map(({ route, pageContent}) => (
            <Route exact path={toLocaleRoute(route)} render={() => <Kiosk {...{pageContent}}/>} />
          ))}
          {/* more routes to be added */}

          <Route render={() => <Redirect to={URLS.DEMO} />} />
        </Switch>
      </Suspense>
    </div>
  );
}

export default withRouter(DemoLayout);
