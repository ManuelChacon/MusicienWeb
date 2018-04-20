musicien.controller('notificaciones', function ($scope, $location, Llamada, $window, $sce, $timeout, configuracionGlobal) {
	Llamada.http.get("AccionesUsuarioLeerSuscripciones?IDUsuarioLector=" + getIDUsuario() + "&top=false&IDIdioma=" + getIdioma())
		.then(function(respuesta) {
			console.log(respuesta);
			$scope.notificacionesPendientes = respuesta.data;
        })
    comprobarPermisos()
});

musicien.controller('planes', function ($scope, $location, Llamada, $window, $sce, $timeout, configuracionGlobal) {
	Llamada.http.get("PlanesYPromocionesLeer?IDIdioma=" + getIdioma())
		.then(function(respuesta) {
			console.log(respuesta);
			$scope.planes = respuesta.data.Planes;
			$scope.promociones = respuesta.data.Promociones;
		})
		$scope.verPlan = function(plan) {

		}
		$scope.verPromo = function(promo) {

		}
		$scope.verPlanes = function() {
			$scope.tareasAdicionalesCambioPag()
	    $location.path("/planes");
		}
		$scope.cargarMultimediaPlan = function(plan, index) {
			plan.MultimediaCargada = true;

			Llamada.http.getArrayByte(plan.ContenidoMM, "A")
				.then(function(respuesta) {
					plan.DataContenidoMM = respuesta.data;
				})

		}
});

musicien.controller('verplanes', function ($scope, $location, Llamada, $window, $sce, $timeout, configuracionGlobal, Carrito) {
	Llamada.http.get("PlanesYPromocionesLeer?IDIdioma=" + getIdioma())
		.then(function(respuesta) {
			console.log(respuesta);
			$scope.planes = respuesta.data.Planes;
			$scope.promociones = respuesta.data.Promociones;
			console.log($scope.promociones)

			$scope.verInfoPlan($scope.planes[0], 0)
			$scope.verInfoPromo($scope.promociones[0], 0)
		})
		$scope.cargarMultimediaPlan = function(plan, index) {
			plan.MultimediaCargada = true;

			Llamada.http.getArrayByte(plan.ContenidoMM, "A")
				.then(function(respuesta) {
					plan.DataContenidoMM = respuesta.data;
				})
				Llamada.http.getArrayByte(plan.Imagen1, "A")
					.then(function(respuesta) {
						plan.DataImagen1 = respuesta.data;
					})
					Llamada.http.getArrayByte(plan.Imagen2, "A")
						.then(function(respuesta) {
							plan.DataImagen2 = respuesta.data;
						})
						Llamada.http.getArrayByte(plan.Imagen3, "A")
							.then(function(respuesta) {
								plan.DataImagen3 = respuesta.data;
							})
		}
		$scope.cargarImgPlan = function(plan) {
			if (plan.ContenidoMMCargado === true) {
				return plan.DataContenidoMM;
			} else {
				if (plan.ContenidoMMCargando === true) {
					return "img/loading.gif";
				} else {
					plan.ContenidoMMCargando = true;
					Llamada.http.getArrayByte(plan.ContenidoMM, "A")
						.then(function(respuesta) {
							plan.DataContenidoMM = respuesta.data;
							plan.ContenidoMMCargando = false;
							plan.ContenidoMMCargado = true;
						})
				}
			}
		}
		$scope.anadirPlanCarrito = function(plan, index) {
			miplan = JSON.parse("" + JSON.stringify(plan));
			miplan.TarifaSelected = miplan.Tarifas[index].IDTarifaPlan + "";
			miplan.TipoArticulo = "PL";
			miplan.Precio = miplan.Tarifas[index].Precio;
			miplan.ID = miplan.IDPromo;
			Carrito.compra.insertarArticulo(miplan);
			Carrito.compra.recalcularPrecio();
			console.log("En el carrito hay:");
			console.log(Carrito.compra.verCarrito())
		}
		$scope.anadirPromocionCarrito = function(promo, index) {
			mipromo = JSON.parse("" + JSON.stringify(promo));
			mipromo.TarifaSelected = mipromo.Tarifas[index].IDTarifaPromocion + "";
			mipromo.TipoArticulo = "PR";
			mipromo.Precio = mipromo.Tarifas[index].Precio;
			mipromo.ID = mipromo.IDPromocion;
			Carrito.compra.insertarArticulo(mipromo);
			Carrito.compra.recalcularPrecio();
			console.log("En el carrito hay:");
			console.log(Carrito.compra.verCarrito())
		}
		$scope.verInfoPlan = function(plan, index) {
			Llamada.http.get("PlanesLeerPorIDPlan?IDPlan=" + plan.IDPlan + "&Modificar=false&IDIdioma=" + getIdioma())
				.then(function(respuesta) {
					console.log(respuesta);
					$scope.planes[index].Tarifas = respuesta.data.Tarifas;
					$scope.planes[index].Cargado = true;
					console.log(index);
				})
		}
		$scope.verInfoPromo = function(promo, index) {
			Llamada.http.get("PromocionesLeerPorIDPromocion?IDPromocion=" + promo.IDPromocion + "&Modificar=false&IDIdioma=" + getIdioma())
				.then(function(respuesta) {
					console.log(respuesta);
					$scope.promociones[index].Tarifas = respuesta.data.Tarifas;
					$scope.promociones[index].Cargado = true;
					$scope.promociones[index].Planes = respuesta.data.Planes;
					$scope.promociones[index].MaxPlanes = respuesta.data.MaxPlanes;
					console.log(index);
				})
		}
		$scope.aprovecharCuponPromo = function(promo, IDCupon, Tarifa) {
			var a = prompt("Introduce el código del cupón");
			Llamada.http.get("CuponesUtilizar?Clave=" + a + "&IDUsuarioLector=" + getIDUsuario() + "&IDCupon=" + IDCupon + "&IDPromocion=" + promo.IDPromocion + "&IDPlan=&Tarifa=" + Tarifa)
				.then(function(respuesta) {
					console.log(respuesta.data);
					if (respuesta.data.ID > 0) {
						mensajeExito(respuesta.data.Resultado);

					} else {
						anadirErrores(respuesta.data.Resultado);
					}
				})
		}
		$scope.aprovecharCuponPlan = function(plan, IDCupon, Tarifa) {
			var a = prompt("Introduce el código del cupón");
			Llamada.http.get("CuponesUtilizar?Clave=" + a + "&IDUsuarioLector=" + getIDUsuario() + "&IDCupon=" + IDCupon + "&IDPromocion=&IDPlan=" + plan.IDPlan + "&Tarifa=" + Tarifa)
				.then(function(respuesta) {
					console.log(respuesta.data);
					if (respuesta.data.ID > 0) {
						mensajeExito(respuesta.data.Resultado);

					} else {
						anadirErrores(respuesta.data.Resultado);
					}
				})
        }
        comprobarPermisos()
});

