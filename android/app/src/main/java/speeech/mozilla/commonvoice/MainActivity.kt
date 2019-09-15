package speeech.mozilla.commonvoice

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.os.Build
import android.os.Bundle
import android.support.v4.app.ActivityCompat
import android.support.v4.content.ContextCompat
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.view.View
import android.webkit.CookieManager
import android.webkit.WebView
import android.webkit.WebViewClient
import kotlinx.android.synthetic.main.activity_main.*
import android.support.v4.app.ActivityCompat.requestPermissions
import android.annotation.TargetApi
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.icu.lang.UCharacter.GraphemeClusterBreak.T



open class MainActivity : AppCompatActivity() {

    private val url = "https://voice.mozilla.org/"
    private val RECORD_REQUEST_CODE = 101
    private val TAG = "Voice Mozilla - Common Voice"

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        setUpWebViewDefaults()

        // WebView settings
        webview.fitsSystemWindows = true

        /* if SDK version is greater of 19 then activate hardware acceleration
        otherwise activate software acceleration  */

        webview.setLayerType(View.LAYER_TYPE_HARDWARE, null)

        webview.loadUrl(url)

        // Set web view client
        webview.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView, url: String, favicon: Bitmap?) {
                // Page loading started
                // Do something
            }

            override fun onPageFinished(view: WebView, url: String) {
                // Page loading finished
                // Enable disable back forward button
            }
        }

        webview.setWebChromeClient(object : WebChromeClient() {
            // Need to accept permissions programmatically to use the microphone
            override fun onPermissionRequest(request: PermissionRequest) {
                Log.d(TAG, "onPermissionRequest")
                this@MainActivity.runOnUiThread {
                    requestPermissions()
                    request.grant(request.resources)
                }
            }
        })
    }

    private fun setUpWebViewDefaults() {

        // Get the web view settings instance
        val settings = webview.settings;

        // Enable java script in web view
        settings.javaScriptEnabled = true

        // AppRTC requires third party cookies to work
        val cookieManager = CookieManager.getInstance()
        cookieManager.setAcceptThirdPartyCookies(webview, true)


        // Enable zooming in web view
        settings.setSupportZoom(true)
        settings.builtInZoomControls = true
        settings.displayZoomControls = true


        // Zoom web view text
        //settings.textZoom = 125


        // Enable disable images in web view
        settings.blockNetworkImage = false
        // Whether the WebView should load image resources
        settings.loadsImagesAutomatically = true


        // More web view settings
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            settings.safeBrowsingEnabled = true  // api 26
        }
        //settings.pluginState = WebSettings.PluginState.ON
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        settings.javaScriptCanOpenWindowsAutomatically = true
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            settings.mediaPlaybackRequiresUserGesture = false
        }

        // More optional settings, you can enable it by yourself
        // Allow use of Local Storage
        settings.domStorageEnabled = true
        settings.setSupportMultipleWindows(true)
        settings.loadWithOverviewMode = true
        settings.allowContentAccess = true
        settings.setGeolocationEnabled(true)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
            settings.allowUniversalAccessFromFileURLs = true
        }

        settings.allowFileAccess = true


    }

    override fun onBackPressed() {
        if (webview.canGoBack()) {
            // If web view have back history, then go to the web view back history
            webview.goBack()
        }
    }

    // Ask the permission to use the mic if it hasn't already been granted
    private fun requestPermissions() {
        val permission = ContextCompat.checkSelfPermission(this,
                Manifest.permission.RECORD_AUDIO)

        if (permission != PackageManager.PERMISSION_GRANTED) {

            ActivityCompat.requestPermissions(this,
                    arrayOf(Manifest.permission.RECORD_AUDIO),
                    RECORD_REQUEST_CODE)
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int,
                                            permissions: Array<String>, grantResults: IntArray) {
        if (requestCode == RECORD_REQUEST_CODE) {
            if (grantResults.size == 0 || grantResults[0] != PackageManager.PERMISSION_GRANTED) {

                Log.i(TAG, "Permission has been denied")
            } else {
                Log.i(TAG, "Permission has been granted")
            }
        }
    }
}
