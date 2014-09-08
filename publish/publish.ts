

class Publish{

    constructor($http, $document, $parse, $timeout){
        return {
            restrict: 'A',
            require: "?ngModel",
            link: function(scope, element, attrs) {
                var url = attrs.url
                var timeout = attrs.timeout
                var model =  $parse(attrs.publish)


                element.on("click", function(clickEvent, element){
                    var object = model(scope)
                    $http.post(url, object).success(function(data){
                        var modelSetter = model.assign
                        modelSetter(scope, data)
                        var savedState = $parse(attrs.publish + ".saved").assign
                        savedState(scope, true)
                        var t = 3000
                        if(timeout)
                            t = timeout
                        $timeout(function(){savedState(scope, null)}, t)
                    }).error(function(){
                        var errorState = $parse(attrs.publish + ".error").assign
                        errorState(scope, true)
                        var t = 3000
                        if(timeout)
                            t = timeout
                        $timeout(function(){errorState(scope, null)}, t)
                    })
                })



            }
        };
    }

}

module.exports = {
    directive: Publish,
    name: "publish"
}




