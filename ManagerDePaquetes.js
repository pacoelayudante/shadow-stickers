import * as FileSystem from 'expo-file-system';
const contenedorPaqueteBase = require('./contenedor_paquetes.json');
const archivoContenedorPaquetes = 'content.json';

export const GuardarEstadoContenedor = (contenedor)=>{
    return new Promise((resolve, reject) => {
        const uri = FileSystem.documentDirectory + archivoContenedorPaquetes;
        return FileSystem.writeAsStringAsync(uri, JSON.stringify(contenedor))
            .then(resolve)
            .catch(reject);
    });
};

export const BuscarListaDePaquetes = () => {
    return new Promise((resolve, reject) => {
        return FileSystem.getInfoAsync(FileSystem.documentDirectory + archivoContenedorPaquetes)
            .then(({exists,uri})=>{
                if (exists) {
                    return FileSystem.readAsStringAsync(uri)
                        .then(json=>resolve(JSON.parse(json)));
                }
                else {
                    resolve(contenedorPaqueteBase);
                }
        });
    }).catch(console.error);
};

export const BorrarImagenDeSticker = (paquete,sticker)=>{
    const uri = GetStickerImageUri(paquete,sticker);
    return FileSystem.deleteAsync( uri ).then(()=>console.log(`clean up de ${uri}`));
};

export const BorrarImagenesDePaquete = (paquete)=>{
    const eliminar = paquete.stickers.map(sticker=> GetStickerImageUri(paquete,sticker) );
    eliminar.push( GetTrayIconUri(paquete) );
    console.log(`Borrando ${eliminar.length} imagenes...`);
    return Promise.all( eliminar.map(uri=>FileSystem.deleteAsync(uri).then(()=>console.log(`clean up de ${uri}`)) ));
};

export const GuardarEstiquer = (uriOrigen, paquete, sticker) => {    
    const stickerPrevio = sticker ? GetStickerImageUri(paquete,sticker) : GetTrayIconUri(paquete);
    const imageFile = uriOrigen.split('/').pop();
    const uriCarpeta = FileSystem.documentDirectory + paquete.identifier;
    const uriArchivo = uriCarpeta + '/' + imageFile;
    return FileSystem.copyAsync({from:uriOrigen,to:uriArchivo})
    .then(()=>{
        console.log('clean up -> ' + uriOrigen);
        return FileSystem.deleteAsync(uriOrigen);
    })
    .then(()=>{
        if (stickerPrevio) {
            console.log(`clean up ${sticker ? 'sticker' : 'icono'} previo -> ${stickerPrevio}`);
            return FileSystem.deleteAsync(stickerPrevio);
        }
        else return;
    }).then(()=>imageFile);
};

export const GetTrayIconUri = (paquete) => paquete.tray_image_file ? FileSystem.documentDirectory + paquete.identifier + '/' + paquete.tray_image_file : '';
export const GetStickerImageUri = (paquete,sticker) => sticker.image_file ? FileSystem.documentDirectory + paquete.identifier + '/' + sticker.image_file : '';
export const getFreeDiskStorageAsync = FileSystem.getFreeDiskStorageAsync;
