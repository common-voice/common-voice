import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../services/api';
import StateTree from '../../stores/tree';
import { Spinner } from '../ui/ui';
import { useEffect, useState } from 'react';

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

  // Whenever locale changes (and on first draw) fetch the document to be displayed.
  useEffect(() => {
    fetchDocument().then();
  }, [locale]);

  /**
   * Retrieves the document to be displayed and updates state.
   */
  async function fetchDocument() {
    const nextHtml = await api.fetchDocument(name);
    setHtml(nextHtml);
  }

  return html ? (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <Spinner />
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
