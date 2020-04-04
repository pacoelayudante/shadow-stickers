const fs = require('fs');
const path = require('path');

const orden_afecto = [
    'base_blanco','base_negro',
    'gana_blanco','gana_negro',
    'pierde_blanco','pierde_negro',
];

const dir = './skins_sinnombre/';
fs.readdir(dir,(err,list)=>{
    if (err) {
        console.error(err);
        return;
    }

    list.forEach(file => {
        if (file) {
            let charid = file.replace('_splash','');
            file = dir + file;
            fs.stat(file, (errr,stats)=>{
                if (errr) {
                    console.error(errr);
                    return;
                }
                if (stats && stats.isDirectory()) {
                    fs.readdir(file,(errrr, listPosta)=>{
                        if (errrr) {
                            console.error(errrr);
                            return;
                        }
                        const numeroMasChico = listPosta.map(cada => cada.replace('character avatar','').replace('.png','')*1.0).sort()[0];
                        const dirDest = `./skins/${charid}_splash/`;
                        fs.mkdirSync(dirDest,{recursive:true});
                        // console.log(charid+' '+numeroMasChico);
                        listPosta.forEach(cadaImg=>{
                            const numeroEste = cadaImg.replace('character avatar','').replace('.png','') - numeroMasChico;
                            const destino = `./skins/${charid}_splash/${charid}_${orden_afecto[numeroEste]}.xpng`;
                            fs.copyFile(file+'/'+cadaImg, destino, ()=>{
                                console.log(cadaImg+' -> '+destino);
                            });
                        });
                    });
                }
            });
        }
    });
});