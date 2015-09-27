var path = require('path'),
    mime = require('mime'),
    fs = require('fs'),
    types = [
        /png$/,
        /jpeg$/,
        /jpg$/,
        /bmp$/
    ];

/*
git remote add origin https://github.com/hollowdoor/dom_copy_image.git
git push -u origin master
*/

module.exports = function(file, dest, options){

    if(typeof dest !== 'string' && typeof options === 'undefined'){
        options = dest;
        dest = null;
    }

    options = options || {};
    options.width = options.width || null;
    options.height = options.height || null;
    options.ratio = typeof options.ratio === 'boolean' ? options.ratio : true;
    options.type = options.type || null;
    options.quality = options.quality || 1;
    options.quality = parseFloat(options.quality);

    if(!options.width && options.height)
        options.width = options.height;
    else if(!options.height && options.width)
        options.height = options.width;

    if(!options.type){
        var type = mime.lookup(dest || file);
        for(var i=0; i<types.length; i++){
            if(types[i].test(type)){
                options.type = type;
                break;
            }
        }

        if(!options.type)
            options.type = 'image/png';
        else if('image/jpg' === options.type)
            options.type = 'image/jpeg';
    }

    return new Promise(function(resolve, reject){
        var img = new Image();

        img.onload = function(){
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d'),
                data = {file: file, destination: dest},
                buffer, dataString,
                type = options.type.split('/')[1];

            options.width = options.width || img.width;
            options.height = options.height || img.height;

            if(img.width > img.height){
                img.width *= options.height / img.height;
                img.height = options.height;
            }else{
                img.height *= options.width / img.height;
                img.width = options.width;
            }

            canvas.height = img.height;
            canvas.width = img.width;

            ctx.drawImage(img, 0, 0, img.width, img.height);
            data.dataURL = canvas.toDataURL(options.type, options.quality);

            dataString = data.dataURL.split(',')[1];

            if(!dest){
                return resolve(data);
            }

            try{
                buffer = new Buffer(dataString, 'base64');
            }catch(e){
                reject(e);
            }

            fs.stat(file, function(err, stats){
                if(err)
                    return reject(err);
                fs.writeFile(dest, buffer, {mode: stats.mode}, function(err){
                    if(err)
                        return reject(err);
                    resolve(data);
                });
            });


        };

        img.src = file;
    });


};
