import { Localized } from '@fluent/react';
import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAccount, useAction, useAPI } from '../../../../hooks/store-hooks';
import { User } from '../../../../stores/user';
import URLS from '../../../../urls';
import { MicIcon, PlayOutlineIcon } from '../../../ui/icons';
import { LinkButton, Button } from '../../../ui/ui';
import Props from '../props';

import './contributions.css';

const NoContributionsPage = ({
  dashboardLocale,
}: {
  dashboardLocale: string;
}) => (
  <div className="no-contributions-page">
    <Localized id="no-contributions">
      <h1></h1>
    </Localized>{' '}
    <LinkButton
      rounded
      to={(dashboardLocale ? '/' + dashboardLocale : '') + URLS.SPEAK}>
      <Localized id="speak-subtitle">
        <span />
      </Localized>{' '}
    </LinkButton>
    <Localized id="submit-clip">
      <p></p>
    </Localized>
  </div>
);

export default function ContributionsPage({ dashboardLocale }: Props) {
  const account = useAccount();
  const api = useAPI();
  const [clips, setClips] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [query, setQuery] = useState({
    page: 0,
    count: 10,
  });

  useEffect(() => {
    api.fetchUserClips(query.page, query.count).then(data => {
      setClips(data.clips);
      setMetadata(data.metadata);
    });
  }, [query]);

  if (!account) {
    return null;
  }

  if (!clips || clips.length == 0) {
    return <NoContributionsPage {...{ dashboardLocale }} />;
  }

  return (
    <section>
      <table className="contributions">
        <thead>
          <tr>
            <th> Sentence </th>
            <th> Date Created </th>
          </tr>
        </thead>
        <tbody>
          {clips &&
            clips.map((clip: { sentence: string }[], i: number) =>
              clip ? (
                <React.Fragment key={i}>
                  <tr>
                    <td>{clip.sentence}</td>
                    <td>
                      {new Date(clip.created_at).toLocaleDateString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                </React.Fragment>
              ) : null
            )}
        </tbody>
      </table>
      {metadata && (
        <div className="table-navigation">
          <p>
            {' '}
            Displaying {query.page + 1}/
            {Math.ceil(metadata.totalCount / query.count)} pages{' '}
          </p>
          {metadata.offset >= query.count && (
            <Button onClick={() => setQuery({ ...query, page: --query.page })}>
              Previous
            </Button>
          )}
          {metadata.offset < metadata.totalCount - query.count && (
            <Button onClick={() => setQuery({ ...query, page: ++query.page })}>
              Next
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
