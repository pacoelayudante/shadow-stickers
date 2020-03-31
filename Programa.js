import React from 'react';
import EditorPaquete from './EditorPaquete';
import CreadorDeSticker from './CreadorDeSticker';
import MenuStickers from './MenuStickers';
import { GuardarEstadoContenedor, BuscarListaDePaquetes } from './ManagerDePaquetes';

import PaqueteTemplate from './paquete_template.json';
// import RNWhatsAppStickers from 'react-native-whatsapp-stickers';

export default class Programa extends React.Component {
    state = {
        contenedor: {sticker_packs:[]},
        paqueteEditado: -1,
        stickerEditado: -1,
    };

    componentDidMount() {
        BuscarListaDePaquetes().then(contenedor=>this.setState({contenedor:contenedor})).catch(console.error);
    }

    nuevoPaquete = ()=>{
        const nuevo = JSON.parse( JSON.stringify(PaqueteTemplate) );
        const contenedor = this.state.contenedor;
        const todosLosPaquetes = contenedor.sticker_packs;
        nuevo.identifier = 'shadowsticker_' + todosLosPaquetes.length;
        todosLosPaquetes.push(nuevo);
        nuevo.name = 'Shadow Brawlers ' + todosLosPaquetes.length;
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
        GuardarEstadoContenedor(contenedor).catch(console.error);
        this.setState({
            contenedor: contenedor,
        });
    }

    vincularPaquete = (paquete)=>{

    };

    render() {
        const paquetes = this.state.contenedor.sticker_packs;
        const estePaquete = this.state.paqueteEditado === -1 ? null : paquetes[this.state.paqueteEditado];
        const esteSticker = this.state.stickerEditado === -1 ? null : estePaquete.stickers[this.state.stickerEditado];

        let renderEsto = (<MenuStickers paquetes={paquetes} abrirPaquete={this.abrirPaquete} vincularPaquete={this.vincularPaquete}
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
