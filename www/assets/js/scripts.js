      var map;
      var markers = [];
      var infoWindow;
      var locationSelect;

        function initMap() {


var frilamap = new google.maps.StyledMapType(
              [
                  {
                      "featureType": "administrative",
                      "elementType": "labels.text.fill",
                      "stylers": [
                          {
                              "color": "#444444"
                          }
                      ]
                  },
                  {
                      "featureType": "landscape",
                      "elementType": "all",
                      "stylers": [
                          {
                              "color": "#f2f2f2"
                          }
                      ]
                  },
                  {
                      "featureType": "poi",
                      "elementType": "all",
                      "stylers": [
                          {
                              "visibility": "off"
                          }
                      ]
                  },
                  {
                      "featureType": "road",
                      "elementType": "all",
                      "stylers": [
                          {
                              "saturation": -100
                          },
                          {
                              "lightness": 45
                          }
                      ]
                  },
                  {
                      "featureType": "road.highway",
                      "elementType": "all",
                      "stylers": [
                          {
                              "visibility": "simplified"
                          }
                      ]
                  },
                  {
                      "featureType": "road.highway",
                      "elementType": "geometry.fill",
                      "stylers": [
                          {
                              "color": "#ffffff"
                          }
                      ]
                  },
                  {
                      "featureType": "road.arterial",
                      "elementType": "labels.icon",
                      "stylers": [
                          {
                              "visibility": "off"
                          }
                      ]
                  },
                  {
                      "featureType": "transit",
                      "elementType": "all",
                      "stylers": [
                          {
                              "visibility": "off"
                          }
                      ]
                  },
                  {
                      "featureType": "water",
                      "elementType": "all",
                      "stylers": [
                          {
                              "color": "#dde6e8"
                          },
                          {
                              "visibility": "on"
                          }
                      ]
                  }
              ],
            {name: 'Frila'});



          var start = {lat: -8.063160, lng: -34.871153};
          map = new google.maps.Map(document.getElementById('map'), {
            center: start,
            zoom: 11,
            fullscreenControl: false,
            mapTypeControlOptions: {
              mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                      'frila']
            }
          });

          //Associate the styled map with the MapTypeId and set it to display.
          map.mapTypes.set('frila', frilamap);
          map.setMapTypeId('frila');

          infoWindow = new google.maps.InfoWindow();

          searchButton = document.getElementById("searchButton").onclick = searchLocations;

          locationSelect = document.getElementById("locationSelect");
          locationSelect.onchange = function() {
            var markerNum = locationSelect.options[locationSelect.selectedIndex].value;
            if (markerNum != "none"){
              google.maps.event.trigger(markers[markerNum], 'click');
            }
          };
        }

          $("#addressInput").keypress(function(event) {
            if (event.which == 13) {
              console.log(event.which);
              //searchLocations();
              event.stopPropagation();
            }
          });

       function searchLocations() {
         var search = document.getElementById("addressInput").value;
         searchLocationsNear(search,'');
         //var geocoder = new google.maps.Geocoder();
         /*geocoder.geocode({address: address}, function(results, status) {
           if (status == google.maps.GeocoderStatus.OK) {
            searchLocationsNear(results[0].geometry.location);
           } else {
             alert(address + ' not found');
           }
         });*/
       }

       function clearLocations() {
         infoWindow.close();
         for (var i = 0; i < markers.length; i++) {
           markers[i].setMap(null);
         }
         markers.length = 0;

         locationSelect.innerHTML = "";
         //var option = document.createElement("option");
         //option.value = "none";
         //option.innerHTML = "See all results:";
         //locationSelect.appendChild(option);
       }

        //////////////// remove acentos ////////////////
        function removerAcento(palavra) {
        var palavraSemAcento = "";
        var caracterComAcento = "áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ";
        var caracterSemAcento = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC";

        for (var i = 0; i < palavra.length; i++)
        {
          var char = palavra.substr(i, 1);
          var indexAcento = caracterComAcento.indexOf(char);
          if (indexAcento != -1) {
            palavraSemAcento += caracterSemAcento.substr(indexAcento, 1);
          } else {
            palavraSemAcento += char;
          }
        }

        return palavraSemAcento;
        }

       function searchLocationsNear(search,center) {
         clearLocations();

         //var radius = document.getElementById('radiusSelect').value;
         var radius = 10;
         //var searchUrl = 'storelocator.php?search='+search+'&lat=' + center.lat() + '&lng=' + center.lng() + '&radius=' + radius;
         var searchUrl = 'storelocator.php?search='+removerAcento(search);
         downloadUrl(searchUrl, function(data) {
           var xml = parseXml(data);
           var markerNodes = xml.documentElement.getElementsByTagName("marker");
           var bounds = new google.maps.LatLngBounds();
           for (var i = 0; i < markerNodes.length; i++) {
             var id = markerNodes[i].getAttribute("id");
             var name = markerNodes[i].getAttribute("name");
             var address = markerNodes[i].getAttribute("address");
             var distance = parseFloat(markerNodes[i].getAttribute("distance"));
             var latlng = new google.maps.LatLng(
                  parseFloat(markerNodes[i].getAttribute("lat")),
                  parseFloat(markerNodes[i].getAttribute("lng")));

             createOption(name, distance, i);
             createMarker(latlng, name, address);
             bounds.extend(latlng);
           }
           map.fitBounds(bounds);
           locationSelect.style.visibility = "visible";
           locationSelect.onchange = function() {
             var markerNum = locationSelect.options[locationSelect.selectedIndex].value;
             google.maps.event.trigger(markers[markerNum], 'click');
           };
         });
       }

       function createMarker(latlng, name, address) {
          var html = "<b>" + name + "</b> <br/>" + address;
          var marker = new google.maps.Marker({
            map: map,
            position: latlng
          });
          google.maps.event.addListener(marker, 'click', function() {
            infoWindow.setContent(html);
            infoWindow.open(map, marker);
          });
          markers.push(marker);
        }

       function createOption(name, distance, num) {
          var option = document.createElement("option");
          option.value = num;
          option.innerHTML = name;
          locationSelect.appendChild(option);
       }

       function downloadUrl(url, callback) {
          var request = window.ActiveXObject ?
              new ActiveXObject('Microsoft.XMLHTTP') :
              new XMLHttpRequest;

          request.onreadystatechange = function() {
            if (request.readyState == 4) {
              request.onreadystatechange = doNothing;
              callback(request.responseText, request.status);
            }
          };

          request.open('GET', url, true);
          request.send(null);
       }

       function parseXml(str) {
          if (window.ActiveXObject) {
            var doc = new ActiveXObject('Microsoft.XMLDOM');
            doc.loadXML(str);
            return doc;
          } else if (window.DOMParser) {
            return (new DOMParser).parseFromString(str, 'text/xml');
          }
       }

       function doNothing() {}


