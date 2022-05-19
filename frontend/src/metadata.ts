export class Metadata {
  private countMetadata(e: Event) {
    const eventTarget = e.target as HTMLInputElement;
  
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

  public getMetadata(e: Event) {
    let res = this.countMetadata(e);
    console.log('metadata: ', res);

    if(res) {
      return res;
    }

    throw new Error('Метадата не получена')
  }
}

