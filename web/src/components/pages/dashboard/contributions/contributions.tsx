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
    <h1>Make a contribution</h1>
    <LinkButton
      rounded
      to={(dashboardLocale ? '/' + dashboardLocale : '') + URLS.SPEAK}>
      Donate your voice
    </LinkButton>
    <p>When you submit a clip, it will show up here.</p>
  </div>
);

const INTERVAL_LABELS: { [key: number]: string } = {
  1: 'Daily',
  7: 'Weekly',
};

const Wave = () => (
  <svg className="wave" width="172" height="70" viewBox="0 0 172 70">
    <defs>
      <linearGradient id="wave-b" x1="50%" x2="50%" y1="100%" y2="0%">
        <stop offset="0%" stopColor="#040101" stopOpacity="0" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.3" />
      </linearGradient>
      <path
        id="wave-a"
        d="M0 49.237c22.655-18.809 30.755-2.594 58.986-2.594C89.25 46.643 100.896 10 128 10c21 0 26 9 44 16.117V80H0V49.237z"
      />
    </defs>
    <use
      fill="url(#wave-b)"
      fillRule="evenodd"
      opacity=".5"
      transform="matrix(-1 0 0 1 172 -10)"
      xlinkHref="#wave-a"
    />
  </svg>
);

const AwardBox = ({ award }: any) => (
  <li className={'award-box ' + award.type}>
    <Wave />
    <img className="star" src={require('./star.svg')} alt="Star" />
    <div className="interval">
      {INTERVAL_LABELS[award.days_interval] || award.days_interval}
    </div>
    <div className="line" />
    <div className="amount">{award.amount} Clips</div>
    <div className="type">
      {award.type[0].toUpperCase() + award.type.slice(1)}
    </div>
    <div className="icon">
      {({ speak: <MicIcon />, listen: <PlayOutlineIcon /> } as any)[award.type]}
    </div>
  </li>
);

export default function ContributionsPage({ dashboardLocale }: Props) {
  const account = useAccount();
  const api = useAPI();
  const refreshUser = useAction(User.actions.refresh);
  const [clips, setClips] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [query, setQuery] = useState({
    page: 1,
    count: 5,
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

  if (clips && clips.length == 0) {
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
            Displaying {metadata.offset}/{metadata.totalCount} clips{' '}
          </p>
          {metadata.offset > 5 && (
            <Button onClick={() => setQuery({ ...query, page: --query.page })}>
              Previous
            </Button>
          )}
          {metadata.offset < metadata.totalCount && (
            <Button onClick={() => setQuery({ ...query, page: ++query.page })}>
              Next
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
