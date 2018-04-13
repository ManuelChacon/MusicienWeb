function AlertaPersolalizadaPropia(){
	var winW = window.innerWidth, 
	winH = window.innerHeight,
	/***** Insertar audio *****/
	sonido = "AQUÍ VA EL AUDIO", 
	/***** Fin de audio *****/
	/***** Ancho de la ventana *****/
	ancho = 300, 
	/***** Fin de ancho de ventana *****/
	/***** Tamaño del borde *****/
	borde = 5, 
	/***** Fin tamaño borde *****/
	/***** El padding de la ventana *****/
	separar = 20, 
	/***** Fin del padding *****/
	/***** Separación con la parte superior *****/
	tope = 100;
	/***** Fin de la separación *****/
	this.winW = winW;
	this.winH = winH;
	this.sonido = sonido;
	this.ancho = ancho;
	this.borde = borde;
	this.separar = separar;
	this.tope = tope;
	this.crear = function(dice,texto,funcion,array){
		this.miArray = array;
		var crearNuevoDivTapadera = document.createElement("div");
		var crearNuevoDivCaja = document.createElement("div");
		crearNuevoDivTapadera.style.height = winH + "px";
		/***** Transparencia de fondo *****/
		crearNuevoDivTapadera.style.opacity = ".4";
		/***** Fin de la transparencia *****/
		crearNuevoDivTapadera.style.position = "fixed";
		crearNuevoDivTapadera.style.top = "0px";
		crearNuevoDivTapadera.style.left = "0px";
		/***** Color de fondo *****/
		crearNuevoDivTapadera.style.background = "#000";
		/***** Fin de color de fondo *****/
		crearNuevoDivTapadera.style.width = "100%";
		crearNuevoDivTapadera.style.zIndex = "10";
		crearNuevoDivTapadera.setAttribute("class","eliminarDivAlertTakanga");
		crearNuevoDivTapadera.addEventListener("click",function(){
			var bleep = new Audio();
			bleep.src = sonido;
			bleep.play();
		},true);
		crearNuevoDivCaja.className = "crearNuevoDivCajaTakanga";
		crearNuevoDivCaja.style.position = "fixed";
		/***** Color de ventana *****/
		crearNuevoDivCaja.style.background = "#FFF";
		/***** Fin de color de ventana *****/
		/***** Muestra el texto centrado *****/
		crearNuevoDivCaja.style.textAlign = "center";
		/***** Fin de texto centrado *****/
		/***** Padding de ventana (combeniente dejar como esta) *****/
		crearNuevoDivCaja.style.padding = "15px " + separar + "px 20px " + separar + "px";
		/***** Fin de padding de ventana *****/
		/***** Pudes cambiar el ultimo pararmetro para cambiar el color del borde *****/
		crearNuevoDivCaja.style.border = borde + "px solid red";
		/***** Fin de color del borde *****/
		/***** Esquinas redondeadas (si comentas esta linea tendra las esquinas cuadradas) *****/
		crearNuevoDivCaja.style.borderRadius = "7px";
		/***** Fin de esquinas *****/
		crearNuevoDivCaja.style.width = ancho + "px";
		crearNuevoDivCaja.style.left = ((winW/2) - (ancho * .5)) - (borde + separar) + "px";
		crearNuevoDivCaja.style.top = tope + "px";
		crearNuevoDivCaja.style.zIndex = "10";
		/***** Sombra de ventana *****/
		crearNuevoDivCaja.style.boxShadow = "5px 5px 8px #666";
		/***** Fin de sombra de ventana *****/
		crearNuevoDivCaja.innerHTML = "<div id='arrastrarCajaNuevaPorBody'><h3 style='margin:0; padding:0'>" + dice + " dice:</h3></div>";
		crearNuevoDivCaja.innerHTML += "<p style='margin:10px 0'>" + texto + "</p><br />";
		crearNuevoDivCaja.innerHTML += "<span onclick='Alert.cancelar()'>Cancelar</span> <span onclick='Alert.aceptar(" + funcion + ")'>Aceptar</span>";				
		document.body.appendChild(crearNuevoDivTapadera);
		document.body.appendChild(crearNuevoDivCaja);
		var spanClass = document.querySelectorAll(".crearNuevoDivCajaTakanga span");
		for(var i = 0; i <= spanClass.length-1; i++){
			/***** Color de botones *****/
			spanClass[i].style.background = "linear-gradient(to top, #F90206, #FFAAAB)";
			/***** Fin de color de botones *****/
			spanClass[i].style.padding = "5px 15%";
			/***** Color de texto de botones *****/
			spanClass[i].style.color = "#FFF";
			/***** Fin de texto de botones *****/
			spanClass[i].style.cursor = "pointer";
			/***** Sombra de botones *****/
			spanClass[i].style.boxShadow = "2px 2px 5px #666";
			/***** Fin de sombra de botones *****/
			/***** Borde de botones *****/
			spanClass[i].style.border = "0.5px solid #666";
			/***** Fin de borde de botones *****/
		}
		var div = document.getElementById("arrastrarCajaNuevaPorBody");
		div.style.cursor = "pointer";
		div.style.marginTop = "-10px";
		div.style.paddingTop = "10px";
		div.addEventListener("mousedown",Alert.posicion,false);
		div.addEventListener("mouseup",Alert.parar,false);
	}
	var num, num1, valor;
	this.parar = function(){
		clearInterval(pararVentana);
		valor = true;
	}
	function moverVentana(e){
		num = e.clientX;
		num1 = e.clientY;
	}
	document.onmousemove = moverVentana;
	this.posicion = function(){
		if(valor == false){
			clearInterval(pararVentana);
		}else{
			pararVentana = setInterval(function(e){
				if(num < 0 || num1 < 0 || num > winW || num1 > winH){
					clearInterval(pararVentana);
					valor = true;
				}else{
					document.querySelector(".crearNuevoDivCajaTakanga").style.left = (num - ((ancho * .5) + (separar + borde))) + "px";
					document.querySelector(".crearNuevoDivCajaTakanga").style.top = (num1 - (((tope/2) - 30) - borde)) + "px";
				}
			}, 10);
			valor = false;
		}
	}
	this.aceptar = function(e){
		document.querySelector(".eliminarDivAlertTakanga").remove();
		document.querySelector(".crearNuevoDivCajaTakanga").remove();
		if(e != null || e != undefined){
			AlertaPersolalizadaPropia.prototype.mostrarArray = e(this.miArray);
		}
	}
	this.cancelar = function(){
		document.querySelector(".eliminarDivAlertTakanga").remove();
		document.querySelector(".crearNuevoDivCajaTakanga").remove();
	}
}
nuevoRecibirPrototypeEcho.prototype = new AlertaPersolalizadaPropia();
function nuevoRecibirPrototypeEcho(){
	var sonido = this.sonido;
	this.crear = function(dice,texto,funcion,array){
		this.miArray = array;
		var crearNuevoDivTapadera = document.createElement("div");
		var crearNuevoDivCaja = document.createElement("div");
		crearNuevoDivTapadera.style.height = this.winH + "px";
		/***** Transparencia de fondo *****/
		crearNuevoDivTapadera.style.opacity = ".4";
		/***** Fin de transparencia de fondo *****/
		crearNuevoDivTapadera.style.position = "fixed";
		crearNuevoDivTapadera.style.top = "0px";
		crearNuevoDivTapadera.style.left = "0px";
		/***** Color de fondo *****/
		crearNuevoDivTapadera.style.background = "#000";
		/***** Fin de color de fondo *****/
		crearNuevoDivTapadera.style.width = "100%";
		crearNuevoDivTapadera.style.zIndex = "10";
		crearNuevoDivTapadera.setAttribute("class","eliminarDivAlertTakanga");
		crearNuevoDivTapadera.addEventListener("click",function(){
			var bleep = new Audio();
			bleep.src = sonido;
			bleep.play();
		},true);
		crearNuevoDivCaja.className = "crearNuevoDivCajaTakanga";
		crearNuevoDivCaja.style.position = "fixed";
		/***** Color de ventana *****/
		crearNuevoDivCaja.style.background = "#FFF";
		/***** Fin de color de ventana *****/
		/***** Centra el texto de la ventana *****/
		crearNuevoDivCaja.style.textAlign = "center";
		/***** Fin de texto de ventana *****/
		/***** Padding de ventana (combiene no cambiar) *****/
		crearNuevoDivCaja.style.padding = "15px " + this.separar + "px 20px " + this.separar + "px";
		/***** Fin de ventana *****/
		/***** Cambiando el untimo parametro, cambia el color del borde *****/
		crearNuevoDivCaja.style.border = this.borde + "px solid red";
		/***** Fin de color de borde *****/
		/***** Esquinas redondeadas (si comentas esta linea tendra las esquinas cuadradas) *****/
		crearNuevoDivCaja.style.borderRadius = "7px";
		/***** Fin de esquinas *****/
		crearNuevoDivCaja.style.width = this.ancho + "px";
		crearNuevoDivCaja.style.left = ((this.winW/2) - (this.ancho * .5)) - (this.borde + this.separar) + "px";
		crearNuevoDivCaja.style.top = this.tope + "px";
		crearNuevoDivCaja.style.zIndex = "10";
		/***** Sombra de ventana *****/
		crearNuevoDivCaja.style.boxShadow = "5px 5px 8px #666";
		/***** Fin de sombra de ventana *****/
		crearNuevoDivCaja.innerHTML = "<div id='arrastrarCajaNuevaPorBody'><h3 style='margin:0; padding:0'>" + dice + " dice:</h3></div>";
		crearNuevoDivCaja.innerHTML += "<p style='margin:10px 0'>" + texto + "</p>";
		crearNuevoDivCaja.innerHTML += "<p style='margin:0; padding:0'><input id='recogerDatosIngresadosDeUsuario' type='text' /></p>";
		crearNuevoDivCaja.innerHTML += "<span onclick='Alert.cancelar()'>Cancelar</span> <span onclick='Prompt.aceptar(" + funcion + ")'>Aceptar</span>";
		document.body.appendChild(crearNuevoDivTapadera);
		document.body.appendChild(crearNuevoDivCaja);
		var input = document.getElementById("recogerDatosIngresadosDeUsuario");
		input.style.outline = "none";
		input.style.margin = "0px 0px 20px 0px";
		input.style.padding = "5px 10px 2px 10px";
		input.style.background = "#FFF";
		input.style.boxShadow = "inset 3px 3px 8px #000";
		var spanClass = document.querySelectorAll(".crearNuevoDivCajaTakanga span");
		for(var i = 0; i <= spanClass.length-1; i++){
			/***** Color de botones *****/
			spanClass[i].style.background = "linear-gradient(to top, #F90206, #FFAAAB)";
			/***** Fin de color de botones *****/
			spanClass[i].style.padding = "5px 15%";
			/***** Color de texto de botones *****/
			spanClass[i].style.color = "#FFF";
			/***** Fin de color de texto de botones *****/
			spanClass[i].style.cursor = "pointer";
			/***** Sombra de botones *****/
			spanClass[i].style.boxShadow = "2px 2px 5px #666";
			/***** Fin de sombra de botones *****/
			/***** Borde de botones *****/
			spanClass[i].style.border = "0.5px solid #666";
			/***** Fin de sombra de botones *****/
		}
		var div = document.getElementById("arrastrarCajaNuevaPorBody");
		div.style.cursor = "pointer";
		div.style.marginTop = "-10px";
		div.style.paddingTop = "10px";
		div.addEventListener("mousedown",Alert.posicion,false);
		div.addEventListener("mouseup",Alert.parar,false);
		document.getElementById("recogerDatosIngresadosDeUsuario").addEventListener("focus",function(){
			var valor = document.getElementById("recogerDatosIngresadosDeUsuario").value;
			if(valor == "Introduce un texto o cancela"){
				document.getElementById("recogerDatosIngresadosDeUsuario").value = "";
				document.getElementById("recogerDatosIngresadosDeUsuario").style.background = "#FFF";
				document.getElementById("recogerDatosIngresadosDeUsuario").style.color = "#000";
			}
		},false);
	}
	this.aceptar = function(e){
		var num = document.getElementsByTagName("div").length;
		var input = document.getElementById("recogerDatosIngresadosDeUsuario");
		var valor = input.value;
		if(valor == "" || valor == "Introduce un texto o cancela"){
			/***** Texto de campo vacio si cambias este deves cambiar el de al linea de arriba *****/
			input.value = "Introduce un texto o cancela";
			/***** Fin de texto *****/
			/***** Color de texto de error *****/
			input.style.background = "red";
			/***** Fin de color del texto de error *****/
			input.style.color = "#FFF";
		}else if(e != null || e != undefined){
			document.querySelector(".eliminarDivAlertTakanga").remove();
			document.querySelector(".crearNuevoDivCajaTakanga").remove();
			if(this.miArray != null || this.miArray != undefined){
				var i = this.miArray.length;
				this.miArray[i] = valor;
				e(this.miArray);
			}else{
				e(valor);
			}
		}
	}
}
var Alert = new AlertaPersolalizadaPropia();
var Prompt = new nuevoRecibirPrototypeEcho();