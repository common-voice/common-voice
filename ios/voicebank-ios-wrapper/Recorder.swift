//
//  Recorder.swift
//  voicebank-ios-wrapper
//
//  Created by Andre Natal on 5/15/17.
//  Copyright © 2017 Andre Natal. All rights reserved.
//

import Foundation
import AVFoundation
import WebKit


class Recorder:  NSObject, AVAudioRecorderDelegate {

    var recordingSession: AVAudioSession!
    var permission_granted = false
    var audioRecorder: AVAudioRecorder!
    var audioFilename: URL? = nil
    var recordingCanceled = false
    var webView: WKWebView? = nil
    var audioPlayer:AVAudioPlayer!
    var metertimer : Timer? = nil
    
    override init() {
        super.init()
        let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        let documentsDirectory = paths[0]
        self.audioFilename = documentsDirectory.appendingPathComponent("recording.m4a")
        self.recordingSession = AVAudioSession.sharedInstance()
        do {
            try self.recordingSession.setCategory(AVAudioSessionCategoryPlayAndRecord, with: [.defaultToSpeaker])
            try self.recordingSession.setActive(true)
            recordingSession.requestRecordPermission() { [unowned self] allowed in
                DispatchQueue.main.async {
                    if allowed {
                        self.permission_granted = true
                        self.createRecorder()
                    } else {
                        self.permission_granted = false
                    }
                }
            }
        } catch {
            // failed to record!
        }
    }
    
    func startRecording() {
        NSLog("startRecording")
        self.audioRecorder.record()
        self.audioRecorder.isMeteringEnabled = true;
        self.metertimer = Timer.scheduledTimer(timeInterval: 0.1, target: self, selector: #selector(self.updateAudioMeter), userInfo: nil, repeats: true);
    }
    
    func stopRecording(canceled: Bool) {
        self.audioRecorder.stop()
        self.recordingCanceled = canceled
        self.metertimer?.invalidate()
    }
    
    func createRecorder() {
        let settings = [
            AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
            AVSampleRateKey: 48000,
            AVNumberOfChannelsKey: 1,
            AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
        ]
        
        do {
            self.audioRecorder = try AVAudioRecorder(url: self.audioFilename!, settings: settings)
        } catch {
            NSLog("Error Recording")
        }
        
        self.audioRecorder.delegate = self
    }
    
    func playCapture() {
        do {
            try AVAudioSession.sharedInstance().overrideOutputAudioPort(AVAudioSessionPortOverride.speaker)
            try audioPlayer = AVAudioPlayer(contentsOf: self.audioFilename!)
            audioPlayer.prepareToPlay()
            audioPlayer.play()
        } catch {
            NSLog("Error Recording")
        }
    }
    
    func updateAudioMeter() {
        self.audioRecorder.updateMeters()
        let dBLevel = self.audioRecorder.averagePower(forChannel: 0)
        let peaklevel = self.audioRecorder.peakPower(forChannel: 0)
        NSLog("peaklevel \(peaklevel) dblevel \(dBLevel) ")
        webView?.evaluateJavaScript("levels('\(dBLevel), \(peaklevel)')")
    }
    
    func audioRecorderDidFinishRecording(_ recorder: AVAudioRecorder, successfully flag: Bool) {
        if (!self.recordingCanceled && flag){
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
