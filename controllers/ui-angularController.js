musicien.controller('TabsDemoCtrl', function ($scope, $window) {
  // $scope.tabs = [
  //   { title:'Dynamic Title 1', content:'Dynamic content 1' },
  //   { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
  // ];

  // $scope.alertMe = function() {
  //   setTimeout(function() {
  //     $window.alert('You\'ve selected the alert tab!');
  //   });
  // };

  // $scope.model = {
  //   name: 'Tabs'
  // };
});





musicien.controller('DemoCtrl', function ($scope, $http, $timeout, $interval, Llamada) {
  var vm = this;
  $scope.init = function(IDTipoObjeto) {
    Llamada.http.get("ObjetosLeerPorIDTipoObjeto?IDTipoObjeto=" + IDTipoObjeto + "&IDIdioma=" + getIdioma())
      .then(function(respuesta) {
        console.log(respuesta.data);
        for (i = 0; i < respuesta.data.Objetos.length; i++) {
          respuesta.data.Objetos[i].name = respuesta.data.Objetos[i].NombreObjeto;
          respuesta.data.Objetos[i].Propiedades = JSON.parse("" + JSON.stringify(respuesta.data.Propiedades));
          respuesta.data.Objetos[i].Modificado = 1;
        }
        vm.people = respuesta.data.Objetos;
      })
    /*vm.people = [
      { name: 'Clásica'},
      { name: 'Muy Clásica'},
      { name: 'Otra Cosa'},
    ];*/
  }
  vm.disabled = undefined;
  vm.searchEnabled = undefined;

  vm.setInputFocus = function (){
    $scope.$broadcast('UiSelectDemo1');
  };

  vm.enable = function() {
    vm.disabled = false;
  };

  vm.disable = function() {
    vm.disabled = true;
  };

  vm.enableSearch = function() {
    vm.searchEnabled = true;
  };

  vm.disableSearch = function() {
    vm.searchEnabled = false;
  };

  vm.clear = function() {
    vm.person.selected = undefined;
    vm.address.selected = undefined;
    vm.country.selected = undefined;
  };

  vm.someGroupFn = function (item){

    if (item.name[0] >= 'A' && item.name[0] <= 'M')
        return 'From A - M';

    if (item.name[0] >= 'N' && item.name[0] <= 'Z')
        return 'From N - Z';

  };

  vm.firstLetterGroupFn = function (item){
      return item.name[0];
  };

  vm.reverseOrderFilterFn = function(groups) {
    return groups.reverse();
  };

  vm.personAsync = {selected : "wladimir@email.com"};
  vm.peopleAsync = [];

  $timeout(function(){
   vm.peopleAsync = [
        { name: 'Manuel1',  }
      ];
  },3000);

  vm.counter = 0;
  vm.onSelectCallback = function (item, model){
    vm.counter++;
    vm.eventResult = {item: item, model: model};
  };

  vm.removed = function (item, model) {
    vm.lastRemoved = {
        item: item,
        model: model
    };
  };

  vm.tagTransform = function (newTag) {
    var item = {
        name: newTag,
        // email: newTag.toLowerCase()+'@email.com',
        // age: 'unknown',
        // country: 'unknown'
    };

    return item;
  };

  vm.peopleObj = {
    '1' : { name: 'Manuel2',  }
  };

  vm.person = {};

  vm.person.selectedValue = vm.peopleObj[3];
  vm.person.selectedSingle = 'Samantha';
  vm.person.selectedSingleKey = '5';
  // To run the demos with a preselected person object, uncomment the line below.
  //vm.person.selected = vm.person.selectedValue;

  vm.people = [
    { name: 'Clásica'},

  ];

  vm.availableColors = ['Red','Green','Blue','Yellow','Magenta','Maroon','Umbra','Turquoise'];

  vm.singleDemo = {};
  vm.singleDemo.color = '';
  vm.multipleDemo = {};
  vm.multipleDemo.colors = ['Blue','Red'];
  vm.multipleDemo.colors2 = ['Blue','Red'];
  vm.multipleDemo.selectedPeople = [vm.people[5], vm.people[4]];
  vm.multipleDemo.selectedPeople2 = vm.multipleDemo.selectedPeople;
  vm.multipleDemo.selectedPeopleWithGroupBy = [vm.people[8], vm.people[6]];
  vm.multipleDemo.selectedPeopleSimple = ['samantha@email.com','wladimir@email.com'];
  vm.multipleDemo.removeSelectIsFalse = [vm.people[2], vm.people[0]];

  vm.appendToBodyDemo = {
    remainingToggleTime: 0,
    present: true,
    startToggleTimer: function() {
      var scope = vm.appendToBodyDemo;
      var promise = $interval(function() {
        if (scope.remainingTime < 1000) {
          $interval.cancel(promise);
          scope.present = !scope.present;
          scope.remainingTime = 0;
        } else {
          scope.remainingTime -= 1000;
        }
      }, 1000);
      scope.remainingTime = 3000;
    }
  };

  vm.address = {};
  vm.refreshAddresses = function(address) {
    var params = {address: address, sensor: false};
    return $http.get(
      'http://maps.googleapis.com/maps/api/geocode/json',
      {params: params}
    ).then(function(response) {
      vm.addresses = response.data.results;
    });
  };

  vm.addPerson = function(item, model){
    if(item.hasOwnProperty('isTag')) {
      delete item.isTag;
      vm.people.push(item);
    }
  }
  $scope.notificarCambio = function(a,b) {
    console.log(a,b);
    ControlarCambio(a,b)
  }

});

