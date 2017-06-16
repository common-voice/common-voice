// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import Foundation
import UIKit
import WebKit

class BrowserViewController: UIViewController, WKNavigationDelegate {
    
    var webView: WKWebView?
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
        let _url = URL(string: url)
        let request = URLRequest(url: _url!)
        webView?.load(request)
    }
    
    func webView(_ webView: UIWebView, didFailLoadWithError error: Error)
    {
    }
    
    func webView(_ webView: WKWebView,
                 didFinish navigation: WKNavigation!) {
        webView.isHidden = false
        self.activityIndicatorView.isHidden = true
    }
    
}
