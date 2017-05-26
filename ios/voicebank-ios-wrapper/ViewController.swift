//
//  ViewController.swift
//  voicebank-ios-wrapper
//
//  Created by Andre Natal on 5/10/17.
//  Copyright © 2017 Andre Natal. All rights reserved.
//

import WebKit

class ViewController: UIViewController, WKScriptMessageHandler {
    var webView: WKWebView?
    var recorder: Recorder!
    
    override func loadView() {
        super.loadView()
        
        // create the webview and load the commonvoice website in it
        webView = WKWebView(frame: self.view.frame)
        webView?.configuration.userContentController.add(self, name: "scriptHandler")
        webView?.scrollView.isScrollEnabled = false
        self.view.addSubview(webView!)
        let url = URL(string: "https://test.mozvoice.org")
        let request = URLRequest(url: url!)
        webView?.load(request)
        
        // start the recorder object and ask permission to capture
        recorder = Recorder()
        recorder.webView = webView!
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
