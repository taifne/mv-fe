import { colorTags } from "../utils/AppColors";

function GenerateRandom(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZa_xXx_I_Put_A_Little_Secret_Here_xXx_bcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

class Note {
  constructor({ ID, title, subTitle, colorTag, createdDate, lastUpdated, content, image, url, tasks }) {
    this.ID = ID != null ? ID : GenerateRandom(7);
    this.title = title;
    this.subTitle = subTitle;
    this.colorTag = colorTag;
    this.createdDate = createdDate;
    this.lastUpdated = lastUpdated;
    this.content = content;
    this.image = image;
    this.url = url;
    this.tasks = tasks;
  }

  static create(obj) {
    if (obj.title == null || obj.title == undefined) return null;

    if ((obj.subTitle == null || obj.subTitle == undefined)
      && (obj.content == null || obj.content == undefined)
      && (obj.image == null || obj.image == undefined)
      && (obj.url == null || obj.url == undefined)
      && (obj.tasks == null || obj.tasks == undefined)) return null;

    if (obj.colorTag == null || obj.colorTag == undefined) obj.colorTag = colorTags[0];

    if (obj.createdDate == null || obj.createdDate == undefined) obj.createdDate = new Date();
    if (obj.lastUpdated == null || obj.lastUpdated == undefined) obj.lastUpdated = new Date();

    return new Note(obj);
  }

}
module.exports = Note;
