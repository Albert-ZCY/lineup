# by AlbertZ
import re

moduleStruct = {}

# 模块转代码
def exportToObject(name, code, imports='*'):
    # 删掉import
    code = re.sub('(import .*?;)', '', code, re.S)
    # 将export语句变为object
    # 无name直接合并 不处理命名空间 （import直接执行和import部分内容的情况）
    if name:
        res = re.findall('(export\s*{)(.*)}', code, re.S)
        for i in res:
            head = i[0]
            content = i[1]
            code = code.replace(head, 'const '+name+' = {')
            exports = re.findall('\s*(.*?),', content, re.M)
            for export in exports:
                lineObject = f'{export}: {export},'
                code = code.replace(export+',', lineObject)
    # 处理export default
    # 全部引入或者引入了d对象
    if name or (isinstance(imports, list) and 'd' in imports):
        res = re.findall('(export default\s*{(.*)})', code, re.S)
        if res:
            res = res[0]
            code = code.replace(res[0], '')
            defaultObject = f'{name}.default = {{ {res[1]} }}' if name else f'const d = {{ {res[1]} }}'
            code += defaultObject
    return code + '\n'

def linkFiles(module:dict, output):
    # {path:name, path:[imports] *}
    codeAll = '/* automatically linked by JLinker */\n'
    for path in module:
        f = open(path, 'r')
        code = f.read()
        f.close()
        if isinstance(module[path], str):
            codeTrans = exportToObject(module[path], code, '*')
        else:
            codeTrans = exportToObject('', code, module[path])
        codeAll += codeTrans
    with open(output, 'w') as f:
        f.write(codeAll)

def linkModule(name, main, output):
    global moduleStruct
    moduleStruct = {main: name}
    analyseCode(main)
    moduleStruct = dict(reversed(moduleStruct.items()))
    linkFiles(moduleStruct, output)


def analyseCode(path):
    global moduleStruct
    code = open(path, 'r').read()
    res = re.findall('import\s+\*\s+as\s+(.*?)\s+from\s+(.*?)\s*;', code, re.S)
    for i in res:
        name = i[0]
        path = i[1][1:-1]
        if not(path): continue
        moduleStruct[path] = name
        analyseCode(path)
    res = re.findall('import\s+(.*?)\s+from\s+(.*?)\s*;', code, re.S)
    for i in res:
        imports = i[0]
        path = i[1][1:-1]
        if path in moduleStruct: continue
        if imports.startswith('{') and imports.endswith('}'):
            imports = imports[1:-1].strip()
            imports = imports.split(',')
        else:
            imports = [imports, ]
        if not(path): continue
        moduleStruct[path] = imports
        analyseCode(path)
    res = re.findall('import\s+(.*?)\s*;', code, re.S)
    for i in res:
        path = i[0][1:-1]
        if not(path): continue
        moduleStruct[path] = ''
        analyseCode(path)