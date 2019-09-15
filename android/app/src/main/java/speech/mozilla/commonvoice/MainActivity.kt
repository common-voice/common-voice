package speech.mozilla.commonvoice

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.View
import android.webkit.*
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import kotlinx.android.synthetic.main.activity_main.*


open class MainActivity : AppCompatActivity() {

    private val url = "https://voice.mozilla.org/"
    private val recordRequestCode = 101

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

        webview.webChromeClient = object : WebChromeClient() {
            // Need to accept permissions programmatically to use the microphone
            override fun onPermissionRequest(request: PermissionRequest) {
                Log.d("Voice Mozilla", "onPermissionRequest")
                this@MainActivity.runOnUiThread {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        requestPermissions()
                    }
                    request.grant(request.resources)
                }
            }
        }
    }

    @SuppressLint("SetJavaScriptEnabled", "ObsoleteSdkInt")
    private fun setUpWebViewDefaults() {

        // Get the web view settings instance
        val settings = webview.settings

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
        } else
            super.onBackPressed()
    }

    // Ask the permission to use the mic if it hasn't already been granted
    @RequiresApi(Build.VERSION_CODES.M)
    private fun requestPermissions() {
        val permission = ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)

        if (permission != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(Manifest.permission.RECORD_AUDIO), recordRequestCode)
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int,
                                            permissions: Array<String>, grantResults: IntArray) {
        if (requestCode == recordRequestCode) {
            if (grantResults.isEmpty() || grantResults[0] != PackageManager.PERMISSION_GRANTED) {

                Log.i("Voice Mozilla", "Permission has been denied")
            } else {
                Log.i("Voice Mozilla", "Permission has been granted")
            }
        }
    }
}
