// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import UIKit
import WebKit

class BrowserViewController: UIViewController {
    
    private var webView: WKWebView?
    private var _url: URL?
    @IBOutlet weak var activityIndicatorView: UIActivityIndicatorView!
    @IBOutlet weak var plhview: UIView!
    
    override func loadView() {
        super.loadView()

        webView = WKWebView(frame: view.frame)
        webView?.isHidden = true
        webView?.navigationDelegate = self
        webView?.scrollView.isScrollEnabled = true
        plhview.addSubview(webView!)
    }
    
    func setUrl(url: String) {
        _url = URL(string: url)
        let request = URLRequest(url: _url!)
        webView?.load(request)
    }

    fileprivate func tryConnectionAgain(sender: UIAlertAction!) {
        let request = URLRequest(url: _url!)
        webView?.load(request)
    }
    
    fileprivate func returnToFirstPage(sender: UIAlertAction!) {
        dismiss(animated: true, completion: nil)
    }
}

extension BrowserViewController: WKNavigationDelegate {

    func webView(_ webView: UIWebView, didFailLoadWithError error: Error) {
        let connectionAlert = UIAlertController(title: "Connection", message: "Connection is Lost", preferredStyle: .alert)
        
        let actionForTryAgain = UIAlertAction(title: "Try Again", style: .default, handler: tryConnectionAgain)
        
        let actionForGoBack = UIAlertAction(title: "Go Back", style: .default, handler: returnToFirstPage)
        
        connectionAlert.addAction(actionForTryAgain)
        connectionAlert.addAction(actionForGoBack)
        
        present(connectionAlert, animated: true, completion: nil);
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        webView.isHidden = false
        activityIndicatorView.isHidden = true
    }
}
