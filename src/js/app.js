var canvas = new fabric.CanvasWithViewport('c');

function crear_linea() {
  var tmp = new fabric.Line([0, 0, 100, 100], {
        stroke: '#ccc',
        strokeWidth: 2,
        selectable: false,
        hasControls: false,
        hasBorders: true,
      });

  return tmp;
}


function ajustar_lineas_conectadas(elemento) {
  var p = elemento;

  p.linea_que_llega && p.linea_que_llega.set({
    'x2': p.left + p.width/2,
    'y2': p.top + p.height / 2
  });

  if (p.lineas_que_salen && p.lineas_que_salen.length > 0) {
    for (var i in p.lineas_que_salen) {
      p.lineas_que_salen[i].set({
        'x1': p.left + p.width/2,
        'y1': p.top + p.height/2}
      );

    }
  }

  //p.line2 && p.line2.set();
}

canvas.on('object:moving', function(e) {
  var currentCanvasHeight = canvas.height
  var currentCanvasWidth = canvas.width
  var p = e.target;

  ajustar_lineas_conectadas(p);



  //p.line3 && p.line3.set({ 'x1': p.left, 'y1': p.top });
  //p.line4 && p.line4.set({ 'x1': p.left, 'y1': p.top });





  /** EXPANDE EL CANVAS PARA QUE SEA INFINITO */

  if ((e.target.left + e.target.currentWidth) > currentCanvasWidth) {
    canvas.setWidth(currentCanvasWidth + 50);
    //$("#wrapper").scrollLeft e.target.left # scroll alongside the canvas expansion
    //$('#wrapper').on 'scroll', canvas.calcOffset.bind(canvas) # to fix the mouse
    //#position bug issue
  }

  //# do the same for the top
  if ((e.target.top + e.target.currentHeight) > currentCanvasHeight) {
    canvas.setHeight(currentCanvasHeight + 50);
    //$("#wrapper").scrollTop e.target.top
    //$('#wrapper').on 'scroll', canvas.calcOffset.bind(canvas)
  }

  canvas.renderAll();
});


function crear_concepto(texto, x, y) {
  var x = x || 0;
  var y = y || 0;

  var tmp = new fabric.Rect({
    left: 30,
    top: 10,
    ry: 7.5,
    width: 150,
    height: 30,
    strokeWidth: 2,
    radius: 12,
    fill: '#fff',
    stroke: '#666',
    tipo: 'concepto',
    hasControls: false,
  });

  tmp.setShadow({color: 'rgba(0, 0, 0, 0.2)'});
  tmp.shadow.offsetX = 2;
  tmp.shadow.offsetY = 2;
  tmp.shadow.blur = 7.5;

  var texto = new fabric.IText(texto, {
    left: 50,
    top: 15,
    fontSize: 15,
    hasControls: false,
  });

  // ajustando el
  tmp.width = texto.width + 40;

  var circulo = new fabric.Circle({
    left: texto.width + 55,
    top: 21,
    fill: '#eee',
    radius: 5,
  });

  var grupo = new fabric.Group([tmp, texto, circulo], {
    left: x,
    top: y,
    tipo: 'concepto',
    hasControls: false,
  });

  grupo.linea_que_llega = undefined;
  grupo.lineas_que_salen = [];

  return grupo;
}


var concepto_1 = crear_concepto("ejemplo", 0, 150);

var etiqueta_1 = crear_etiqueta("es parte de ...", 100, 100);


function crear_etiqueta(texto, x, y) {
  var x = x || 0;
  var y = y || 0;

  var etiqueta_1 = new fabric.IText(texto, {
    left: x,
    top: y,
    fontSize: 15,
    textBackgroundColor: 'white',
    fill: 'black',
    tipo: 'etiqueta',
    hasControls: false,
  });

  etiqueta_1.linea_que_llega = undefined;
  etiqueta_1.lineas_que_salen = [];

  canvas.add(etiqueta_1);
  return etiqueta_1;
}


function conectar(desde, hasta) {
  var linea = crear_linea();

  desde.lineas_que_salen.push(linea);
  hasta.linea_que_llega = linea;

  canvas.add(linea);
  canvas.sendToBack(linea);

  ajustar_lineas_conectadas(desde);
  ajustar_lineas_conectadas(hasta);
}

function conectar_con_relacion_intermedia(concepto, nuevo_concepto) {
  var x = ((concepto.left + concepto.width/2) + nuevo_concepto.left) / 2;
  var y = (concepto.top + nuevo_concepto.top) / 2;

  var etiqueta = crear_etiqueta('...', x, y);

  conectar(concepto, etiqueta);
  conectar(etiqueta, nuevo_concepto);
}



var concepto_2 = crear_concepto("otra cosa mas...", 0, 0);


conectar(concepto_1, etiqueta_1);
conectar(etiqueta_1, concepto_2);

canvas.add(concepto_1);
canvas.add(concepto_2);
canvas.add(etiqueta_1);


function crear_subitem() {
  var item = canvas.getActiveObject();

  if (!item) {
    alert("hey, no hay un elemento seleccionado.");
    return;
  }

  var nuevo_concepto = crear_concepto("nuevo concepto", item.left + 100, item.top + 100);

  if (item.tipo === 'concepto') {
    conectar_con_relacion_intermedia(item, nuevo_concepto);
  } else {
    // se asume que el item es de tipo 'etiqueta'
    conectar(item, nuevo_concepto);
  }

    canvas.add(nuevo_concepto);
}




function zoom_acercar() {
  canvas.setZoom(canvas.viewport.zoom*1.1);
}

function zoom_alejar() {
  canvas.setZoom(canvas.viewport.zoom*.9);
}

function zoom_reiniciar() {
  canvas.viewport.zoom = 1;
  canvas.setZoom(canvas.viewport.zoom);
}

function definir_modo_paneo(estado) {
  canvas.isGrabMode = estado;
}
