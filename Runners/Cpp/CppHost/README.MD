# CppHost Executable Build Guide

### 1. Install npm modules
Install the modules required to build the host

```
npm install
```

#### Mac
install xcode.  
  ```
  xcode-select --install
  ```

### 2. Change config
Open Config.json and change builder_path to absolute path of CppPlayer.

```
{
    "builder_path": "Change\\this\\correctly"
}
```

### 3. Build
Package it as an executable file. 

```
pkg .
```

### 4. Specify file location
Copy these files to `coin-challenger/Assets/StreamingAssets/Runners/{Platform}/CppHost` folder

``` From
./CppHost/dist/cppHost.exe
./CppHost/build.bat
./CppHost/config.json 
```

Caution: Platform and architecture may be included in the executable file name. Please rename the executable file that suits you to cppHost.
