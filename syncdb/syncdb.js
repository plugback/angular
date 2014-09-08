var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var dbm = require("../db/db");
var DB = dbm.service;

var SyncDB = (function (_super) {
    __extends(SyncDB, _super);
    function SyncDB($localForage, $window, $http, $timeout, $interval, syncUrl) {
        _super.call(this, $localForage);
        this.$window = $window;
        this.$http = $http;
        this.$timeout = $timeout;
        this.syncUrl = syncUrl;
        this.toSync = "to-sync";
        this.saving = false;
        this.syncing = false;
        console.log("starting sync db v2");
        var me = this;
        this.checker = $interval(function () {
            me.synchronize();
        }, 5000);
    }
    SyncDB.prototype.save = function (object) {
        var me = this;
        me.$localForage.getItem(me.toSync).then(function (toSyncCollection) {
            if (!toSyncCollection)
                toSyncCollection = [];
            toSyncCollection.push(object);
            me.$timeout(function () {
                if (!me.syncing) {
                    me.saving = true;
                    me.$localForage.setItem(me.toSync, toSyncCollection).then(function () {
                        me.saving = false;
                    });
                } else
                    me.$timeout(this, 50);
            }, 50);
        });
        return _super.prototype.save.call(this, object);
    };

    SyncDB.prototype.synchronize = function () {
        var me = this;
        me.$localForage.getItem(me.toSync).then(function (toSyncCollection) {
            if (toSyncCollection) {
                me.$http.post(me.syncUrl, toSyncCollection).success(me.serverSyncCallback);
            }
        });
    };

    SyncDB.prototype.serverSyncCallback = function (action) {
        for (var i = 0; i < action.shouldSave.length; i++) {
            var data = action.shouldSave[i];
            this.save(data);
        }

        for (var i = 0; i < action.shouldDelete.length; i++) {
            var data = action.shouldDelete[i];
            this.remove(data);
        }

        // the server said to unsync these elements
        var me = this;
        me.$localForage.getItem(me.toSync).then(function (toSyncCollection) {
            if (toSyncCollection) {
                var idsToUnsync = {};
                for (var j = 0; j < action.shouldUnsync.length; j++) {
                    var objectToUnsync = action.shouldUnsync[j];
                    idsToUnsync[objectToUnsync.id] = true;
                }
                toSyncCollection = toSyncCollection.filter(function (e) {
                    return idsToUnsync[e.id];
                });

                me.$timeout(function () {
                    if (!me.saving) {
                        me.syncing = true;
                        me.$localForage.setItem(me.toSync, toSyncCollection).then(function () {
                            me.syncing = false;
                        });
                    } else
                        me.$timeout(this, 50);
                }, 50);
            }
        });
    };
    return SyncDB;
})(DB);

module.exports = {
    service: SyncDB,
    name: "syncDB"
};
//# sourceMappingURL=syncdb.js.map
