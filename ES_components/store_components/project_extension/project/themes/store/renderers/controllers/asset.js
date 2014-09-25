/*
 * Copyright (c) 2005-2014, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var render = function(theme, data, meta, require) {
    var navigation = 'navigation';
    var navigationContext = require('/helpers/navigation.js').currentPage(data.navigation, data.type, data.search);
    switch (data.assetTypeCount) {
        case 1:
            navigation = 'navigation-single';
            navigationContext = require('/helpers/navigation-single.js').currentPage(data.navigation, data.type, data.search);
            break;
        default:
            break;
    }
    var partial = 'asset';
    /*support multiple LC state in store*/
    if (data.asset.lifecycleState == 'Testing') {
        partial = 'asset_testing_state'; // if the LC state is 'Testing', point to asset_testing_state.hbs partial
    }
    if (data.asset.lifecycleState == 'Development') {
        partial = 'asset_development_state'; // if the LC state is 'Development', point to asset_development_state.hbs partial
    }
    if (data.asset.lifecycleState == 'Production') {
        partial = 'asset_production_state'; // if the LC state is 'Production', point to asset_production_state.hbs partial
    }
    if (data.asset.lifecycleState == 'Published') {
        partial = 'asset_published_state'; // if the LC state is 'Published', point to asset_published_state.hbs partial
    }
    theme('1-column', {
        title: data.title,
        header: [{
            partial: 'header',
            context: data.header
        }],
        navigation: [{
            partial: navigation,
            context: navigationContext
        }],
        body: [{
            partial: partial,
            context: require('/helpers/asset.js').format({
                user: data.user,
                sso: data.sso,
                asset: data.asset,
                type: data.type,
                inDashboard: data.inDashboard,
                embedURL: data.embedURL,
                isSocial: data.isSocial
            })
        }]
    });
};