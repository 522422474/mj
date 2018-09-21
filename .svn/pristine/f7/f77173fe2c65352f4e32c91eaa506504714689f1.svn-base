@echo off

node version_generator.js -v 2.0.8 -u http://tianjin.update.ry-play.com/tj_mj_update/ -s ../build/jsb-default -d ../assets


copy ..\assets\project.manifest ..\build\jsb-default\project.manifest /y
copy ..\assets\version.manifest ..\build\jsb-default\version.manifest /y
copy .\main.js ..\build\jsb-default\main.js /y

@pause