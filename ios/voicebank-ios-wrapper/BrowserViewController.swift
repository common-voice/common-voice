// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import Foundation
import UIKit
import WebKit

class BrowserViewController: UIViewController, WKNavigationDelegate {
    
    var webView: WKWebView?
    var _url : URL?
    @IBOutlet weak var activityIndicatorView: UIActivityIndicatorView!
    @IBOutlet weak var plhview: UIView?
    
    override func loadView() {
        super.loadView()
        print("constructor")
        webView = WKWebView(frame: self.view.frame)
        webView?.isHidden = true
        webView?.navigationDelegate = self
        webView?.scrollView.isScrollEnabled = true
        self.plhview?.addSubview(webView!)
    }
    
    public func setUrl(url: String){
        _url = URL(string: url)
        let request = URLRequest(url: _url!)
        webView?.load(request)
    }
    
    // if webview has endangered with an error , there will be go back
    //    and reload page options
    private func tryConnectionAgain(sender : UIAlertAction!)
    {
        let request = URLRequest(url: self._url!)
        self.webView?.load(request)
    }
    
    // go main view controller (ViewController.swift)
    private func showingFirstPage(sender : UIAlertAction!){
        dismiss(animated: true, completion: nil)
    }
    
    func webView(_ webView: UIWebView, didFailLoadWithError error: Error)
    {
        // imported alert view for fail
        let connectionAlert : UIAlertController = UIAlertController(title: "Connection", message: "Connection is Lost", preferredStyle: .alert)
        
        let actionForTryAgain = UIAlertAction(title: "Try Again", style: .default, handler: tryConnectionAgain)
        
        let actionForGoBack = UIAlertAction(title: "Go Back", style: .default, handler: showingFirstPage)
        
        connectionAlert.addAction(actionForTryAgain)
        connectionAlert.addAction(actionForGoBack)
        
        self.present(connectionAlert, animated: true, completion: nil);
    }
    
    func webView(_ webView: WKWebView,
                 didFinish navigation: WKNavigation!) {
        webView.isHidden = false
        self.activityIndicatorView.isHidden = true
    }
    
}
