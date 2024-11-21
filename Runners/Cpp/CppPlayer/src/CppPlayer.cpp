#include <iostream>
#include <string>
#include <cstdlib>

extern "C" void initialize(int myNumber, int column, int row)
{

}

extern "C" const char* getName()
{
    return "zzz";
}

extern "C" int moveNext(int argc, int* argv, int myPosition)
{
    return std::rand() % 2;
}
