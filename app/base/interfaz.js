
// comunicacion común
var bc = new BroadcastChannel('rvdbc');

function setear_videos(){
    let k;
    for( k of Object.keys(lista_videos)){
        let o = document.createElement('option');
        o.textContent = k;
        o.value = lista_videos[k];
        archivos.add(o);
    }
}

function iniciar_controles(){
    var archivos = document.querySelector('#archivos');
    var reproducir = document.querySelector('#reproducir');
    var pausar = document.querySelector('#pausar');
    var detener = document.querySelector('#detener');
    var cargar = document.querySelector('#cargar');
    var opacidad = document.querySelector("#opacidad");
    var volumen = document.querySelector("#volumen");
    var vol_opa = document.querySelector("#vol_opa");
    var ciclico = document.querySelector("#ciclico");
    var posicionarse = document.querySelector("#posicionarse");
    var posicion = document.querySelector("#posicion");
    var posicion_info = document.querySelector("#posicion_info");

    ciclico.addEventListener('change', ev => {
        bc.postMessage({accion: 'reproduccion_ciclica', valor: ev.target.checked});
    });

    posicionarse.addEventListener('change', ev => {
        if(ev.target.value > ev.target.max) {
            ev.target.value = ev.target.max;
        }else if(ev.target.value < 0) {
            ev.target.value = 0;
        }
        bc.postMessage({accion: 'posicionarse', valor: ev.target.value});
    });

    archivos.addEventListener('change', ev => {
        bc.postMessage({accion: 'archivo', valor: ev.target.value});
    });

    cargar.addEventListener('click', ev => {
        bc.postMessage({accion: 'cargar'});
    });

    reproducir.addEventListener('click', ev => {
        bc.postMessage({accion: 'reproducir'});
    });

    pausar.addEventListener('click', ev => {
        bc.postMessage({accion: 'pausar'});
    });

    detener.addEventListener('click', ev => {
        bc.postMessage({accion: 'detener'});
    });

    opacidad.addEventListener('change', ev => {
        bc.postMessage({accion: 'opacidad', valor: ev.target.value});
    });

    volumen.addEventListener('change', ev => {
        bc.postMessage({accion: 'volumen', valor: ev.target.value});
    });

    vol_opa.addEventListener('change', ev => {
        let v = ev.target.value;
        bc.postMessage({accion: 'vol_opa', valor: v});
        opacidad.value = volumen.value = v;
    });

    bc.addEventListener('message', ev => {
        if(ev.data.accion == 'posicion_actual'){
            let p = ev.data.valor[0].toFixed(2),
                t = ev.data.valor[1].toFixed(2);
            posicion.value = ev.data.valor[0];
            posicion.max = ev.data.valor[1];
            posicionarse.max = ev.data.valor[1];
            posicion_info.innerHTML = `${p} / ${t}`;
        }
    });


    setear_videos();
    bc.postMessage( {accion: 'archivo', valor: archivos.value} );
}

var reproducir_ciclicamente = false;
function iniciar_pantalla(){
    var video = document.querySelector("#video");
    var video_source = document.querySelector("#video_source");

    video.addEventListener('loadeddata', ev => {
        bc.postMessage({accion: 'posicion_actual', valor:
                        [video.currentTime, video.duration]
                       });
    });
    video.addEventListener('timeupdate', ev => {
        bc.postMessage({accion: 'posicion_actual', valor:
                        [video.currentTime, video.duration]
                       });

        if(reproducir_ciclicamente){
            if(video.currentTime == video.duration){
                video.currentTime = 0;
                video.play();
            }
        }

    });

    bc.addEventListener('message', ev => {
        if(video && video_source){
            console.log(ev.data);

            if(ev.data.accion == 'archivo'){
                video_source.src = ev.data.valor;
            }else if(ev.data.accion == 'opacidad'){
                video.style = `opacity: ${ev.data.valor}`;
            }else if(ev.data.accion == 'volumen'){
                video.volume = ev.data.valor;
            }else if(ev.data.accion == 'vol_opa'){
                video.style = `opacity: ${ev.data.valor}`;
                video.volume = ev.data.valor;
            }else if(ev.data.accion == 'cargar'){
                video.load();
            }else if(ev.data.accion == 'reproducir'){
                video.play();
            }else if(ev.data.accion == 'pausar'){
                video.pause();
            }else if(ev.data.accion == 'detener'){
                video.pause();
                video.currentTime = 0;
            }else if(ev.data.accion == 'reproduccion_ciclica'){
                reproducir_ciclicamente = ev.data.valor;
            }else if(ev.data.accion == 'posicionarse'){
                let v = ev.data.valor;
                if(v > video.duration) { v = video.duration; }
                if(v < 0) { v = 0; }
                video.currentTime = v;
            }
        }
    });

}

function activar_pantalla(el){
    el.parentElement.style = 'display:none';
    document.body.classList.add('activa');
    let h = document.querySelector('html');
    h.classList.remove('no_activa');
}
