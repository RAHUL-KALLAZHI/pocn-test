//
//  PhotoPlugin.m
//  App
//
//  Created by Kiran Joseph on 20/03/23.
//

#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>
CAP_PLUGIN(PhotoPlugin, "PhotoPlugin",
           CAP_PLUGIN_METHOD(getPhoto, CAPPluginReturnPromise);
)
