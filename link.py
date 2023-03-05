# Python 胶水插件代码
import re

constjs = open('syntax/const.js', 'r').read()
compilejs = open('./compile.js', 'r').read()
lineupjs = open('./lineup.js', 'r').read()
lineupminjs = open('./lineup-min.js', 'w')

# 模块转代码
def exportToObject(name, code):
    # 删掉import
    res = re.findall('(import .*;)', code)
    if res:
        code = code.replace(res[0], '')
    # 将export语句变为object
    res = re.findall('(export[\s]*{)(.*)}', code, re.S)[0]
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

codeobj = exportToObject('Const', constjs) + exportToObject('Compile', compilejs) + exportToObject('Lineup', lineupjs)
lineupminjs.write('/* automatically linked by link.py */\n' + codeobj)
lineupminjs.close()