// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import WebKit

class ViewController: UIViewController, WKScriptMessageHandler, WKNavigationDelegate {
    var webView: WKWebView?
    var recorder: Recorder!
    var orientation: UIInterfaceOrientationMask!
    var browserViewController: UIViewController? = nil
    var timerconn: Timer!
    @IBOutlet weak var labelStatus: UILabel!
    @IBOutlet weak var activityIndicatorView: UIActivityIndicatorView!

    override func loadView() {
        super.loadView()
        
        if !Reachability.isConnectedToNetwork(){
            self.activityIndicatorView.stopAnimating()
            labelStatus.text = "Voice Commons needs an internet connection to function properly. Please connect to the internet and try again."
            timerconn = Timer.scheduledTimer(timeInterval: 0.4, target: self, selector: #selector(self.checkconnectivity), userInfo: nil, repeats: true)
        } else {
            self.loadWebView()
        }
    }

    func loadWebView(){
        self.activityIndicatorView.isHidden = false
        // create the webview and load the commonvoice website in it
        webView = WKWebView(frame: self.view.frame)
        webView?.isHidden = true
        webView?.navigationDelegate = self
        webView?.configuration.userContentController.add(self, name: "scriptHandler")
        webView?.scrollView.isScrollEnabled = UIDevice.current.userInterfaceIdiom == .pad
        self.view.addSubview(webView!)
        let url = URL(string: "https://voice.mozilla.org/")
        let request = URLRequest(url: url!)
        webView?.load(request)
        // start the recorder object and ask permission to capture
        recorder = Recorder()
        recorder.webView = webView!
        let mainStoryboard = UIStoryboard(name: "Main", bundle: Bundle.main)
        browserViewController = mainStoryboard.instantiateViewController(withIdentifier: "browser")
    }

    @objc func checkconnectivity() {
        if Reachability.isConnectedToNetwork(){
            timerconn.invalidate()
            timerconn = nil
            labelStatus.text = "Connection re-established"
            self.loadWebView()
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
            case "lockportrait":
                orientation = [UIInterfaceOrientationMask.portrait, UIInterfaceOrientationMask.portraitUpsideDown]
            case "locklandscape":
                orientation = UIInterfaceOrientationMask.landscape
            case "unlockall":
                orientation = UIInterfaceOrientationMask.all
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
    
    override var supportedInterfaceOrientations:UIInterfaceOrientationMask {
        if (orientation != nil) {
            return orientation
        }
        else {
            return  [UIInterfaceOrientationMask.portrait, UIInterfaceOrientationMask.portraitUpsideDown]
        }
    }
    
    func webView(_ webView: WKWebView,
                 didFinish navigation: WKNavigation!) {
        webView.isHidden = false
        self.activityIndicatorView.isHidden = true
        // register javascript function to open settings page
        webView.evaluateJavaScript("window.vcopensettings = function () { window.webkit.messageHandlers['scriptHandler'].postMessage('openSettings'); }")
    }
    
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping ((WKNavigationActionPolicy) -> Void)) {
        if (navigationAction.navigationType == WKNavigationType.linkActivated){
            print(navigationAction.request.url?.relativeString as Any)
            decisionHandler(WKNavigationActionPolicy.cancel)
            self.present(browserViewController!, animated: true, completion: nil)
            (browserViewController as! BrowserViewController).setUrl(url: (navigationAction.request.url?.absoluteString)!)
        } else {
            decisionHandler(WKNavigationActionPolicy.allow)
        }
    }
    

    @IBAction func closeBrowserView() {
        let prefs = UserDefaults.standard
        prefs.setValue(0, forKey: "userDetails")
    }
}
