// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import Foundation
import AVFoundation
import WebKit


class Recorder:  NSObject, AVAudioRecorderDelegate {

    var recordingSession: AVAudioSession!
    var audioRecorder: AVAudioRecorder!
    var audioFilename: URL? = nil
    var webView: WKWebView? = nil
    var audioPlayer:AVAudioPlayer!
    var metertimer : Timer? = nil
    var hasMicPermission: Bool = false
    
    override init() {
        super.init()
        let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        let documentsDirectory = paths[0]
        self.audioFilename = documentsDirectory.appendingPathComponent("recording.m4a")
        self.recordingSession = AVAudioSession.sharedInstance()
        do {
            try self.recordingSession.setCategory(AVAudioSessionCategoryPlayAndRecord, with: [.defaultToSpeaker])
            try self.recordingSession.setActive(true)
        } catch {
            // failed to record!
        }
    }
    
    func startRecording() {
        // first we declare the closure to start recording
        let record = { () -> Void in
            self.audioRecorder.record()
            self.audioRecorder.isMeteringEnabled = true;
            self.metertimer = Timer.scheduledTimer(timeInterval: 0.1, target: self, selector: #selector(self.updateAudioMeter), userInfo: nil, repeats: true);
        }
        
        // then we check if we have mic permission
        if (!self.hasMicPermission){
            // if not, we ask it
            requestPermission(completion:{(allowed: Bool) -> Void in
                if (!allowed) {
                    // if permission wasn't given, we let the webapp now
                    self.hasMicPermission = false
                    self.webView?.evaluateJavaScript("nativemsgs('nomicpermission')")
                } else {
                    // if permission was given, we start recording
                    if (self.createRecorder()) {
                        self.hasMicPermission = true
                        record()
                        self.webView?.evaluateJavaScript("nativemsgs('capturestarted')")
                    } else {
                        self.webView?.evaluateJavaScript("nativemsgs('errorrecording')")
                    }
                }
            })
        } else {
            // if we have permission, then we start capturing
            record()
            self.webView?.evaluateJavaScript("nativemsgs('capturestarted')")
        }
    }
    
    func requestPermission(completion: @escaping (Bool) -> Void) {
        // first we show the permissions popup
        recordingSession.requestRecordPermission() { [unowned self] allowed in
            DispatchQueue.main.async {
                completion(allowed)
            }
        }
    }
    
    func stopRecording() {
        self.audioRecorder.stop()
        self.metertimer?.invalidate()
    }
    
    func stopPlayingCapture() {
        self.audioPlayer.stop()
    }
    
    func createRecorder() -> Bool {
        let settings = [
            AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
            AVSampleRateKey: 48000,
            AVNumberOfChannelsKey: 1,
            AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
        ]
        
        do {
            self.audioRecorder = try AVAudioRecorder(url: self.audioFilename!, settings: settings)
        } catch {
            return false
        }
        
        self.audioRecorder.delegate = self
        return true
    }
    
    func playCapture() {
        do {
            try AVAudioSession.sharedInstance().overrideOutputAudioPort(AVAudioSessionPortOverride.speaker)
            try audioPlayer = AVAudioPlayer(contentsOf: self.audioFilename!)
            audioPlayer.prepareToPlay()
            audioPlayer.play()
        } catch {
            self.webView?.evaluateJavaScript("nativemsgs('errorplaying')")
        }
    }
    
    func updateAudioMeter() {
        self.audioRecorder.updateMeters()
        let dBLevel = self.audioRecorder.averagePower(forChannel: 0)
        let peaklevel = self.audioRecorder.peakPower(forChannel: 0)
        NSLog("peaklevel \(peaklevel) dblevel \(dBLevel) ")
        webView?.evaluateJavaScript("levels('\(dBLevel)', '\(peaklevel)')")
    }
    
    func audioRecorderDidFinishRecording(_ recorder: AVAudioRecorder, successfully flag: Bool) {
        if (flag){
            do {
                let data: NSData = try NSData(contentsOfFile: self.audioFilename!.path)
                // Convert swift dictionary into encoded json
                let encodedData = data.base64EncodedString(options: .endLineWithLineFeed)
                // This WKWebView API to calls 'reloadData' function defined in js
                webView?.evaluateJavaScript("uploadData('\(encodedData)')")
            } catch {
                // failed to record!
            }
        }
    }
}
