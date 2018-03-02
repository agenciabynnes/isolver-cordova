var maskBehavior = function (val) {
  return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
},
options = {onKeyPress: function(val, e, field, options) {
        field.mask(maskBehavior.apply({}, arguments), options);
    }
};


function mascara(o,f){
    v_obj=o
    v_fun=f
    setTimeout("execmascara()",1)
}
function execmascara(){
    v_obj.value=v_fun(v_obj.value)
}

function mplaca(v){
    v=v.replace(/([a-zA-Z]{3})(\d{1,2})$/,"$1-$2") //Coloca um hífen entre o terceiro e o quarto dígitos
    //v=v.replace(/(\d{4})(\d)/,"$1-$2")
    return v
}

$(document).ready(function(){


    document.addEventListener("backbutton", voltar, false);


    function voltar(){
        
    }

    document.addEventListener("offline", onOffline, false);

    function onOffline() {

        $("iframe").hide();
        alert('Você precisa de conexão com a internet');
    }
    function onOnline() {
        $("iframe").show();
    }

    document.addEventListener("online", onOnline, false);

});
