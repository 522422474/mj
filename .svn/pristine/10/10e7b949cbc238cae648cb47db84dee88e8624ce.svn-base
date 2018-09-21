
PROJ_NAME="mahjong_tianjin"
PROJ_PATH=${PWD}"/../../"
BUILD_PATH=${PROJ_PATH}"build"
REMOTE_PATH="http://47.104.25.227/tj_mj_update_test/"
PLATFORM="ios"
VERSION="10.0.1"

#build
echo "build project, "
/Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path ${PROJ_PATH} --build "title=${PROJ_NAME};platform=${PLATFORM};buildPath=${BUILD_PATH};debug=true"

#copy xcode build settings and 3rd libs
if [ "$PLATFORM" = "android" ];then
	cp -rf ${PROJ_PATH}../mj-client-build/android/haerbin/* ${BUILD_PATH}/jsb-default/frameworks/runtime-src/proj.android-studio/app
	cp -rf ${PROJ_PATH}../mj-client-build/android/a-public/* ${BUILD_PATH}/jsb-default/frameworks/runtime-src/proj.android-studio/app
else
	cp -rf ${PROJ_PATH}../mj-client-build/ios/haerbin/* ${BUILD_PATH}/jsb-default/frameworks/runtime-src/proj.ios_mac
	cp -rf ${PROJ_PATH}../mj-client-build/ios/a-public/* ${BUILD_PATH}/jsb-default/frameworks/runtime-src/proj.ios_mac/ios
fi

#copy cpp
cp -r ../CCFileUtils.cpp ${BUILD_PATH}/jsb-default/frameworks/cocos2d-x/cocos/platform
cp -r ../js_bindings_core.cpp ${BUILD_PATH}/jsb-default/frameworks/cocos2d-x/cocos/scripting/js-bindings/manual

#generator assets
node ../version_generator.js -v ${VERSION} -u ${REMOTE_PATH} -s ${BUILD_PATH}/jsb-default -d ../../assets
cp -f ../../assets/project.manifest ${BUILD_PATH}/jsb-default/project.manifest
cp -f ../../assets/version.manifest ${BUILD_PATH}/jsb-default/version.manifest

#copy main.js
cp -f ../main.js ${BUILD_PATH}/jsb-default/main.js

#compile
/Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path ${PROJ_PATH} --compile "title=${PROJ_NAME};platform=${PLATFORM};buildPath=${BUILD_PATH};debug=true"
