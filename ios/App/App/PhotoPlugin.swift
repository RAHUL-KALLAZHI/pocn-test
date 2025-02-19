//
//  PhotoPlugin.swift
//  App
//
//  Created by Kiran Joseph on 20/03/23.
//

import Foundation
import Capacitor
import Photos
import BSImagePicker

@objc(PhotoPlugin)
public class PhotoPlugin : CAPPlugin, UIImagePickerControllerDelegate, UINavigationControllerDelegate, UIPopoverPresentationControllerDelegate, SelectedImageData {
    
   
    let semaphore = DispatchSemaphore(value: 0)
    var imageDataPass = ""
    var imageDataArrayPass = [String] ()
    var single = String()
    
    // passed base64 image data we get here
    func imageData(dataImage: String) {
        imageDataPass = dataImage
        
        // add semaphore for waiting thred (get image data)
        semaphore.signal()
    }
    
    func imageDataArrayMultipleImage(dataImage: [String]) {
        imageDataArrayPass = dataImage
        semaphore.signal()
    }
    
    @available(iOS 14, *)
    @objc func getPhoto(_ call: CAPPluginCall) {
        
        let message = call.getString("message") ?? ""
        self.single = message
        
        // Connect to view controller for loading native UI
        DispatchQueue.main.async {
        let storyboard = UIStoryboard(name: "Main", bundle: nil)
        let controller = storyboard.instantiateViewController(withIdentifier: "PhotopluginVC") as! PhotopluginVC
        controller.single = message
        controller.delegate = self
        controller.modalPresentationStyle = .overFullScreen
            self.bridge?.viewController!.present(controller, animated: true, completion: nil)
        }
        
        DispatchQueue.global().async {
            // Wait for the value to reach the desired one
            if self.imageDataPass == "" {
                self.semaphore.wait()
            }

            // Do something when the value reaches the desired one
            print("The value has reached the desired value!")
            
            // Data return to ionic
            if self.single == "SINGLE"{
                call.resolve([
                    "dataImage": self.imageDataPass
                ])
            }else{
                call.resolve([
                    "dataImage": self.imageDataArrayPass
                ])
            }
            print(self.imageDataArrayPass)
            self.imageDataPass = ""
            self.imageDataArrayPass = []
            
        }
        
    }
}
