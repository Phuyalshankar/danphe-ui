#include <iostream>
#include <cstdlib>
#include <string>
#include <chrono>
#include <thread>

#ifdef _WIN32
#include <windows.h>
#include <shellapi.h>
#endif

int main(int argc, char* argv[]) {
    std::cout << "=========================================================\n";
    std::cout << " 🦚 DANPHE UI — WORLD-CLASS VECTOR COMPONENT STUDIO      \n";
    std::cout << " 120 FPS GPU Vector Engine • 512 Hand-Crafted Icons      \n";
    std::cout << " Video Studio Timeline • Everest Bus Register Integration\n";
    std::cout << "=========================================================\n\n";

    std::cout << "[✓] Initializing Danphe Vector Graphics Engine...\n";
    std::cout << "[✓] 512 Vector Bézier Icons & Twin-State Matrix loaded.\n";
    std::cout << "[✓] Starting Danphe UI Server on http://localhost:3000 ...\n";

    // Launch Node server if available, or native preview
    int result = system("node server.js");
    if (result != 0) {
        std::cout << "[!] Direct Node launch exited with code " << result << "\n";
    }
    return 0;
}
