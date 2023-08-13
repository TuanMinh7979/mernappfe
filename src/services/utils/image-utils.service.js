import { updatePost } from "@redux/reducers/post/post.reducer";

export class ImageUtils {
    // valid file type
    static isValidFormat(file) {
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
        return validTypes.indexOf(file.type) > -1;
    }
    static isValidSize(file) {
       
        return file.size < 5048576
    }
    static checkFile(file) {
        if (!file) {
            return window.alert("File can not be empty")
        }
        if (!ImageUtils.isValidFormat(file)) {
            return window.alert("File type not accepted")
        }
        if (!ImageUtils.isValidSize(file)) {
            return window.alert("File size too large")
        }

    }


}