//////////////// tooltip profile /////////////////////
var login;
  $('.account').on('click', function () {
    if (login=='true') {
      $(".gb_rb").toggle();
      $(".gb_qb").toggle();
      $(".gb_fa").toggle();
    }else{
      console.log("não logado");
      location.href = "https://isolver.com.br/login/";
    }
  });

//////////// retirar submit do campo servicos. ////////////
$('.tt-input').keypress(function(e) {
    if(e.which == 13) {
      e.preventDefault();
      console.log('Não vou enviar');
      $('.tt-input').blur();
    }
}); 

//////////////// detectar se é mobile ////////////////
var isMobile = {
   iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },    
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

if(viewport.is('xs') ){
  
  $(".tse-scrollable").addClass("tse-scrollablex");
  $(".tse-scrollable").removeClass("tse-scrollable");

  $(".tse-content").addClass("tse-contentx");
  $(".tse-content").removeClass("tse-content");
}else{

  $(".tse-scrollablex").addClass("tse-scrollable");
  $(".tse-scrollablex").removeClass("tse-scrollablex");

  $(".tse-contentx").addClass("tse-content");
  $(".tse-contentx").removeClass("tse-contentx");
}

function openSocialProfile(){
  console.log("full-detail");
  $("address.social-profile").toggleClass("min-height-100");
}
/////////////// iniciar api luis - voice consulta  ////////////////


    $(document).ready(function() {
      //if (!isMobile.any()) {

        if (isMobile.iOS()) {
          $(".colunamic").hide();
          
          if ($(window).width()<769) {
            //$(".pesquisa_conteudo .coluna").attr("style","width:50%");
          }
        }
      //}
      $(".closeSpeak").click(function(event) {
        $(".speak").hide("slow");
        console.log("fechar");
      });

      /*$("#searchHome").keypress(function(event) {
        if (event.which == 13) {
          $(".textspeak h1").html("Procurando...");
          $(".speak").show("slow");
          event.preventDefault();
          send();
        }
      });*/

      $("#butSearchHome").click(function(event) {
        $(".textspeak h1").html("Procurando...");
        $(".speak").show("slow");
        send();
      });

      $("#rec").click(function(event) {
        //$(".speak").css("top",$(document).scrollTop());
        $(".speak").show("slow");
        switchRecognition();  
      });


    var recognition;
    function startRecognition() {
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
      //speakLegend("");
      recognition.onstart = function(event) {
        console.log("onstart");
        updateRec();
        
      };
      recognition.onresult = function(event) {
        var text = "";
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
          }
          speakLegend("Procurando por: "+text);
          setInput(text);
        stopRecognition(text);
      };
      recognition.onend = function() {
            stopRecognition();
      };
      recognition.onerror = function(event) {
        console.log(event);
      };
      recognition.lang = "pt-BR";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.start();
    }
  
    function stopRecognition(text) {
      if (recognition) {
        recognition.stop();
        recognition = null;
        console.log("stop");
      }
      updateRec(text);
    }
    function switchRecognition() {
      if (recognition) {
        stopRecognition();
        console.log("stopRecognition");
      } else {
        startRecognition();
        console.log("startRecognition");
      }
    }
    function setInput(text) {
      $("#searchHome").val(text);
      $(".textspeak h1").html(text).show("slow");
      send("voice");
    }
    function updateRec(text) {
      $("#rec").html(recognition ? "<i class='fa fa-microphone-slash fa-lg icon-menu'></i>" : "<i class='fa fa-microphone fa-lg icon-menu'></i>");
      if (!recognition && !$("#searchHome").val()) {
        $(".speak").hide("slow");
      }
    }
    
    function send(voice) {


        // limpar variáveis
        var tipoImovel = "";
        var acaoImovel= "";
        var estadoImovel= "";
        var cidadeImovel= "";
        var bairroImovel= "";
        var codCidadeImovel= "";
        var codCidadeImovelSelect= "";
        var codBairroImovel= "";
        var quartosoImovel= "";
        var quartosoImovelSplit= "";
        var quartosMaxImovel= "";
        var e;
        var valorImovelMin = "";
        var valorImovelMax = "";

        //var text = $("#searchImoveis").val();
        var params = {
            // Request parameters
            "q": $("#searchHome").val(),
            "verbose": true,
            "timezoneOffset": "-180",

        };
        $.ajax({
            url: "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/00dbcfb0-bddc-435e-b69f-4c6a4d33d703?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","696295809d454650bd5d9318ad1fe397");
            },
            type: "GET",
        })
        .done(function(data) {
            console.log(data);

            var qtd = data.entities.length;

            for (var i = 0; i < qtd; i++) {
              if (data.entities[i].type=='bairros'){
                tipoImovel = data.entities[i].entity.toUpperCase();
              }
              if (data.entities[i].type=='cidades'){
                acaoImovel = data.entities[i].entity.toUpperCase();
              }
              if (data.entities[i].type=='cidade'){
                cidadeImovel = data.entities[i].entity;
              }
              if (data.entities[i].type=='bairro'){
                bairroImovel = data.entities[i].entity;
              }
              if (data.entities[i].type=='valor'){

                if (data.entities[i].entity.toUpperCase()=="UM MILHÃO") {
                  valorImovelMax = 1000000;
                }
                if (data.entities[i].entity.toUpperCase()=="DOIS MILHÕES") {
                  valorImovelMax = 2000000;
                }
                if (data.entities[i].entity.toUpperCase()=="TRÊS MILHÕES") {
                  valorImovelMax = 3000000;
                }
                if (data.entities[i].entity.toUpperCase()=="QUATRO MILHÕES") {
                  valorImovelMax = 4000000;
                }
                if (data.entities[i].entity.toUpperCase()=="CINCO MILHÕES") {
                  valorImovelMax = 5000000;
                }
                if (data.entities[i].entity.toUpperCase()=="MEIO MILHÃO") {
                  valorImovelMax = 500000;
                }
                if (valorImovelMax=="") {
                  valorImovelMax = data.entities[i].entity.split(",");
                  console.log("valorImovelMax = "+valorImovelMax);
                  valorImovelMax = valorImovelMax[0].replace(" . ","");
                  valorImovelMax = valorImovelMax.replace(/^\s+|\s+$/g,"");
                  console.log("valorImovelMax = "+valorImovelMax);
                  //valorImovelMax = valorImovelMax[0].trim();
                  //valorImovelMax = Regex.Replace(valorImovelMax[0], @"\s","");
                  console.log("valorImovelMax = "+valorImovelMax);
                }
                valorImovelMin = 0;
              }
              if (data.entities[i].type=='quartos'){
                quartosoImovel = data.entities[i].entity.split(" ");
                quartosoImovelSplit = quartosoImovel[0];
                quartosoImovelSplitUpper = quartosoImovelSplit.toUpperCase();
                quartosoImovelSplit = quartosoImovelSplit.replace("QTS", "");
                quartosoImovelSplit = quartosoImovelSplit.replace("qts", "");
                quartosoImovelSplit = quartosoImovelSplit.replace("QUARTOS", "");
                quartosoImovelSplit = quartosoImovelSplit.replace("quartos", "");
                quartosoImovelSplit = quartosoImovelSplit.replace("QUARTO", "");
                quartosoImovelSplit = quartosoImovelSplit.replace("quarto", "");
                console.log("quartosoImovelSplit = " +quartosoImovelSplit);
                console.log("quartosoImovelSplit toUpperCase = " +quartosoImovelSplit.toUpperCase());
                switch (quartosoImovelSplitUpper) {
                  case "UM":
                    quartosoImovelSplit = 1;
                    quartosMaxImovel = 1;
                  break;
                  case "DOIS":
                    quartosoImovelSplit = 2;
                    quartosMaxImovel = 2;
                  break;
                  case "TRÊS":
                    quartosoImovelSplit = 3;
                    quartosMaxImovel = 3;
                  break;
                  case "QUATRO":
                    quartosoImovelSplit = 4;
                    quartosMaxImovel = 4;
                  break;
                  case "CINCO":
                    quartosoImovelSplit = 5;
                    quartosMaxImovel = 5;
                  break;
                  case "SEIS":
                    quartosoImovelSplit = 6;
                    quartosMaxImovel = 6;
                  break;
                  default:
                    quartosoImovelSplit = quartosoImovelSplit;
                    quartosMaxImovel = quartosoImovelSplit;
                    console.log("quartosoImovelSplit default = " +quartosoImovelSplit);
                  break;
                }
              }
            }

            if (cidadeImovel!="") {
              console.log("cidadeImovel = "+cidadeImovel);
                estadoImovel = 1;
                // consulta cidades - api SMART
                var url = "http://www.jairorocha.com.br/site-2017";
                  $.ajax({
                      url: url+"/funcoes-api-smart.php?codEstado="+estadoImovel+"&action=obterCidades",
                      dataType : "json",
                      success: function(data) {
                        var qtd = data.cidades.length;
                        //console.log(data);
                        for (var i = 0; i < qtd; i++) {
                          //console.log("cidadeImovel "+data.cidades[i].cidade+" = "+cidadeImovel);
                          if (data.cidades[i].cidade.toUpperCase()==cidadeImovel.toUpperCase()) {
                            codCidadeImovelSelect = data.cidades[i].codigo;
                            obterBairros(codCidadeImovelSelect);
                          }
                        }
                      }
                  });
                function obterBairros(codCidadeImovel){
                // consulta bairros - api SMART
                var url = "http://www.jairorocha.com.br/site-2017";
                  $.ajax({
                      url: url+"/funcoes-api-smart.php?codCidade="+codCidadeImovel+"&action=obterBairros",
                      dataType : "json",
                      success: function(data) {
                        var qtd = data.bairros.length;
                        
                        for (var i = 0; i < qtd; i++) {
                          //console.log("bairroImovel "+data.bairros[i].bairro+" = "+bairroImovel);
                          if (removerAcento(data.bairros[i].bairro.toUpperCase())==removerAcento(bairroImovel.toUpperCase())) {
                            codBairroImovel = data.bairros[i].codigo;
                          }
                        }
                        obterListaImoveis();
                        console.log("codBairroImovel = "+codBairroImovel);
                      }
                  });
                }
            }else{
              console.log("cidadeImovel else = "+cidadeImovel);
                // consulta cidades diretamente pelo codigos - api SMART

                var qtd = 9;
                for (e = 0; e < qtd; e++) {
                  if (e==0) {
                    codCidadeImovel = 133; // Recife
                  }else if (e==1) {
                    codCidadeImovel = 88; // Jaboatão dos Guarapes
                  }else if (e==2) {
                    codCidadeImovel = 112; // Olinda
                  }else if (e==3) {
                    codCidadeImovel = 80; // Ipojuca
                  }else if (e==4) {
                    codCidadeImovel = 123; // Paulista
                  }else if (e==5) {
                    codCidadeImovel = 157; // São Lourenço da Mata
                  }else if (e==6) {
                    codCidadeImovel = 168; // Tamandaré
                  }else if (e==7) {
                    codCidadeImovel = 1; // Abreu e Lima
                  }else if (e==8) {
                    codCidadeImovel = 31; // Cabo de Santo Agostinho
                  }

                  // consulta bairros - api SMART
                  var url = "http://www.jairorocha.com.br/site-2017";
                  $.ajax({
                      url: url+"/funcoes-api-smart.php?codCidade="+codCidadeImovel+"&action=obterBairros",
                      dataType : "json",
                      async: false,
                      success: function(data) {
                        var qtd = data.bairros.length;
                        if(bairroImovel.toUpperCase()=="BV"){
                          bairroImovel = "BOA VIAGEM";
                        }
                        for (var i = 0; i < qtd; i++) {
                          //console.log("bairroImovel "+data.bairros[i].bairro+" = "+bairroImovel);
                          if (removerAcento(data.bairros[i].bairro.toUpperCase())==removerAcento(bairroImovel.toUpperCase())) {
                            codBairroImovel = data.bairros[i].codigo;
                            
                            if (e==0) {
                              codCidadeImovelSelect = 133;
                              //console.log("cidade e = "+e);
                              //console.log("codCidadeImovel e = "+codCidadeImovelSelect);
                            }
                            if (e==1) {
                              codCidadeImovelSelect = 88;
                              //console.log("cidade e = "+e);
                              //console.log("codCidadeImovel e = "+codCidadeImovelSelect);
                            }
                            if (e==2) {
                              codCidadeImovelSelect = 112;
                              //console.log("cidade e = "+e);
                              //console.log("codCidadeImovel e = "+codCidadeImovelSelect);
                            }
                            if (e==3) {
                              codCidadeImovelSelect = 80;
                              //console.log("cidade e = "+e);
                              //console.log("codCidadeImovel e = "+codCidadeImovelSelect);
                            }
                            if (e==4) {
                              codCidadeImovelSelect = 123;
                              //console.log("cidade e = "+e);
                              //console.log("codCidadeImovel e = "+codCidadeImovelSelect);
                            }
                            if (e==5) {
                              codCidadeImovelSelect = 157;
                              //console.log("cidade e = "+e);
                              //console.log("codCidadeImovel e = "+codCidadeImovelSelect);
                            }
                            if (e==6) {
                              codCidadeImovelSelect = 168;
                              //console.log("cidade e = "+e);
                              //console.log("codCidadeImovel e = "+codCidadeImovelSelect);
                            }
                            if (e==7) {
                              codCidadeImovelSelect = 1;
                              //console.log("cidade e = "+e);
                              //console.log("codCidadeImovel e = "+codCidadeImovelSelect);
                            }
                            if (e==8) {
                              codCidadeImovelSelect = 31;
                              //console.log("cidade e = "+e);
                              //console.log("codCidadeImovel e = "+codCidadeImovelSelect);
                            }
                          }
                        }
                        //console.log("codCidadeImovel = "+codCidadeImovelSelect);
                        //console.log("codBairroImovel = "+codBairroImovel);
                      }
                  });
                  // loop em todas as cidades verificando a escolhida e depois chama obterListaImoveis
                  if (e==8) {
                    obterListaImoveis();
                  }
                }
            }

            function obterListaImoveis(){
              console.log("obterListaImoveis");
              switch (acaoImovel) {
                case "COMPRAR":
                  acaoImovel = "V";
                break;
                case "ALUGAR":
                  acaoImovel = "L";
                break;
                default:
                  acaoImovel = "V;L";
                break;
              }

              switch (tipoImovel) {
                case "APARTAMENTO":
                  tipoImovel = 1;
                break;
                case "APTO":
                  tipoImovel = 1;
                break;
                case "CASA":
                  tipoImovel = 2;
                break;
                case "LOJA":
                  tipoImovel = 3;
                break;
                case "TERRENO":
                  tipoImovel = 4;
                break;
                case "LOTEAMENTO":
                  tipoImovel = 4;
                break;
                case "GALPÃO":
                  tipoImovel = 5;
                break;
                case "PRÉDIO COMERCIAL":
                  tipoImovel = 5;
                break;
                case "SALA COMERCIAL":
                  tipoImovel = 6;
                break;
                case "SALA":
                  tipoImovel = 6;
                break;
                case "RURAL":
                  tipoImovel = 7;
                break;
                case "FLAT":
                  tipoImovel = 8;
                break;
                case "STUDIO":
                  tipoImovel = 8;
                break;
                case "HOTEL":
                  tipoImovel = 9;
                break;
                case "POUSADA":
                  tipoImovel = 9;
                break;
                case "RESTAURANTE":
                  tipoImovel = 10;
                break;
                case "LANCHONETE":
                  tipoImovel = 10;
                break;
                default:
                  tipoImovel = "1;2;3;4;5;6;7;8;9;10;";
                break;
              }

              if (quartosoImovelSplit=="") {
                quartosoImovelSplit = 1;
                console.log("quartosoImovelSplit else =" +quartosoImovelSplit);
              }
              if (quartosMaxImovel=="") {
                quartosMaxImovel = 6;
              }
              if (valorImovelMax=="") {
                valorImovelMin = 0;
                valorImovelMax = 100000000;
              }

              if (codCidadeImovelSelect=="") {
                var filtroImoveis ={
                    tipoImovel: tipoImovel,
                    token:"MRyLSNSeovwg8MkjW6JbRcmqXtWiV5i3SAhcFvDH",
                    quantidadeImoveis:300,
                    idEstado:1,
                    quartosMinimo: quartosoImovelSplit,
                    quartosMaximo: quartosMaxImovel,
                    temFoto:"s",
                    statusImovelStr: acaoImovel,
                    precoMinimo: valorImovelMin,
                    precoMaximo: valorImovelMax,
                };
              }else if (codBairroImovel=="") {
                var filtroImoveis ={
                    tipoImovel: tipoImovel,
                    token:"MRyLSNSeovwg8MkjW6JbRcmqXtWiV5i3SAhcFvDH",
                    quantidadeImoveis:300,
                    idEstado:1,
                    idCidade: codCidadeImovelSelect,
                    quartosMinimo: quartosoImovelSplit,
                    quartosMaximo: quartosMaxImovel,
                    temFoto:"s",
                    statusImovelStr: acaoImovel,
                    precoMinimo: valorImovelMin,
                    precoMaximo: valorImovelMax,
                };
              }else{
                var filtroImoveis ={
                    tipoImovel: tipoImovel,
                    token:"MRyLSNSeovwg8MkjW6JbRcmqXtWiV5i3SAhcFvDH",
                    quantidadeImoveis:300,
                    idEstado:1,
                    idCidade: codCidadeImovelSelect,
                    idBairros: [codBairroImovel],
                    quartosMinimo: quartosoImovelSplit,
                    quartosMaximo: quartosMaxImovel,
                    temFoto:"s",
                    statusImovelStr: acaoImovel,
                    precoMinimo: valorImovelMin,
                    precoMaximo: valorImovelMax,
                };
              }

              // consulta search - api SMART
              var url = "http://www.jairorocha.com.br/site-2017";
                $.ajax({
                  url: url+"/funcoes-api-smart.php?filtro="+JSON.stringify(filtroImoveis)+"&action=obterListaImoveis",
                  dataType : "json",
                  success: function(data) {
                    $(".list-imoveis").html("");
                      if (data.imoveis) {
                        if (voice=="voice") {
                          //setTimeout(function() {
                            speakAnswer("Encontramos alguns empreendimentos para você!","");
                          //}, 3000);
                        }

                        var html="";
                        var nquartos="";
                        var nbanheirossociais="";
                        var areautil="";
                        var preco="";
                        var ngaragens="";
                        var tipoImovel="";


                            var qtd = data.imoveis.length;
                            for (var i = 0; i < qtd; i++) {
                              if (data.imoveis[i].nquartos) {
                                nquartos = data.imoveis[i].nquartos.replace(/^(0+)(\d)/g,"$2");
                                nquartos = "<li>"+nquartos+"<i class='fa fa-bed fa-lg'></i></li>";
                              }else{
                                nquartos = "";
                              }
                              if (data.imoveis[i].nbanheirossociais) {
                                //console.log("nbanheirossociais = "+data.imoveis[i].nbanheirossociais);
                                nbanheirossociais = "<li>"+data.imoveis[i].nbanheirossociais+"<i class='fa fa-shower fa-lg'></i></li>";
                              }else{
                                nbanheirossociais = "";
                              }
                              if (data.imoveis[i].areautil) {
                                  areautil = Math.floor(data.imoveis[i].areautil);
                                  areautil = "<li>"+areautil+"<span> m²</span></li>";
                              }else{
                                areautil = "";
                              }
                              if (data.imoveis[i].preco) {
                                  preco = formatMoneyReal(data.imoveis[i].preco);
                                  preco = "R$ "+preco;
                              }
                              if (data.imoveis[i].ngaragens) {
                                  ngaragens = data.imoveis[i].ngaragens.replace(/^(0+)(\d)/g,"$2");
                                  ngaragens = "<li>"+ngaragens+"<i class='fa fa-car fa-lg'></i></li>";
                              }else{
                                  ngaragens="";
                              }
                              if (data.imoveis[i].tipoImovel) {
                                  tipoImovel = data.imoveis[i].tipoImovel.split(" ");
                                  tipoImovel = tipoImovel[0];
                              }
                              if (data.imoveis[i].fotodestaque) {
                                data.imoveis[i].urlFotoDestaque = data.imoveis[i].fotoImovelList[data.imoveis[i].fotodestaque-1].urlThumbnailMiddleHD;
                              }else{
                                data.imoveis[i].urlFotoDestaque = data.imoveis[i].fotoImovelList[0].urlThumbnailMiddleHD;
                              }
                              



                          html+="<div class='col-md-3'>"+
                                "<div class='container-imovel-dest'>"+
                                  "<a href='"+url+"/"+data.imoveis[i].urlDetalhe+"/'>"+
                                    "<div class='img-imovel-dest'>"+
                                      "<img data-original='"+data.imoveis[i].urlFotoDestaque+"' class='lazy' alt=''>"+
                                      "<div class='tipo-imovel-dest bg-"+data.imoveis[i].idTipoImovel+"'>"+tipoImovel+"</div>"+
                                      "</div>"+
                                    "<div class='txt-imovel-dest'>"+
                                      "<div class='txt-location-imovel-dest'>"+data.imoveis[i].nomeCidade+" - "+data.imoveis[i].siglaEstado+"</div>"+
                                      "<div class='txt-bairro-imovel-dest'>"+data.imoveis[i].nomeBairro+"</div>"+
                                      "<div class='txt-tit-imovel-dest'>"+data.imoveis[i].nomeImovel+"</div>"+
                                      "<div class='txt-tit-preco-dest'>"+preco+"</div>"+
                                      "<div class='fav-imovel-dest'>"+
                                        "<a class='favoritos-search' id='"+data.imoveis[i].codigoImovel+"'>"+
                                          "<i class='fa fa-star-o fa-lg'></i>"+
                                        "</a>"+
                                      "</div>"+
                                    "</div>"+
                                    "<div class='icon-imovel-dest'>"+
                                      "<ul>"+nquartos+nbanheirossociais+ngaragens+areautil+
                                      "</ul>"+
                                    "</div>"+
                                  "</a>"+
                                "</div>"+
                              "</div>";

                              nquartos="";
                              nbanheirossociais="";
                              areautil="";
                              preco="";
                              ngaragens="";
                              tipoImovel="";

                            }
                              $(".list-imoveis").html("");
                              $(".list-imoveis1").hide();
                              $(".list-imoveis2").hide();
                              $(".list-imoveis3").hide();
                              $("#map-det").hide();

                              $(".list-imoveis").html(html);
                              fav(".favoritos-search");
                        
                        //if (voice!="voice") {
                          //setTimeout(function() {
                            $(".speak").hide("slow");
                            //$("#searchHome, #searchImoveis").val("");
                            setTimeout(function() { 
                              $(".textspeak h1").html("Ouvindo...");
                            }, 5000);
                            
                            $('html, body').stop().animate({
                                'scrollTop': (($("#imoveis").offset().top-heightMenu))
                            }, 1500, 'swing');
                          //}, 5000);
                        //}
                      }else{
                        $(".list-imoveis").html("");
                        if (voice=="voice") {
                          speakAnswer("Não encontramos nenhum empreendimento, favor tentar novamente!","");
                        }

                        //setTimeout(function() {
                          $(".speak").hide("slow");
                          $('html, body').stop().animate({
                              'scrollTop': (($("#imoveis").offset().top-heightMenu))
                          }, 1500, 'swing');
                        //}, 3000);

                        $(".list-imoveis").html("<h4>Não encontramos nenhum empreendimento, favor tentar novamente!</h4>");
                        //$("#searchHome, #searchImoveis").val("");
                        setTimeout(function() { 
                          $(".textspeak h1").html("Ouvindo...");
                        }, 5000);
                      
                      }
                  // limpar variáveis
                  var tipoImovel = "";
                  var acaoImovel= "";
                  var estadoImovel= "";
                  var cidadeImovel= "";
                  var bairroImovel= "";
                  var codCidadeImovel= "";
                  var codCidadeImovelSelect= "";
                  var codBairroImovel= "";
                  var quartosoImovel= "";
                  var quartosoImovelSplit= "";
                  var quartosMaxImovel= "";
                  var e;
                  var valorImovelMin = "";
                  var valorImovelMax = "";

                  },error: function(data) {

                  }
              });
            }
        })
        .fail(function() {
            //alert("error");
            console.log(data);
        });
    }




