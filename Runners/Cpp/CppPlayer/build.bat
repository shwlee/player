@echo off

set SCRIPT_DIR=%~dp0
set OUTPUT_NAME=%1
set SOURCE_CPP=%2
set MINGW_PATH=%SCRIPT_DIR%compiler/MinGW/bin

:: set env
set PATH=%MINGW_PATH%;%PATH%

set BUILD_DIR=%SCRIPT_DIR%..\build

if not exist %BUILD_DIR% (
    mkdir %BUILD_DIR%
)

echo Creating DLL...
g++ -shared -o "%BUILD_DIR%\%OUTPUT_NAME%.dll" "%SOURCE_CPP%"

echo Build: %BUILD_DIR%\%OUTPUT_NAME%.dll
