import * as React from 'react';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import API from '../../services/api';
import StateTree from '../../stores/tree';
import { Spinner } from '../ui/ui';
import Page from '../ui/page';
import PageTextContent from '../ui/page-text-content';
import PageHeading from '../ui/page-heading';

interface PropsFromState {
  api: API;
  locale: string;
}

type Props = {
  name: 'privacy' | 'terms' | 'challenge-terms';
} & PropsFromState;

/**
 * Renders an HTML document determined by the <c>name</c> prop.
 * @param {{name:string} & PropsFromState} props Props passed to the component.
 */
function DocumentPage(props: Props) {
  const { api, name, locale } = props;
  const [html, setHtml] = useState('');
  const [h1Content, setH1Content] = useState('');

  // Whenever locale changes (and on first draw) fetch the document to be displayed.
  useEffect(() => {
    fetchDocument();
  }, [locale]);

  /**
   * Retrieves the document to be displayed and updates state.
   */
  async function fetchDocument() {
    const nextHtml = await api.fetchDocument(name);

    const h1Regex = /<h1>(.*)<\/h1>/;
    const nextH1Content = nextHtml.match(h1Regex)[1];
    const htmlWithoutH1 = nextHtml.replace(h1Regex, '');

    setH1Content(nextH1Content);
    setHtml(htmlWithoutH1);
  }

  return (
    <Page isCentered>
      {html ? (
        <React.Fragment>
          <PageHeading>{h1Content}</PageHeading>
          <PageTextContent>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </PageTextContent>
        </React.Fragment>
      ) : (
        <Spinner />
      )}
    </Page>
  );
}

/**
 * Maps Redux state to local props for the component
 * @param API api Provides methods for fetching HTML for the page.
 * @param {string} locale Triggers a redraw if the locale is changed in state.
 */
const mapStateToProps = ({ api, locale }: StateTree) => ({
  api,
  locale,
});

export default connect<PropsFromState>(mapStateToProps)(DocumentPage);
