# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile
-keep public class * extends com.getcapacitor.Plugin
-keep class androidx.camera.core.** { *; }
-keep class com.getcapacitor.** { *; }
-keep class com.getcapacitor.plugin.** { *; }
-keep class com.getcapacitor.android.** { *; }
-keep class com.getcapacitor.bridge.** { *; }
-keep class com.getcapacitor.ui.** { *; }
-keep class com.getcapacitor.file.** { *; }
-keep class io.ionic.** { *; }
-keep class androidx.documentfile.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin public class * {
     @com.getcapacitor.annotation.PermissionCallback <methods>;
     @com.getcapacitor.annotation.ActivityCallback <methods>;
     @com.getcapacitor.annotation.Permission <methods>;
     @com.getcapacitor.PluginMethod public <methods>;
}
-keep public class * extends org.apache.cordova.* {
   public <methods>;
   public <fields>;
}
