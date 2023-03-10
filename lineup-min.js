/* automatically linked by link.py */
// Const Define
// by Albert Z
// ordinary element: [sym]([args]) [content]
const ordinaryElementRE = /(\s*)(.*?)\((.*?)\)\s+(.*)/;
// inline element: { [element defination] }
const inlineElementRE = /(?<!\\){(.*?)(?<!\\)}/;
const quoteRE = /^(\s|"|')+|(\s|"|')+$/g;
const ordinaryElements = {
    '@': 'a',
    '#': 'h',
    '!': 'img',
    '+': 'br',
    '-': 'hr',
    'bold': 'b',
    'italic': 'i',
    'under': 'u',
    'cell': 'td',
    'row': 'tr',
    'headcell': 'th',
};
const notSupportedElements = [];
const ordinaryElementsDefault = {
    '#': 'size',
    '@': 'link',
    '!': 'link',
    'audio': 'link',
    'video': 'link',
};
const argNameTranslate = {
    '@': {'link': 'href'},
    '!': {'link': 'src'},
    'audio': {'link': 'src'},
    'video': {'link': 'src'},
};
const argValueTranslate = {
    '@': {'target': {'new': '_blank', 'self': '_self'}}
};
const defaultTagname = 'span';
const argsSplitSymbol = ',';
const argsDefineSymbol = ':';
const nestingSymbol = '\\';
const indentSymbol = '    ';

const Const = {
    ordinaryElementRE: ordinaryElementRE,
    inlineElementRE: inlineElementRE,
    quoteRE: quoteRE,
    ordinaryElements: ordinaryElements,
    ordinaryElementsDefault: ordinaryElementsDefault,
    notSupportedElements: notSupportedElements,
    argNameTranslate: argNameTranslate,
    defaultTagname: defaultTagname,
    argValueTranslate: argValueTranslate,
    argsSplitSymbol: argsSplitSymbol,
    argsDefineSymbol: argsDefineSymbol,
    nestingSymbol: nestingSymbol,
    indentSymbol: indentSymbol,
};
// the currency version of node and ecmascript
// by Albert Z
// include as type 'module'



var htmlcode = '';
var openNodeList = [];
var indentIndex = 0;

function compile(code) {
    htmlcode = '';
    openNodeList = [];
    indentIndex = 0;
    let rootNode = parse(code);
    code = compose(rootNode.content);
    return code;
}

function compileInline(code) {
    let item = parseLine(code, true);
    code = compose(item, true);
    return code;
}

function parse(code) {
    // ???????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????
    let lines = code.split('\n');
    let indentIndex = 0; // ???????????????????????????
    let rootNode = {'content':[], 'indentIndex': -1};
    let openNodeList = [rootNode]; // ?????????????????????????????????
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (!line.trim()) continue;
        let obj = parseLine(line);
        // ????????????????????????
        if (typeof obj.content != 'string') {
            // ?????????????????????????????????
            indentIndex += 1;
            openNodeList[openNodeList.length-1].content.push(obj);
            openNodeList.push(obj);
        } else {
            if (obj.indentIndex == indentIndex) {
                // ????????????
                openNodeList[openNodeList.length-1].content.push(obj);
            } else {
                // ??????????????? / ?????????
                openNodeList = openNodeList.slice(0, obj.indentIndex+1);
                openNodeList[openNodeList.length-1].content.push(obj);
                indentIndex = obj.indentIndex;
            }
        }
    }
    openNodeList = []; // ???????????? ???????????????????????????
    return rootNode
}

// ?????????????????????????????????
function parseLine(line, inline=false) {
    let res = line.match(Const.ordinaryElementRE); //ordinary element
    if (inline) {
        let tagname = res[2];
        if (!tagname) {
            tagname = Const.defaultTagname;
        }
        if (Const.notSupportedElements.indexOf(tagname) > -1) {
            throw TypeError('Markup Parser does not support tagname "' + tagname + '".');
        }
        let args = res[3];
        let content = res[4];
        let arglist = splitArgs(tagname, args);
        return {'tagname':tagname, 'arglist':arglist, 'content':content, 'indentIndex': 1};
    }
    let indent = res[1];
    let indentIndex = indent.length / Const.indentSymbol.length;
    if (indentIndex%1 != 0) {
        throw TypeError('Markup Parser only suppor "    " as indent symbol.');
    }
    let tagname = res[2];
    if (!tagname) {
        tagname = Const.defaultTagname;
    }
    if (Const.notSupportedElements.indexOf(tagname) > -1) {
        throw TypeError('Markup Parser does not support tagname "' + tagname + '".');
    }
    let args = res[3];
    let content = res[4];
    let arglist = splitArgs(tagname, args);
    if (content == Const.nestingSymbol) {
        return {'tagname':tagname, 'arglist':arglist, 'content':[], 'indentIndex': indentIndex};
    } else {
        // ???????????????????????????
        while (true){
            let res = content.match(Const.inlineElementRE);
            if (!res) break
            let code = res[1];
            let codeCompiled = compileInline(code.trim());
            content = content.replace(res[0], codeCompiled);
        }
        return {'tagname':tagname, 'arglist':arglist, 'content':content, 'indentIndex': indentIndex};
    }
}

