import { registerPlugin } from '@capacitor/core';

export interface CAPCameraPlugin{
    getPhoto(options: { message: "SINGLE" | "MULTIPLE" }): Promise<{dataImage :string}>;
}
const PhotoPlugin = registerPlugin<CAPCameraPlugin>('PhotoPlugin');


export { PhotoPlugin };