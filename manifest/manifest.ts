

class ManifestService{


    constructor() {
        console.log("manifest v7.21")
    }

    clear():any{
        document.cookie = "_manifest=clear"
        this.setIframe()
    }

    offline(resources:Array<string>){
        var offline = ""
        for(var i = 0; i < resources.length; i++)
            offline = offline + resources[i] + ","
        document.cookie = "_manifest=" + offline
        this.setIframe()
    }

    private setIframe(){
        var iframe = <any>document.getElementById("__manifest_iframe")
        if(!iframe)
            iframe = "<iframe id='__manifest_iframe' src='manifest' style='display:none;'></iframe>"
        angular.element(iframe).remove()
        angular.element(document.body).append(angular.element(iframe))
    }

}

module.exports = {
    service: ManifestService,
    name: "manifest"
}