import React, { Component } from 'react';
import { View, ScrollView, Text, Button, TextInput, ImageBackground, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import * as G from './Globales';
import LinearGradient from 'react-native-linear-gradient';
import { GetTrayIconUri, GetStickerImageUri } from './ManagerDePaquetes';

const regexEmoji = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g;
const soloEmojis = (texto) => {
    if (!texto) {
        return '';
    }
    const resultado = texto.match(regexEmoji);
    if (!resultado) {
        return '';
    }
    return resultado.slice(0, 3);//.join('');// 3 es el limite de emojis
};

// const generarTrayIcon = (sticker, callback) => {
//     const canvas = document.createElement('canvas');
//     canvas.width = canvas.height = 96;
//     const ctx = canvas.getContext('2d');
//     const img = new Image();
//     img.addEventListener('load', () => {
//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
//         callback(canvas.toDataURL('image/png'));
//     }, false);
//     img.src = sticker.image_file;
// };

class NuevoSticker extends Component {
    render() {
        return (
            <TouchableHighlight onPress={this.props.nuevoSticker} style={[G.Estilos.editarSticker, G.Estilos.editarStickerAgregar]}><Text style={[G.Estilos.textoIcono,G.Estilos.textoBase]}>+</Text></TouchableHighlight>
        );
    }
}

class EditarSticker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emojis: props.sticker.emojis && props.sticker.emojis.join ? props.sticker.emojis.join('') : '',
        }
        this.onChangeEmojis = this.onChangeEmojis.bind(this);
    }

    onChangeEmojis = (nuevoTexto) => {
        // ev.target.value = soloEmojis(ev.target.value);
        nuevoTexto = soloEmojis(nuevoTexto);
        if (nuevoTexto.join) nuevoTexto = nuevoTexto.join('');
        this.setState({ emojis: nuevoTexto });
    }
    onEndEditing = ()=>{
        this.props.sticker.emojis = soloEmojis(this.state.emojis);
        this.props.actualizar();
    }

    componentWillUnmount() {
        if (this.state.emojis) {
            this.props.sticker.emojis = this.state.emojis.split('');
        }
    }

    render() {
        const uri = GetStickerImageUri(this.props.paquete,this.props.sticker);
        const sticker = { uri: uri, width: G.Tamanos.iconoMenor, height: G.Tamanos.iconoMenor };
        // const sticker = { uri: this.props.sticker.image_file, width: G.Tamanos.sticker, height: G.Tamanos.sticker };

        return (
            <TouchableHighlight onPress={() => this.props.abrirSticker(this.props.sticker)} style={G.Estilos.editarSticker}>
                <ImageBackground style={[G.Estilos.editarStickerSub]} imageStyle={G.Estilos.editarStickerImage} onClick={() => this.props.abrirSticker(this.props.sticker)} source={sticker}>
                    <TextInput value={this.state.emojis} style={G.Estilos.emojisInput} onChangeText={this.onChangeEmojis} onEndEditing={this.onEndEditing}/>
                    <Button title="X" onPress={(ev) => { this.props.borrarSticker(this.props.sticker); }} />
                </ImageBackground>
            </TouchableHighlight>
        );
    }
}

export default class EditorPaquete extends React.Component {
    onBorrarSticker = (stickerBorrado) => {
        this.props.paquete.stickers = this.props.paquete.stickers.filter(stick => stick !== stickerBorrado);
        this.forceUpdate();
    };

    render() {
        const paquete = this.props.paquete;
        const icono = { uri: GetTrayIconUri(this.props.paquete), width: G.Tamanos.iconoMenor, height: G.Tamanos.iconoMenor };
        // const icono = { uri: this.props.paquete.tray_image_file, width: G.Tamanos.iconoMenor, height: G.Tamanos.iconoMenor };

        let stickersRender = this.props.paquete.stickers.map(sticker => <EditarSticker key={sticker.image_file} sticker={sticker} paquete={paquete} borrarSticker={this.onBorrarSticker} abrirSticker={this.props.abrirSticker} actualizar={()=>this.props.actualizarPaquete(this.props.paquete)}/>);
        stickersRender.push(<NuevoSticker key={null} nuevoSticker={this.props.nuevoSticker}/>);

        return (
            <View style={G.Estilos.programa}>
                <ImageBackground style={[G.Estilos.cabezeraBasica]} imageStyle={G.Estilos.imagenContenida} source={icono}>
                    <TouchableOpacity onPress={() => this.props.abrirPaquete(null)}><Text style={[G.Estilos.textoIcono]}>↶</Text></TouchableOpacity>
                </ImageBackground>
                <ScrollView><LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        colors={[G.Colores.negro, G.Colores.oscuro]} style={[G.Estilos.listaBasica, G.Estilos.listaStickers]}>
                    {stickersRender}
                </LinearGradient></ScrollView>
            </View>);
    }
}
