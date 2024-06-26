export class videoItem {
  constructor(id, title, release_date, img, type) {
    this._id = id;
    this.title = title;
    this.release_date = release_date;
    this.img = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' + img;
    this.type = type;
  }
}