musicien.controller('ModalSegundamano', function ($scope, $uibModal, $log, $document,Publicacion) {

  $scope.animationsEnabled = false;

  $scope.openSegundamano = function (size, parentSelector) {
    console.log(Publicacion)
    $scope.previsualizar()
    Publicacion.Modal.set($scope.publicacion)
    var parentElem = parentSelector ?
    angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'templates/modales/modal-segundamano.html',
      controller: 'previsualizar',
      size: size,
      appendTo: parentElem,

    });
  };

});

musicien.directive("sticky", function($window) {
  return {
    link: function(scope, element, attrs) {

      var $win = angular.element($window);

      if (scope._stickyElements === undefined) {
        scope._stickyElements = [];

        $win.bind("scroll.sticky", function(e) {
          var pos = $win.scrollTop();
          for (var i=0; i<scope._stickyElements.length; i++) {

            var item = scope._stickyElements[i];

            if (!item.isStuck && pos > item.start) {
              item.element.addClass("stuck");
              item.isStuck = true;

              if (item.placeholder) {
                item.placeholder = angular.element("<div></div>")
                    .css({height: item.element.outerHeight() + "px"})
                    .insertBefore(item.element);
              }
            }
            else if (item.isStuck && pos < item.start) {
              item.element.removeClass("stuck");
              item.isStuck = false;

              if (item.placeholder) {
                item.placeholder.remove();
                item.placeholder = true;
              }
            }
          }
        });

        var recheckPositions = function() {
          for (var i=0; i<scope._stickyElements.length; i++) {
            var item = scope._stickyElements[i];
            if (!item.isStuck) {
              item.start = item.element.offset().top;
            } else if (item.placeholder) {
              item.start = item.placeholder.offset().top;
            }
          }
        };
        $win.bind("load", recheckPositions);
        $win.bind("resize", recheckPositions);
      }

      var item = {
        element: element,
        isStuck: false,
        placeholder: attrs.usePlaceholder !== undefined,
        start: element.offset().top
      };

      scope._stickyElements.push(item);

    }
  };
});

musicien.controller('DropdownCtrl', function ($scope, $log) {
  $scope.items = [
    'The first choice!',
    'And another choice for you.',
    'but wait! A third!'
  ];

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    $log.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

  $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
});

musicien.config(function (ScrollBarsProvider) {
      // scrollbar defaults
      ScrollBarsProvider.defaults = {
        autoHideScrollbar: false,
        setHeight: 100,
        scrollInertia: 0,
        axis: 'yx',
        advanced: {
          updateOnContentResize: true
        },
        scrollButtons: {
          scrollAmount: 'auto', // scroll amount when button pressed
          enable: true // enable scrolling buttons by default
        }
      };
    });

    //function MainController($scope) {
      // example of overriding defaults per scrollbar
      //$scope.scrollbarConfig = {
       // theme: 'dark',
       // scrollInertia: 500
     // }

musicien.controller('mainCtrl' , function($scope){

});