// ????????????????????????html??????
function compose(node, inline=false){
    if (inline) {
        let item = node;
        let htmltag, content;
        if (Const.ordinaryElements[item.tagname]) { htmltag = Const.ordinaryElements[item.tagname];}
        else { htmltag = item.tagname;}
        content = item.content;
        item.htmltag = htmltag;
        // ??????h???????????????
        if (htmltag == 'h') {
            htmltag = 'h' + item.arglist.size;
            item.htmltag = htmltag;
            delete item.arglist.size;
        }
        let htmlarg = joinArgs(item.tagname, item.arglist);
        let code = `<${htmltag}${htmlarg}>${content}</${htmltag}>\n`;
        return code;
    }
    for (let item of node) {
        let htmltag, content;
        if (Const.ordinaryElements[item.tagname]) { htmltag = Const.ordinaryElements[item.tagname];}
        else { htmltag = item.tagname;}
        content = item.content;
        item.htmltag = htmltag;
        // ??????h???????????????
        if (htmltag == 'h') {
            htmltag = 'h' + item.arglist.size;
            item.htmltag = htmltag;
            delete item.arglist.size;
        }
        let htmlarg = joinArgs(item.tagname, item.arglist);
        if (item.indentIndex < indentIndex) {
            while (item.indentIndex < indentIndex) {
                indentIndex -= 1;
                let obj = openNodeList.pop();
                htmlcode += `${repeatString(Const.indentSymbol, obj.indentIndex)}</${obj.htmltag}>\n`;
            }
        }
        if (typeof content == 'string') {
            content = content.replaceAll('\\{', '{').replaceAll('\\}', '}');
            htmlcode += `${repeatString(Const.indentSymbol, item.indentIndex)}<${htmltag}${htmlarg}>${content}</${htmltag}>\n`;
            indentIndex = item.indentIndex;
        } else if (typeof content != 'string') {
            htmlcode += `${repeatString(Const.indentSymbol, item.indentIndex)}<${htmltag}${htmlarg}>\n`;
            openNodeList.push(item);
            indentIndex = item.indentIndex;
        }
        if (item.content && typeof item.content != 'string' && item.content.length) 
            compose(item.content);
    }
    return htmlcode;
}


function splitArgs(tagname, str) {
    // ???????????? ?????????????????????????????????
    str = str.replace(/ /g, '');
    let list = str.split(Const.argsSplitSymbol);
    let args = {};
    for (let i = 0; i < list.length; i++) {
        let temp = list[i];
        if (temp.indexOf(Const.argsDefineSymbol) > -1 && temp[0] != '"' && temp[0] != "'") {
            // ??????slice ????????????????????????????????????????????????????????????
            args[temp.slice(0,temp.indexOf(Const.argsDefineSymbol))] = 
                temp.slice(temp.indexOf(Const.argsDefineSymbol)+1)
                .replace(Const.quoteRE, '');
        } else if (Const.ordinaryElementsDefault[tagname]) {
            args[Const.ordinaryElementsDefault[tagname]] = temp.replace(Const.quoteRE, '');
        }
    }
    return args;
}

function joinArgs(tagname, args) {
    // html???????????? ??????????????????
    let res = '';
    for (let arg in args) {
        let argtr;
        let value = args[arg];
        if (Const.argNameTranslate[tagname] &&
            Const.argNameTranslate[tagname][arg]) {
            argtr = Const.argNameTranslate[tagname][arg];
        } else {
            argtr = arg;
        }
        if (Const.argValueTranslate[tagname] && 
            Const.argValueTranslate[tagname][arg] && 
            Const.argValueTranslate[tagname][arg][value]) {
            value = Const.argValueTranslate[tagname][arg][value]; 
        }
        let temp = ' ' + argtr + '=' + '"' + value + '"';
        res += temp;
    }
    return res;
}

function repeatString(str,n) {
	return new Array(n+1).join(str);
}

const Compile = {
    compile: compile,
    parse: parse,
    parseLine: parseLine,
    compose: compose,
}


var compile = Compile.compile;

function compileDocument(replaceTag=true) {
    let eles = document.getElementsByTagName('lineup');
    for (var i = 0; i < eles.length; i++) {  //????????????
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
    code = compile(code);
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
    code = compile(code);
    let xmlcode = `
${head}
${code}
`;
    return xmlcode
}

const Lineup = {
    compile: compile,
    compileDocument: compileDocument,
    compileHTML: compileHTML,
    compileXML: compileXML,
}
