import React, { Component } from 'react';
import { View, ScrollView, Text, Image, TouchableHighlight, ImageBackground, TouchableOpacity } from 'react-native';
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
    render() {
        const icono = { uri: GetTrayIconUri(this.props.paquete), width: G.Tamanos.iconoMenor, height: G.Tamanos.iconoMenor };
        const color = this.props.hayWasap ? {} : {backgroundColor:G.Colores.oscuro};

        return (
            <TouchableHighlight style={[G.Estilos.editarPaquete]} onPress={this.props.onClick}>
                <>
                    <Image style={G.Estilos.iconoDeLinea} source={icono} />
                    <Text style={[G.Estilos.textoBase, { flexGrow: 1 }]}>{this.props.paquete.name}</Text>
                    <TouchableOpacity onPress={()=>console.log(this.props.paquete)} style={[G.Estilos.botonConIcono]}><Image style={G.Estilos.iconoContenido} source={G.Img.renombrar} /></TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.props.vincularPaquete(this.props.paquete);}} style={[G.Estilos.botonConIcono,color]}><Image style={G.Estilos.iconoContenido} source={G.Img.vincular} /></TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.props.borrarPaquete(this.props.paquete);}} style={G.Estilos.botonConIcono}><Image style={G.Estilos.iconoContenido} source={G.Img.borrar} /></TouchableOpacity>
                </>
            </TouchableHighlight>
        );
    }
}

export default class MenuStickers extends React.Component {
    render() {
        let paquetesRender = this.props.paquetes.map(paquete => <EditarPaqute key={paquete.identifier} paquete={paquete} vincularPaquete={this.props.vincularPaquete}
            onClick={() => this.props.abrirPaquete(paquete)} borrarPaquete={this.props.borrarPaquete} hayWasap={this.props.hayWasap}/>);
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
