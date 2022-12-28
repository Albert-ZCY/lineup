// the currency version of node and ecmascript
// by Albert Z
// include as type 'module'

import * as Const from './syntax/const.js';

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

function parse(code) {
    // 用一个奇奇怪怪的原创方法实现的数结构遍历 把所有代码根据缩进转换成语法树的结构
    let lines = code.split('\n');
    let indentIndex = 0; // 初始的当前缩进级别
    let rootNode = {'content':[], 'indentIndex': -1};
    let openNodeList = [rootNode]; // 所有未闭合的节点的引用
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (!line.trim()) continue;
        let obj = parseLine(line);
        // 判断是否为叶节点
        if (typeof obj.content != 'string') {
            // 下一级节点（非叶节点）
            indentIndex += 1;
            openNodeList[openNodeList.length-1].content.push(obj);
            openNodeList.push(obj);
        } else {
            if (obj.indentIndex == indentIndex) {
                // 同级节点
                openNodeList[openNodeList.length-1].content.push(obj);
            } else {
                // 返回上一级 / 更多级
                openNodeList = openNodeList.slice(0, obj.indentIndex+1);
                openNodeList[openNodeList.length-1].content.push(obj);
                indentIndex = obj.indentIndex;
            }
        }
    }
    openNodeList = []; // 释放内存 可能有未闭合的节点
    return rootNode
}

// 转译为参数性的程序语言
function parseLine(line) {
    let res = line.match(Const.ordinaryElementRE); //ordinary element
    let indent = res[1];
    let indentIndex = indent.length / Const.indentSymbol.length;
    if (indentIndex%1 != 0) {
        throw TypeError('Markup Parser only suppor "    " as indent symbol.');
    }
    let tagname = res[2];
    if (tagname) {
        if (tagname in Const.ordinaryElements) {
            let args = res[3];
            let content = res[4];
            let arglist = splitArgs(tagname, args);
            if (content == Const.nestingSymbol) {
                return {'tagname':tagname, 'arglist':arglist, 'content':[], 'indentIndex': indentIndex};
            } else {
                return {'tagname':tagname, 'arglist':arglist, 'content':content, 'indentIndex': indentIndex};
            }
        } else {
            throw TypeError('Markup Parser does not support tagname "' + tagname + '".');
        }
    } else {
        throw TypeError('Invalid Markup syntax: "' + line + '".');
    }
}

// 将程序语言组合成html代码
function compose(node, arr=[]){
    for (let item of node) {
        let htmltag = Const.ordinaryElements[item.tagname];
        let content = item.content;
        if (htmltag == 'h') {
            htmltag = 'h' + item.arglist.size;
            item.htmltag = htmltag;
            delete item.arglist.size;
        } else if (htmltag == 'a') {
            item.arglist.href = item.arglist.link;
            delete item.arglist.link;
        } else if (['img', 'audio', 'video'].indexOf(htmltag) > -1) {
            item.arglist.src = item.arglist.link;
            delete item.arglist.link;
        }
        let htmlarg = joinArgs(item.arglist);
        if (item.indentIndex < indentIndex) {
            while (item.indentIndex < indentIndex) {
                indentIndex -= 1;
                let obj = openNodeList.pop();
                htmlcode += `${repeatString(Const.indentSymbol, obj.indentIndex)}</${obj.htmltag || Const.ordinaryElements[obj.tagname]}>\n`;
            }
        }
        if (typeof content == 'string') {
            htmlcode += `${repeatString(Const.indentSymbol, item.indentIndex)}<${htmltag}${htmlarg}>${content}</${htmltag}>\n`;
            indentIndex = item.indentIndex;
        } else if (typeof content != 'string') {
            htmlcode += `${repeatString(Const.indentSymbol, item.indentIndex)}<${htmltag}${htmlarg}>\n`;
            openNodeList.push(item);
            indentIndex = item.indentIndex;
        }
        if (item.content && typeof item.content != 'string' && item.content.length) 
            compose(item.content, arr);
    }
    return htmlcode;
}


function splitArgs(tagname, str) {
    // 参数读取 支持默认位置和新的东西
    str = str.replace(/ /g, '');
    let list = str.split(Const.argsSplitSymbol);
    let args = {};
    for (let i = 0; i < list.length; i++) {
        let temp = list[i];
        if (temp.indexOf(Const.argsDefineSymbol) > -1 && temp[0] != '"' && temp[0] != "'") {
            // 采用slice 从第一个定义符的位置分割字符串成两个部分
            args[temp.slice(0,temp.indexOf(Const.argsDefineSymbol))] = 
                temp.slice(temp.indexOf(Const.argsDefineSymbol)+1)
                .replace(/^(\s|"|')+|(\s|"|')+$/g, '');
        } else if (Const.ordinaryElementsDefault[tagname]) {
            args[Const.ordinaryElementsDefault[tagname]] = temp.replace(/^(\s|"|')+|(\s|"|')+$/g, '');
        }
    }
    return args;
}

function joinArgs(args) {
    let res = '';
    for (let arg in args) {
        let value = args[arg];
        let temp = ' ' + arg + '=' + '"' + value + '"';
        res += temp;
    }
    return res;
}

function repeatString(str,n) {
	return new Array(n+1).join(str);
}

export {
    compile,
    parse,
    parseLine,
    compose,
}