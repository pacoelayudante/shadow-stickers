const fs = require('fs');
const path = require('path');
const walk = function (dir, done) {
    let results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        let i = 0;
        (function next() {
            let file = list[i++];
            if (!file) return done(null, results);
            // file = path.resolve(dir, file);
            file = dir+'/'+file;
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
};

walk('./skins', function (err, results) {
    if (err) throw err;
    let gen = "export default {";
    for(let cada in results) gen += `'${results[cada]}':require('${results[cada]}'),`;
    gen += "}";
    console.log(gen);
    fs.writeFileSync('dicconarioSkins.js',gen);
});