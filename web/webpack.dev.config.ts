import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

import { commonConfig } from './webpack.common.config';

const devConfig: webpack.Configuration = {
    devtool: 'inline-source-map'
};

export default merge(commonConfig, devConfig);
