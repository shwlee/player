# Description of CppPlayer
Project that turns cppPlayer into dll. (For now, Windows only)  
GCC for Windows is included to build the cpp player in real time.  
CppPlayer must be included in the CoinChallenger distribution package.  
For detailed setup instructions, please refer to CppHost.

### Scope of Support
C++17  
Stl  
gcc/clang/msvc extension is not available.

### Template
```
extern "C" void initialize(int myNumber, int column, int row) {
}
extern "C" const char* getName() {
    return "userName";
}
extern "C" int moveNext(int argc, int* argv, int myPosition) {
    return 0;
}
```

Sample cpp file is included.