/* post link */
  $("a.post").click(function(e) {
      e.stopPropagation();
      e.preventDefault();
      var href = this.href;
      var parts = href.split('?');
      var url = parts[0];
      var params = parts[1].split('&');
      var pp, inputs = '';
      for(var i = 0, n = params.length; i < n; i++) {
          pp = params[i].split('=');
          inputs += '<input type="hidden" name="' + pp[0] + '" value="' + pp[1] + '" />';
      }
      $("body").append('<form action="'+url+'" method="post" id="postlink">'+inputs+'</form>');
      $("#postlink").submit();
  });

});

/* ler imagem em tempo real no upload */
function readURL(input) {
    var url = input.value;
    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
    if (input.files && input.files[0]&& (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
        var reader = new FileReader();
        //console.log("url = "+url);
        reader.onload = function (e) {
            $('.bg-transfer-profile').attr('style', 'background-image: url('+e.target.result+')');
        }

        reader.readAsDataURL(input.files[0]);
    }
}
  $("#url_profile").change(function(){ 
    readURL(this);
  });

/* atualiza nome ao digitar no profile*/

$('#nome').keyup(function(){
  var $this = $(this);
  var valueSeach = $this.val();
  $('.nome-profile h2').html(valueSeach);
});

$('#email').keyup(function(){
  var $this = $(this);
  var valueSeach = $this.val();
  $('.email-profile strong').html(valueSeach);
});

/* validação do formulario */
  $('.form').validate({
    rules:{
      nome: {
      required: true,
      minlength: 3
      },
      txtSexo: {
      required: true
      },
      password_login: {
      required: true
      },
      txtFancy_name: {
      required: true,
      minlength: 5
      },      
      selectCat: {
      required: true
      },
      txtDescription: {
      required: true,
      minlength: 3
      },
      txtStart_date: {
      required: true
      },
      txtStart_time: {
      required: true
      },
      txtEnd_time: {
      required: true
      },
      txtAcronym: {
      required: true
      },
      txtSequence: {
      required: true
      },
      email: {
      required: true,
      email: true
      },
      cnpj: {
      required: false,
      cnpj: true
      },      
      nascimento:{
      required: false,
      },
      telefone: {
      required: false,
      celular: true
      },
      txtWeight: {
      required: true
      },
      txtDimentions: {
      required: true
      },
      txtPrice: {
      required: true
      },
      txtStreet: {
      required: false
      },
      txtNumber: {
      required: false
      },
      txtDistrict: {
      required: false
      },
      selState: {
      required: true
      },
      selCity: {
      required: true
      },
      txtZip_code: {
      required: false
      },
      txtContact_name: {
      required: true
      },
      txtEnd_date: {
      required: true
      },
      txtLocal_event: {
      required: true
      },
      txtCountry: {
      required: true
      },
      city: {
      required: true
      },
      state: {
      required: true
      },
      company: {
      required: true
      },
      nome_fantasia: {
      required: true
      },
      txtFirst_name: {
      required: true
      },
      txtLast_name: {
      required: true
      },
      txtAssunto: {
      required: true
      },
      selProfile: {
      required: true
      },
      'files[]': {
      required: false
      }
    },
    messages:{
      nome:{
      required: "O campo nome é obrigatório.",
      minlength: "O campo nome deve conter no mínimo 3 caracteres."
      },
      txtSexo:{
      required: "O campo Sexo é obrigatório."
      },
      password_login:{
      required: "O campo Senha é obrigatório."
      },
      txtFancy_name:{
      required: "O campo Nome de fantasia é obrigatório.",
      minlength: "O campo Nome de fantasia deve conter no mínimo 5 caracteres."
      },
      selectCat: {
      required: "O campo categoria é obrigatório."
      },
      txtDescription: {
      required: "O campo descrição é obrigatório.",
      minlength: "O campo descrição deve conter no mínimo 3 caracteres."
      },
      txtStart_date: {
      required: "O campo data início é obrigatório"
      },
      txtStart_time: {
      required: "O campo hora início é obrigatório"
      },
      txtEnd_time: {
      required: "O campo hora término é obrigatório"
      },      
      txtAcronym: {
      required: "O campo sigla é obrigatório."
      },
      txtSequence: {
      required: "O campo ordem é obrigatório."
      },
      email: {
      required: "O campo email é obrigatório.",
      email: "O campo email deve conter um email válido."
      },
      cnpj: {
      required: "O campo CNPJ é obrigatório.",
      cnpj: "CNPJ inválido."
      },        
      nascimento: {
      required: "O campo data de nascimento é obrigatório.",
      },
      telefone: {
      required: "O campo telefone é obrigatório.",
      celular: "Telefone inválido"
      },
      txtWeight: {
      required: "O campo peso é obrigatório."
      },
      txtDimentions: {
      required: "O campo dimensões é obrigatório."
      },
      txtPrice: {
      required: "O campo preço é obrigatório."
      },
      txtStreet: {
      required: "O campo logradouro é obrigatório."
      },
      txtNumber: {
      required: "O campo número é obrigatório."
      },
      txtDistrict: {
      required: "O campo bairro é obrigatório."
      },
      selState: {
      required: "O campo estado é obrigatório."
      },
      selCity: {
      required: "O campo cidade é obrigatório."
      },
      txtZip_code: {
      required: "O campo CEP é obrigatório."
      },
      txtContact_name: {
      required: "O campo nome contato é obrigatório."
      },
      txtEnd_date: {
      required: "O campo data término é obrigatório."
      },
      txtLocal_event: {
      required: "O campo local é obrigatório."
      },
      txtCountry: {
      required: "O campo país é obrigatório."
      },
      city: {
      required: "O campo cidade é obrigatório."
      },
      state: {
      required: "O campo estado é obrigatório."
      },
      company: {
      required: "O campo empresa é obrigatório."
      },
      nome_fantasia: {
      required: "O campo nome fantasia é obrigatório."
      },
      txtFirst_name: {
      required: "O campo primeiro nome é obrigatório."
      },
      txtLast_name: {
      required: "O campo último nome é obrigatório."
      },
      txtAssunto: {
      required: "O campo assunto é obrigatório."
      },
      selProfile: {
      required: "O campo Perfil é obrigatório."
      }     
    }
  });
  $( "#files" ).rules( "remove" );
jQuery.validator.addMethod("cnpj", function (cnpj, element) {
    cnpj = jQuery.trim(cnpj);
 
    // DEIXA APENAS OS NÚMEROS
    cnpj = cnpj.replace('/', '');
    cnpj = cnpj.replace('.', '');
    cnpj = cnpj.replace('.', '');
    cnpj = cnpj.replace('-', '');
 
    var numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
    digitos_iguais = 1;
 
    if (cnpj.length < 14 && cnpj.length < 15) {
        return this.optional(element) || false;
    }
    for (i = 0; i < cnpj.length - 1; i++) {
        if (cnpj.charAt(i) != cnpj.charAt(i + 1)) {
            digitos_iguais = 0;
            break;
        }
    }
 
    if (!digitos_iguais) {
        tamanho = cnpj.length - 2
        numeros = cnpj.substring(0, tamanho);
        digitos = cnpj.substring(tamanho);
        soma = 0;
        pos = tamanho - 7;
 
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0)) {
            return this.optional(element) || false;
        }
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1)) {
            return this.optional(element) || false;
        }
        return this.optional(element) || true;
    } else {
        return this.optional(element) || false;
    }
}, "Informe um CNPJ válido.");