musicien.controller('spotifyController', function ($scope, $sce, $location, Llamada, $window, $sce, $timeout, configuracionGlobal) {
	Llamada.http.get("PlaylistCompartidasLeer")
		.then(function(respuesta) {
			console.log(respuesta);
			$scope.playlists = respuesta.data;
			if (!$scope.PlayListCargada) {
				playlistspotify = document.createElement("iframe");
				playlistspotify.src = "https://open.spotify.com/embed?uri=" + $scope.playlists.PlaylistSpotify;
				playlistspotify.width = "100%";
				playlistspotify.height = "300";
				playlistspotify.frameborder = "0";
				playlistspotify.allowtransparency = "true";
				document.getElementById("spotifyplaylists").appendChild(playlistspotify);

				soundcloud = document.createElement("iframe");
				soundcloud.width = "100%";
				soundcloud.height = "166";
				soundcloud.scrolling="no";
				soundcloud.frameborder="no";
				soundcloud.src = $scope.playlists.PlaylistSoundcloud;
				document.getElementById("soundcloudplaylist").appendChild(soundcloud);
				marcarPlaylistCargada();
			}

		})
});
musicien.controller('verperfiles', function ($scope, $location, Llamada, $window, $sce, $timeout, configuracionGlobal) {
	console.log("Ey");
	Llamada.http.get("CategoriasLeer?IDIdioma=" + getIdioma())
		.then(function(respuesta) {
			$scope.perfiles = respuesta.data;
			for (i = 0; i < $scope.perfiles.length; i++) {
				Llamada.http.getArrayByte($scope.perfiles[i].Imagen, "A", i)
					.then(function(respuesta) {
						$scope.perfiles[respuesta.posi].DataContenidoMM = respuesta.data;
					})
			}
        })
    comprobarPermisos()

});
musicien.controller('verusuariosperfil', function ($scope, $location, Llamada, $window, $sce, $timeout, configuracionGlobal, $routeParams) {
	console.log("Ey");
	Llamada.http.get("UsuariosLeerPorIDCategoria?IDCategoria=" + $routeParams.IDCategoria + "&IDUsuarioLector=" + getIDUsuario())
		.then(function(respuesta) {
			console.log(respuesta);
			$scope.usuarios = respuesta.data;
		})
		$scope.condicionesSeguirFollowers = function(usuarioseguido) {
      if (NotNullNotUndefinedNotEmpty($scope.usuario)) {
        if ($scope.usuario.Login!==true) {
          return true;
        } else {
          if (usuarioseguido.IDUsuario == $scope.usuario.IDUsuario) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return true;
      }
    }
    $scope.SeguirDejarSeguirUsuarioFollower = function(usuario) {
      if (usuario.IDUsuarioSigueUsuario > 0) {
        $scope.DejarSeguirUsuarioFollower(usuario);
      } else {
        $scope.SeguirUsuarioFollower(usuario);
      }
    }
    $scope.SeguirUsuarioFollower = function(usuario) {
      Llamada.http.get("UsuarioSigueUsuarioSeguir?IDUsuarioSeguidor=" + getIDUsuario() + "&IDUsuarioSeguido=" + usuario.IDUsuario)
        .then(function(respuesta) {
          console.log(respuesta);
          ActualizarFollowsYFollowers(usuario.IDUsuario, respuesta.data.ID);

        })
    }
    $scope.DejarSeguirUsuarioFollower = function(usuario) {
      Llamada.http.get("UsuarioSigueUsuarioDejarDeSeguir?IDUsuarioSigueUsuario=" + usuario.IDUsuarioSigueUsuario)
        .then(function(respuesta) {
          console.log(respuesta);
          ActualizarFollowsYFollowers(usuario.IDUsuario, 0);
        })
    }
    ActualizarFollowsYFollowers = function(IDUsuario, newValor) {
      if (NotNullNotUndefinedNotEmpty($scope.usuarios)) {
        if (NotNullNotUndefinedNotEmpty($scope.usuarios)) {
          for (i = 0; i < $scope.usuarios.length; i++) {
            if ($scope.usuarios[i].IDUsuario == IDUsuario) {
              $scope.usuarios[i].IDUsuarioSigueUsuario = newValor;
              if (newValor > 0) {
                $scope.usuarios[i].Seguidores++;
              } else {
                $scope.usuarios[i].Seguidores--;
              }
            }
          }
        }
      }
    }
});
