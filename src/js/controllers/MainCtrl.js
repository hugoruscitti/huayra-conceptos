var app = angular.module('app');

app.controller('MainCtrl', function MainCtrl($scope) {
  $scope.data = {};
  $scope.data.zoom = 1;

  function actualizar_zoom() {
    canvas.setZoom($scope.data.zoom);
  }

  $scope.zoom_reiniciar = function() {
    $scope.data.zoom = 1;
    actualizar_zoom();
  }

  $scope.$watch('data.zoom', function() {
    actualizar_zoom();
  });


});
