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

export {
    ordinaryElementRE,
    inlineElementRE,
    quoteRE,
    ordinaryElements,
    ordinaryElementsDefault,
    notSupportedElements,
    argNameTranslate,
    defaultTagname,
    argValueTranslate,
    argsSplitSymbol,
    argsDefineSymbol,
    nestingSymbol,
    indentSymbol,
};