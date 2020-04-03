import React from 'react';
import { View, Image, TouchableOpacity, Text, Picker, Switch, PanResponder, Button } from 'react-native';
import * as G from './Globales';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
import { ColorPicker, toHsv, fromHsv } from 'react-native-color-picker';
import { GuardarEstiquer } from './ManagerDePaquetes';
import { GLView } from 'expo-gl';
import { Asset } from 'react-native-unimodules';
// import './overrideRemoteImageResolver';

const pjs = ['demonhead', 'shadowsis', 'shaman', 'witch'];
const variantes = ['base', 'gana', 'pierde'];
const colores = ['blanco', 'negro'];
const maxZoom = 10.0;

const generarStringImagen = function (pj, variante, color) {
    return `./skins/${pj}_splash/${pj}_${variante}_${color}.png`;
};

const fragmentShaderSrc = `
precision mediump float;

varying vec4 texcoord;
uniform sampler2D texturaFondo;
uniform sampler2D texturaDetalle;
// uniform sampler2D noise;
uniform vec3 colorFondo;
uniform vec3 colorDetalle;
uniform vec4 ventanaPos;

void main() {
    float alfaFondo = texture2D(texturaFondo, texcoord.xy).a;
    float alfaDetalle = texture2D(texturaDetalle, texcoord.xy).a;

    vec3 color = mix( mix(colorDetalle, colorFondo, alfaFondo) ,colorDetalle,alfaDetalle);
    gl_FragColor = vec4( color, alfaFondo+alfaDetalle );
}
`;
const vertexShaderSrc = `
precision mediump float;
attribute vec4 position;   
attribute vec2 texcoordIn; 
uniform vec4 ventanaPos;

varying vec4 texcoord;

void main () {
  gl_Position = position;
  texcoord = vec4( ventanaPos.x+position.x*ventanaPos.z , ventanaPos.y-position.y*ventanaPos.w,ventanaPos.z,ventanaPos.w);
}
`;

const unitQuad = [
    -1, -1,
    -1, 1,
    1, -1,
    1, -1,
    -1, 1,
    1, 1,
];
const texQuad = [
    0, 1,
    0, 0,
    1, 1,
    1, 1,
    0, 0,
    1, 0,
];

let gl;
let imagenData = [];
let texturas = [];
let zoom = 1;
let offX = G.Tamanos.sticker / 2.0;
let offY = G.Tamanos.sticker / 2.0;
let colorFondo = [255.0, 255.0, 255.0], colorDetalle = [0.0, 0.0, 0.0];

let texCoordBuffer, vertexPosBuffer;
let ventanaLocation, colorFondoLoc, colorDetalleLoc;

const iniciarTexturasYBuffers = function (program) {
    const positionLocation = gl.getAttribLocation(program, 'position');
    const texcoordLocation = gl.getAttribLocation(program, 'texcoordIn');
    ventanaLocation = gl.getUniformLocation(program, 'ventanaPos');
    colorFondoLoc = gl.getUniformLocation(program, 'colorFondo');
    colorDetalleLoc = gl.getUniformLocation(program, 'colorDetalle');

    texturas.length = 0;
    [gl.TEXTURE0, gl.TEXTURE1].forEach((gltexpoint, indice) => {
        texturas.push(gl.createTexture(gl.TEXTURE_2D));
        gl.activeTexture(gltexpoint);
        gl.bindTexture(gl.TEXTURE_2D, texturas[indice]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        if (imagenData[indice]) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagenData[indice]);
        }

    });

    // set which texture units to render with.
    gl.uniform1i(gl.getUniformLocation(program, 'texturaFondo'), 0);  // texture unit 0
    gl.uniform1i(gl.getUniformLocation(program, 'texturaDetalle'), 1);  // texture unit 1
    // gl.uniform1i(gl.getUniformLocation(program, "noise"), 2);  // texture unit 1

    gl.enableVertexAttribArray(texcoordLocation);
    texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texQuad), gl.STATIC_DRAW);
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);

    gl.enableVertexAttribArray(positionLocation);
    vertexPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unitQuad), gl.STATIC_DRAW);
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

    actualizarImagen();
};

const createContext = (initGL) => {
    if (gl) return;//Ya fue creado
    gl = initGL;

    gl.viewport(0, 0, G.Tamanos.sticker, G.Tamanos.sticker);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSrc);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSrc);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    gl.useProgram(program);

    iniciarTexturasYBuffers(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var info = gl.getProgramInfoLog(program);
        throw new Error('Could not compile WebGL program. \n\n' + info);
    }

    actualizarImagen();
};

