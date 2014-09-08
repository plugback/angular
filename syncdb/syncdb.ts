
var dbm = require("../db/db")
var DB = dbm.service

interface Action{
    shouldUnsync:Array<any>
    shouldDelete:Array<any>
    shouldSave:Array<any>
}

class SyncDB extends DB{

    private checker
    private toSync = "to-sync"
    private saving = false
    private syncing = false

    constructor($localForage, private $window, private $http:ng.IHttpService, private $timeout, $interval, private syncUrl) {
        super($localForage)
        console.log("starting sync db v2")
        var me = this
        this.checker = $interval(function(){me.synchronize()}, 5000)
    }

    save(object:any):any{
        var me = this
        me.$localForage.getItem(me.toSync).then(function(toSyncCollection){
            if(!toSyncCollection)
                toSyncCollection = []
            toSyncCollection.push(object)
            me.$timeout(function(){
                if(!me.syncing){
                    me.saving = true
                    me.$localForage.setItem(me.toSync, toSyncCollection).then(function(){
                        me.saving = false
                    })
                }
                else
                    me.$timeout(this, 50)
            }, 50)

        })
        return super.save(object)
    }

    synchronize(){
        var me = this
        me.$localForage.getItem(me.toSync).then(function(toSyncCollection){
            if(toSyncCollection){
                me.$http.post(me.syncUrl, toSyncCollection).success(me.serverSyncCallback)
            }
        })
    }

    private serverSyncCallback(action:Action){

        // the server said to save these elements
        for(var i = 0; i < action.shouldSave.length; i++){
            var data = action.shouldSave[i]
            this.save(data)
        }

        // the server said to delete these elements
        for(var i = 0; i < action.shouldDelete.length; i++){
            var data = action.shouldDelete[i]
            this.remove(data)
        }

        // the server said to unsync these elements
        var me = this
        me.$localForage.getItem(me.toSync).then(function(toSyncCollection){
            if(toSyncCollection){
                var idsToUnsync = {}
                for(var j = 0; j < action.shouldUnsync.length; j++) {
                    var objectToUnsync = action.shouldUnsync[j]
                    idsToUnsync[objectToUnsync.id] = true
                }
                toSyncCollection = toSyncCollection.filter(function(e){
                    return idsToUnsync[e.id]
                })

                me.$timeout(function(){
                    if(!me.saving){
                        me.syncing = true
                        me.$localForage.setItem(me.toSync, toSyncCollection).then(function(){
                            me.syncing = false
                        })
                    }
                    else
                        me.$timeout(this, 50)
                }, 50)
            }





        })
    }

}

module.exports = {
    service: SyncDB,
    name: "syncDB"
}