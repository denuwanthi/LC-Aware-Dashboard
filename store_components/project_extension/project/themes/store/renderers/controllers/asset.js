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
        partial = 'asset_testing_state';
    }
    if (data.asset.lifecycleState == 'Development') {
        partial = 'asset_development_state';
    }
    if (data.asset.lifecycleState == 'Production') {
        partial = 'asset_production_state';
    }
    if (data.asset.lifecycleState == 'Published') {
        partial = 'asset_published_state';
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