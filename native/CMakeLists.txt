cmake_minimum_required(VERSION 3.18.1)
project(danphe_vector LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O3 -fvisibility=hidden -fdata-sections -ffunction-sections -fno-rtti")
set(CMAKE_SHARED_LINKER_FLAGS "${CMAKE_SHARED_LINKER_FLAGS} -Wl,--gc-sections -Wl,-s")

include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    ${CMAKE_CURRENT_SOURCE_DIR}/thorvg/inc
    ${CMAKE_CURRENT_SOURCE_DIR}/thorvg/src/common
    ${CMAKE_CURRENT_SOURCE_DIR}/thorvg/src/renderer
    ${CMAKE_CURRENT_SOURCE_DIR}/thorvg/src/renderer/cpu_engine
    ${CMAKE_CURRENT_SOURCE_DIR}/thorvg/src/loaders/raw
    ${CMAKE_CURRENT_SOURCE_DIR}/thorvg/src/loaders/svg
)

file(GLOB THORVG_COMMON_SRC "${CMAKE_CURRENT_SOURCE_DIR}/thorvg/src/common/*.cpp")
file(GLOB THORVG_RENDERER_CORE "${CMAKE_CURRENT_SOURCE_DIR}/thorvg/src/renderer/*.cpp")
file(GLOB THORVG_CPU_SRC "${CMAKE_CURRENT_SOURCE_DIR}/thorvg/src/renderer/cpu_engine/*.cpp")
file(GLOB THORVG_RAW_SRC "${CMAKE_CURRENT_SOURCE_DIR}/thorvg/src/loaders/raw/*.cpp")
file(GLOB THORVG_SVG_SRC "${CMAKE_CURRENT_SOURCE_DIR}/thorvg/src/loaders/svg/*.cpp")
file(GLOB DANPHE_SRC "${CMAKE_CURRENT_SOURCE_DIR}/src/*.cpp")

add_library(danphe_vector SHARED
    ${THORVG_COMMON_SRC}
    ${THORVG_RENDERER_CORE}
    ${THORVG_CPU_SRC}
    ${THORVG_RAW_SRC}
    ${THORVG_SVG_SRC}
    ${DANPHE_SRC}
    ${CMAKE_CURRENT_SOURCE_DIR}/danphe_thorvg_jni.cpp
)

target_compile_definitions(danphe_vector PRIVATE
    THORVG_SVG_LOADER_SUPPORT=1
    THORVG_SW_ENGINE_SUPPORT=1
    THORVG_THREAD_SUPPORT=1
    TVG_BUILD=1
    NDEBUG=1
)

target_link_libraries(danphe_vector
    android
    jnigraphics
    log
)
