import { updatePost } from "@redux/reducers/post/post.reducer";

export class ImageUtils {
  // valid file type
  static isValidFormat(file) {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    return validTypes.indexOf(file.type) > -1;
  }
  static isValidSize(file) {
    return file.size < 5048576;
  }
  static checkFile(file) {
    if (!file) {
      return "File can not be empty"
    }
    if (!ImageUtils.isValidFormat(file)) {
      return "File type not accepted";
    }
    if (!ImageUtils.isValidSize(file)) {
      return "File size too large";
    }
  }

  static readAsBase64(file) {
    const reader = new FileReader();
    const fileValue = new Promise((resolve, reject) => {
      reader.addEventListener('load', () => {
        resolve(reader.result);
      });

      reader.addEventListener('error', (event) => {
        reject(event);
      });

      reader.readAsDataURL(file);
    });
    return fileValue;
  }


  
}
