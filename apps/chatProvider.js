musicien.controller('chat', function ($scope, $location, Llamada, $window, $q, configuracionGlobal) {
  $scope.mostrandoChat = false;
  var api_url = configuracionGlobal.api_url;
  var chat_url = configuracionGlobal.chat_url;
  var chathub;
  var IDUsuario;
  var NombreUsuario;
  var conversaciones = [];
  var MensajesNoLeidos = [];
  var mostrandoChat = false;
  var chatMostrados = [];
  $scope.anadirAGrupo = false;
  $scope.anadirPendientes = true;
  $scope.filtroUsuarios = [];
  $scope.mifiltrouser = "";
  $scope.longFiltroAnterior = 0;
  $scope.selectedUsers = []
  $scope.checkLongFiltro = function() {

  }
  $scope.checkLongFiltro = function() {
    //console.log("Ha cambiado el valor");

    if (NotNullNotUndefinedNotEmpty(document.getElementById("filtroUsersChat").value)) {
      //console.log("no es nulo")
      if (document.getElementById("filtroUsersChat").value.length == 3 && $scope.longFiltroAnterior < 4) {
        //console.log("Tengo que llamar");
        $scope.enviarFiltroUsuarios();
      } else {
        //console.log("No llamo porque: $scope.filtroUsuarios.length == 3" + document.getElementById("filtroUsersChat").value.length == 3 + " y $scope.longFiltroAnterior < 4" + $scope.longFiltroAnterior < 4)
      }
      $scope.longFiltroAnterior = parseInt("" + document.getElementById("filtroUsersChat").value.length);
    } else {
      //console.log(document.getElementById("filtroUsersChat").value);
    }
  }
  $scope.enviarFiltroUsuarios = function() {
    /*console.log("llamando")
    Llamada.http.post("UsuariosFiltrar?cadena=" + document.getElementById("filtroUsersChat").value, null)
      .then(function(respuesta) {
        console.log(respuesta);
        $scope.filtroUsuarios = respuesta;
        console.log("cambiado el fltrousuarios");
        console.log($scope.filtroUsuarios);
      })*/
      at.FiltrarUsuarios(document.getElementById("filtroUsersChat").value)
  }
  mostrarMsjPendientes = function() {

  }
  /*mostrarMsjPendientes = function() {

    //console.log("1");
    for (i = 0; i < MensajesNoLeidos.length; i++) {
      //console.log("La longitud")
      //console.log("2");
      //console.log("El i es:" + i);
      for (h = 0; h < conversaciones.length; h++) {
        if (NotNullNotUndefinedNotEmpty(MensajesNoLeidos[i].IDConversacion)) {

          if (NotNullNotUndefinedNotEmpty(conversaciones[h].IDConversacion)) {

            if (MensajesNoLeidos[i].IDConversacion == conversaciones[h].IDConversacion) {

              if (NotNullNotUndefinedNotEmpty(MensajesNoLeidos[i].Messages)) {

                if (MensajesNoLeidos[i].Messages.length > 0) {
                  conversaciones[h].Leido = false;

                }
              }
              $scope.$apply(function () {
                //console.log("9");
                  conversaciones[h].Messages = MensajesNoLeidos[i].Messages;
                  //console.log("10");
              });
            }
          }

        }
      }
    }
    $scope.cantidadCalculada = false;
  }*/
  AgregarMensajeAGrupo = function(msg, windowId) {
    //console.log("Agregando mensaje al grupo")
    for (n = 0; n < conversaciones.length; n++) {
      if (conversaciones[n].roomName == windowId) {
        //console.log("Entro dentro porque" + windowId +"es " + conversaciones[n].roomName + "y n es " + n)
        if (!NotNullNotUndefinedNotEmpty(conversaciones[n].Messages)) {
          conversaciones[n].Messages = [];
        }
        for (e = 0; e < conversaciones[n].Users.length; e++) {
          if (conversaciones[n].Users[e].IDUsuario == msg.IDUsuario) {
            //console.log("encontré el idusuario");
            msg.Usuario = conversaciones[n].Users[e];
          }
        }
        if (msg.IDUsuario == IDUsuario) {
          msg.Clase = 'msgpropio';
        } else {
          if (msg.IDUsuario == 0) {
            msg.clase = "msginfo";
          } else {
            msg.Clase = 'msgotro';
          }

        }
        $scope.$apply(function () {
            if (conversaciones[n].Mostrado === true) {
              conversaciones[n].Leido = true;
            } else {
              conversaciones[n].Leido = false;
            }
            //console.log(msg)
            console.log("Añadiendo");
            conversaciones[n].Messages.splice(0, 0, msg);
        });

      }
      //console.log("Iterando ")
    }
    $scope.cantidadCalculada = false;
  }
  registerClientMethods = function(chatHub) {

    // Calls when user successfully logged in
    chatHub.client.onConnected = function (id, conversa, allUsers, messages) {
        //console.log("On connected");
        MensajesNoLeidos = conversa;
        if ($scope.anadirPendientes === true) {
          if (conversaciones.length > 0) {
            mostrarMsjPendientes();
          }
        }
        anadirPendientes = true;
    }
    // On New User Connected
    chatHub.client.onNewUserConnected = function (id, name) {

        //console.log("Cuando se conecta un usuario");
        //console.log(id,name);
    }

    chatHub.client.receiveGroupInformation = function (room, pendientes) {
        //console.log("Cuando te unes a un grupo")
        //console.log(room);

        //console.log("Vamos a añadir info:")
        //console.log($scope.anadirPendientes);
        room.Leido = true;
        if (pendientes === true) {
          if (conversaciones.length > 0) {
            //console.log("Añadiendo pendientes")
            mostrarMsjPendientes();
            room.Leido = false;
          }
        } else {
          //console.log("No ñadiendo pendientes");
        }

        Llamada.http.get("ConversacionLeerMensajes?IDConversacion=" + room.IDConversacion + "&IDInicio=&tamPag=5")
          .then(function(respuesta) {
            //alert("He ido a por mensajse");
            console.log(respuesta);
            room.Messages = respuesta.data;
            for (i = 0; i < room.Messages.length; i++) {
                if (room.Messages[i].IDUsuario == getIDUsuario()) {
                    room.Messages[i].Clase = "msgpropio";
                } else {
                    room.Messages[i].Clase = "msgotro";
                }
            }
              conversaciones.push(room);
          })
        //console.log(conversaciones);

    }
    chatHub.client.receiveGroupJoin = function (user, roomName) {
        //console.log("Cuando alguien se une a un grupo");
        //console.log(user,roomName);
        //console.log("Aplicando");
        for (t = 0; t < conversaciones.length; t++) {
          if (conversaciones[t].roomName == roomName.roomName) {
            //console.log("Actualizando usuarios")
            conversaciones[t].Users = roomName.Users;
          }
        }

        AgregarMensajeInfo({ UserName: "info", Message: user.UserName + " se ha unido a la conversación", IDUsuario: 0 }, roomName.roomName);
    }
    chatHub.client.receiveGroupLeave = function (user, roomName) {
        //console.log("Cuando alguien se va de un grupo");
        //console.log(user,roomName);
        for (t = 0; t < conversaciones.length; t++) {
          if (conversaciones[t].roomName == roomName.roomName) {
            conversaciones[t].Users = roomName.Users;
          }
          var message = user.UserName + " ha abandonado la conversación";
          AgregarMensajeInfo({ UserName: "info", Message: message, IDUsuario: 0 }, roomName.roomName);
        }
    }
    chatHub.client.receiveGroupDestroy = function(room) {
      //console.log("Recibiendo grupo eliminado");
      //console.log(room);
      AgregarMensajeInfo({ UserName: "info", Message: "La conversación ha sido eliminada", IDUsuario: 0 }, room.roomName);
    }

    // On User Disconnected
    chatHub.client.onUserDisconnected = function (id, userName) {

        //console.log("Cuando un usuario se desconecta")
        //console.log(id,userName)
        for (i = 0; i < conversaciones.length; i++) {
          for (h = 0; h < conversaciones[i].Users.length; h++) {
            if (conversaciones[i].Users[h].IDUsuario == userName.IDUsuario) {
              $scope.$apply(function () {
                  conversaciones[i].Users[h].Connected = false;
              });

            }
          }
        }

    }

    chatHub.client.messageReceived = function (userName, message) {

        //console.log("Cuando se recibe un mensaje")
    }
    /*chatHub.client.receiveMessage = function (fromUserName, message, windowId, IDUsuario) {
        console.log("Cuando se recibe un mensaje de un grupo");
        console.log(fromUserName, message, windowId)
        AgregarMensajeAGrupo({ UserName: fromUserName, Message: message, IDUsuario: IDUsuario }, windowId);

    }*/
    chatHub.client.receiveMessage = function (fromUserName, message, windowId, IDUsuario) {
        //console.log("Cuando se recibe un mensaje de un grupo");
        //console.log(fromUserName, message, windowId)
        AgregarMensajeAGrupo({ UserName: fromUserName, Message: message, IDUsuario: IDUsuario }, windowId);

    }
    chatHub.client.receiveFilteredUsers = function(users) {
      //console.log("Recibo un listado de usuarios");
      $scope.$apply(function () {
          $scope.filtroUsuarios = users;
      });
    }
    //aqui estÁ EL ATO
    chatHub.client.sendPrivateMessage = function (windowId, fromUserName, message) {

        //console.log("Cuando se recibe un privado");

    }
  }
  var at = {
    EstablecerConexion: function(name, idus) {
      //$.connection.hub.url = 'http://localhost:65277/signalr';
      //$.connection.hub.url = 'http://nsd2012/Desarrollo/dsSignalRChat/signalr';
      //$.connection.hub.url = 'http://82.223.27.144/dsSignalRChat/signalr';
      $.connection.hub.url = chat_url;
      chatHub = $.connection.chatHub;
            registerClientMethods(chatHub);
            // Start Hub
            //console.log("Conectando");
            tratarDeConectar(0, name, idus);

    },
    ObtenerConversaciones: function() {
      return conversaciones;
    },
    MostrandoChat: function() {
      return mostrandoChat;
    },

    MarcarChat: function(chat, val) {

      for (i = 0; i < conversaciones.length; i++) {
        if (conversaciones[i].roomName == chat.roomName) {
          conversaciones[i].Mostrado = val;
          conversaciones[i].Leido = true;
          //console.log("Chat Marcado con true");
        }
      }
      $scope.cantidadCalculada = false;
    },
    EnviarMensaje: function(groupName, msg) {
      //console.log("Enviando un mensaje al grupo:" + groupName + ". " + msg)
        chatHub.server.sendGroupMessage(IDUsuario, NombreUsuario, groupName, msg);
    },
    MarcarChatLeido: function(groupName) {
      chatHub.server.readGroup(groupName);
    },
    CambiarNombreGrupo: function(groupName) {
      chatHub.server.renameGroup(groupName);
    },
    IniciarChat: function(IDUsuario1, IDUsuario2) {
      chatHub.server.startConversation(IDUsuario1, IDUsuario2);
    },
    FiltrarUsuarios: function(cadena) {
      chatHub.server.searchUsers(cadena);
    },
    IniciarGrupo: function(IDUsuario, NombreGrupo, usuarios) {
      chatHub.server.startGroup(IDUsuario, NombreGrupo, usuarios)
    },
    AbandonarConversacion: function(NombreGrupo) {
      chatHub.server.leaveRoom(NombreGrupo);
    },
    AgregarPersonaAGrupo: function(roomName, IDUsuario) {
      chatHub.server.joinToExistingRoomOtherUser(roomName, IDUsuario)
    }
  }
  tratarDeConectar = function(reintento, name, idus) {
    if (reintento < 5) {
      gestionarConexion(reintento, name, idus)
        .then(function(respuesta) {
          if (respuesta !== true) {
            //console.log(respuesta);
            reintento++;
            //console.log("Reintentando");
            tratarDeConectar(reintento, name, idus);
          }
        })
    } else {
      anadirErrores($scope.lang.conect_chat_error);
      $scope.cargandoChat = false;
    }
  }
  gestionarConexion = function(reintento, name, idus) {
    var deferred = $q.defer();
    $scope.cargandoChat = true;
    try {
      setTimeout(function () {

        $.connection.hub.start().done(function () {
            //console.log("Conectado");
            IDUsuario = idus;
            NombreUsuario = name;
            chatHub.server.connect(name, IDUsuario);
            $scope.cargandoChat = false;
            $scope.conectadoAChat = true;
        }).fail(function(a,b,c) {
          anadirErrores($scope.lang.fail_conect_error);
          //console.log(a,b,c);
          $scope.cargandoChat = false;
        });
      }, 2000);

    }
    catch(ex) {
      //console.log("Entro al catch???");
      //console.log(ex);
      $scope.cargandoChat = false;
    }
    setTimeout(function () {
      if ($scope.conectadoAChat === true) {
        deferred.resolve(true);
      } else {
        deferred.resolve(false);
      }
    }, 3000);
    return deferred.promise;
  }
  checkLoginStChat = function() {
    var deferred = $q.defer();
    if ($scope.checkLoginStatus()) {
      deferred.resolve(true);
    } else {
      anadirErrores($scope.lang.iniciar_chat_error);
      deferred.resolve(false);
    }
    return deferred.promise;
  }
  $scope.chatConectado = false;
  $scope.abrirChat = function() {
    if ($scope.mostrandoChat === true) {
      $scope.mostrandoChat = false;
    } else {
      if ($scope.chatConectado === true) {
        $scope.mostrandoChat = true;
      } else {
        checkLoginStChat()
        .then(function(respuesta) {
          if (respuesta) {
            at.EstablecerConexion($scope.usuario.Nombre, getIDUsuario());
            //console.log("EEOO QUE MUESTRO CHAT");
            $scope.mostrandoChat = true;
            $scope.chatConectado = true;
          }
        })
      }

    }
  }
  $scope.leerMasConver = function(chat) {
    var idinicio = chat.Messages[chat.Messages.length-1].IDMensaje;
    Llamada.http.get("ConversacionLeerMensajes?IDConversacion=" + chat.IDConversacion + "&IDInicio=" + idinicio + "&tamPag=5")
      .then(function(respuesta) {
        console.log(respuesta);
        if (respuesta.data.length < 1) {
          anadirErrores("no hay más mensajes que mostrar");
        }
        for (i = 0; i < respuesta.data.length; i++) {
            if (respuesta.data[i].IDUsuario == getIDUsuario()) {
                respuesta.data[i].Clase = "msgpropio";
            } else {
                respuesta.data[i].Clase = "msgotro";
            }
        }
        chat.Messages = chat.Messages.concat(respuesta.data);
        console.log(chat);
      })
  }
  $scope.getConversaciones = function() {

    return at.ObtenerConversaciones();
  }
  $scope.consoleConver = function() {
    //console.log(at.ObtenerConversaciones())
  }
  $scope.getChatsMostrados = function() {
    return at.ChatsMostrados();
  }
  $scope.seMuestra = function(chat) {
    return chat.Mostrado===true;
  }
  $scope.mostrarChat = function(chat, val) {
    //console.log("Marcando chat");
    //console.log(chat);
    at.MarcarChat(chat, val);
    at.MarcarChatLeido(chat.roomName);
  }
  $scope.mostrarChatt = function() {


    if ($scope.mostrandoChatt) {

      cambiarEstadoChat(false);
    } else {

      cambiarEstadoChat(true);


      if ($scope.chatConectado !== true) {

        $scope.abrirChat()
      } else {

      }
    }

  }
  $scope.obtenerImagenUsuario = function(chatuser) {
    if (NotNullNotUndefinedNotEmpty(chatuser)) {
      if (chatuser.ImgCargada === true) {
        return chatuser.dataContenidoMM;
      } else {
        chatuser.ImgCargada = true;
        if (chatuser.ContenidoMMServidor > 0) {
          chatuser.ImgCargada = true;
          Llamada.http.getArrayByte(chatuser.ContenidoMM, "I")
            .then(function(respuesta) {
              chatuser.dataContenidoMM = respuesta.data;
            })
            return "loading";
        } else {
          chatuser.ImgCargada = true;
          chatuser.dataContenidoMM = chatuser.ContenidoMM;
          return chatuser.dataContenidoMM;
        }
      }
    } else {
      return "not found";
    }


  }
  $scope.enviarMensaje = function(chat) {
    //console.log(chat);
    at.EnviarMensaje(chat.roomName, chat.newMsj);
    chat.newMsj = "";
  }
  $scope.esUnGrupo = function(conversacion) {
    return conversacion.Users.length>2;
  }
  $scope.nosoyyo = function(chatuser) {
    return chatuser.IDUsuario!==getIDUsuario();
  }
  $scope.comprobarEstado = function(chatuser) {
    if (chatuser.Connected === true) {
      return "green";
    } else {
      return "red";
    }
  }
  $scope.comprobarLeidos = function(conversacion) {
    if (conversacion.Leido === true) {
      return "grey";
    } else {
      return "orange";
    }
  }
  $scope.MarcarChatLeido = function(chat) {
    at.MarcarChatLeido(chat.roomName);
  }
  $scope.IniciarChat = function(IDUsuario2) {
    $scope.anadirPendientes = false;
    at.IniciarChat(getIDUsuario(), IDUsuario2);
  }
  $scope.noselected = function(chatuser) {
    var res = true;
    for (i = 0; i < $scope.selectedUsers.length; i++) {
      if ($scope.selectedUsers[i].IDUsuario == chatuser.IDUsuario) {
        res = false;
      }
    }
    return res;
  }
  $scope.seleccionarUsuario = function(chatuser) {
    $scope.selectedUsers.push(chatuser);
  }
  $scope.unseleccionarUsuario = function(index) {
    $scope.selectedUsers.splice(index,1);
  }
  $scope.crearGrupo = function() {
    $scope.anadirPendientes = false;
    at.IniciarGrupo(getIDUsuario(), document.getElementById("groupName").value, $scope.selectedUsers);
    $scope.selectedUsers = [];
    document.getElementById("groupName").value = "";
  }
  $scope.salirConversacion = function(chat) {
    at.AbandonarConversacion(chat.roomName);
    for (i = 0; i < conversaciones.length; i++) {
      if (conversaciones[i].roomName == chat.roomName) {
        conversaciones.splice(i,1)
      };
    }
  }
  $scope.cantidadMsjPendientes = function() {
    if ($scope.checkLoginStatus() === true) {
      if ($scope.chatConectado === true) {
      if ($scope.cantidadCalculada === true) {
            return $scope.msjPendientes;
      } else {
            $scope.cantidadCalculada = true;
            var res = 0;
            for (r = 0; r < conversaciones.length; r++) {
              if (conversaciones[r].Leido !== true) {
                res++;
              }
            }
            $scope.msjPendientes = res;
            return res;
      }
    } else {
      return $scope.usuario.ConverPendientes;
    }
    } else {
      return "0";
    }

  }
  AgregarMensajeInfo = function(msg, windowId) {
    //console.log("Buscando sala");
      for (n = 0; n < conversaciones.length; n++) {
        //console.log("Es la sala" + n + "?");
        if (conversaciones[n].roomName == windowId) {
          //console.log("Pos si")
          if (conversaciones[n].Mostrado === true) {
            conversaciones[n].Leido = true;
          } else {
            conversaciones[n].Leido = false;
          }
          msg.clase = "msginfo";
          //console.log(msg)
              $scope.$apply(function () {
                  conversaciones[n].Messages.push(msg);
                  $scope.cantidadCalculada = false;
              });
        } else {
          //console.log("Pos no")
        }
      }
  }
  $scope.AgregarNuevoMiembroAlGrupo = function(roomName, IDUsuario) {
    at.AgregarPersonaAGrupo(roomName, IDUsuario);
    $scope.anadirAGrupo = false;
    $scope.conversacionAsignadaAnadir = null;
  }
  $scope.asignarGrupoParaAnadir = function(conversacion) {
    $scope.anadirAGrupo = true;
    $scope.conversacionAsignadaAnadir = conversacion;
  }
  $scope.anadirPersonasAGrupo = function() {
    for (y = 0; y < $scope.selectedUsers.length; y++) {
      //console.log("Añadiendo al grupo a:");
      //console.log($scope.conversacionAsignadaAnadir.roomName, $scope.selectedUsers[y].IDUsuario)
      at.AgregarPersonaAGrupo($scope.conversacionAsignadaAnadir.roomName, $scope.selectedUsers[y].IDUsuario);
    }
    $scope.anadirAGrupo = false;
    $scope.conversacionAsignadaAnadir = null;
    $scope.selectedUsers = [];
  }
  $scope.IsConnected = function() {
    if ($scope.chatConectado === true) {
      return 'green';
    } else {
      return 'red';
    }
  }

});
