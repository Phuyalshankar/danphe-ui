#include <jni.h>
#include <android/bitmap.h>
#include <android/log.h>
#include <string>
#include <cstring>
#include "thorvg.h"

#define TAG "DanpheThorVG"
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, TAG, __VA_ARGS__)

static bool s_tvgInitialized = false;

static void ensureThorVGInit() {
    if (!s_tvgInitialized) {
        tvg::Initializer::init(0);
        s_tvgInitialized = true;
        LOGI("⚡ Samsung ThorVG Engine initialized successfully");
    }
}

extern "C" JNIEXPORT jboolean JNICALL
Java_io_dolphin_runtime_DanpheThorVG_renderSvg(
    JNIEnv* env,
    jclass clazz,
    jobject bitmap,
    jstring svgStr
) {
    if (!bitmap || !svgStr) return JNI_FALSE;
    ensureThorVGInit();

    AndroidBitmapInfo info;
    if (AndroidBitmap_getInfo(env, bitmap, &info) < 0) return JNI_FALSE;
    if (info.format != ANDROID_BITMAP_FORMAT_RGBA_8888) return JNI_FALSE;

    void* pixels = nullptr;
    if (AndroidBitmap_lockPixels(env, bitmap, &pixels) < 0) return JNI_FALSE;

    const char* rawSvg = env->GetStringUTFChars(svgStr, nullptr);
    if (!rawSvg) {
        AndroidBitmap_unlockPixels(env, bitmap);
        return JNI_FALSE;
    }

    uint32_t width = info.width;
    uint32_t height = info.height;
    uint32_t* buffer = reinterpret_cast<uint32_t*>(pixels);

    // Clear buffer with transparent black
    std::memset(pixels, 0, width * height * 4);

    // Create ThorVG Software Canvas backed by the Android Bitmap pixel buffer
    auto canvas = tvg::SwCanvas::gen();
    if (!canvas) {
        env->ReleaseStringUTFChars(svgStr, rawSvg);
        AndroidBitmap_unlockPixels(env, bitmap);
        return JNI_FALSE;
    }

    canvas->target(buffer, width, width, height, tvg::ColorSpace::ABGR8888);

    // Load and add SVG Picture
    auto picture = tvg::Picture::gen();
    uint32_t svgLen = static_cast<uint32_t>(std::strlen(rawSvg));
    if (picture && picture->load(rawSvg, svgLen, "svg", nullptr, true) == tvg::Result::Success) {
        picture->size(static_cast<float>(width), static_cast<float>(height));
        canvas->add(picture);
        canvas->draw();
        canvas->sync();
    } else {
        LOGE("Failed to load SVG data into ThorVG Picture");
    }

    delete canvas;

    env->ReleaseStringUTFChars(svgStr, rawSvg);
    AndroidBitmap_unlockPixels(env, bitmap);
    return JNI_TRUE;
}
