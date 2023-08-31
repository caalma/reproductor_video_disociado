
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

    setear_videos();
    bc.postMessage( {accion: 'archivo', valor: archivos.value} );
}


function iniciar_pantalla(){
    var video = document.querySelector("#video");
    var video_source = document.querySelector("#video_source");

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
            }
        }
    });

}
