import React, { Component } from 'react';
import { View, ScrollView, Text, Image, TouchableHighlight, ImageBackground, TouchableOpacity, Alert, TextInput } from 'react-native';
import * as G from './Globales';
import LinearGradient from 'react-native-linear-gradient';
import { GetTrayIconUri } from './ManagerDePaquetes';

class NuevoPaquete extends Component {
    render() {
        return (
            <TouchableHighlight onPress={this.props.nuevoPaquete} style={[G.Estilos.editarPaquete, { justifyContent: 'center' }]}><Text style={[G.Estilos.textoIcono,G.Estilos.textoBase]}>+</Text></TouchableHighlight>
        );
    }
}
class EditarPaqute extends Component {
    state = {
        editandoNombre: false,
        nombreEditado: this.props.paquete.name,
    }

    alertStickers = ()=>{
        Alert.alert('Mas estiquers','En el paquete tiene que haber un minimo de tres estiquers\n(3 stickers min in pack)');
    };

    nombreCambiadoFin = ()=>{
        if (this.state.nombreEditado) {
            this.props.paquete.name = this.state.nombreEditado;
            this.props.actualizarPaquete(this.props.paquete);
        }
        this.setState({editandoNombre:false, nombreEditado:this.props.paquete.name});
    };
    nombreCambiando = (cambio)=>{
        this.setState({nombreEditado:cambio});
    }
    editarNombre = ()=>{
        this.setState({editandoNombre:true});
        if (this.inputNombre) this.inputNombre.focus();
    }

    render() {
        const icono = { uri: GetTrayIconUri(this.props.paquete), width: G.Tamanos.iconoMenor, height: G.Tamanos.iconoMenor };
        const color = this.props.hayWasap ? {} : {backgroundColor:G.Colores.oscuro};
        const vincularPaquete = this.props.paquete.stickers.length >= 3 ? ()=>{this.props.vincularPaquete(this.props.paquete);} : this.alertStickers;

        const nombrePaquete = (<TextInput ref={(input)=>{this.inputNombre = input;}} style={[G.Estilos.textoBase, { flexGrow: 1 }]} value={this.state.nombreEditado}
            onChangeText={this.nombreCambiando} onEndEditing={this.nombreCambiadoFin} editable={this.state.editandoNombre}/>);

        return (

            <TouchableHighlight style={[G.Estilos.editarPaquete]} onPress={this.props.onClick}>
                <>
                    <Image style={G.Estilos.iconoDeLinea} source={icono} />
                    {nombrePaquete}
                    <TouchableOpacity onPress={this.editarNombre} style={[G.Estilos.botonConIcono]}><Image style={G.Estilos.iconoContenido} source={G.Img.renombrar} /></TouchableOpacity>
                    <TouchableOpacity onPress={vincularPaquete} style={[G.Estilos.botonConIcono,color]}><Image style={G.Estilos.iconoContenido} source={G.Img.vincular} /></TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.props.borrarPaquete(this.props.paquete);}} style={G.Estilos.botonConIcono}><Image style={G.Estilos.iconoContenido} source={G.Img.borrar} /></TouchableOpacity>
                </>
            </TouchableHighlight>
        );
    }
}

export default class MenuStickers extends React.Component {
    render() {
        let paquetesRender = this.props.paquetes.map(paquete => <EditarPaqute key={paquete.identifier} paquete={paquete} vincularPaquete={this.props.vincularPaquete}
            onClick={() => this.props.abrirPaquete(paquete)} borrarPaquete={this.props.borrarPaquete} hayWasap={this.props.hayWasap} actualizarPaquete={this.props.actualizarPaquete}/>);
        paquetesRender.push(<NuevoPaquete key={null} nuevoPaquete={this.props.nuevoPaquete}/>);

        return (<View style={G.Estilos.programa}>
            <ImageBackground style={G.Estilos.cabezeraBasica} source={G.Img.logo} imageStyle={G.Estilos.imagenContenida} />
            <ScrollView><LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    colors={[G.Colores.negro, G.Colores.oscuro]} style={G.Estilos.listaBasica}>
                {paquetesRender}
            </LinearGradient></ScrollView>
        </View>);
    }
}
