import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import * as React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import StateTree from '../../../stores/tree';
import { ACCENTS, AGES } from '../../../stores/demographics';
import {
  localeConnector,
  LocalePropsFromState,
  LocalizedGetAttribute,
  LocaleLink,
  useLocale,
} from '../../locale-helpers';
import { CloudIcon, PlayOutlineIcon, MicIcon, GlobeIcon } from '../../ui/icons';
import {
  Button,
  LabeledCheckbox,
  LabeledInput,
  LabeledSelect,
  LinkButton,
  TextButton,
} from '../../ui/ui';
import CircleStats, { CircleStat } from './circle-stats';
import Dots from './dots';
import releases from './stats';
import {
  DatasetPropsFromState,
  DownloadFormProps,
  CorpusProps,
  BundleState,
} from './types';
import './dataset-info.css';
import URLS from '../../../urls';

export const CURRENT_RELEASE = 'cv-corpus-6.1-2020-12-11';
const SEGMENT_RELEASE = 'cv-corpus-6.1-singleword';

const DEFAULT_CATEGORY_COUNT = 2;

const Splits = ({
  category,
  values,
  bundleLocale,
}: {
  category: string;
  values: { [key: string]: number };
  bundleLocale: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const categories = Object.entries(values).filter(
    ([key, value]) => key && key != 'other' && value > 0
  );
  return (
    <div key={category} className="splits">
      <LocalizedGetAttribute id={'profile-form-' + category} attribute="label">
        {label => <h5>{label}</h5>}
      </LocalizedGetAttribute>
      <ol onClick={() => setExpanded(!expanded)} tabIndex={0} role="button">
        {categories
          .sort((a, b) => (a[1] < b[1] ? 1 : -1))
          .slice(0, expanded ? categories.length : DEFAULT_CATEGORY_COUNT)
          .map(([key, value]) => (
            <li key={key}>
              <b>{Math.round(value * 100)}%</b>
              <span> </span>
              <div className="ellipsis">
                {category == 'gender' ? (
                  <Localized id={key}>
                    <span />
                  </Localized>
                ) : category == 'accent' ? (
                  ACCENTS[bundleLocale] ? (
                    ACCENTS[bundleLocale][key]
                  ) : (
                    key
                  )
                ) : category == 'age' ? (
                  (AGES as any)[key]
                ) : (
                  key
                )}
              </div>
            </li>
          ))}
        {!expanded && categories.length > DEFAULT_CATEGORY_COUNT && (
          <li key="more">...</li>
        )}
      </ol>
    </div>
  );
};

type Props = LocalePropsFromState & WithLocalizationProps;

const formatHrs = (hrs: number) => {
  return hrs < 1 ? Math.floor(hrs * 100) / 100 : Math.floor(hrs);
};

const byteToSize = (bytes: number, getString: Function) => {
  const megabytes = bytes / 1024 / 1024;
  return megabytes < 1
    ? Math.round(megabytes * 100) / 100 + ' ' + getString('size-megabyte')
    : megabytes > 1024
    ? Math.round(megabytes / 1024) + ' ' + getString('size-gigabyte')
    : Math.round(megabytes) + ' ' + getString('size-megabyte');
};

function renderStats(stats: any, bundleState: BundleState) {
  const localeStats = stats.locales[bundleState.bundleLocale];

  return Object.entries({
    'dataset-date': stats.date,
    size: bundleState.size,
    'dataset-version': (
      <div className="version">
        {[
          bundleState.bundleLocale,
          bundleState.totalHours + 'h',
          stats.date,
        ].join('_')}
      </div>
    ),
    'validated-hr-total': bundleState.validHours.toLocaleString(),
    'overall-hr-total': bundleState.totalHours.toLocaleString(),
    'cv-license': 'CC-0',
    'number-of-voices': localeStats.users.toLocaleString(),
    'audio-format': 'MP3',
    splits: Object.entries(localeStats.splits)
      .filter(([, values]) => Object.keys(values).length > 1)
      .map(([category, values]: [string, { [key: string]: number }]) => {
        return (
          <Splits
            key={category}
            {...{ category, values, bundleLocale: bundleState.bundleLocale }}
          />
        );
      }),
  }).map(([id, value]) => (
    <li key={id}>
      <Localized id={id}>
        <span className="label" />
      </Localized>
      <span className="value">{value}</span>
    </li>
  ));
}

export const DatasetsIntro = ({ demoMode }: { demoMode?: boolean }) => {
  const [showIntroTextMdDown, setShow] = useState(false);
  return (
    <div className="intro">
      <Localized id="datasets-headline">
        <h1 />
      </Localized>

      {!showIntroTextMdDown && (
        <Localized id="show-wall-of-text">
          <TextButton
            className={!demoMode && 'hidden-lg-up'}
            onClick={() => {
              setShow(true);
            }}
          />
        </Localized>
      )}

      <Localized id="datasets-positioning">
        <p
          className={
            showIntroTextMdDown ? '' : demoMode ? 'hide' : 'hidden-md-down'
          }
        />
      </Localized>
    </div>
  );
};

const DatasetCorpusDownload = ({
  getString,
  api,
  releaseName,
}: CorpusProps) => {
  const generateBundleState = (
    bundleLocale: string,
    version: string,
    localeStats: any
  ) => {
    return {
      bundleLocale,
      checksum: localeStats?.checksum || null,
      rawSize: localeStats.size,
      size: byteToSize(localeStats.size, getString),
      language: getString(bundleLocale),
      totalHours: formatHrs(localeStats.totalHrs),
      validHours: formatHrs(localeStats.validHrs),
      datasetVersion: version,
    };
  };

  const [locale, _] = useLocale();
  const [releaseStats, setReleaseStats] = React.useState(releases[releaseName]);

  let bundleLocale = releaseStats.locales[locale] ? locale : 'en';
  let localeStats = releaseStats.locales[bundleLocale];

  const [bundleState, setBundleState] = React.useState(
    generateBundleState(bundleLocale, CURRENT_RELEASE, localeStats)
  );

  const handleLangChange = ({ target }: any) => {
    const newLocale = target.value;

    setBundleState(
      generateBundleState(
        newLocale,
        bundleState.datasetVersion,
        releaseStats.locales[newLocale]
      )
    );
  };

  const handleVersionChange = ({ target }: any) => {
    const newDatasetVersion = target.value;
    const newReleaseStats = releases[newDatasetVersion];
    const locale = newReleaseStats.locales[bundleState.bundleLocale]
      ? bundleState.bundleLocale
      : 'en';

    setReleaseStats(newReleaseStats);
    setBundleState(
      generateBundleState(
        locale,
        newDatasetVersion,
        newReleaseStats.locales[locale]
      )
    );
  };

  return (
    <div className="info" id="demo-info">
      <div className="inner">
        <LabeledSelect
          label={getString('release-version')}
          name="datasetVersion"
          value={bundleState.datasetVersion}
          onChange={handleVersionChange}>
          {Object.keys(releases).map(
            releaseName =>
              releases[releaseName].multilingual && (
                <option key={releaseName} value={releaseName}>
                  {releases[releaseName].name}
                </option>
              )
          )}
        </LabeledSelect>

        <LabeledSelect
          label={getString('language')}
          name="bundleLocale"
          value={bundleState.bundleLocale}
          onChange={handleLangChange}>
          {Object.keys(releaseStats.locales)
            .sort()
            .map(locale => (
              <Localized key={locale} id={locale}>
                <option value={locale} />
              </Localized>
            ))}
        </LabeledSelect>

        <ul className="facts">{renderStats(releaseStats, bundleState)}</ul>
        <DownloadEmailPrompt
          {...{
            api,
            urlPattern: releaseStats.bundleURLTemplate
              ? releaseStats.bundleURLTemplate
              : releaseStats.bundleUrl,
            release: releaseName,
            bundleState,
          }}
        />
      </div>
    </div>
  );
};

const DownloadEmailPrompt = ({
  release,
  urlPattern,
  api,
  bundleState,
}: DownloadFormProps) => {
  const emailInputRef = React.useRef<HTMLInputElement>();

  const [formState, setFormState] = React.useState({
    email: '',
    confirmNoIdentify: false,
    confirmSize: false,
    downloadLink: null,
    hideEmailForm: true,
    locale: bundleState.bundleLocale,
    datasetVersion: bundleState.datasetVersion,
  });

  const {
    email,
    confirmNoIdentify,
    confirmSize,
    downloadLink,
    hideEmailForm,
    locale,
    datasetVersion,
  } = formState;

  const validDownload = (formState: any) => {
    return (
      emailInputRef.current?.checkValidity() &&
      formState.confirmNoIdentify &&
      formState.confirmSize
    );
  };

  const updateLink = async (bundleState: any, formState: any) => {
    // AWS CDN only supports files up to 20GB
    const useCDN = bundleState.rawSize < 20 * 1024 * 1024 * 1024;

    const key = urlPattern.replace('{locale}', bundleState.bundleLocale);
    const { url } = await api.getPublicUrl(
      encodeURIComponent(key),
      'dataset',
      useCDN
    );

    return validDownload(formState) ? url : null;
  };

  const saveHasDownloaded = async () => {
    if (validDownload(formState)) {
      await api.saveHasDownloaded(
        email,
        bundleState.bundleLocale,
        bundleState.datasetVersion
      );
    }
  };

  const showEmailForm = () =>
    setFormState(prev => ({ ...prev, hideEmailForm: false }));

  const handleInputChange = async ({ target }: any) => {
    let newState = {
      ...formState,
      [target.name]: target.type !== 'checkbox' ? target.value : target.checked,
    };

    updateLink(bundleState, newState).then(downloadLink => {
      setFormState({
        ...newState,
        downloadLink,
      });
    });
  };

  if (
    bundleState.bundleLocale != formState.locale ||
    bundleState.datasetVersion != formState.datasetVersion
  ) {
    updateLink(bundleState, formState).then(downloadLink => {
      setFormState({
        ...formState,
        downloadLink,
        locale: bundleState.bundleLocale,
        datasetVersion: bundleState.datasetVersion,
      });
    });
  }

  return (
    <>
      {hideEmailForm ? (
        <div className="show-email-wrapper">
          <div className="show-email-button">
            <Button className="show-email-form" rounded onClick={showEmailForm}>
              <Localized id="email-to-download">
                <span />
              </Localized>
              <CloudIcon />
            </Button>
          </div>
          <Localized id="why-email" elems={{ b: <b /> }}>
            <p className="why-email" />
          </Localized>
        </div>
      ) : (
        <>
          <Localized id="email-input" attrs={{ label: true }}>
            <LabeledInput
              name="email"
              id="download-email"
              onChange={handleInputChange}
              ref={emailInputRef}
              type="email"
              required
            />
          </Localized>
          <LabeledCheckbox
            label={
              <Localized
                id="confirm-size"
                elems={{ b: <b /> }}
                vars={{ size: bundleState.size }}>
                <span />
              </Localized>
            }
            name="confirmSize"
            checked={confirmSize}
            onChange={handleInputChange}
          />
          <LabeledCheckbox
            label={
              <Localized id="confirm-no-identify" elems={{ b: <b /> }}>
                <span />
              </Localized>
            }
            name="confirmNoIdentify"
            checked={confirmNoIdentify}
            onChange={handleInputChange}
          />
          <LinkButton
            href={downloadLink}
            onClick={saveHasDownloaded}
            rounded
            blank
            className="download-language">
            <Localized
              id="download-language"
              vars={{ language: bundleState.language }}>
              <span />
            </Localized>
            <CloudIcon />
          </LinkButton>
          {bundleState.checksum && (
            <div className="checksum">
              <strong>sha256 checksum</strong>: {bundleState.checksum}
            </div>
          )}
        </>
      )}
    </>
  );
};

export const DatasetsDescription = ({
  releaseName,
}: {
  releaseName: string;
}) => {
  const [locale, _] = useLocale();
  const stats = releases[releaseName];
  const languages = Object.keys(stats.locales).length;
  const globalStats = {
    total: stats.totalHrs.toLocaleString(locale),
    valid: stats.totalValidHrs.toLocaleString(locale),
    languages,
  };

  return (
    <>
      <CircleStats {...globalStats} className="hidden-md-down" />
      <div className="text">
        <div className="line" />
        <Localized id="whats-inside">
          <h1 id="whats-inside" />
        </Localized>
        <CircleStats {...globalStats} className="hidden-lg-up" />
        <Localized
          id="dataset-description-hours"
          vars={globalStats}
          elems={{
            b: <b />,
            languagesLink: <LocaleLink to={URLS.LANGUAGES}></LocaleLink>,
          }}>
          <p id="description-hours" />
        </Localized>
      </div>
    </>
  );
};

const DatasetSegmentDownload = ({
  getString,
  api,
  releaseName,
}: CorpusProps) => {
  const stats = releases[releaseName];
  const bundleState = {
    bundleLocale: 'overall',
    checksum: stats.overall.checksum,
    size: byteToSize(stats.overall.size, getString),
    language: '',
    totalHours: formatHrs(stats.totalHrs),
    validHours: formatHrs(stats.totalValidHrs),
    rawSize: stats.overall.size,
    datasetVersion: SEGMENT_RELEASE,
  };

  const dotSettings = {
    dotBackground: '#121217',
    dotColor: '#4a4a4a',
    dotSpace: 15,
    dotWidth: 100,
  };

  return (
    <div className="dataset-segment-content">
      <div className="dataset-segment-intro">
        <h2 className="dataset-segment-callout">
          <Localized id="data-download-singleword-title" />
        </h2>
        <Localized id="data-download-singleword-callout-v2">
          <p id="description-hours" />
        </Localized>
      </div>
      <div className="dataset-segment-stats">
        <div className="circle-stats">
          <div className="circle-stat-wrapper">
            <CircleStat
              className="valid-hours"
              label="validated-hours"
              value={bundleState.validHours}
              icon={<PlayOutlineIcon />}
              {...dotSettings}
            />
          </div>
          <div className="circle-stat-wrapper">
            <CircleStat
              className="total-hours"
              label="recorded-hours"
              value={bundleState.totalHours}
              icon={<MicIcon />}
              {...dotSettings}
            />
          </div>
          <div className="circle-stat-wrapper">
            <CircleStat
              className="languages"
              label="languages"
              value={
                Object.keys(stats.locales).filter(
                  locale => locale !== releaseName
                ).length
              }
              icon={<GlobeIcon />}
              {...dotSettings}
            />
          </div>
        </div>
        <div className="dataset-download-prompt">
          <DownloadEmailPrompt
            {...{
              api,
              urlPattern: stats.bundleURL,
              release: releaseName,
              bundleState,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

class DatasetInfo extends React.Component<Props> {
  constructor(props: Props, context: any) {
    super(props, context);
  }

  render() {
    const { getString } = this.props;

    return (
      <div className="dataset-info">
        <div className="top">
          <div className="cloud-circle">
            <CloudIcon />
          </div>
          <DatasetsIntro />
          <ConnectedDatasetDownload
            {...{ releaseName: CURRENT_RELEASE, getString }}
          />
        </div>
        <div className="description">
          <DatasetsDescription {...{ releaseName: CURRENT_RELEASE }} />
        </div>
        <div className="dataset-segment-download">
          <ConnectedSegmentDownload
            {...{ releaseName: SEGMENT_RELEASE, getString }}
          />
        </div>
      </div>
    );
  }
}

export const ConnectedDatasetDownload = connect<DatasetPropsFromState>(
  mapStateToProps
)(DatasetCorpusDownload);

export const ConnectedSegmentDownload = connect<DatasetPropsFromState>(
  mapStateToProps
)(DatasetSegmentDownload);

export default localeConnector(
  withLocalization(connect<DatasetPropsFromState>(mapStateToProps)(DatasetInfo))
);
