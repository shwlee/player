// Sample file
#include <cstdlib>

extern "C" void initialize(int myNumber, int column, int row) {}

extern "C" const char* getName() { return "Sample"; }

extern "C" int moveNext(int argc, int* argv, int myPosition) {
    // Write path finder in here.
    return std::rand() % 4;
}
