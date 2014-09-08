var Autocomplete = (function () {
    function Autocomplete($http, $document, $parse) {
        return {
            restrict: 'A',
            require: "?ngModel",
            link: function (scope, element, attrs, ngModel) {
                var url = attrs.url;
                var property = attrs.property;
                var autocompleteModel = attrs.autocomplete;

                element.parent().css("position", "relative");

                var elements = angular.element("<ul class='dropdown-menu'></ul>");
                var hidePopup = function () {
                    elements.css("display", "none");
                };

                element.after(elements);
                element.on("keyup", function (event) {
                    $http.get(url + element.val()).success(function (data) {
                        if (data && data.length > 0) {
                            elements.html("");
                            elements.css("display", "block");
                            for (var i = 0; i < data.length; i++) {
                                var obj = data[i];
                                var prop = obj[property];
                                var a = angular.element("<a class='autocomplete-item' acindex='" + i + "' href='#" + i + "' >" + prop + "</a>");
                                a.on("click", function (clickEvent, element) {
                                    var selected = data[angular.element(clickEvent.target).attr("acindex")];

                                    var modelGetter = $parse(autocompleteModel);
                                    var modelSetter = modelGetter.assign;
                                    modelSetter(scope, selected);

                                    hidePopup();
                                    clickEvent.preventDefault();
                                    scope.$apply();
                                    return false;
                                });
                                var li = angular.element("<li></li>");
                                li.append(a);
                                elements.append(li);
                            }
                        } else {
                            hidePopup();
                        }
                    });
                });
                $document.on('click', hidePopup);
            }
        };
    }
    return Autocomplete;
})();

module.exports = {
    directive: Autocomplete,
    name: "autocomplete"
};
//# sourceMappingURL=autocomplete.js.map
