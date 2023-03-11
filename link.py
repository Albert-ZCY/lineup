# Python 胶水插件代码
import jlinker

jlinker.linkFile({'Const': 'syntax/const.js', 
                  'Compile': 'compile.js', 
                  'Lineup': 'lineup.js'}, 
                 output='lineup-min.js')