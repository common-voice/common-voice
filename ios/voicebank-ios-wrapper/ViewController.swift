// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import WebKit

class ViewController: UIViewController {
    var webView: WKWebView?
    var recorder: Recorder!
    var orientation: UIInterfaceOrientationMask!
    var browserViewController: BrowserViewController?
    var timerconn: Timer!
    @IBOutlet weak var labelStatus: UILabel!
    @IBOutlet weak var activityIndicatorView: UIActivityIndicatorView!

    override func loadView() {
        super.loadView()
        
        if !Reachability.isConnectedToNetwork() {
            activityIndicatorView.stopAnimating()
            timerconn = Timer.scheduledTimer(timeInterval: 0.4, target: self, selector: #selector(checkConnectivity), userInfo: nil, repeats: true)
            labelStatus.text = "Common Voice needs an internet connection to function properly. Please connect to the Internet and try again."
        } else {
            loadWebView()
        }
    }

    override var prefersStatusBarHidden: Bool {
        return true
    }

    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        guard orientation == nil else { return orientation }
        return [.portrait, .portraitUpsideDown]
    }

    // MARK: - Private

    private func loadWebView() {
        activityIndicatorView.isHidden = false
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
        browserViewController = mainStoryboard.instantiateViewController(withIdentifier: "browser") as? BrowserViewController
    }

    @objc private func checkConnectivity() {
        if Reachability.isConnectedToNetwork() {
            timerconn.invalidate()
            timerconn = nil
            labelStatus.text = "Connection re-established"
            loadWebView()
        }
    }
}

extension ViewController: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
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
            orientation = [.portrait, .portraitUpsideDown]
        case "locklandscape":
            orientation = .landscape
        case "unlockall":
            orientation = .all
        default:
            break
        }
    }
}

extension ViewController: WKNavigationDelegate {
    func webView(_ webView: UIWebView, didFailLoadWithError error: Error) {
        labelStatus.text = "Error loading the application."
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        webView.isHidden = false
        activityIndicatorView.isHidden = true
        // register javascript function to open settings page
        webView.evaluateJavaScript("window.vcopensettings = function () { window.webkit.messageHandlers['scriptHandler'].postMessage('openSettings'); }")
    }

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping ((WKNavigationActionPolicy) -> Void)) {
        if navigationAction.navigationType == .linkActivated {
            print(navigationAction.request.url?.relativeString as Any)
            decisionHandler(WKNavigationActionPolicy.cancel)
            present(browserViewController!, animated: true, completion: nil)
            browserViewController?.setUrl(url: (navigationAction.request.url?.absoluteString)!)
        } else {
            decisionHandler(WKNavigationActionPolicy.allow)
        }
    }
}
