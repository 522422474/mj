@echo off

node version_generator.js -v 1.8.0 -u http://shishi.update.ry-play.com/ -s ../build/jsb-default -d ../assets


copy ..\assets\project.manifest ..\build\jsb-default\project.manifest /y
copy ..\assets\version.manifest ..\build\jsb-default\version.manifest /y
copy .\main.js ..\build\jsb-default\main.js /y

@pause