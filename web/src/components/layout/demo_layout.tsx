import * as React from 'react';
import { Switch, Route, withRouter } from 'react-router';
import { useLocale } from '../locale-helpers';
import { Spinner } from '../ui/ui';
import URLS from '../../urls';

function DemoLayout() {
  const [_, toLocaleRoute] = useLocale();

  return (
    <div>
      <React.Suspense fallback={<Spinner />}>
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
          <Route render={() => <h1>not found</h1>} />
        </Switch>
      </React.Suspense>
    </div>
  );
}

export default withRouter(DemoLayout);
