@echo off

node version_generator.js -v 1.6.6 -u http://47.104.25.227/tj_mj_update_test/ -s ../build_test/jsb-default -d ../assets


copy ..\assets\project.manifest ..\build_test\jsb-default\project.manifest /y
copy ..\assets\version.manifest ..\build_test\jsb-default\version.manifest /y
copy .\main.js ..\build_test\jsb-default\main.js /y

@pause