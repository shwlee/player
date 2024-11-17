# Description of CppPlayer
Project that turns cppPlayer into dll or dylib.

### Structure
CCppPlayer's essential functions must always be implemented

```
void CCppPlayer::Initialize(int myNumber, int column, int row)
const char* CCppPlayer::GetName()
int CCppPlayer::MoveNext(int argc, int* argv, int myPosition)
```

### Scope of Support
c++17 support.
Cannot use gcc or clang extensions.
Stl can be included and used as desired. 

### Template
```
#include "CppPlayer.h"

void CCppPlayer::Initialize(int myNumber, int column, int row) {
}

const char* CCppPlayer::GetName() {
    return "";
}

int CCppPlayer::MoveNext(int argc, int* argv, int myPosition) {
    return -1;
}
```

### Sample
```
#include "CppPlayer.h"
#include <cstdlib> // if you want to use rand

void CCppPlayer::Initialize(int myNumber, int column, int row)
{
}

const char* CCppPlayer::GetName()
{
    return "Aaron";
}

int CCppPlayer::MoveNext(int argc, int* argv, int myPosition)
{
    return std::rand() % 4;
}
```
