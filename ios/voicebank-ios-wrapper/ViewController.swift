// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import WebKit

class ViewController: UIViewController, WKScriptMessageHandler {
    var webView: WKWebView?
    var recorder: Recorder!
    @IBOutlet weak var labelStatus: UILabel!

    override func loadView() {
        super.loadView()
        
        if !Reachability.isConnectedToNetwork(){
            labelStatus.text = "Internet Connection not available!"
        } else {
            // create the webview and load the commonvoice website in it
            webView = WKWebView(frame: self.view.frame)
            webView?.configuration.userContentController.add(self, name: "scriptHandler")
            webView?.scrollView.isScrollEnabled = false
            self.view.addSubview(webView!)
            let url = URL(string: "http://192.168.0.44:8000/index-cv.html")
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
            default :
                break
        }
    }
    
    override var prefersStatusBarHidden: Bool {
        return true
    }
    
}