const actualizarImagen = function () {
    if (gl && imagenData[0] && imagenData[1]) {
        //offX = Math.min( Math.max ( offX , 0.5/(zoom * imgBlanca.width) ) );
        //offY = Math.min( Math.max ( offX , 0.5/(zoom * imgBlanca.width) ) );
        const expanseX = 0.5 * Math.max(1, imagenData[0].height / imagenData[0].width) / zoom;
        const expanseY = 0.5 * Math.max(1, imagenData[0].width / imagenData[0].height) / zoom;
        const posX = offX / (G.Tamanos.sticker);
        const posY = offY / (G.Tamanos.sticker);

        gl.clearColor(0, 0, 0, 0);
        gl.uniform4f(ventanaLocation, posX, posY, expanseX, expanseY);
        gl.uniform3f(colorFondoLoc, colorFondo[0] / 255.0, colorFondo[1] / 255.0, colorFondo[2] / 255.0);
        gl.uniform3f(colorDetalleLoc, colorDetalle[0] / 255.0, colorDetalle[1] / 255.0, colorDetalle[2] / 255.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        // gl.flush();
        gl.endFrameEXP();
    }
};

const cargarPersonaje = function (pj, variante, index) {
    if (index === undefined) index = 0;
    if (index >= colores.length) {
        if (gl) actualizarImagen();
        return;
    }
    const kinAsset = G.Img.Skins[generarStringImagen(pj, variante, colores[index])];
    const assetFromMod = Asset.fromModule(kinAsset);
    assetFromMod.downloadAsync().then(() => {
            imagenData[index] = assetFromMod;
            console.log(assetFromMod);
            // imagenData[index] = Image.resolveAssetSource(kinAsset);
            // imagenData[index].localUri = imagenData[index].uri;
            if (gl) {
                gl.activeTexture([gl.TEXTURE0, gl.TEXTURE1][index]);
                gl.bindTexture(gl.TEXTURE_2D, texturas[index]);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagenData[index]);
            }
            cargarPersonaje(pj, variante, index + 1);
        })
        .catch(console.error);

};

