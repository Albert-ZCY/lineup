import * as Compile from './compile.js';

var compile = Compile.compile;

function compileDocument() {
    let eles = document.getElementsByTagName('markup');
    for (var i = 0; i < eles.length; i++) {  //遍历数组
        let ele = eles[i];
        let code = ele.innerHTML;
        code = compile(code);
        ele.innerHTML = code;
    }
}

export {
    compile,
    compileDocument,
}