#include <iostream>
#include <string>
#include "VectorSynthesizer.hpp"

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cout << "Usage: danphe-vector <type> [args...]" << std::endl;
        return 0;
    }

    std::string type = argv[1];
    if (type == "7seg") {
        std::string input = (argc > 2) ? argv[2] : "0";
        std::string theme = (argc > 3) ? argv[3] : "red";
        std::cout << DanpheNativeVector::SevenSegment::renderSVG(input, theme) << std::endl;
        return 0;
    }

    std::cout << "OK" << std::endl;
    return 0;
}
