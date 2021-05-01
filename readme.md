===========================================================================================
####  PLEASE FOLLOW THE INSTRUSTION GIVEN BELOW TO BYPASS SSL CERTIFICATE IN SIGNED APK ###
=========================================================================================== 

Reference URL: http://ivancevich.me/articles/ignoring-invalid-ssl-certificates-on-cordova-android-ios/

=========================================================================================== 

Please find the file ### CordovaWebViewClient.java ### in location 
"/platforms/android/CordovaLib/src/org/apache/cordova/engine/SystemWebViewClient.java"

Replace the method "onReceivedSslError" in  ### CordovaWebViewClient.java ###  file.

=========================================================================================== 
Replace the method "onReceivedSslError" with given code

**METHOD onReceivedSslError**  


public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {

        final String packageName = parentEngine.cordova.getActivity().getPackageName();
        final PackageManager pm = parentEngine.cordova.getActivity().getPackageManager();
    
        ApplicationInfo appInfo;
        try {
            appInfo = pm.getApplicationInfo(packageName, PackageManager.GET_META_DATA);
            if ((appInfo.flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0) {
                // debug = true
                handler.proceed();
                return;
            } else {
                // debug = false
                // THIS IS WHAT YOU NEED TO CHANGE:
                // 1. COMMENT THIS LINE
                // super.onReceivedSslError(view, handler, error);
                // 2. ADD THESE TWO LINES
                // ---->
                handler.proceed();
                return;
                // <----
            }
        } catch (NameNotFoundException e) {
            // When it doubt, lock it out!
            super.onReceivedSslError(view, handler, error);
        }
    }
    

    **END OF METHOD** 




