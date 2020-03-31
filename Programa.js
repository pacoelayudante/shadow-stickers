import React from 'react';
import EditorPaquete from './EditorPaquete';
import CreadorDeSticker from './CreadorDeSticker';
import MenuStickers from './MenuStickers';
import { GuardarEstadoContenedor, BuscarListaDePaquetes, BorrarImagenesDePaquete, getFreeDiskStorageAsync } from './ManagerDePaquetes';

import PaqueteTemplate from './paquete_template.json';
import RNWhatsAppStickers from 'react-native-whatsapp-stickers';

export default class Programa extends React.Component {
    state = {
        contenedor: {sticker_packs:[]},
        paqueteEditado: -1,
        stickerEditado: -1,
        wasapSupported: false,
    };

    componentDidMount() {
        BuscarListaDePaquetes().then(contenedor=>this.setState({contenedor:contenedor})).catch(console.error);
        
        RNWhatsAppStickers.isWhatsAppAvailable()
            .then(isWhatsAppAvailable => this.setState({wasapSupported:isWhatsAppAvailable}))
            .catch(console.error);
    }

    nuevoPaquete = ()=>{
        const nuevo = JSON.parse( JSON.stringify(PaqueteTemplate) );
        const contenedor = this.state.contenedor;
        const todosLosPaquetes = contenedor.sticker_packs;
        const todosIdentifiers = todosLosPaquetes.map(paquete=>paquete.identifier);
        for (let i = 0; i <= todosIdentifiers.length; i++) {
            nuevo.identifier = 'shadowsticker_' + i;
            if ( !todosIdentifiers.some(ids=>ids === nuevo.identifier)) break;
        }
        todosLosPaquetes.push(nuevo);
        nuevo.name = 'Shadow Brawlers ' + todosLosPaquetes.length;
        nuevo.tray_image_file = '';
        this.setState({
            contenedor: contenedor,
            paqueteEditado: todosLosPaquetes.length - 1,
            stickerEditado: 0,
        });
        GuardarEstadoContenedor(contenedor).catch(console.log);
    };
    
    nuevoSticker = ()=>{
        const contenedor = this.state.contenedor;
        const stickersPaquete = contenedor.sticker_packs[ this.state.paqueteEditado ].stickers;
        const nuevo = JSON.parse( JSON.stringify(stickersPaquete[stickersPaquete.length - 1]) );
        nuevo.image_file = '';
        stickersPaquete.push(nuevo);
        this.setState({
            contenedor: contenedor,
            stickerEditado: stickersPaquete.length - 1,
        });
    };

    abrirPaquete = (paquete)=>{
        const contenedor = this.state.contenedor;
        const paqueteId = paquete ? contenedor.sticker_packs.indexOf(paquete) : -1;
        const actual = { paqueteEditado: paqueteId, stickerEditado: -1 };
        this.setState(actual);
    };

    abrirSticker = (sticker)=>{
        const contenedor = this.state.contenedor;
        const stickerId = sticker ? contenedor.sticker_packs[this.state.paqueteEditado].stickers.indexOf(sticker) : -1;
        let actual = { stickerEditado: stickerId };
        this.setState(actual);
    };

    actualizarPaquete = (paquete)=>{
        const contenedor = this.state.contenedor;
        GuardarEstadoContenedor(contenedor).catch(console.error);
        this.setState({
            contenedor: contenedor,
        });
    };

    borrarPaquete = (paquete)=>{
        const contenedor = this.state.contenedor;
        const todosLosPaquetes = contenedor.sticker_packs.filter(cada=>cada !== paquete);
        contenedor.sticker_packs = todosLosPaquetes;
        BorrarImagenesDePaquete(paquete).catch(console.error);
        GuardarEstadoContenedor(contenedor).catch(console.error);
        this.setState({
            contenedor: contenedor,
        });
    }

    vincularPaquete = (paquete)=>{
        console.log(paquete);
        console.log(this.state.contenedor);
        paquete.image_data_version = ((paquete.image_data_version * 1.0) + 1.0) + '';
        console.log('aumentar version ' + paquete.image_data_version);
        console.log('vincular ' + paquete.name);
        RNWhatsAppStickers.send(paquete.identifier, paquete.name)
            .then(() => console.log('success'))
            .catch(e => console.log(e));
        this.actualizarPaquete(paquete);
    };

    render() {
        const paquetes = this.state.contenedor.sticker_packs;
        const estePaquete = this.state.paqueteEditado === -1 ? null : paquetes[this.state.paqueteEditado];
        const esteSticker = this.state.stickerEditado === -1 ? null : estePaquete.stickers[this.state.stickerEditado];

        let renderEsto = (<MenuStickers paquetes={paquetes} abrirPaquete={this.abrirPaquete} vincularPaquete={this.vincularPaquete}
            hayWasap={this.state.wasapSupported}
            nuevoPaquete={this.nuevoPaquete} borrarPaquete={this.borrarPaquete} actualizarPaquete={this.actualizarPaquete}/>);
        if (esteSticker) {
            renderEsto = (<CreadorDeSticker sticker={esteSticker} paquete={estePaquete} abrirSticker={this.abrirSticker} actualizarPaquete={this.actualizarPaquete}/>);
        }
        else if (estePaquete) {
            renderEsto = (<EditorPaquete paquete={estePaquete} abrirPaquete={this.abrirPaquete}
                    abrirSticker={this.abrirSticker} nuevoSticker={this.nuevoSticker} actualizarPaquete={this.actualizarPaquete}/>);
        }

        return (
            <>{renderEsto}</>
        );
    }
}
