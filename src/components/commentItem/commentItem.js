export class commentItem {
  constructor(user, content, img) {
    this.user = user;
    this.content = content;
    this.img = {uri: img};
  }
}
