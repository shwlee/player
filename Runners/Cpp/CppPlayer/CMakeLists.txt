cmake_minimum_required(VERSION 3.10)
project(CppBuilder VERSION 1.0 LANGUAGES CXX)

add_definitions(
-DNDEBUG    
-DCPPPLAYER_EXPORTS
-D_WINDOWS
-D_USRDLL
)

set(SOURCES
    src/CppPlayer.cpp  
)

set(HEADERS
    src/CppPlayer.h  
)

add_library(CppBuilder SHARED ${SOURCES} ${HEADERS})
target_compile_definitions(CppBuilder PRIVATE CPPBUILDER_EXPORTS)

install(TARGETS CppBuilder
        EXPORT CppBuilderExports
        LIBRARY DESTINATION lib
        ARCHIVE DESTINATION lib)

install(DIRECTORY include/ DESTINATION include)

