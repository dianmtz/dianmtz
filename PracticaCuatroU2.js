let video = document.getElementById("video");
let model;
//Referencia de canvas en HTML
let canvas = document.getElementById("canvas");
//INDICAMMOS CONTEXTO 2D
let ctx = canvas.getContext("2d");
//Funcion para utilizar HW de la maquina o sease la camara
const camara = () =>{
    //Invocamos el uso de la camara
    navigator.mediaDevices
    .getUserMedia({
//Resolucion del video
video: {width: 500, height:500},
//No utilizamos el audio
audio:false,
    })
    //Capturamos los frames
    .then((stream) =>{
        //Cada frame debe plasmarse en el canvas
        video.srcObject = stream;
    });
};
//Eventos asincronos siempre que usemos micro, camara, etc.
const detecFaces = async() =>{
    //Regresamos algo
    //Valores obtenidos para la prediccion
    const prediccion = await model.estimateFaces(video, false);
    //Imprimimos un arreglo (todo en tensorflow es un arreglo)
    console.log(prediccion);

    //En canvas ponemos el video donde detectamos el rostro
    ctx.drawImage(video,0,0,500,500);

    prediccion.forEach((pred) => {
        
        //Obtenemos la region de interes (unicamente cara)
        ctx.beginPath(); //Comenzamos a dibujar
        ctx.lineWidth = "4";
        ctx.strokeStyle = "#fff";
        ctx.rect(//Indicamos que deseamos dibujar el rectangulo
        pred.topLeft[0],
        pred.topLeft[1],
        pred.bottomRight[0] - pred.topLeft[0],
        pred.bottomRight[1] - pred.topLeft[1]
        );
        ctx.stroke(); //Terminamos de delimitar el rectangulo
        // A partir de los patrones de una cara, detectamos con marca
        ctx.fillStyle = "blue";
        pred.landmarks.forEach((landmark)=>{

            ctx.fillRect(landmark[0], landmark[1], 5, 5);
        });

    });
};

camara();
video.addEventListener("loadeddata", async () => {
model = await blazeface.load();
//call detect faces every 100 miliseconds or 10 times every second
setInterval(detecFaces, 100)
});
