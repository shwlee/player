#!/bin/bash

# 인수로 전달된 외부 변수 설정
EXTERNAL_CPP_PATH="$1"
PROJECT_PATH="$2"
OUTPUT_NAME="$3"

TARGET_PATH="${PROJECT_PATH}/src"
FILE_NAME="CppPlayer.cpp"

echo "${EXTERNAL_CPP_PATH}"
echo "${PROJECT_PATH}"
echo "${OUTPUT_NAME}"

# "result" 디렉터리로 이동
cd "${PROJECT_PATH}/result" || { echo "경로로 이동할 수 없습니다: ${PROJECT_PATH}/result"; exit 1; }

# CMake 명령 실행
cmake ..
cmake --build . --config Release

# 빌드된 DLL 파일 이름 변경
mv "${PROJECT_PATH}/result/libCppBuilder.dylib" "${PROJECT_PATH}/result/${OUTPUT_NAME}.dylib"

