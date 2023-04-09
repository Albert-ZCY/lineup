# by AlbertZ
import re

moduleStruct = {}

# 模块转代码
def exportToObject(name, code, imports='*'):
    """
    # Function
    处理单文件导入导出语句
    Process the import and export syntax of a single file

    # Argument
    |  arg   |    内容     |     content      |
    |  name  |   模块名称   |    module name   |
    |  main  |   代码内容   |  javascript code |
    |*imports|   导入内容   | imported objects |

    # Return
    code: 已转换的代码
    """
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
    """
    # Function
    提供模块结构，组合模块至单文件。
    Read the module struct dict and compose the module into a single file.

    # Argument
    |  arg   |    内容     |     content      |
    |  name  |   模块结构   |   module struct  |
    | output |   输出文件   | output file path |
    
    module: {path:name, path:[imports] *}

    # Example 
    JLinker.linkFiles({'imports/tool.js': ['fun1', 'fun2', 'd'], 'import/network.js': 'Network',
                       './index.js': 'ModuleName', }, './singlefile.js')
    """
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
    """
    # Function
    仅分析入口文件，组合模块至单文件。
    Analyse the index file and compose the module into a single file.
    
    # Argument
    |  arg   |    内容     |     content      |
    |  name  |  模块总名称  |    module name   |
    |  main  |   入口文件   |  index file path |
    | output |   输出文件   | output file path |
    """
    global moduleStruct
    moduleStruct = {main: name}
    analyseCode(main)
    moduleStruct = dict(reversed(moduleStruct.items()))
    linkFiles(moduleStruct, output)


def analyseCode(path):
    """
    # Function
    分析文件导入和包含关系
    Analyse the file into module struct.

    # Argument
    |  arg   |    内容     |     content      |
    |  main  |   入口文件   |  index file path |
    """
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