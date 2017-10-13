import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

import { commonConfig } from './webpack.common.config';

const prodConfig: webpack.Configuration = {
    plugins: [
        /** See https://github.com/webpack-contrib/uglifyjs-webpack-plugin/tree/v0.4.6 */
        new webpack.optimize.UglifyJsPlugin()
    ]
};

export default merge(commonConfig, prodConfig);
