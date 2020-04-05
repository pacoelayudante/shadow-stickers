import { StyleSheet, Dimensions, PixelRatio } from 'react-native';
import Skins from './dicconarioSkins';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;
const vmin = Math.min(vh,vw);

const Colores = {
    negro: '#000',
    blanco: '#FFF',
    claro: '#00c8c8',
    oscuro: '#002828',
};

const Tamanos = {
    anchoLineaBase: 60,
    iconoMenor: 96,
    sticker: 512,
    stickerLayoutSize: 512 / PixelRatio.get(),
};

const Estilos = StyleSheet.create({
    programa: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        backgroundColor: Colores.oscuro,
    },
    textoBase: {
        fontWeight: '900',
        color: Colores.claro,
    },
    textoIcono: {
        fontSize: 40,
        color: Colores.oscuro,
    },
    cabezeraBasica: {
        height: Tamanos.anchoLineaBase * 1.2,
        flexShrink: 0,
        backgroundColor: Colores.claro,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: Tamanos.anchoLineaBase * 0.2,
        resizeMode:'contain',
        flexDirection: 'row',
    },
    imagenContenida: {
        height: '100%',
        resizeMode: 'contain',
        marginVertical: Tamanos.anchoLineaBase * 0.2,
    },
    listaBasica: {
        // backgroundColor: Colores.negro,
        flexGrow: 1,
        color: Colores.claro,
    },
    editarPaquete: {
        height: Tamanos.anchoLineaBase,
        borderBottomWidth: 2,
        borderBottomColor: Colores.oscuro,
        paddingVertical: 0,
        paddingHorizontal: 15,
        alignItems: 'center',
        flexDirection: 'row',
    },
    botonConIcono: {
        flexGrow: 0,
        marginHorizontal: 5,
        backgroundColor: Colores.claro,
        flexBasis: Tamanos.anchoLineaBase * 0.5,
        height: Tamanos.anchoLineaBase * 0.5,
        borderRadius: 5,
        padding: 3,
    },
    iconoContenido: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    iconoDeLinea: {
        flexGrow: 0,
        marginHorizontal: 10,
        flexBasis: Tamanos.anchoLineaBase * 0.5,
        height: Tamanos.anchoLineaBase * 0.5,
        resizeMode: 'contain',
    },
    listaStickers: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },
    editarSticker: {
        flexBasis: 0.5 * vmin - 10,
        minHeight: 0.5 * vmin - 10,
        maxHeight: 0.5 * vmin + 10,
        margin: 5,
        borderWidth: 1,
        borderColor: Colores.claro,
    },
    editarStickerSub: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 3,
    },
    editarStickerImage: {
        resizeMode: 'contain',
        height: 0.5 * vmin - 10,
    },
    editarStickerAgregar: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    emojisInput:{
        flexGrow: 1,
        padding: 0,
        paddingHorizontal: 5,
        backgroundColor: Colores.claro + '60',
        borderRadius: 6,
    },
    selectorPj:{
        flexGrow: 1,
        backgroundColor: Colores.oscuro,
        color: Colores.claro,
        margin: 3,
    },
    selectorColor:{
        height:'100%',
        borderWidth: 2,
        borderRadius: 9,
    },
    contenedorDibujo:{
        flexGrow: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    estiloCanvas:{
        width: Tamanos.stickerLayoutSize,
        height: Tamanos.stickerLayoutSize,
        backgroundColor: Colores.oscuro,
    },
    sliderZoom:{
        height: Tamanos.anchoLineaBase,
        flexDirection: 'row',
    },
    colorPicker:{
        flex : 1,        
    },
    contenedorDeEditarColor:{
        flexDirection: 'column',
        flexBasis: Tamanos.anchoLineaBase * 1.5,
    },
    miniMostrarColor:{
        flexGrow: 1,
        margin: 3,  
        borderRadius: 3,
    },
});

const Transforms = {};
Transforms.escalaCanvas = {scale:Math.min(vw - 60 * 0.5,vh - 60 * 3.0) / Tamanos.stickerLayoutSize};
Transforms.canvasCorreccionTranslate = {translateY: Tamanos.stickerLayoutSize * 0.5 * 0.0};

const Img = {
    logo: require('./icono.png'),
    borrar: require('./borrar.png'),
    renombrar: require('./renombrar.png'),
    vincular: require('./vincular.png'),
    zoom: require('./zoom.png'),
    Skins: Skins,
};

export { Colores, Tamanos, Estilos, Img, Transforms };
