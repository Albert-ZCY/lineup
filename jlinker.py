# by AlbertZ
import re

# 模块转代码
def exportToObject(name, code):
    # 删掉import
    res = re.findall('(import .*;)', code)
    if res:
        code = code.replace(res[0], '')
    # 将export语句变为object
    res = re.findall('(export[\s]*{)(.*)}', code, re.S)
    if not(res): return code + '\n'
    res = res[0]
    head = res[0]
    lines = res[1]
    code = code.replace(head, 'const '+name+' = {')
    for line in lines.split('\n'):
        export = re.findall('[\s]*(.*),', line)
        if not export: continue
        export = export[0]
        lineObject = f'    {export}: {export},'
        code = code.replace(line, lineObject)
    return code + '\n'

def linkFile(module:dict, output):
    # {name: path, *}
    codeAll = '/* automatically linked by JLinker */\n'
    for name in module:
        f = open(module[name], 'r')
        code = f.read()
        f.close()
        codeTrans = exportToObject(name, code)
        codeAll += codeTrans
    with open(output, 'w') as f:
        f.write(codeAll)
    