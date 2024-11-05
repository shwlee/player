set EXTERNAL_CPP_PATH=%1
set PROJECT_PATH=%2
set OUTPUT_NAME=%3

echo %EXTERNAL_CPP_PATH%
echo %PROJECT_PATH%

set TARGET_PATH=%PROJECT_PATH%\src
set FILE_NAME=CppPlayer.cpp

if not exist "%PROJECT_PATH%\result" (
    mkdir "%PROJECT_PATH%\result"
)

cd "%PROJECT_PATH%\result"

cmake ..
cmake --build . --config Release

rename %PROJECT_PATH%\result\Release\CppBuilder.dll %OUTPUT_NAME%.dll

echo Build complete.
