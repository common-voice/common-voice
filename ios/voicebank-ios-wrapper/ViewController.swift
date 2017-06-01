// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import WebKit

class ViewController: UIViewController, WKScriptMessageHandler, WKNavigationDelegate {
    var webView: WKWebView?
    var recorder: Recorder!
    @IBOutlet weak var labelStatus: UILabel!
    @IBOutlet weak var activityIndicatorView: UIActivityIndicatorView!

    override func loadView() {
        super.loadView()
        
        if !Reachability.isConnectedToNetwork(){
            labelStatus.text = "Internet Connection not available!"
        } else {
            self.activityIndicatorView.isHidden = false
            // create the webview and load the commonvoice website in it
            webView = WKWebView(frame: self.view.frame)
            webView?.isHidden = true
            webView?.navigationDelegate = self
            webView?.configuration.userContentController.add(self, name: "scriptHandler")
            webView?.scrollView.isScrollEnabled = false
            self.view.addSubview(webView!)
            let url = URL(string: "https://test.mozvoice.org/")
            let request = URLRequest(url: url!)
            webView?.load(request)
            // start the recorder object and ask permission to capture
            recorder = Recorder()
            recorder.webView = webView!
        }
    }
    
    public func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        let msg = message.body as! String
        switch msg {
            case "startCapture":
                recorder.startRecording()
            case "stopCapture":
                recorder.stopRecording()
            case "playCapture":
                recorder.playCapture()
            case "stopPlaying":
                recorder.stopPlayingCapture()
            case "openSettings":
                UIApplication.shared.open(URL(string: UIApplicationOpenSettingsURLString)!, options: [:], completionHandler: nil)
            default :
                break
        }
    }
    
    override var prefersStatusBarHidden: Bool {
        return true
    }
    
    func webView(_ webView: UIWebView, didFailLoadWithError error: Error)
    {
        labelStatus.text = "Error loading the webapp"
    }
    
    func webView(_ webView: WKWebView,
                 didFinish navigation: WKNavigation!) {
        webView.isHidden = false
        self.activityIndicatorView.isHidden = true
        // register javascript function to open settings page
        webView.evaluateJavaScript("window.vcopensettings = function () { window.webkit.messageHandlers['scriptHandler'].postMessage('openSettings'); }")
    }
    
}
