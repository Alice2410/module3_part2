"use strict";
const uploadFile = document.getElementById("file");
console.log(uploadFile);
class Metadata {
    countMetadata(e) {
        const eventTarget = e.target;
        if (eventTarget.files) {
            const file = eventTarget.files[0];
            const metadata = {
                name: file.name,
                lastModifiedDate: new Date(file.lastModified),
                size: file.size,
                type: file.type,
            };
            return metadata;
        }
    }
    getMetadata(e) {
        let res = this.countMetadata(e);
        console.log(res);
        return res;
    }
}
// async function getMetadata(e: Event) {
//   const eventTarget = e.target as HTMLInputElement;
//   if (eventTarget.files) {
//     const file = eventTarget.files[0];
//     console.log(Object.keys(file));
//     const metadata = {
//       name: file.name,
//       lastModifiedDate: new Date(file.lastModified),
//       size: file.size,
//       type: file.type,
//     };
//     console.log(metadata);
//   }
// }
let metadataService = new Metadata();
uploadFile.addEventListener('change', (e) => metadataService.getMetadata(e));
