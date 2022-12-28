// Const Define
// by Albert Z
// ordinary element: [sym]([args]) [content]

const ordinaryElementRE = /(\s*)(.*?)\((.*?)\)\s+(.*)/;

const ordinaryElements = {
    '@': 'a',
    '#': 'h',
    '!': 'img',
    '+': 'br',
    '-': 'hr',
    'audio': 'audio',
    'video': 'video',
    'bold': 'b',
    'italic': 'i',
    'under': 'u',
    'abbr': 'abbr',
    'address': 'address',
    'area': 'area',
    'bdi': 'bdi',
    'bdo': 'bdo',
    'cite': 'cite',
    'button': 'button',
    'canvas': 'canvas',
    'caption': 'caption',
    'code': 'code',
    'col': 'col',
    'del': 'del',
    'div': 'div',
    'dialog': 'dialog',
    'embed': 'embed',
    'figure': 'figure',
    'footer': 'footer',
    'form': 'form',
    'header': 'header',
    'iframe': 'iframe',
    'input': 'input',
    'label': 'label',
    'main': 'main',
    'map': 'map',
    'noscript': 'noscript',
    'object': 'object',
    'p': 'p',
    'pre': 'pre',
    'select': 'select',
    'span': 'span',
    'sub': 'sub',
    'sup': 'sup',
    'svg': 'svg',
    'time': 'time',
    'title': 'title',
    'style': 'style',
    'script': 'script',
};
const ordinaryElementsDefault = {
    '#': 'size',
    '@': 'link',
    '!': 'link',
    'audio': 'link',
    'video': 'link',
};
const functionalParse = ['@', '!', '#', '+', '-'];
const argsSplitSymbol = ',';
const argsDefineSymbol = ':';
const nestingSymbol = '\\';
const indentSymbol = '    ';

export {
    ordinaryElementRE,
    ordinaryElements,
    functionalParse,
    ordinaryElementsDefault,
    argsSplitSymbol,
    argsDefineSymbol,
    nestingSymbol,
    indentSymbol,
};