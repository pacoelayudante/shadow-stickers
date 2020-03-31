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

export const GuardarEstiquer = (uriOrigen, paquete) => {    
    const imageFile = uriOrigen.split('/').pop();
    const uriCarpeta = FileSystem.documentDirectory + paquete.identifier;
    const uriArchivo = uriCarpeta + '/' + imageFile;
    return FileSystem.copyAsync({from:uriOrigen,to:uriArchivo})
        .then(()=>imageFile);
};

export const GetTrayIconUri = (paquete) => FileSystem.documentDirectory + paquete.identifier + '/' + paquete.tray_image_file;
export const GetStickerImageUri = (paquete,sticker) => FileSystem.documentDirectory + paquete.identifier + '/' + sticker.image_file;
