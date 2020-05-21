import { Suspense } from 'react';
import * as React from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router';
import { useLocale } from '../locale-helpers';
import { Spinner } from '../ui/ui';
import URLS from '../../urls';

function DemoLayout() {
  const [_, toLocaleRoute] = useLocale();

  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route
            exact
            path={toLocaleRoute(URLS.DEMO)}
            render={() => {
              return <h1>in get started</h1>;
            }}
          />
          <Route
            exact
            path={toLocaleRoute(URLS.DEMO_DATASETS)}
            render={() => {
              return <h1>in language select</h1>;
            }}
          />
          {/* more routes to be added */}
          <Route render={() => <Redirect to={URLS.DEMO} />} />
        </Switch>
      </Suspense>
    </div>
  );
}

export default withRouter(DemoLayout);
