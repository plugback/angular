
class DB {

    $localForage : any

    constructor($localForage) {
        this.$localForage = $localForage
        console.log("starting db v4")
    }

    save(object:any):any{
        var type = this.getType(object)
        if(!object.id)
            (<any>object).id = new Date().getTime()
        this.$localForage.setItem(this.objectKey(object.id, type), object)
        var me = this
        this.$localForage.getItem(type).then(function(collection){
            if(!collection) collection = me.initCollection()
            collection[object.id] = object
            me.$localForage.setItem(type, collection)
        })
        return object
    }

    find(id:any, type:any):ng.IPromise<any>{

        var t = type
        if(type instanceof Function)
            t = (<any>type).name
        return this.$localForage.getItem(this.objectKey(id, t))
    }

    private objectKey(id:any, type:string){
        return type + "_" + id
    }

    remove(object:any){
        var type = this.getType(object)
        var me = this
        this.$localForage.getItem(type).then(function(collection){
            if(collection){
                collection[object.id] = null
                me.$localForage.setItem(type, collection)
            }
        })
        this.$localForage.removeItem(this.objectKey(object.id, type))
    }

    getAll(type:Function):ng.IPromise<any>{
        var t = (<any>type).name
        return this.$localForage.getItem(t)
    }

    clearAll(type:Function){
        var t = (<any>type).name
        var me = this
        this.$localForage.getItem(t).then(function(collection){
            if(!collection) collection = me.initCollection()
            for(var key in collection){
                var id = collection[key].id
                me.$localForage.removeItem(me.objectKey(id, t))
            }
            me.$localForage.removeItem(t)
        })
    }

    private getType(inputClass) {
        if(inputClass.className)
            return inputClass.className
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec((<any> inputClass).constructor.toString());
        var t =  (results && results.length > 1) ? results[1] : "";
        if(t == null){
            t = "UNKNOWN_TYPE"
        }
        return t
    }

    private initCollection(){
        return {}
    }

}

module.exports = {
    service: DB,
    name: "db"
}