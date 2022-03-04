import * as React from 'react';
import { useEffect, useState } from 'react';

import { BarPlot } from '../../../plot/plot';
import { useAPI } from '../../../../hooks/store-hooks';

interface Props {
  locale: string;
  from: 'you' | 'everyone';
}

const ContributionActivity = ({ from, locale }: Props) => {
  const api = useAPI();
  const [barPlotData, setBarPlotData] = useState([]);

  useEffect(() => {
    api.fetchContributionActivity(from, locale).then(setBarPlotData);
  }, [from, locale]);

  return <BarPlot data={barPlotData} />;
};

export default ContributionActivity;
