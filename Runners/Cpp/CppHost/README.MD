# CppHost Executable Build Guide
For now, Windows only.

### 1. Install npm modules
Install the modules required to build the host

```
npm install
```

### 2. Build
Package it as an executable file. 

```
pkg .
```

### 3. Specify file location
Copy file `cppHost.exe` to `coin-challenger/Assets/StreamingAssets/Runners/Windows/CppHost`  
Caution: Platform and architecture may be included in the executable filename(ex. cppHost-darwin-arm64 / cppHost-win-x64). Please rename the executable file that suits you to cppHost.

```
./CppHost/dist/cppHost.exe
```

### 4. Distribution
user-written code must be compiled, the CppPlayer folder must also be distributed.  
Copy folder `CppPlayer` to `/build_result_path/CoinChallenger_Data/StreamingAssets/Runners/Windows/CppHost`

``` 
/build_result_path/CoinChallenger_Data/StreamingAssets/Runners/Windows/CppHost/CppPlayer
```

