import * as React from 'react';
import { Switch, Route, withRouter } from 'react-router';
import { useLocale } from '../locale-helpers';
import { Spinner } from '../ui/ui';
import Intro from '../demo_pages/Intro/intro';

function DemoLayout() {
  const [_, toLocaleRoute] = useLocale();

  return (
    <div>
      <React.Suspense fallback={<Spinner />}>
        <Switch>
          <Route exact path={toLocaleRoute('/demo')} component={Intro} />
          <Route
            exact
            path={toLocaleRoute('/demo/language-select')}
            render={() => {
              return <h1>in language select</h1>;
            }}
          />
          {/* more routes to be added */}
          <Route path="*" render={() => <h1>not found</h1>} />
        </Switch>
      </React.Suspense>
    </div>
  );
}

export default withRouter(DemoLayout);
