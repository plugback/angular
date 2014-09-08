var ManifestService = (function () {
    function ManifestService() {
        console.log("manifest v7.21");
    }
    ManifestService.prototype.clear = function () {
        document.cookie = "_manifest=clear";
        this.setIframe();
    };

    ManifestService.prototype.offline = function (resources) {
        var offline = "";
        for (var i = 0; i < resources.length; i++)
            offline = offline + resources[i] + ",";
        document.cookie = "_manifest=" + offline;
        this.setIframe();
    };

    ManifestService.prototype.setIframe = function () {
        var iframe = document.getElementById("__manifest_iframe");
        if (!iframe)
            iframe = "<iframe id='__manifest_iframe' src='manifest' style='display:none;'></iframe>";
        angular.element(iframe).remove();
        angular.element(document.body).append(angular.element(iframe));
    };
    return ManifestService;
})();

module.exports = {
    service: ManifestService,
    name: "manifest"
};
//# sourceMappingURL=manifest.js.map
