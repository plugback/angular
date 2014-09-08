var DB = (function () {
    function DB($localForage) {
        this.$localForage = $localForage;
        console.log("starting db v4");
    }
    DB.prototype.save = function (object) {
        var type = this.getType(object);
        if (!object.id)
            object.id = new Date().getTime();
        this.$localForage.setItem(this.objectKey(object.id, type), object);
        var me = this;
        this.$localForage.getItem(type).then(function (collection) {
            if (!collection)
                collection = me.initCollection();
            collection[object.id] = object;
            me.$localForage.setItem(type, collection);
        });
        return object;
    };

    DB.prototype.find = function (id, type) {
        var t = type;
        if (type instanceof Function)
            t = type.name;
        return this.$localForage.getItem(this.objectKey(id, t));
    };

    DB.prototype.objectKey = function (id, type) {
        return type + "_" + id;
    };

    DB.prototype.remove = function (object) {
        var type = this.getType(object);
        var me = this;
        this.$localForage.getItem(type).then(function (collection) {
            if (collection) {
                collection[object.id] = null;
                me.$localForage.setItem(type, collection);
            }
        });
        this.$localForage.removeItem(this.objectKey(object.id, type));
    };

    DB.prototype.getAll = function (type) {
        var t = type.name;
        return this.$localForage.getItem(t);
    };

    DB.prototype.clearAll = function (type) {
        var t = type.name;
        var me = this;
        this.$localForage.getItem(t).then(function (collection) {
            if (!collection)
                collection = me.initCollection();
            for (var key in collection) {
                var id = collection[key].id;
                me.$localForage.removeItem(me.objectKey(id, t));
            }
            me.$localForage.removeItem(t);
        });
    };

    DB.prototype.getType = function (inputClass) {
        if (inputClass.className)
            return inputClass.className;
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec(inputClass.constructor.toString());
        var t = (results && results.length > 1) ? results[1] : "";
        if (t == null) {
            t = "UNKNOWN_TYPE";
        }
        return t;
    };

    DB.prototype.initCollection = function () {
        return {};
    };
    return DB;
})();

module.exports = {
    service: DB,
    name: "db"
};
//# sourceMappingURL=db.js.map