export default class CreadorDeSticker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zoom: this.props.sticker.zoom ? this.props.sticker.zoom : 1.0,
            pjActual: this.props.sticker.personaje ? this.props.sticker.personaje : pjs[0],
            varianteActual: this.props.sticker.actitud ? this.props.sticker.actitud : variantes[0],
            editarColor: false,
            editandoFondo: true,
            colorFondo: this.props.sticker.col1 ? this.props.sticker.col1 : '#FFFFFF',
            colorDetalle: this.props.sticker.col2 ? this.props.sticker.col2 : '#000000',
            colorInicial: this.props.sticker.col1 ? this.props.sticker.col1 : '#FFFFFF',
            hsv: toHsv('white'),
        };

        colorFondo = this.state.colorFondo.match(/[A-Za-z0-9]{2}/g).map(function (v) { return parseInt(v, 16); });
        colorDetalle = this.state.colorDetalle.match(/[A-Za-z0-9]{2}/g).map(function (v) { return parseInt(v, 16); });
        if (this.props.sticker.offX) offX = this.props.sticker.offX;
        if (this.props.sticker.offY) offY = this.props.sticker.offY;
        if (this.props.sticker.zoom) zoom = this.props.sticker.zoom;

        cargarPersonaje(this.state.pjActual, this.state.varianteActual);

        this.offXInit = offX;
        this.offYInit = offY;
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                this.offXInit = offX;
                this.offYInit = offY;
            },
            onPanResponderMove: (evt, gestureState) => {
                offX = this.offXInit - gestureState.dx / this.state.zoom;
                offY = this.offYInit - gestureState.dy / this.state.zoom;
                actualizarImagen();
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => { },
            onPanResponderTerminate: (evt, gestureState) => { },
            onShouldBlockNativeResponder: (evt, gestureState) => true,
        });
    }

    onZoom = (ev) => {
        zoom = ev;
        this.setState({ zoom: zoom });
        actualizarImagen();
    };
    activarEditarColores = (editar, editarColorFondo) => {
        const nuevoEstado = { editarColor: editar };
        nuevoEstado.colorInicial = this.state.editandoFondo ? this.state.colorFondo : this.state.colorDetalle;
        if (editarColorFondo !== undefined) {
            nuevoEstado.editandoFondo = editarColorFondo;
            nuevoEstado.colorInicial = (editarColorFondo ? this.state.colorFondo : this.state.colorDetalle);
        }
        nuevoEstado.hsv = toHsv(nuevoEstado.colorInicial);
        this.setState(nuevoEstado);
    }
    cambiarColor = (hsv) => {
        const nuevoColor = fromHsv(hsv);
        if (this.state.editandoFondo) {
            this.setState({ colorFondo: nuevoColor, hsv:hsv });
            colorFondo = nuevoColor.match(/[A-Za-z0-9]{2}/g).map(function (v) { return parseInt(v, 16); });
        }
        else {
            this.setState({ colorDetalle: nuevoColor, hsv:hsv });
            colorDetalle = nuevoColor.match(/[A-Za-z0-9]{2}/g).map(function (v) { return parseInt(v, 16); });
        }
        actualizarImagen();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.pjActual !== this.state.pjActual || prevState.varianteActual !== this.state.varianteActual) {
            cargarPersonaje(this.state.pjActual, this.state.varianteActual);
        }
    }
    guardarYVolver = () => {
        const paquete = this.props.paquete;
        const sticker = this.props.sticker;
        const glYa = gl;
        GLView.takeSnapshotAsync(glYa, { format: 'webp' })
            .then(({ uri, localUri, width, height }) => {
                sticker.offX = offX;
                sticker.offY = offY;
                sticker.zoom = zoom;
                sticker.col1 = this.state.colorFondo;
                sticker.col2 = this.state.colorDetalle;
                sticker.personaje = this.state.pjActual;
                sticker.actitud = this.state.varianteActual;
                return GuardarEstiquer(localUri,paquete,sticker);
            }).then((nuevoUri)=>{
                sticker.image_file = nuevoUri;
                return paquete.stickers[0] === sticker;
            }).then((dibujarTrayIcon) => {
                if ( !dibujarTrayIcon ) return {uri:null,localUri:null,width:0,height:0};
                const offx = 0;
                const offy = 0;
                glYa.viewport(0,0,G.Tamanos.iconoMenor,G.Tamanos.iconoMenor);
                actualizarImagen();
                return GLView.takeSnapshotAsync(glYa, { format: 'png', rect: { x: offx, y: offy, width: G.Tamanos.iconoMenor, height: G.Tamanos.iconoMenor } });
            }).then(({ uri, localUri, width, height }) => {
                if (localUri === null) return null;
                return GuardarEstiquer(localUri,paquete);
            }).then((nuevoUri)=>{
                if (nuevoUri !== null) paquete.tray_image_file = nuevoUri;
                this.props.actualizarPaquete(paquete);
                this.props.abrirSticker(null);
                // return nuevoUri;
            }).catch(console.error);
    }
    componentWillUnmount(){
        gl = null;
    }

    render() {
        const pjsRender = pjs.map(pj => <Picker.Item key={pj} label={pj} value={pj} />);
        const variantesRender = variantes.map(variante => <Picker.Item key={variante} label={variante} value={variante} />);

        const borderSelectedColor = this.state.editandoFondo ? this.state.colorDetalle : this.state.colorFondo;
        const colorSelected = this.state.hsv;//this.state.editandoFondo ? this.state.colorFondo : this.state.colorDetalle;
        const transformsCanvas = [G.Transforms.escalaCanvas];
        if (this.state.editarColor) transformsCanvas.unshift(G.Transforms.canvasCorreccionTranslate);

        return (
            <View style={G.Estilos.programa}>
                <View style={[G.Estilos.cabezeraBasica]} imageStyle={G.Estilos.imagenContenida}>
                    <TouchableOpacity onPress={this.guardarYVolver}><Text style={[G.Estilos.textoIcono]}>↶</Text></TouchableOpacity>
                    {!this.state.editarColor && (<><Picker mode="dropdown" style={G.Estilos.selectorPj} selectedValue={this.state.pjActual}
                        onValueChange={(val) => this.setState({ pjActual: val })} >{pjsRender}</Picker>
                        <Picker mode="dropdown" style={G.Estilos.selectorPj} selectedValue={this.state.varianteActual}
                            onValueChange={(val) => this.setState({ varianteActual: val })} >{variantesRender}</Picker></>)}
                    {this.state.editarColor && (<><TouchableOpacity onPress={() => this.activarEditarColores(true, true)} style={[G.Estilos.selectorPj, G.Estilos.selectorColor, { backgroundColor: this.state.colorFondo, borderColor: borderSelectedColor }]} />
                        <TouchableOpacity onPress={() => this.activarEditarColores(true, false)} style={[G.Estilos.selectorPj, G.Estilos.selectorColor, { backgroundColor: this.state.colorDetalle, borderColor: borderSelectedColor }]} /></>)}
                    <Switch thumbColor={G.Colores.oscuro}
                        value={this.state.editarColor} onValueChange={(val) => this.activarEditarColores(val)} />
                </View>
                <LinearGradient {...this._panResponder.panHandlers} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    colors={[G.Colores.negro, G.Colores.oscuro]} style={[G.Estilos.contenedorDibujo]}>
                    <GLView style={G.Estilos.estiloCanvas} transform={transformsCanvas} onContextCreate={createContext} />
                </LinearGradient>
                {this.state.editarColor && <ColorPicker color={colorSelected} oldColor={this.state.colorInicial} onColorChange={this.cambiarColor} sliderComponent={Slider} style={G.Estilos.colorPicker} />}
                {!this.state.editarColor && <Slider style={G.Estilos.sliderZoom} onValueChange={this.onZoom} minimumValue={1.0} maximumValue={maxZoom} value={this.state.zoom} />}
            </View>
        );
    }
}
