# React Native & TurboModules
-keep class com.facebook.react.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.uimanager.** { *; }
-keep class com.facebook.jni.** { *; }
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod *;
    @com.facebook.react.bridge.ReactProperty *;
    @com.facebook.react.uimanager.annotations.ReactProp *;
    @com.facebook.react.uimanager.annotations.ReactPropGroup *;
}

# NitroModules & C++ JNI bridge
-keep class com.margelo.nitro.** { *; }
-keepclassmembers class com.margelo.nitro.** { *; }

# MMKV
-keep class com.tencent.mmkv.** { *; }
-keepclassmembers class com.tencent.mmkv.** { *; }

# Expo Modules
-keep class expo.modules.** { *; }
-keepclassmembers class expo.modules.** { *; }

# React Native SVG
-keep class com.horcrux.svg.** { *; }

# Reanimated
-keep class com.swmansion.reanimated.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}
