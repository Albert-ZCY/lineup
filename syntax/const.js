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
    '@': {'target': {'_blank': 'new'}}
};
const argsSplitSymbol = ',';
const argsDefineSymbol = ':';
const nestingSymbol = '\\';
const indentSymbol = '    ';

export {
    ordinaryElementRE,
    ordinaryElements,
    ordinaryElementsDefault,
    notSupportedElements,
    argNameTranslate,
    argValueTranslate,
    argsSplitSymbol,
    argsDefineSymbol,
    nestingSymbol,
    indentSymbol,
};