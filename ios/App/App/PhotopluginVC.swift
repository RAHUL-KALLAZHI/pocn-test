//
//  PhotopluginVC.swift
//  App
//
//  Created by Kiran Joseph on 21/03/23.
//

import UIKit
import Capacitor
import BSImagePicker
import Photos
import PhotosUI

protocol SelectedImageData{
    func imageData(dataImage:String)
    func imageDataArrayMultipleImage(dataImage: [String])
}

@available(iOS 14, *)
class PhotopluginVC: UIViewController, UINavigationControllerDelegate, UIImagePickerControllerDelegate {
    // var imagePicker = UIImagePickerController()
    var delegate: SelectedImageData?
    var single = String()
    var base64Convert = String()
    var imageArray = [String]()
    var imageSelectArray = [String]()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        //  func capture(_ call: CAPPluginCall){
        // Do any additional setup after loading the view.
        
        self.view.backgroundColor = .clear
        let imagePicker = ImagePickerController()
        if single == "SINGLE"{
            imagePicker.settings.selection.max = 1
        }else{
            imagePicker.settings.selection.max = 5
        }
        
    //  imagePicker.settings.theme.selectionStyle = .numbered
        imagePicker.settings.fetch.assets.supportedMediaTypes = [.image, .video]
        imagePicker.settings.selection.unselectOnReachingMax = true
       // imagePicker.doneButton = nil
        
        let start = Date()
        
        self.presentImagePicker(imagePicker, select: { (asset) in
            print(asset)
            print("Selected: \(asset)")
            print(asset)
            //delegate implemented for passing base64 image data to ionic native method (CAPPluginCall)
            if self.single == "SINGLE"{
                getAssetThumbnail(asset: asset)
                self.delegate?.imageData(dataImage: self.base64Convert)
                
                //Remove view from parent
                imagePicker.dismiss(animated: true)
                self.dismiss(animated: true)
            }else{
                getAssetThumbnail(asset: asset)
            }
            
        }, deselect: { (asset) in
            print("Deselected: \(asset)")
            self.imageSelectArray = self.imageArray.filter {$0 != self.base64Convert}
            self.imageArray = self.imageSelectArray
        }, cancel: { (assets) in
            imagePicker.dismiss(animated: true)
            self.dismiss(animated: true)
            print("Canceled with selections: \(assets)")
        }, finish: { (assets) in
            
            print("Finished with selections: \(assets)")
            self.delegate?.imageDataArrayMultipleImage(dataImage: self.imageArray)
        }, completion: {
            let finish = Date()
            print(finish.timeIntervalSince(start))
        })
        
        imagePicker.dismiss(animated: true)
        
        func getAssetThumbnail(asset: PHAsset) -> UIImage {
            let manager = PHImageManager.default()
            let option = PHImageRequestOptions()
            var thumbnail = UIImage()
            option.isSynchronous = true
            manager.requestImage(for: asset, targetSize: CGSize(width: self.view.frame.width - 50, height: 230), contentMode: .aspectFit, options: option, resultHandler: { [self](result, info)->Void in
                thumbnail = result!
                let data = thumbnail.pngData()
                let imageFromData = UIImage(data: data!)
                let imageData:NSData = imageFromData!.jpegData(compressionQuality: 1)! as NSData //UIImagePNGRepresentation(img)
                let imgStringBase64 = imageData.base64EncodedString(options: .init(rawValue: 0))
                self.base64Convert = imgStringBase64
                imageArray.append(self.base64Convert)
                print(imageArray)
            })
            return thumbnail
        }
        
        func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
            
            // Do something with the results here
            picker.dismiss(animated: true)
        }
    }
}
