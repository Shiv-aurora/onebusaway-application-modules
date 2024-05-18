function init() {

}

function onStageClick() {
    stageBundle();
}

function stageBundle() {
    var environment = jQuery("#deploy_environment").text();
    var bundleDir = selectedDirectory;
    var bundleName = jQuery("#Build #bundleBuildName").val();
    console.log("calling " + "../../api/bundle/stagerequest/" + environment + "/" + bundleDir + "/" + bundleName + "?ts=" +new Date().getTime())
    // TODO consider POST
    jQuery.ajax({
        url: "../../api/bundle/stagerequest/" + environment + "/" + bundleDir + "/" + bundleName + "?ts=" +new Date().getTime(),
        type: "GET",
        async: false,
        success: function(response) {
            /*var bundleResponse = response;
                if (bundleResponse != undefined) {
                    if (typeof response=="string") {
                        if (bundleResponse.match(/SUCCESS/)) {
                            toggleStageBundleResultList();
                            jQuery("#bundleStagingResultsHolder #bundleStagingResults #stageBundle_progress").show().css("display","block");
                            jQuery("#bundleStagingResultsHolder #bundleStagingResults #stageBundle_resultList").show().css("display","block");
                            jQuery("#stageBundle_resultList").html(bundleName);
                            jQuery("#stageContentsHolder #stageBox #staging #stagingProgress").attr("src","../../css/img/dialog-accept-2.png");
                            jQuery("#stageBundle_stageProgress").text("Staging Complete!");
                            var continueButton = jQuery("#stage_continue");
                            enableContinueButton(continueButton);
                        } else {
                            jQuery("#stageBundle_id").text("Failed to Stage requested Bundle!");
                            jQuery("#stageBundle_resultList").html("error");
                        }
                    }*/
            var bundleResponse = response;
            if (bundleResponse != undefined) {
                // the header is set wrong for the proxied object, run eval to correct
                if (typeof response=="string") {
                    bundleResponse = eval('(' + response + ')');
                }
                jQuery("#stageBundle_resultList").html("calling...");
                jQuery("#stageBundle_id").text(bundleResponse.id);
                jQuery("#stageBundle #requestLabels").show().css("display","block");
                jQuery("#stageContentsHolder #stageBox #staging").show().css("display","block");
                jQuery("#stageBundle_stageProgress").text("Staging ...");
                jQuery("#stageContentsHolder #stageBox #staging #stagingProgress").attr("src","../../css/img/ajax-loader.gif");
                window.setTimeout(updateStageStatus, 5000);
            } else {
                jQuery("#stageBundle_id").text(error);
                jQuery("#stageBundle_resultList").html("error");
            }
        },
        error: function(request) {
            console.log("failure=" + JSON.stringify(request, null, 2));
            alert("There was an error processing your request. Please try again.");
        }
    });

}

function updateStageStatus() {
    id = jQuery("#stageBundle_id").text();
    // TODO consider POST
    console.log("status check " + "../../api/bundle/stage/status/" + id + "/list?ts=" +new Date().getTime());
    jQuery.ajax({
        url: "../../api/bundle/stage/status/" + id + "/list?ts=" +new Date().getTime(),
        type: "GET",
        async: false,
        success: function(response) {
            var txt = "<ul>";
            var bundleResponse = response;
            if (bundleResponse == null) {
                jQuery("#stageBundle_stageProgress").text("Stage Complete!");
                jQuery("#stageContentsHolder #stageBox #staging #stagingProgress").attr("src","../../css/img/dialog-warning-4.png");
                jQuery("#stageBundle_resultList").html("unknown id=" + id);
                return;
            }
            // the header is set wrong for the proxied object, run eval to correct
            if (typeof response=="string") {
                bundleResponse = eval('(' + response + ')');
            }
            if (bundleResponse.status != "complete" && bundleResponse.status != "error") {
                window.setTimeout(updateStageStatus, 5000); // recurse
            } else {
                toggleStageBundleResultList();
                jQuery("#bundleStagingResultsHolder #bundleStagingResults #stageBundle_progress").show().css("display","block");
                jQuery("#bundleStagingResultsHolder #bundleStagingResults #stageBundle_resultList").show().css("display","block");
                if (bundleResponse.status == "complete") {
                    jQuery("#stageContentsHolder #stageBox #staging #stagingProgress").attr("src","../../css/img/dialog-accept-2.png");
                    jQuery("#stageBundle_stageProgress").text("Staging Complete!");
                    // set resultList to bundleNames list
                    var size = bundleResponse.bundleNames.length;
                    if (size > 0) {
                        for (var i=0; i<size; i++) {
                            txt = txt + "<li>" + bundleResponse.bundleNames[i] + "</li>";
                        }
                    }
                    var continueButton = jQuery("#stage_continue");
                    enableContinueButton(continueButton);
                } else {
                    jQuery("#stageContentsHolder #stageBox #staging #stagingProgress").attr("src","../../css/img/dialog-warning-4.png");
                    jQuery("#stageBundle_stageProgress").text("Staging Failed!");
                    // we've got an error
                    txt = txt + "<li><font color=\"red\">ERROR!  Please consult the logs and check the "
                        + "filesystem permissions before continuing</font></li>";
                }
            }
            txt = txt + "</ul>";
            jQuery("#stageBundle_resultList").html(txt).css("font-size", "12px");
        },
        error: function(request) {
            console.log("failure=" + JSON.stringify(request, null, 2));
            clearTimeout(timeout);

            jQuery("#stageContentsHolder #stagingBox #staging #stagingProgress").attr("src","../../css/img/dialog-warning-4.png");
            jQuery("#stageBundle_stageProgress").text("Staging Failed!");
            jQuery("#bundleStagingResultsHolder #bundleStagingResults #stageBundle_progress").show().css("display","block");
            jQuery("#bundleStagingResultsHolder #bundleStagingResults #stageBundle_resultList").show().css("display","block");
            toggleStageBundleResultList();

            // error out on a 500 error, the session will be lost so it will not recover
            var txt = "<ul>";
            txt = txt + "<li><font color=\"red\">The server returned an internal error.  Please consult the logs"
                + " or retry your request</font></li>";
            txt = txt + "</ul>";
            jQuery("#stageBundle_resultList").html(txt).css("font-size", "12px");
        }
    });
}

