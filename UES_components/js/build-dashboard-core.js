var pref = new gadgets.Prefs();
var delay;
var chartData = [];
$(function() {
    var url = $.url();
    if (url.param('onRemote') === "true") {
        fetchData(url.attr('query'));
    }
    var pauseBtn = $("button.pause");
    pauseBtn.click(function() {
        $(this).toggleClass('btn-warning');
        togglePause($(this));
    });
    $(".reset").click(function() {
        fetchData();
    });
    if (pref.getString("pause").toLowerCase() == "yes") {
        document.getElementById("pauseBtn").style.visibility = 'visible';
    }
});

function fetchData(params) {
    var url = pref.getString("dataSource") + "?" + params;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: onDataReceived
    });
    var pauseBtn = $("button.pause");
    togglePause(pauseBtn);
}
gadgets.HubSettings.onConnect = function() {
    gadgets.Hub.subscribe("req-param-channel", callback);
};

function callback(topic, params, subscriberData) {
    fetchData(params);
}
$(window).load(function() {
    var url = $.url();
    if (url.param('onRemote') === "true") {
        fetchData(url.attr('query'));
    }
});

function onDataReceived(data) {
    var series = data['content'];
    var options = data['options'];
    chartData = series[0];
    //var data = series[0];//console.info(data);
    var chartOptions = options;
    var _chartData = [];
    addSeriesCheckboxes(chartData);
    $.each(chartData, function(key, val) {
        _chartData.push(chartData[key]);
    });
    //console.info(chartData);
    $.plot("#placeholder", _chartData, chartOptions);
    //drawChart(_chartData,chartOptions);
    var seriesContainer = $("#optionsRight");
    seriesContainer.find(":checkbox").click(function() {
        filterSeries(chartData);
    });
}

function togglePause(btnElm) {
    var pauseBtn = btnElm;
    if (pauseBtn.hasClass('btn-warning')) {
        clearTimeout(delay);
    } else {
        if (isNumber(pref.getString("updateGraph")) && !(pref.getString("updateGraph") == "0")) {
            delay = setTimeout(function() {
                fetchData()
            }, pref.getString("updateGraph") * 1000);
        }
    }
}
var drawChart = function(data, options) {
    $.plot("#placeholder", data, options);
}

function addSeriesCheckboxes(data) {
    // insert checkboxes 
    var seriesContainer = $("#optionsRight .series-toggle");
    seriesContainer.html("");
    var objCount = 0;
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            objCount++;
        }
    }
    if (objCount > 1) {
        $.each(data, function(key, val) {
            seriesContainer.append("<li><input type='checkbox' name='" + key + "' checked='checked' id='id" + key + "'></input>" + "<label for='id" + key + "' class='seriesLabel'>" + val.label + "</label></li>");
        });
    }
}

function filterSeries(data) {
    var filteredData = [];
    var seriesContainer = $("#optionsRight");
    seriesContainer.find("input:checked").each(function() {
        var key = $(this).attr("name");
        if (key && data[key]) {
            filteredData.push(data[key]);
        }
        drawChart(filteredData, options);
    });
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}