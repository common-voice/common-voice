import * as React from 'react';
import './kiosk.css';
import { MicIcon, PlayOutlineGreenIcon } from '../../ui/icons';
import { useLocation } from 'react-router-dom';
import { useLocale } from '../../locale-helpers';
import urls from '../../../urls';
import grid from './assets/grid.svg';
import { PageContentType } from './types';
import { datasets } from './datasets';
import dashboard from './dashboard';

const BottomRightPane = () => {
  return (
    <ul id="kiosk-bottom-right-pane">
      <li id="pane__micIcon">
        <MicIcon />
      </li>
      <li>
        <PlayOutlineGreenIcon />
      </li>
      <hr id="pane-divider" />
      <li>
        <img src={grid} />
      </li>
    </ul>
  );
};

function Kiosk() {
  const PageContentFactory = (): PageContentType => {
    //returns appropriate page content based on current route url
    let page: PageContentType;
    switch (pathname) {
      case toLocaleRoute(urls.DEMO_DATASETS):
        page = datasets();
        break;
      case toLocaleRoute(urls.DEMO_DASHBOARD):
        page = dashboard();
        break;
      // TODO: add more kiosk routes here
      default:
        break;
    }
    return {
      Card: page.Card,
      Content: page.Content,
    };
  };

  const [_, toLocaleRoute] = useLocale();
  const { pathname } = useLocation();
  const [PageContent, setPageContent] = React.useState<PageContentType>(
    PageContentFactory()
  );

  React.useEffect(() => {
    setPageContent(PageContentFactory());
  }, [pathname]);

  return (
    <div id="kiosk-container">
      <div id="pattern-bg">
        <div id="gradient"></div>
        <div id="mesh"></div>
      </div>
      <div id="kiosk-card">
        <PageContent.Card />
      </div>
      <BottomRightPane />
      <div id="kiosk--content">
        <PageContent.Content />
      </div>
    </div>
  );
}

export default Kiosk;
