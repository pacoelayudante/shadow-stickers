import * as FileSystem from 'expo-file-system';
// import { FileSystem } from 'react-native-unimodules';
// const prefijoPaquetes = 'paquete_';
// const extensionPaquetes = '.json';
const contenedorPaqueteBase = require('./contenedor_paquetes.json');
const archivoContenedorPaquetes = 'content.json';

// export const BorrarPaquete = (paquete) => {
//     return new Promise((resolve, reject) => {
//         const uri = FileSystem.documentDirectory + prefijoPaquetes + paquete.identifier + extensionPaquetes;
//         return FileSystem.deleteAsync(uri)
//             .then(resolve)
//             .catch(reject);
//     });
// }

// export const GuardarPaquete = (paquete) => {
//     return new Promise((resolve, reject) => {
//         const uri = FileSystem.documentDirectory + prefijoPaquetes + paquete.identifier + extensionPaquetes;
//         return FileSystem.writeAsStringAsync(uri, JSON.stringify(paquete))
//             .then(resolve)
//             .catch(reject);
//     });
// };

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
// export const BuscarListaDePaquetes = () => {
//     return new Promise((resolve, reject) => {
//         return FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
//             .then(resultado => Promise.all(resultado
//                 .filter(archivo => archivo.startsWith(prefijoPaquetes) && archivo.endsWith(extensionPaquetes))
//                 .map(archivo => FileSystem.getInfoAsync(FileSystem.documentDirectory + archivo))
//             ))
//             .then(lasInfos => Promise.all(lasInfos
//                 .filter(estaInfo => !estaInfo.isDirectory)
//                 .map(estaInfo => FileSystem.readAsStringAsync(estaInfo.uri))
//             ))
//             .then(losStrings => {
//                 resolve(losStrings.map(estaString => JSON.parse(estaString)));
//             })
//             .catch(reject);
//     });
// };