jQuery.validator.addMethod("verificaCPF", function(value, element) {
    value = value.replace('.','');
    value = value.replace('.','');
    cpf = value.replace('-','');
    while(cpf.length < 11) cpf = "0"+ cpf;
    var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
    var a = [];
    var b = new Number;
    var c = 11;
    for (i=0; i<11; i++){
        a[i] = cpf.charAt(i);
        if (i < 9) b += (a[i] * --c);
    }
    if ((x = b % 11) < 2) { a[9] = 0 } else { a[9] = 11-x }
    b = 0;
    c = 11;
    for (y=0; y<10; y++) b += (a[y] * c--);
    if ((x = b % 11) < 2) { a[10] = 0; } else { a[10] = 11-x; }
    if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]) || cpf.match(expReg)) return false;
    return true;
}, "Informe um CPF válido."); // Mensagem padrão

jQuery.validator.addMethod("dateBR", function (value, element) {
    //contando chars    
    if (value.length != 10) return (this.optional(element) || false);
    // verificando data
    var data = value;
    var dia = data.substr(0, 2);
    var barra1 = data.substr(2, 1);
    var mes = data.substr(3, 2);
    var barra2 = data.substr(5, 1);
    var ano = data.substr(6, 4);
    if (data.length != 10 || barra1 != "/" || barra2 != "/" || isNaN(dia) || isNaN(mes) || isNaN(ano) || dia > 31 || mes > 12) return (this.optional(element) || false);
    if ((mes == 4 || mes == 6 || mes == 9 || mes == 11) && dia == 31) return (this.optional(element) || false);
    if (mes == 2 && (dia > 29 || (dia == 29 && ano % 4 != 0))) return (this.optional(element) || false);
    if (ano < 1900) return (this.optional(element) || false);
    return (this.optional(element) || true);
}, "Informe uma data válida");  // Mensagem padrão

// Celular (com 8 ou 9 dígitos)
jQuery.validator.addMethod("celular", function (value, element) {
  value = value.replace("(", "");
  value = value.replace(")", "");
  value = value.replace("-", "");
  value = value.replace("_", "");
  value = value.replace(" ", "");
  return this.optional(element) || /[0-9]{10}/.test(value) || /[0-9]{11}/.test(value);
}, "Informe um telefone válido."); 
