import * as Compile from './compile.js';

var compile = Compile.compile;

function compileDocument(replaceTag=true) {
    let eles = document.getElementsByTagName('lineup');
    for (var i = 0; i < eles.length; i++) {  //遍历数组
        let ele = eles[i];
        ele.style.display = 'none';
        let code = ele.innerHTML;
        code = compile(code);
        ele.innerHTML = code;
        ele.style.display = 'block';
        if(!replaceTag) return;
        ele.outerHTML = ele.outerHTML
                        .replace('<lineup', '<div')
                        .replace(/(.*)\<\/lineup\>/,'</div>');
    }
}

function compileHTML(code, head='<meta charset="utf-8">') {
    let code = compile(code);
    let htmlcode = `
<!DOCTYPE html>
<html>
    <head>
        ${head}
    </head>
    <body>
        ${code}
    </body>
</html>
`;
    return htmlcode;
} 

function compileXML(code, head='<?xml version="1.0" encoding="utf-8"?>') {
    let code = compile(code);
    let xmlcode = `
${head}
${code}
`;
    return xmlcode
}

export {
    compile,
    compileDocument,
    compileHTML,
    compileXML,
}